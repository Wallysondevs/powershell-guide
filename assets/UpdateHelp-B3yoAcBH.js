import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Update-Help e Save-Help — Documentação atualizada e offline`,subtitle:`Baixar Help completo da Microsoft, salvar para servidores sem internet, configurar fontes alternativas. Help é metadata, não código.`,difficulty:`iniciante`,timeToRead:`15 min`,children:[(0,i.jsxs)(`p`,{children:[`Quando você instala PowerShell, o ajuda `,(0,i.jsx)(`code`,{children:`Get-Help`}),` só traz sintaxe básica autogerada. Para ver descrições, exemplos, links e parâmetros explicados em prosa, é preciso baixar com`,(0,i.jsx)(`code`,{children:`Update-Help`}),` — esses arquivos vivem fora do binário e a Microsoft atualiza separadamente.`]}),(0,i.jsx)(n,{type:`info`,title:`Por que Help é separado?`,children:(0,i.jsx)(`p`,{children:`Help completo ocupa centenas de MB e é traduzido em vários idiomas. Vincular ao binário inflaria o instalador. A solução: baixar sob demanda, em qualquer idioma, e atualizar quando os exemplos mudarem.`})}),(0,i.jsx)(`h2`,{children:`Baixar pela primeira vez`}),(0,i.jsx)(t,{title:`Update-Help básico`,code:`# Atualiza help para todos os módulos com endereço de help
# Em PS 7+: salva em pasta do usuário (sem precisar de admin)
Update-Help

# PS 5.1 ou módulos system-wide: precisa de elevação
Start-Process pwsh -Verb RunAs -ArgumentList '-Command', 'Update-Help -Force'

# Forçar mesmo que já esteja atualizado nas últimas 24h
Update-Help -Force

# Idioma específico (default: idioma do SO)
Update-Help -UICulture en-US, pt-BR -Force`}),(0,i.jsx)(n,{type:`tip`,title:`Onde fica?`,children:(0,i.jsxs)(`p`,{children:[`Em PS 7: `,(0,i.jsx)(`code`,{children:`$HOME/.local/share/powershell/Help`}),` (Linux/Mac) ou`,(0,i.jsx)(`code`,{children:`$env:USERPROFILE\\\\Documents\\\\PowerShell\\\\Help`}),` (Windows). Em PS 5.1: `,(0,i.jsx)(`code`,{children:`$PSHOME\\<idioma>\\`}),` (system-wide).`]})}),(0,i.jsx)(`h2`,{children:`Atualizar só alguns módulos`}),(0,i.jsx)(t,{title:`Mais rápido quando só importa um conjunto`,code:`# Um módulo
Update-Help -Module Microsoft.PowerShell.Utility -Force

# Vários
Update-Help -Module Az.*, PnP.* -Force

# Listar módulos que SUPORTAM update-help
Get-Module -ListAvailable |
    Where-Object HelpInfoUri |
    Select-Object Name, HelpInfoUri |
    Sort-Object Name`}),(0,i.jsx)(`h2`,{children:`Save-Help — para máquinas offline`}),(0,i.jsxs)(`p`,{children:[`Servidores em rede isolada (DMZ, jumpbox sem internet) não conseguem rodar `,(0,i.jsx)(`code`,{children:`Update-Help`}),`. A solução: baixar em uma máquina conectada com `,(0,i.jsx)(`code`,{children:`Save-Help`}),` e usar `,(0,i.jsx)(`code`,{children:`-SourcePath`}),`nas máquinas offline.`]}),(0,i.jsx)(t,{title:`Workflow completo`,code:`# 1. Em uma máquina ONLINE — baixa pacote para share
Save-Help -DestinationPath '\\\\fileserver\\PSHelp' -Force

# Ou para todos os módulos disponíveis localmente
Get-Module -ListAvailable | Save-Help -DestinationPath '\\\\fileserver\\PSHelp' -Force

# 2. Em máquinas OFFLINE — atualiza a partir do share
Update-Help -SourcePath '\\\\fileserver\\PSHelp' -Force

