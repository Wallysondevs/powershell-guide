import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Pacotes() {
    return (
      <PageContainer
        title="Gerenciamento de Pacotes"
        subtitle="WinGet, Chocolatey, Scoop, PowerShellGet e automatização de ambientes com scripts."
        difficulty="iniciante"
        timeToRead="25 min"
      >
        <p>
          Gerenciar software manualmente através de downloads e instaladores ".exe" é coisa do passado.
          O PowerShell integra-se com múltiplos gerenciadores de pacotes para instalar, atualizar
          e remover software de forma reproduzível e automatizável — em minutos, não horas.
        </p>

        <h2>WinGet — Gerenciador Oficial da Microsoft</h2>
        <CodeBlock title="Instalando e gerenciando aplicativos com WinGet" code={`# Buscar aplicativos pelo nome
  winget search "Visual Studio Code"
  winget search --id "Microsoft.PowerShell"  # Busca exata por ID

  # Instalar aplicativos (sem interação do usuário)
  winget install "Microsoft.VisualStudioCode" --silent
  winget install "Git.Git" --silent --accept-package-agreements --accept-source-agreements
  winget install "Docker.DockerDesktop" -e  # -e para match exato do ID

  # Listar softwares instalados
  winget list
  winget list | Where-Object { $_ -match "2024" }  # Filtrar por texto

  # Verificar e instalar atualizações
  winget upgrade                    # Ver o que está desatualizado
  winget upgrade --all --silent    # Atualizar tudo

  # Desinstalar
  winget uninstall "Microsoft.VisualStudioCode"

  # Export/Import para backup de lista de apps
  winget export --output "C:\\Backup\\apps.json"           # Exportar lista
  winget import --import-file "C:\\Backup\\apps.json" --no-upgrade  # Restaurar tudo

  # Instalar via PowerShell (capturar saída)
  $resultado = winget install "Notepad++.Notepad++" --silent 2>&1
  if ($LASTEXITCODE -eq 0) {
      Write-Host "Instalado com sucesso!" -ForegroundColor Green
  } else {
      Write-Warning "Falha na instalação: $resultado"
  }
  `} />

        <h2>Chocolatey — O Gerenciador Corporativo</h2>
        <CodeBlock title="Instalação e uso do Chocolatey" code={`# Instalar o Chocolatey (admin)
  Set-ExecutionPolicy Bypass -Scope Process -Force
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  Invoke-Expression ((New-Object Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

  # Verificar instalação
  choco --version

  # Instalar pacotes
  choco install git nodejs-lts vscode googlechrome -y  # -y para aceitar tudo

  # Instalar versão específica
  choco install nodejs-lts --version=18.20.0 -y

  # Verificar atualizações pendentes
  choco outdated

  # Atualizar pacotes
  choco upgrade git -y
  choco upgrade all -y   # Atualizar tudo (cuidado!)

  # Informações de um pacote
  choco info vscode

  # Remover
  choco uninstall googlechrome -y

  # Criar pacote local da empresa (empresa chocolatey server)
  choco pack "C:\\MeuPacote\\meuapp.nuspec"
  choco push "meuapp.1.0.0.nupkg" --source "https://choco.empresa.com/api/v2/package"
  `} />

        <h2>Scoop — Para Desenvolvedores</h2>
        <CodeBlock title="Instalações portáteis e sem admin" code={`# Instalar Scoop (sem permissão de admin)
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
  Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression

  # Adicionar buckets (repositórios de pacotes)
  scoop bucket add extras     # Apps extras
  scoop bucket add java       # JDKs
  scoop bucket add games      # Jogos
  scoop bucket add nerd-fonts # Fontes para dev

  # Instalar ferramentas de desenvolvimento
  scoop install git curl wget jq
  scoop install python nodejs
  scoop install vscode         # Do bucket extras

  # Instalar fontes para terminal
  scoop install nerd-fonts/CascadiaCode-NF   # Para icons no terminal

  # Manter atualizado
  scoop update      # Atualizar Scoop e buckets
  scoop update *    # Atualizar todos os apps

  # Vantagem: instalações portáteis em $env:USERPROFILE\\scoop
  # Fácil limpeza: scoop cleanup * (remove versões antigas)
  scoop cleanup *   # Liberar espaço de versões antigas
  scoop cache rm *  # Limpar cache de downloads
  `} />

        <h2>PowerShellGet — Módulos do PowerShell</h2>
        <CodeBlock title="Gerenciando módulos e scripts PS" code={`# Instalar módulo da PSGallery
  Find-Module "ImportExcel"  # Pesquisar
  Install-Module "ImportExcel" -Scope CurrentUser -Force

  # Instalar múltiplos de uma vez
  @("Pester","PSScriptAnalyzer","ImportExcel","PSReadLine") |
      ForEach-Object {
          Install-Module $_ -Scope CurrentUser -Force -AllowClobber -ErrorAction SilentlyContinue
          Write-Host "Instalado: $_" -ForegroundColor Green
      }

  # Ver módulos instalados
  Get-InstalledModule | Select-Object Name, Version, InstalledDate | Sort-Object InstalledDate -Descending

  # Atualizar todos os módulos instalados via PowerShellGet
  Get-InstalledModule | Update-Module -Force

  # Desinstalar módulo e todas as suas versões
  Uninstall-Module -Name "AzureRM" -AllVersions -Force

  # Instalar script da PSGallery
  Find-Script "Get-NetworkSummary"
  Install-Script "Get-NetworkSummary" -Scope CurrentUser

  # Provedor NuGet — necessário para muitas operações
  Install-PackageProvider -Name NuGet -MinimumVersion 2.8.5.201 -Force
  `} />

        <h2>Automação de Ambiente — Setup Script Completo</h2>
        <CodeBlock title="Script para configurar máquina do zero" code={`#Requires -RunAsAdministrator
  <#
  .SYNOPSIS
      Setup completo de máquina de desenvolvimento
  .DESCRIPTION
      Instala ferramentas de desenvolvimento, configura o terminal e módulos PS
  #>

  param(
      [switch]$SomenteModulosPS,
      [switch]$SomenteApps,
      [switch]$VerboseOutput
  )

  function Write-Status {
      param([string]$Msg, [string]$Cor = "Cyan")
      Write-Host "  ▶ $Msg" -ForegroundColor $Cor
  }

  Write-Host "=== Setup de Ambiente Dev ===" -ForegroundColor Magenta

  # --- APLICATIVOS VIA WINGET ---
  if (-not $SomenteModulosPS) {
      Write-Host "Instalando aplicativos..." -ForegroundColor Yellow
      $apps = @(
          "Microsoft.WindowsTerminal",
          "Microsoft.PowerShell",
          "Git.Git",
          "Microsoft.VisualStudioCode",
          "Docker.DockerDesktop",
          "Postman.Postman",
          "dbeaver.dbeaver"
      )
      foreach ($app in $apps) {
          Write-Status $app
          winget install $app --silent --accept-package-agreements --accept-source-agreements 2>$null
      }
  }

  # --- MÓDULOS POWERSHELL ---
  if (-not $SomenteApps) {
      Write-Host "Instalando módulos PowerShell..." -ForegroundColor Yellow
      $modulos = @("PSReadLine","Terminal-Icons","posh-git","Pester","PSScriptAnalyzer","ImportExcel")
      foreach ($mod in $modulos) {
          Write-Status $mod
          Install-Module $mod -Scope CurrentUser -Force -AllowClobber -ErrorAction SilentlyContinue
      }
  }

  Write-Host "Setup concluído! Reinicie o terminal." -ForegroundColor Green
  `} />

        <AlertBox type="info" title="WinGet Export/Import">
          Use <code>winget export -o apps.json</code> para fazer backup de todos os aplicativos
          instalados e <code>winget import -i apps.json</code> para restaurar tudo em um
          novo PC. Ideal para migração de máquina ou onboarding de novos colaboradores.
        </AlertBox>

        <AlertBox type="warning" title="Escopo de Instalação">
          Sempre use <code>-Scope CurrentUser</code> no <code>Install-Module</code> quando
          não tiver privilégios de Administrador. Sem esse parâmetro, o PowerShell tenta
          instalar para todos os usuários e falha com erro de permissão.
        </AlertBox>
      </PageContainer>
    );
  }
  