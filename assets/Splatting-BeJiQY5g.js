import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Splatting — passando parâmetros como objeto`,subtitle:`Hashtable e array para chamar cmdlets com 20 parâmetros sem perder a sanidade. O recurso mais subutilizado do PowerShell.`,difficulty:`intermediario`,timeToRead:`18 min`,children:[(0,i.jsxs)(`p`,{children:[(0,i.jsx)(`strong`,{children:`Splatting`}),` é o ato de empacotar parâmetros em uma hashtable (ou array) e passá-los para um cmdlet usando o operador`,(0,i.jsx)(`code`,{children:`@`}),`. Em vez de uma linha de 200 caracteres com 12 backticks de continuação, você tem um bloco organizado, versionável e reutilizável.`]}),(0,i.jsx)(n,{type:`info`,title:`Quando usar`,children:(0,i.jsx)(`p`,{children:`Sempre que um comando passar de 3 parâmetros, ou quando os parâmetros forem dinâmicos (vêm de config, arquivo JSON, lógica condicional). É a forma idiomática de PowerShell — e o que separa scripts de iniciante dos de profissional.`})}),(0,i.jsx)(`h2`,{children:`Sem splatting vs. com splatting`}),(0,i.jsx)(t,{title:`Antes — ilegível e difícil de revisar`,code:`Send-MailMessage -To 'admin@empresa.com.br' -From 'noreply@empresa.com.br' \`
    -Subject 'Backup concluído' -Body 'Backup OK em ' -BodyAsHtml \`
    -SmtpServer 'smtp.empresa.com.br' -Port 587 -UseSsl \`
    -Credential $cred -Attachments 'C:\\logs\\backup.log' -Priority High`}),(0,i.jsx)(t,{title:`Depois — splatting com hashtable`,code:`$email = @{
    To          = 'admin@empresa.com.br'
    From        = 'noreply@empresa.com.br'
    Subject     = 'Backup concluído'
    Body        = 'Backup OK em ' + (Get-Date)
    BodyAsHtml  = $true
    SmtpServer  = 'smtp.empresa.com.br'
    Port        = 587
    UseSsl      = $true
    Credential  = $cred
    Attachments = 'C:\\logs\\backup.log'
    Priority    = 'High'
}

Send-MailMessage @email`}),(0,i.jsxs)(`p`,{children:[`Note o `,(0,i.jsx)(`code`,{children:`@email`}),` (não `,(0,i.jsx)(`code`,{children:`$email`}),`). O `,(0,i.jsx)(`code`,{children:`@`}),`diz ao parser: "expanda esta hashtable como parâmetros nomeados".`]}),(0,i.jsx)(`h2`,{children:`Conceito — o operador @`}),(0,i.jsx)(t,{title:`$ acessa o valor, @ faz splatting`,code:`$dados = @{ Path = 'C:\\temp'; Recurse = $true }

# $dados → passa a hashtable inteira como UM argumento (errado)
Get-ChildItem $dados        # Path = System.Collections.Hashtable

# @dados → expande para -Path 'C:\\temp' -Recurse $true (correto)
Get-ChildItem @dados        # Funciona: lista C:\\temp recursivo`}),(0,i.jsx)(`h2`,{children:`Splatting com array (parâmetros posicionais)`}),(0,i.jsx)(t,{title:`Hashtable é nomeado, array é posicional`,code:`# Hashtable → parâmetros nomeados
$h = @{ ComputerName = 'SRV01'; Count = 4 }
Test-Connection @h

# Array → parâmetros posicionais (na ordem)
$a = @('SRV01', 4)
Test-Connection @a    # Equivale a: Test-Connection 'SRV01' 4

# Mistura: array para posicionais + hashtable para nomeados
$pos  = @('SRV01')
$nom  = @{ Count = 4; Quiet = $true }
Test-Connection @pos @nom`}),(0,i.jsx)(`h2`,{children:`Switches — como passar -Force, -Recurse, -WhatIf`}),(0,i.jsx)(t,{title:`Switches são $true / $false na hashtable`,code:`# ERRADO — switch sem valor não funciona em hashtable
$h = @{ Path = 'C:\\temp'; Recurse }

# CERTO — sempre $true ou $false
$h = @{
    Path    = 'C:\\temp'
    Recurse = $true
    Force   = $true
}
Remove-Item @h

# Útil: ativar -WhatIf condicionalmente
$confirm = $env:CI -eq 'true'    # Em pipeline, modo seguro
$op = @{
    Path    = '\\\\srv\\share\\old'
    Recurse = $true
    WhatIf  = $confirm
}
Remove-Item @op`}),(0,i.jsxs)(n,{type:`tip`,title:`Switches dinâmicos`,children:[(0,i.jsxs)(`p`,{children:[`Para "incluir o parâmetro só se condição X", construa a hashtable incrementalmente em vez de usar muitos `,(0,i.jsx)(`code`,{children:`if`}),` em volta da chamada:`]}),(0,i.jsx)(t,{language:`powershell`,code:`$params = @{ Path = $caminho }
if ($recursivo) { $params.Recurse = $true }
if ($filtro)    { $params.Filter  = $filtro }
Get-ChildItem @params`})]}),(0,i.jsx)(`h2`,{children:`Splatting + repasse de parâmetros (proxy functions)`}),(0,i.jsx)(t,{title:`@PSBoundParameters — repassa tudo que recebeu`,code:`function Backup-Pasta {
    [CmdletBinding()]
    param(
        [string]$Source,
        [string]$Destination,
        [switch]$Force,
        [int]$Retencao = 7
    )

    Write-Host "Iniciando backup com retenção=$Retencao"

    # Passa adiante todos os bound params para Copy-Item
    $copyParams = @{
        Path        = $Source
        Destination = $Destination
        Recurse     = $true
        Force       = $Force          # repassa switch
    }
    Copy-Item @copyParams

    # Limpa antigos
    Get-ChildItem $Destination |
        Where-Object LastWriteTime -lt (Get-Date).AddDays(-$Retencao) |
        Remove-Item -Recurse -Force
}

Backup-Pasta -Source C:\\projetos -Destination D:\\backup -Force`}),(0,i.jsx)(`h2`,{children:`Caso prático 1 — Splatting vindo de JSON/config`}),(0,i.jsx)(t,{title:`Configuração externa, código limpo`,code:`# config.json
# {
#   "ServerInstance": "SQL01",
#   "Database": "Vendas",
#   "Username": "etl",
#   "QueryTimeout": 300
# }

$cfg = Get-Content .\\config.json | ConvertFrom-Json -AsHashtable

# Garantir password vinda de cofre
$cfg.Password = (Get-Secret -Name SqlEtl -AsPlainText)

Invoke-Sqlcmd @cfg -Query "SELECT TOP 10 * FROM Pedidos"

# Ambiente diferente, mesma chamada
$cfg = Get-Content .\\config.prod.json | ConvertFrom-Json -AsHashtable
$cfg.Password = (Get-Secret -Name SqlEtlProd -AsPlainText)
Invoke-Sqlcmd @cfg -Query "SELECT TOP 10 * FROM Pedidos"`}),(0,i.jsx)(`h2`,{children:`Caso prático 2 — Loop de chamadas com splatting`}),(0,i.jsx)(t,{title:`Provisionar 100 VMs sem repetir 12 parâmetros cada`,code:`$vmsCsv = Import-Csv .\\vms.csv

foreach ($vm in $vmsCsv) {
    $params = @{
        Name             = $vm.Nome
        ResourceGroup    = $vm.RG
        Location         = $vm.Regiao
        Size             = $vm.Tamanho
        Image            = 'Win2022Datacenter'
        AdminUsername    = 'azadmin'
        AdminPassword    = (ConvertTo-SecureString $vm.Senha -AsPlainText -Force)
        OpenPorts        = @(3389, 5985, 5986)
        EnableUltraSSD   = $false
    }
    try {
        New-AzVM @params -ErrorAction Stop
        Write-Host "✔ $($vm.Nome)" -ForegroundColor Green
    } catch {
        Write-Warning "✘ $($vm.Nome): $_"
    }
}`}),(0,i.jsx)(`h2`,{children:`Combinando hashtables — splatting modular`}),(0,i.jsx)(t,{title:`Defaults + override por chamada`,code:`# Hashtable base com defaults da empresa
$baseSmtp = @{
    SmtpServer = 'smtp.corp.com'
    Port       = 587
    UseSsl     = $true
    From       = 'noreply@corp.com'
    Credential = $smtpCred
}

# Email de erro — adiciona/sobrescreve campos específicos
Send-MailMessage @baseSmtp -To $admins -Subject 'ERRO' -Body $log -Priority High

# Email de relatório semanal
$relatorio = $baseSmtp.Clone()
$relatorio.To         = $diretoria
$relatorio.Subject    = 'Relatório semanal'
$relatorio.Attachments = '.\\relatorio.pdf'
Send-MailMessage @relatorio -Body 'Segue em anexo'`}),(0,i.jsx)(n,{type:`warning`,title:`Cuidado com referência compartilhada`,children:(0,i.jsxs)(`p`,{children:[`Hashtable é tipo de referência. `,(0,i.jsx)(`code`,{children:`$copia = $original`}),`aponta para o MESMO objeto — alterar `,(0,i.jsx)(`code`,{children:`$copia.X`}),` altera`,(0,i.jsx)(`code`,{children:`$original.X`}),`. Use `,(0,i.jsx)(`code`,{children:`.Clone()`}),` para cópia rasa quando for modificar.`]})}),(0,i.jsx)(`h2`,{children:`Splatting condicional — construir hash dinamicamente`}),(0,i.jsx)(t,{title:`Inclui parâmetros só se fizer sentido`,code:`function Invoke-RestApi {
    param(
        [string]$Url,
        [hashtable]$Headers,
        [object]$Body,
        [int]$TimeoutSec
    )

    $params = @{
        Uri    = $Url
        Method = 'POST'
    }
    if ($Headers)     { $params.Headers     = $Headers }
    if ($Body)        {
        $params.Body        = ($Body | ConvertTo-Json -Depth 10)
        $params.ContentType = 'application/json'
    }
    if ($TimeoutSec)  { $params.TimeoutSec  = $TimeoutSec }

    Invoke-RestMethod @params
}`}),(0,i.jsx)(`h2`,{children:`Armadilhas comuns`}),(0,i.jsx)(n,{type:`danger`,title:`Erros que todo mundo comete`,children:(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsxs)(`strong`,{children:[(0,i.jsx)(`code`,{children:`$h`}),` em vez de `,(0,i.jsx)(`code`,{children:`@h`})]}),` — passa a hashtable como argumento único.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Chave com nome errado`}),` — `,(0,i.jsx)(`code`,{children:`Force = $true`}),` mas o cmdlet espera `,(0,i.jsx)(`code`,{children:`Confirm`}),`: parâmetro é silenciosamente ignorado se o cmdlet aceitar `,(0,i.jsx)(`code`,{children:`-AllowExtraArguments`}),`, ou erro de "parameter cannot be found" se for estrito.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Switch com valor errado`}),` — `,(0,i.jsx)(`code`,{children:`Recurse = 'true'`}),` (string!) em vez de `,(0,i.jsx)(`code`,{children:`$true`}),` dispara conversão e às vezes vira `,(0,i.jsx)(`code`,{children:`$true`}),` por acidente, mas pode falhar em strict mode.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Reordenar quebra splatting de array`}),` — para parâmetros posicionais a ORDEM importa.`]})]})}),(0,i.jsx)(`h2`,{children:`Cheat — splatting em uma página`}),(0,i.jsx)(t,{title:`O que decorar`,code:`# 1. Definir
$params = @{
    Param1 = 'valor1'
    Param2 = 42
    Switch = $true
}

# 2. Chamar (note @, não $)
Cmdlet @params

# 3. Combinar com outros parâmetros explícitos
Cmdlet @params -ParamExtra 'override'

# 4. Construir condicional
if ($x) { $params.Extra = $x }

# 5. Splatting de array (posicional)
$args = @('val1', 'val2')
Cmdlet @args

# 6. Repassar tudo
function Wrapper { Cmdlet @PSBoundParameters }`}),(0,i.jsx)(n,{type:`success`,title:`Adote agora`,children:(0,i.jsx)(`p`,{children:`Toda vez que escrever um cmdlet com mais de 3 parâmetros, pare e extraia para hashtable. Em 6 meses seus scripts são revisáveis, versionáveis em Git com diff legível e fáceis de parametrizar por ambiente.`})})]})}export{a as default};