# 3. Em GPO (toda a empresa)
# Computer Configuration > Administrative Templates > System > Internet Communication Management
# > Internet Communication settings > Set the default source path for Update-Help`}),(0,i.jsx)(`h2`,{children:`Configurar fonte padrão (sem repetir -SourcePath)`}),(0,i.jsx)(t,{title:`Política via registry — vale para toda a sessão`,code:`$key = 'HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\PowerShell\\UpdatableHelp'
New-Item -Path $key -Force | Out-Null
New-ItemProperty -Path $key -Name 'EnableUpdateHelpDefaultSourcePath' -Value 1 -PropertyType DWord -Force
New-ItemProperty -Path $key -Name 'DefaultSourcePath' -Value '\\\\fileserver\\PSHelp' -PropertyType String -Force

# Agora:
Update-Help -Force      # Pega do share automaticamente`}),(0,i.jsx)(`h2`,{children:`Get-Help — usando a documentação`}),(0,i.jsx)(t,{title:`Sempre que estiver perdido`,code:`# Sintaxe e descrição
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
Get-Help about_*`}),(0,i.jsx)(`h2`,{children:`About topics — a documentação conceitual`}),(0,i.jsx)(t,{title:`Os melhores artigos para ler em ordem`,code:`Get-Help about_PowerShell_Basics       # Conceito raiz
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
Get-Help about_Foreach`}),(0,i.jsx)(`h2`,{children:`Caso prático 1 — Atualização agendada`}),(0,i.jsx)(t,{title:`Tarefa semanal de atualização`,code:`# Script update-help.ps1
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
    -RunLevel Highest -User 'NT AUTHORITY\\SYSTEM'`}),(0,i.jsx)(`h2`,{children:`Caso prático 2 — Verificar quais módulos estão sem help`}),(0,i.jsx)(t,{title:`Diagnóstico`,code:`Get-Module -ListAvailable | ForEach-Object {
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
    Format-Table -AutoSize`}),(0,i.jsx)(`h2`,{children:`Get-Help avançado — busca por padrão`}),(0,i.jsx)(t,{title:`Quando você não sabe o nome exato`,code:`# Buscar comando por palavra-chave
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
Get-Help Get-Process -Online`}),(0,i.jsx)(n,{type:`warning`,title:`Help desatualizado != desinstalado`,children:(0,i.jsxs)(`p`,{children:[(0,i.jsx)(`code`,{children:`Update-Help`}),` só atualiza módulos com`,(0,i.jsx)(`code`,{children:`HelpInfoUri`}),` definida (ou seja, módulos que publicaram local de download). Módulos próprios ou de terceiros sem isso ficam sempre com sintaxe básica autogerada — para esses, leia o README.md do módulo.`]})}),(0,i.jsx)(`h2`,{children:`Comment-based help — documente seus próprios scripts`}),(0,i.jsx)(t,{title:`Get-Help funciona em funções suas se você documentar`,code:`function Backup-Database {
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
Get-Help Backup-Database -Examples`}),(0,i.jsx)(`h2`,{children:`Cheat — comandos de help essenciais`}),(0,i.jsx)(t,{title:`Decorar uma vez, usar para sempre`,code:`Update-Help                       # Atualiza local
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
$cmd | gm                         # Idem (alias)`}),(0,i.jsx)(n,{type:`success`,title:`Resumão`,children:(0,i.jsxs)(`p`,{children:[`Rode `,(0,i.jsx)(`code`,{children:`Update-Help`}),` uma vez por mês. Use `,(0,i.jsx)(`code`,{children:`Save-Help`}),` em DMZ. Aprenda `,(0,i.jsx)(`code`,{children:`Get-Help <qualquer-coisa> -Examples`}),` e`,(0,i.jsx)(`code`,{children:`Get-Help about_*`}),` antes de procurar no Google — a doc oficial geralmente já responde.`]})})]})}export{a as default};