import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Scripts() {
  return (
    <PageContainer
      title="Scripts e Automação"
      subtitle="Transforme comandos isolados em ferramentas poderosas, robustas e seguras."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        Scripts do PowerShell são arquivos de texto com a extensão <code>.ps1</code> que contêm uma sequência de comandos. Eles permitem automatizar tarefas repetitivas, desde backups simples até orquestração complexa de infraestrutura, transformando você em um multiplicador de eficiência.
      </p>

      <h2>Criando e Executando Scripts</h2>
      <p>
        Diferente de arquivos <code>.bat</code>, você não pode simplesmente dar um duplo clique em um <code>.ps1</code> para executá-lo (por motivos de segurança). Você deve chamá-lo de dentro do PowerShell ou configurar uma política de execução.
      </p>

      <CodeBlock
        title="Como executar um script"
        language="powershell"
        code={`# Forma 1: Usando o caminho relativo (o .\\  é obrigatório)
cd C:\\Scripts
.\\MeuScript.ps1

# Forma 2: Caminho absoluto com operador de chamada & (bom para caminhos com espaços)
& "C:\\Meus Scripts\\Backup Final.ps1"

# Forma 3: Passando argumentos ao script
.\\Relatorio.ps1 -Ambiente "Producao" -FormatoSaida "HTML"

# Forma 4: Executar um bloco de código como script a partir da linha de comando
powershell.exe -Command "Get-Date; Get-Process | Select-Object -First 5"

# Forma 5: Executar um arquivo .ps1 de fora do PowerShell (ex: .bat ou tarefa agendada)
powershell.exe -ExecutionPolicy Bypass -NonInteractive -File "C:\\Scripts\\Backup.ps1"`}
      />

      <h2>Políticas de Execução (Execution Policy)</h2>
      <p>
        O PowerShell possui uma trava de segurança para evitar que scripts maliciosos rodem sem permissão. Você precisa configurar o nível de segurança adequado para o seu ambiente.
      </p>

      <CodeBlock
        title="Gerenciando permissões de execução"
        language="powershell"
        code={`# Verificar todas as políticas (por escopo de precedência)
Get-ExecutionPolicy -List

# Nível mais alto de privilégio sempre ganha:
# MachinePolicy > UserPolicy > Process > CurrentUser > LocalMachine

# Opções de política:
# Restricted    — Nenhum script pode rodar (padrão no Windows)
# AllSigned     — Apenas scripts com assinatura digital válida
# RemoteSigned  — Scripts locais rodam livremente; baixados precisam de assinatura ← Recomendado
# Unrestricted  — Tudo roda (aviso para scripts remotos)
# Bypass        — Ignora tudo (use apenas em automações controladas)

# Alterar a política para o usuário atual (sem precisar de admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Rodar um script ignorando a política apenas nessa execução
powershell.exe -ExecutionPolicy Bypass -File .\\script.ps1`}
      />

      <AlertBox type="danger" title="Nunca use Unrestricted em produção">
        Evite <code>Set-ExecutionPolicy Unrestricted</code> em servidores. Prefira <code>RemoteSigned</code> para desenvolvimento e assine seus scripts digitalmente (<code>Set-AuthenticodeSignature</code>) para ambientes corporativos e de produção.
      </AlertBox>

      <h2>Parâmetros com Validação Avançada</h2>
      <p>
        Um bom script é reutilizável. A chave é usar <code>param()</code> com atributos de validação para capturar erros antes que causem dano.
      </p>

      <CodeBlock
        title="Script profissional com parâmetros (Deploy.ps1)"
        language="powershell"
        code={`#Requires -Version 5.1
#Requires -RunAsAdministrator

[CmdletBinding(SupportsShouldProcess, ConfirmImpact = "High")]
param(
    [Parameter(Mandatory, HelpMessage = "Informe o caminho de saída do relatório")]
    [ValidateScript({ Test-Path $_ -PathType Container })]
    [string]$CaminhoSaida,

    [Parameter()]
    [ValidateSet("CSV", "HTML", "JSON", "XML")]
    [string]$Formato = "CSV",

    [Parameter()]
    [ValidateRange(1, 365)]
    [int]$DiasAtras = 30,

    [Parameter()]
    [ValidatePattern("^[a-zA-Z0-9_-]{3,20}$")]
    [string]$NomeProjeto,

    [switch]$EnviarEmail,
    [switch]$ForcarSobrescrita
)

Write-Verbose "Iniciando script com formato=$Formato, dias=$DiasAtras"

if ($PSCmdlet.ShouldProcess($CaminhoSaida, "Gerar relatório de $DiasAtras dias")) {
    Write-Host "Gerando relatório $Formato em: $CaminhoSaida" -ForegroundColor Cyan
    # ... lógica principal aqui
}

if ($EnviarEmail) {
    Write-Host "Enviando por e-mail após geração..." -ForegroundColor Yellow
}`}
      />

      <h2>Documentação (Comment-Based Help)</h2>
      <p>
        O PowerShell permite que você crie ajuda nativa para seus scripts usando um bloco de comentários especial. Isso faz com que o comando <code>Get-Help .\\seu-script.ps1</code> funcione exatamente como nos cmdlets oficiais.
      </p>

      <CodeBlock
        title="Documentação completa no estilo Microsoft"
        language="powershell"
        code={`<#
.SYNOPSIS
    Gera um relatório de espaço em disco de todos os volumes locais.

.DESCRIPTION
    Este script analisa os volumes locais (DriveType=3) e exporta os dados
    de uso em disco para um arquivo no formato especificado. Pode ser agendado
    via Tarefas Agendadas para monitoramento contínuo.

.PARAMETER Path
    O caminho da pasta onde o arquivo de saída será salvo.
    A pasta deve existir. Padrão: "C:\\Relatorios"

.PARAMETER Formato
    O formato do arquivo de saída. Opções: CSV, HTML, JSON.
    Padrão: CSV

.PARAMETER LimiteGB
    Alerta quando o espaço livre estiver abaixo desse valor em GB.
    Padrão: 10

.EXAMPLE
    .\\Get-DiskReport.ps1 -Path "C:\\Temp"
    Gera um arquivo CSV na pasta C:\\Temp com os dados de todos os discos.

.EXAMPLE
    .\\Get-DiskReport.ps1 -Path "C:\\Temp" -Formato HTML -LimiteGB 20
    Gera um relatório HTML e alerta discos com menos de 20GB livres.

.NOTES
    Autor: Seu Nome
    Versão: 2.1
    Criado em: 2024-01-15
    Última atualização: 2024-03-10
    Requer: PowerShell 5.1+

.LINK
    https://docs.microsoft.com/powershell/
#>
param(
    [string]$Path = "C:\\Relatorios",
    [string]$Formato = "CSV",
    [int]$LimiteGB = 10
)`}
      />

      <h2>Variáveis Automáticas de Script</h2>
      <p>
        Ao rodar scripts, o PowerShell disponibiliza variáveis automáticas especiais que ajudam a localizar arquivos, verificar o status de execuções e muito mais.
      </p>

      <CodeBlock
        title="Variáveis úteis de ambiente de script"
        language="powershell"
        code={`# Pasta onde o script atual está localizado (a mais importante!)
$PSScriptRoot

# Caminho completo do arquivo do script sendo executado
$PSCommandPath

# Importar arquivo na mesma pasta do script (uso correto de $PSScriptRoot)
$config   = Import-Csv    -Path "$PSScriptRoot\\config.csv"
$template = Get-Content   -Path "$PSScriptRoot\\templates\\email.html"
$dados    = Get-Content   -Path "$PSScriptRoot\\dados.json" | ConvertFrom-Json

# Verificar se o script está sendo executado como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
    [Security.Principal.WindowsBuiltInRole]::Administrator
)
if (-not $isAdmin) { throw "Este script requer privilégios de Administrador!" }

# Obter os parâmetros com os quais o script foi chamado
$PSBoundParameters      # Hashtable com os parâmetros passados
$MyInvocation.MyCommand # Objeto com metadados do comando atual`}
      />

      <h2>Dot Sourcing e Reutilização de Código</h2>
      <p>
        Normalmente, quando um script termina, todas as suas variáveis e funções desaparecem. O <strong>Dot Sourcing</strong> executa o script no escopo atual, mantendo tudo carregado na memória da sessão.
      </p>

      <CodeBlock
        title="Reutilizando funções entre scripts"
        language="powershell"
        code={`# Execução normal (variáveis somem quando o script termina)
.\\FuncoesUteis.ps1       # Roda e limpa o escopo

# Dot Sourcing (mantém funções e variáveis disponíveis)
. .\\FuncoesUteis.ps1     # Note o ponto e espaço antes do caminho!

# Agora você pode chamar as funções definidas no arquivo:
Enviar-Email -Para "admin@empresa.com" -Assunto "Backup completo"

# Padrão profissional: arquivo de "biblioteca" de funções
# libs\\Validacoes.ps1
function Test-EmailValido { param([string]$Email) return $Email -match "^[\w-]+@[\w-]+\.\w+" }
function Test-IPValido    { param([string]$IP)    return $IP    -match "^\d{1,3}(\.\d{1,3}){3}$" }

# No script principal:
. "$PSScriptRoot\\libs\\Validacoes.ps1"
if (Test-EmailValido "usuario@empresa.com") { Write-Host "Email válido!" }`}
      />

      <h2>Tratamento de Erros em Scripts</h2>

      <CodeBlock
        title="Try/Catch/Finally e gestão de erros"
        language="powershell"
        code={`# Padrão básico de tratamento de erros
try {
    # Código que pode falhar
    $resultado = Get-Content -Path "C:\\arquivo_nao_existe.txt" -ErrorAction Stop

} catch [System.IO.FileNotFoundException] {
    Write-Error "Arquivo não encontrado: $_"
    exit 1

} catch [System.UnauthorizedAccessException] {
    Write-Error "Sem permissão para acessar o arquivo: $_"
    exit 2

} catch {
    # Captura qualquer outro erro
    Write-Error "Erro inesperado: $($_.Exception.Message)"
    Write-Host "Stack trace: $($_.ScriptStackTrace)" -ForegroundColor DarkRed
    exit 99

} finally {
    # Sempre executa — ideal para limpeza de recursos
    Write-Host "Script finalizado em: $(Get-Date -Format 'HH:mm:ss')"
}`}
      />

      <AlertBox type="info" title="Dica: Unblock-File">
        Se você baixar um script da internet, o Windows aplica um "Zone Identifier" que bloqueia a execução. Use <code>Unblock-File -Path .\\script.ps1</code> para remover esse bloqueio antes de executá-lo. Você pode inspecionar o bloco com <code>Get-Item .\\script.ps1 -Stream Zone.Identifier</code>.
      </AlertBox>
    </PageContainer>
  );
}
