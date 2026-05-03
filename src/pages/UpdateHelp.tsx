import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function UpdateHelp() {
  return (
    <PageContainer
      title="Update-Help e Save-Help — Documentação atualizada e offline"
      subtitle="Baixar Help completo da Microsoft, salvar para servidores sem internet, configurar fontes alternativas. Help é metadata, não código."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        Quando você instala PowerShell, o ajuda <code>Get-Help</code> só traz
        sintaxe básica autogerada. Para ver descrições, exemplos, links e
        parâmetros explicados em prosa, é preciso baixar com
        <code>Update-Help</code> — esses arquivos vivem fora do binário e a
        Microsoft atualiza separadamente.
      </p>

      <AlertBox type="info" title="Por que Help é separado?">
        <p>
          Help completo ocupa centenas de MB e é traduzido em vários idiomas.
          Vincular ao binário inflaria o instalador. A solução: baixar sob
          demanda, em qualquer idioma, e atualizar quando os exemplos mudarem.
        </p>
      </AlertBox>

      <h2>Baixar pela primeira vez</h2>
      <CodeBlock title="Update-Help básico" code={`# Atualiza help para todos os módulos com endereço de help
# Em PS 7+: salva em pasta do usuário (sem precisar de admin)
Update-Help

# PS 5.1 ou módulos system-wide: precisa de elevação
Start-Process pwsh -Verb RunAs -ArgumentList '-Command', 'Update-Help -Force'

# Forçar mesmo que já esteja atualizado nas últimas 24h
Update-Help -Force

# Idioma específico (default: idioma do SO)
Update-Help -UICulture en-US, pt-BR -Force`} />

      <AlertBox type="tip" title="Onde fica?">
        <p>
          Em PS 7: <code>$HOME/.local/share/powershell/Help</code> (Linux/Mac) ou
          <code>$env:USERPROFILE\\Documents\\PowerShell\\Help</code> (Windows).
          Em PS 5.1: <code>{'$PSHOME\\<idioma>\\'}</code> (system-wide).
        </p>
      </AlertBox>

      <h2>Atualizar só alguns módulos</h2>
      <CodeBlock title="Mais rápido quando só importa um conjunto" code={`# Um módulo
Update-Help -Module Microsoft.PowerShell.Utility -Force

# Vários
Update-Help -Module Az.*, PnP.* -Force

# Listar módulos que SUPORTAM update-help
Get-Module -ListAvailable |
    Where-Object HelpInfoUri |
    Select-Object Name, HelpInfoUri |
    Sort-Object Name`} />

      <h2>Save-Help — para máquinas offline</h2>
      <p>
        Servidores em rede isolada (DMZ, jumpbox sem internet) não conseguem
        rodar <code>Update-Help</code>. A solução: baixar em uma máquina
        conectada com <code>Save-Help</code> e usar <code>-SourcePath</code>
        nas máquinas offline.
      </p>

      <CodeBlock title="Workflow completo" code={`# 1. Em uma máquina ONLINE — baixa pacote para share
Save-Help -DestinationPath '\\\\fileserver\\PSHelp' -Force

# Ou para todos os módulos disponíveis localmente
Get-Module -ListAvailable | Save-Help -DestinationPath '\\\\fileserver\\PSHelp' -Force

# 2. Em máquinas OFFLINE — atualiza a partir do share
Update-Help -SourcePath '\\\\fileserver\\PSHelp' -Force

# 3. Em GPO (toda a empresa)
# Computer Configuration > Administrative Templates > System > Internet Communication Management
# > Internet Communication settings > Set the default source path for Update-Help`} />

      <h2>Configurar fonte padrão (sem repetir -SourcePath)</h2>
      <CodeBlock title="Política via registry — vale para toda a sessão" code={`$key = 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\UpdatableHelp'
New-Item -Path $key -Force | Out-Null
New-ItemProperty -Path $key -Name 'EnableUpdateHelpDefaultSourcePath' -Value 1 -PropertyType DWord -Force
New-ItemProperty -Path $key -Name 'DefaultSourcePath' -Value '\\\\fileserver\\PSHelp' -PropertyType String -Force

# Agora:
Update-Help -Force      # Pega do share automaticamente`} />

      <h2>Get-Help — usando a documentação</h2>
      <CodeBlock title="Sempre que estiver perdido" code={`# Sintaxe e descrição
Get-Help Get-Process

# Detalhe completo (parâmetros + descrições)
Get-Help Get-Process -Detailed

# Tudo (notas, links, exemplos longos)
Get-Help Get-Process -Full

# Apenas exemplos
Get-Help Get-Process -Examples

# Online (abre browser na doc oficial)
Get-Help Get-Process -Online

# Janela separada (PS 7+)
Get-Help Get-Process -ShowWindow

# Ajuda sobre conceitos (about_*)
Get-Help about_Functions
Get-Help about_*Param*
Get-Help about_Parameters_Default_Values

# Listar todos os tópicos conceituais
Get-Help about_*`} />

      <h2>About topics — a documentação conceitual</h2>
      <CodeBlock title="Os melhores artigos para ler em ordem" code={`Get-Help about_PowerShell_Basics       # Conceito raiz
Get-Help about_Variables
Get-Help about_Operators
Get-Help about_Comparison_Operators
Get-Help about_Logical_Operators
Get-Help about_Arrays
Get-Help about_Hash_Tables
Get-Help about_Pipelines
Get-Help about_Functions
Get-Help about_Functions_Advanced
Get-Help about_Splatting
Get-Help about_Try_Catch_Finally
Get-Help about_Scopes
Get-Help about_Modules
Get-Help about_Execution_Policies
Get-Help about_Remoting
Get-Help about_Foreach`} />

      <h2>Caso prático 1 — Atualização agendada</h2>
      <CodeBlock title="Tarefa semanal de atualização" code={`# Script update-help.ps1
$ErrorActionPreference = 'SilentlyContinue'
$log = "$env:TEMP\\update-help.log"

"=== $(Get-Date -Format o) ===" | Add-Content $log
try {
    Update-Help -Force -ErrorAction Stop *>> $log
    "OK" | Add-Content $log
} catch {
    "ERRO: $_" | Add-Content $log
}

# Agendar
$t = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday -At 3am
$a = New-ScheduledTaskAction -Execute 'pwsh' -Argument '-NoProfile -File C:\\scripts\\update-help.ps1'
Register-ScheduledTask -TaskName 'PS Update Help' -Trigger $t -Action $a \`
    -RunLevel Highest -User 'NT AUTHORITY\\SYSTEM'`} />

      <h2>Caso prático 2 — Verificar quais módulos estão sem help</h2>
      <CodeBlock title="Diagnóstico" code={`Get-Module -ListAvailable | ForEach-Object {
    $semHelp = $true
    if ($_.HelpInfoUri) {
        $cmd = $_.ExportedCommands.Values | Select-Object -First 1
        if ($cmd) {
            $help = Get-Help $cmd.Name -ErrorAction SilentlyContinue
            $semHelp = -not ($help.description -or $help.Synopsis)
        }
    }
    [pscustomobject]@{
        Modulo  = $_.Name
        Versao  = $_.Version
        TemHelp = -not $semHelp
        Uri     = $_.HelpInfoUri
    }
} | Where-Object { -not $_.TemHelp -and $_.Uri } |
    Format-Table -AutoSize`} />

      <h2>Get-Help avançado — busca por padrão</h2>
      <CodeBlock title="Quando você não sabe o nome exato" code={`# Buscar comando por palavra-chave
Get-Help *process*
Get-Help *backup*

# Buscar por verbo
Get-Verb | Where-Object Verb -like 'Get*'
Get-Command -Verb Stop

# Buscar por substantivo (Noun)
Get-Command -Noun Service
Get-Command -Noun *Net*

# Mostrar ajuda em tela cheia, navegável (PS 5.1)
Get-Help Get-Process -ShowWindow

# Mostrar ajuda online (PS 7+)
Get-Help Get-Process -Online`} />

      <AlertBox type="warning" title="Help desatualizado != desinstalado">
        <p>
          <code>Update-Help</code> só atualiza módulos com
          <code>HelpInfoUri</code> definida (ou seja, módulos que publicaram
          local de download). Módulos próprios ou de terceiros sem isso ficam
          sempre com sintaxe básica autogerada — para esses, leia o README.md
          do módulo.
        </p>
      </AlertBox>

      <h2>Comment-based help — documente seus próprios scripts</h2>
      <CodeBlock title="Get-Help funciona em funções suas se você documentar" code={`function Backup-Database {
<#
.SYNOPSIS
    Faz backup de um banco SQL Server para arquivo .bak.

.DESCRIPTION
    Wrapper para BACKUP DATABASE TO DISK com compressão e checksum.
    Mantém retenção de N dias automaticamente.

.PARAMETER Database
    Nome do banco a fazer backup.

.PARAMETER Destination
    Pasta onde salvar o .bak. Será criada se não existir.

.PARAMETER RetentionDays
    Quantos dias manter backups antigos. Default: 14.

.EXAMPLE
    Backup-Database -Database Vendas -Destination D:\\bak

    Backup do banco Vendas em D:\\bak\\Vendas-yyyyMMdd-HHmm.bak

.EXAMPLE
    'Vendas','Compras' | Backup-Database -Destination \\\\nas\\bak

    Backup de múltiplos bancos via pipeline para share de rede.

.LINK
    https://learn.microsoft.com/sql/t-sql/statements/backup-transact-sql

.NOTES
    Autor : Wally
    Versão: 1.2
#>
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)][string]$Database,
        [Parameter(Mandatory)][string]$Destination,
        [int]$RetentionDays = 14
    )
    process {
        # ...
    }
}

# Pronto:
Get-Help Backup-Database -Full
Get-Help Backup-Database -Examples`} />

      <h2>Cheat — comandos de help essenciais</h2>
      <CodeBlock title="Decorar uma vez, usar para sempre" code={`Update-Help                       # Atualiza local
Save-Help -DestinationPath X      # Para máquinas offline
Get-Help <cmd>                    # Sintaxe + sinopse
Get-Help <cmd> -Examples          # Só exemplos
Get-Help <cmd> -Full              # Tudo
Get-Help <cmd> -Online            # Browser
Get-Help <cmd> -ShowWindow        # Janela
Get-Help about_*                  # Tópicos conceituais
Get-Command -Noun *X*             # Achar cmdlets por sufixo
Get-Command -Module Az.*          # Tudo de um módulo
Get-Member                        # Propriedades/métodos de objeto
$cmd | gm                         # Idem (alias)`} />

      <AlertBox type="success" title="Resumão">
        <p>
          Rode <code>Update-Help</code> uma vez por mês.
          Use <code>Save-Help</code> em DMZ.
          Aprenda <code>Get-Help &lt;qualquer-coisa&gt; -Examples</code> e
          <code>Get-Help about_*</code> antes de procurar no Google — a doc
          oficial geralmente já responde.
        </p>
      </AlertBox>
    </PageContainer>
  );
}
