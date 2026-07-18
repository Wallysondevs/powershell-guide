import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Perfil do PowerShell`,subtitle:`Personalize seu ambiente com $PROFILE, aliases, funções e configurações de produtividade.`,difficulty:`iniciante`,timeToRead:`20 min`,children:[(0,i.jsx)(`p`,{children:`O perfil do PowerShell é um script executado automaticamente ao iniciar cada sessão. É onde você define aliases, funções personalizadas, aparência do prompt, variáveis globais e qualquer configuração que queira ter sempre disponível.`}),(0,i.jsx)(`h2`,{children:`Tipos de Perfil`}),(0,i.jsx)(t,{title:`Os quatro perfis do PowerShell`,code:`# Ver todos os caminhos de perfil
$PROFILE | Select-Object *

# Os quatro perfis (em ordem de precedência):
$PROFILE.AllUsersAllHosts          # Para todos usuários, todos hosts
$PROFILE.AllUsersCurrentHost       # Para todos usuários, apenas este host
$PROFILE.CurrentUserAllHosts       # Para você, todos hosts — MAIS RECOMENDADO
$PROFILE.CurrentUserCurrentHost    # Para você, apenas este host (= $PROFILE)

# Verificar se o perfil existe
Test-Path $PROFILE

# Criar o perfil se não existir
if (-not (Test-Path $PROFILE)) {
    New-Item -Path $PROFILE -ItemType File -Force
}

# Abrir para edição
notepad $PROFILE
code $PROFILE     # VS Code
ise $PROFILE      # PowerShell ISE
`}),(0,i.jsx)(`h2`,{children:`Conteúdo Essencial do Perfil`}),(0,i.jsx)(t,{title:`Perfil completo e produtivo`,code:`# === $PROFILE ===

# ──────────────────────────────────────────────
# ALIASES
# ──────────────────────────────────────────────
Set-Alias -Name ll    -Value Get-ChildItem
Set-Alias -Name grep  -Value Select-String
Set-Alias -Name which -Value Get-Command
Set-Alias -Name touch -Value New-Item
Set-Alias -Name open  -Value Invoke-Item

# ──────────────────────────────────────────────
# FUNÇÕES UTILITÁRIAS
# ──────────────────────────────────────────────
function Get-IpPublico { (Invoke-RestMethod "https://api.ipify.org?format=json").ip }

function Get-DiskInfo {
    Get-PSDrive -PSProvider FileSystem |
        Select-Object Name,
            @{N="Total GB"; E={[math]::Round($_.Used/1GB + $_.Free/1GB, 1)}},
            @{N="Livre GB"; E={[math]::Round($_.Free/1GB, 1)}},
            @{N="Livre %";  E={[math]::Round($_.Free/($_.Used + $_.Free)*100, 1)}} |
        Where-Object "Total GB" -gt 0 |
        Format-Table -AutoSize
}

function New-Pasta([string]$Nome) {
    New-Item -ItemType Directory -Name $Nome | Set-Location
}

function Edit-Perfil { code $PROFILE }

# ──────────────────────────────────────────────
# PROMPT PERSONALIZADO
# ──────────────────────────────────────────────
function prompt {
    $loc  = (Get-Location).Path -replace $HOME,"~"
    $hora = Get-Date -Format "HH:mm"
    Write-Host "[$hora] " -ForegroundColor DarkGray -NoNewline
    Write-Host $loc -ForegroundColor Cyan -NoNewline
    "> "
}

# ──────────────────────────────────────────────
# PARÂMETROS PADRÃO
# ──────────────────────────────────────────────
$PSDefaultParameterValues = @{
    "Format-Table:AutoSize"        = $true
    "Out-File:Encoding"            = "UTF8"
    "Export-Csv:NoTypeInformation" = $true
    "Export-Csv:Encoding"          = "UTF8"
}

# Histórico maior
Set-PSReadLineOption -MaximumHistoryCount 10000

Write-Host "Perfil carregado! PS $($PSVersionTable.PSVersion)" -ForegroundColor Green
`}),(0,i.jsx)(`h2`,{children:`PSReadLine — Produtividade na Linha de Comando`}),(0,i.jsx)(t,{title:`Configurando PSReadLine`,code:`# PSReadLine já vem com PowerShell 5.1+
Import-Module PSReadLine

# Predição de comandos (histórico)
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView  # Lista de sugestões

# Atalhos de teclado úteis
Set-PSReadLineKeyHandler -Key UpArrow   -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward
Set-PSReadLineKeyHandler -Key Tab       -Function MenuComplete

# Cores de sintaxe
Set-PSReadLineOption -Colors @{
    Command          = "Cyan"
    Parameter        = "DarkCyan"
    Operator         = "DarkYellow"
    Variable         = "Green"
    String           = "DarkGreen"
    Comment          = "DarkGray"
    Keyword          = "Magenta"
    Error            = "Red"
    InlinePrediction = "#606060"
}
`}),(0,i.jsx)(`h2`,{children:`Oh My Posh — Terminal Estiloso`}),(0,i.jsx)(t,{title:`Configurando Oh My Posh`,code:`# Instalar Oh My Posh
winget install JanDeBrabander.OhMyPosh

# Instalar Nerd Font (necessário para ícones)
oh-my-posh font install

# Adicionar ao perfil:
oh-my-posh init pwsh | Invoke-Expression
# ou com tema específico:
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH\\jandedobbeleer.omp.json" | Invoke-Expression

# Listar temas disponíveis
Get-PoshThemes

# Temas populares: agnoster, paradox, spaceship, pure, robbyrussell
`}),(0,i.jsxs)(n,{type:`success`,title:`Módulos Recomendados para o Perfil`,children:[`Instale e importe no perfil: `,(0,i.jsx)(`strong`,{children:`posh-git`}),` (integração com Git),`,(0,i.jsx)(`strong`,{children:`PSReadLine`}),` (edição de linha avançada),`,(0,i.jsx)(`strong`,{children:`Terminal-Icons`}),` (ícones coloridos no ls).`]})]})}export{a as default};