import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Pester() {
  return (
    <PageContainer
      title="Testes com Pester"
      subtitle="Escreva testes unitários e de integração para scripts e módulos PowerShell com o Pester."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        Pester é o framework de testes padrão do PowerShell. Permite escrever testes
        unitários e de integração para verificar que seu código funciona conforme esperado,
        facilitando refatorações seguras e integração com pipelines CI/CD.
      </p>

      <h2>Instalação e Estrutura Básica</h2>
      <CodeBlock title="Primeiro teste com Pester" code={`# Instalar Pester (versão mais recente)
Install-Module Pester -Force -SkipPublisherCheck
Import-Module Pester -PassThru  # Ver versão instalada

# Estrutura de arquivo de teste: MinhaFuncao.Tests.ps1
BeforeAll {
    # Executado uma vez antes de todos os testes
    . "$PSScriptRoot/../src/MinhaFuncao.ps1"  # Dot-source o script
}

Describe "MinhaFuncao" {
    Context "Parâmetros válidos" {
        It "retorna o resultado correto para entrada positiva" {
            $resultado = MinhaFuncao -Valor 10
            $resultado | Should -Be 100
        }

        It "aceita valores decimais" {
            MinhaFuncao -Valor 5.5 | Should -BeGreaterThan 0
        }
    }

    Context "Parâmetros inválidos" {
        It "lança exceção para zero" {
            { MinhaFuncao -Valor 0 } | Should -Throw "Valor não pode ser zero"
        }

        It "retorna null para entrada nula" {
            MinhaFuncao -Valor $null | Should -BeNullOrEmpty
        }
    }
}
`} />

      <h2>Assertions Disponíveis</h2>
      <CodeBlock title="Todos os tipos de Should" code={`# Igualdade
42 | Should -Be 42
42 | Should -Not -Be 0
42 | Should -BeExactly 42

# Comparações numéricas
42 | Should -BeGreaterThan 10
42 | Should -BeLessThan 100
42 | Should -BeInRange 0 100

# Strings
"PowerShell 7.4" | Should -BeLike "PowerShell*"
"Hello World"    | Should -Match '\bWorld\b'
"PowerShell"     | Should -Contain "Power"

# Coleções
@(1,2,3) | Should -HaveCount 3
@(1,2,3) | Should -Contain 2
@()      | Should -BeNullOrEmpty

# Tipos
42       | Should -BeOfType [int]
"texto"  | Should -BeOfType [string]

# Exceções
{ 1/0 } | Should -Throw
{ Get-Item "nao-existe" -ErrorAction Stop } | Should -Throw "Cannot find path*"

# Arquivos
"C:\Windows" | Should -Exist
"C:\nao-existe.txt" | Should -Not -Exist
`} />

      <h2>Mocking — Isolando Dependências</h2>
      <CodeBlock title="Mock para simular chamadas externas" code={`# Função a ser testada (contém dependências externas)
function Deploy-Aplicacao {
    param([string]$Ambiente)
    $status = Test-Connection -ComputerName "servidor-$Ambiente" -Count 1 -Quiet
    if (-not $status) { throw "Servidor não acessível" }
    $resp = Invoke-RestMethod -Uri "https://deploy.empresa.com/api/$Ambiente" -Method POST
    return $resp
}

# Testes com Mock
Describe "Deploy-Aplicacao" {
    BeforeEach {
        Mock Test-Connection   { return $true }
        Mock Invoke-RestMethod { return @{ status = "success"; version = "1.2.3" } }
        Mock Write-Host        {}
    }

    It "executa deploy com sucesso" {
        $resultado = Deploy-Aplicacao -Ambiente "staging"
        $resultado.status | Should -Be "success"

        Should -Invoke Invoke-RestMethod -Times 1 -ParameterFilter {
            $Uri -like "*staging*" -and $Method -eq "POST"
        }
    }

    It "lança exceção quando servidor offline" {
        Mock Test-Connection { return $false }
        { Deploy-Aplicacao -Ambiente "staging" } | Should -Throw "Servidor não acessível"
        Should -Invoke Invoke-RestMethod -Times 0
    }
}
`} />

      <h2>BeforeAll, BeforeEach e Limpeza</h2>
      <CodeBlock title="Configuração e teardown dos testes" code={`Describe "Testes de Arquivo" {
    BeforeAll {
        # Criar pasta temporária para todos os testes
        $script:TempDir = Join-Path ([System.IO.Path]::GetTempPath()) ([System.IO.Path]::GetRandomFileName())
        New-Item -ItemType Directory -Path $script:TempDir | Out-Null

        . "$PSScriptRoot/funcoes.ps1"  # Carregar funções
    }

    AfterAll {
        # Limpar após todos os testes
        Remove-Item $script:TempDir -Recurse -Force -ErrorAction SilentlyContinue
    }

    BeforeEach {
        # Estado limpo antes de CADA teste
        $script:ArquivoTeste = Join-Path $script:TempDir "test-$(Get-Random).txt"
        "Conteúdo inicial" | Set-Content $script:ArquivoTeste
    }

    AfterEach {
        Remove-Item $script:ArquivoTeste -ErrorAction SilentlyContinue
    }

    It "processa arquivo corretamente" {
        ProcessarArquivo -Path $script:ArquivoTeste
        Get-Content $script:ArquivoTeste | Should -Not -BeNullOrEmpty
    }

    It "cria backup antes de processar" {
        ProcessarArquivo -Path $script:ArquivoTeste -CriarBackup
        "$($script:ArquivoTeste).bak" | Should -Exist
    }
}
`} />

      <h2>Executando e Integrando com CI</h2>
      <CodeBlock title="Invoke-Pester e relatórios" code={`# Executar todos os testes
Invoke-Pester

# Executar pasta específica
Invoke-Pester -Path "./tests/"

# Configuração avançada com relatório JUnit (para CI/CD)
$config = New-PesterConfiguration
$config.Run.Path                     = "./tests"
$config.Output.Verbosity             = "Detailed"
$config.TestResult.Enabled           = $true
$config.TestResult.OutputPath        = "TestResults.xml"
$config.TestResult.OutputFormat      = "JUnitXml"  # Azure DevOps / GitHub
$config.CodeCoverage.Enabled         = $true
$config.CodeCoverage.Path            = "./src/*.ps1"
$config.CodeCoverage.OutputPath      = "coverage.xml"
$config.CodeCoverage.OutputFormat    = "JaCoCo"

$result = Invoke-Pester -Configuration $config -PassThru
if ($result.FailedCount -gt 0) { exit 1 }

# Filtrar por tags
Describe "Testes Críticos" -Tag "critico","smoke" {
    It "verifica conectividade" -Tag "network" { ... }
}
Invoke-Pester -Tag "smoke"  # Só testes marcados como smoke
`} />

      <AlertBox type="success" title="Code Coverage">
        A cobertura de código mostra quais linhas do seu script foram executadas durante os testes.
        Tente manter acima de 80% para funções críticas.
        Use <code>$config.CodeCoverage.Enabled = $true</code> para gerar o relatório.
      </AlertBox>
    </PageContainer>
  );
}
