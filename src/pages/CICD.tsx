import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CICD() {
  return (
    <PageContainer
      title="CI/CD com PowerShell"
      subtitle="Integre PowerShell em pipelines de GitHub Actions, Azure DevOps e automação de deploy."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        PowerShell é uma excelente linguagem de automação para pipelines CI/CD. Ele pode ser
        usado em GitHub Actions, Azure DevOps, Jenkins e outros sistemas para build, teste,
        validação e deploy de aplicações.
      </p>

      <h2>GitHub Actions com PowerShell</h2>
      <CodeBlock title="Workflow GitHub Actions usando PowerShell" code={`# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4

      - name: Instalar dependências
        shell: pwsh
        run: |
          Install-Module Pester -Force -SkipPublisherCheck
          Install-Module PSScriptAnalyzer -Force

      - name: Análise estática de código
        shell: pwsh
        run: |
          $resultados = Invoke-ScriptAnalyzer -Path . -Recurse -Severity Error
          if ($resultados) {
            $resultados | Format-Table -AutoSize
            throw "Erros de análise encontrados: $($resultados.Count)"
          }
          Write-Host "Análise passou!" -ForegroundColor Green

      - name: Executar testes Pester
        shell: pwsh
        run: |
          $config = New-PesterConfiguration
          $config.Run.Path = "./tests"
          $config.TestResult.Enabled = $true
          $config.TestResult.OutputPath = "TestResults.xml"
          $config.TestResult.OutputFormat = "JUnitXml"
          $result = Invoke-Pester -Configuration $config -PassThru
          if ($result.FailedCount -gt 0) {
            throw "$($result.FailedCount) testes falharam!"
          }

      - name: Deploy para produção
        shell: pwsh
        env:
          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}
          SERVER: \${{ vars.PROD_SERVER }}
        run: |
          ./scripts/Deploy.ps1 -Servidor $env:SERVER -Chave $env:DEPLOY_KEY
`} />

      <h2>Script de Deploy Reutilizável</h2>
      <CodeBlock title="Deploy.ps1 — script de implantação" code={`#Requires -Version 7.2
<#
.SYNOPSIS
    Script de deploy da aplicação para servidores remotos.
.PARAMETER Ambiente
    Ambiente alvo: staging | producao
.PARAMETER Versao
    Versão da aplicação a implantar.
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory)]
    [ValidateSet("staging","producao")]
    [string]$Ambiente,

    [Parameter(Mandatory)]
    [string]$Versao,

    [string]$ArtifactPath = ".\dist",
    [switch]$RollbackEmFalha
)

$servidores = @{
    staging   = @("srv-stg-01","srv-stg-02")
    producao  = @("srv-prd-01","srv-prd-02","srv-prd-03")
}

$alvos = $servidores[$Ambiente]
Write-Host "Deploy v$Versao para $Ambiente ($($alvos.Count) servidores)" -ForegroundColor Cyan

# 1. Validações iniciais
Write-Host "Verificando artefatos..."
if (-not (Test-Path $ArtifactPath)) {
    throw "Pasta de artefatos não encontrada: $ArtifactPath"
}

# 2. Deploy em paralelo com rollback automático
$sessoes    = New-PSSession -ComputerName $alvos
$resultado  = @{ Sucesso = @(); Falha = @() }

$sessoes | ForEach-Object -Parallel {
    $sess = $_
    try {
        # Parar serviço
        Invoke-Command -Session $sess { Stop-Service -Name "MinhaApp" -Force }

        # Backup da versão atual
        Invoke-Command -Session $sess {
            $backup = "C:\\App\\backup-$(Get-Date -Format 'yyyyMMdd_HHmmss')"
            Copy-Item "C:\\App\\current" $backup -Recurse
        }

        # Copiar nova versão
        Copy-Item -Path $Using:ArtifactPath  -Destination "C:\\App\\current"  -ToSession $sess -Recurse -Force

        # Iniciar serviço
        Invoke-Command -Session $sess { Start-Service -Name "MinhaApp" }

        Write-Host "Servidor $($sess.ComputerName): OK" -ForegroundColor Green
    } catch {
        Write-Warning "Servidor $($sess.ComputerName): FALHOU - $_"
    }
} -ThrottleLimit 3

$sessoes | Remove-PSSession
`} />

      <h2>Azure DevOps Pipeline</h2>
      <CodeBlock title="azure-pipelines.yml com PowerShell" code={`# azure-pipelines.yml
trigger:
  - main

pool:
  vmImage: windows-latest

variables:
  - group: producao-secrets  # Variáveis secretas do grupo

stages:
- stage: Build
  jobs:
  - job: BuildJob
    steps:
    - task: PowerShell@2
      displayName: 'Build e Testes'
      inputs:
        targetType: inline
        script: |
          Write-Host "##vso[task.setvariable variable=BuildVersion]$(Get-Date -Format 'yyyyMMdd.HHmm')"

          # Testes Pester
          $result = Invoke-Pester -Path ./tests -PassThru
          Write-Host "##vso[task.logissue type=warning]$($result.FailedCount) falhas"
          if ($result.FailedCount -gt 0) { exit 1 }

- stage: Deploy
  dependsOn: Build
  condition: succeeded()
  jobs:
  - deployment: DeployProd
    environment: producao
    strategy:
      runOnce:
        deploy:
          steps:
          - task: PowerShell@2
            displayName: 'Deploy Produção'
            env:
              SENHA_SERVIDOR: $(SenhaServidor)
            inputs:
              filePath: './scripts/Deploy.ps1'
              arguments: '-Ambiente producao -Versao $(Build.BuildNumber)'
`} />

      <h2>Notificações de Pipeline</h2>
      <CodeBlock title="Alertas de CI/CD via e-mail e Teams" code={`function Send-NotificacaoCICD {
    param(
        [string]$Status,    # success | failure
        [string]$Pipeline,
        [string]$Versao,
        [string]$WebhookUrl = $env:TEAMS_WEBHOOK_URL
    )

    $cor    = if ($Status -eq "success") { "00c700" } else { "ff0000" }
    $emoji  = if ($Status -eq "success") { "✅" } else { "❌" }

    $corpo = @{
        "@type"      = "MessageCard"
        "@context"   = "https://schema.org/extensions"
        summary      = "$emoji Deploy $Status: $Pipeline"
        themeColor   = $cor
        sections     = @(
            @{
                activityTitle    = "$emoji Pipeline: $Pipeline"
                activitySubtitle = "Versão: $Versao | $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
                facts = @(
                    @{ name = "Status";    value = $Status.ToUpper() },
                    @{ name = "Versão";    value = $Versao },
                    @{ name = "Disparado"; value = $env:USERNAME }
                )
            }
        )
    } | ConvertTo-Json -Depth 10

    Invoke-RestMethod -Uri $WebhookUrl  -Method POST  -Body $corpo  -ContentType "application/json"
}

# Chamar no final do script de deploy
try {
    # ... deploy ...
    Send-NotificacaoCICD -Status "success" -Pipeline "App-Web" -Versao "2.1.0"
} catch {
    Send-NotificacaoCICD -Status "failure" -Pipeline "App-Web" -Versao "2.1.0"
    throw
}
`} />

      <AlertBox type="success" title="Boas Práticas de CI/CD com PowerShell">
        Use <code>#Requires -Version 7.2</code> no topo dos scripts, sempre retorne código de saída
        com <code>exit 1</code> em falhas (não apenas throw), e salve resultados de testes em
        formato JUnit XML para visualização no painel do CI.
      </AlertBox>
    </PageContainer>
  );
}
