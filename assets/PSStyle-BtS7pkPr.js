import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`$PSStyle e ANSI — Cores no terminal moderno`,subtitle:`Estilizar texto, tabelas, progress, erros e formatos de saída usando o sistema oficial de ANSI/VT100 do PowerShell 7.2+.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`A partir do `,(0,i.jsx)(`strong`,{children:`PowerShell 7.2`}),`, a variável automática`,(0,i.jsx)(`code`,{children:`$PSStyle`}),` centraliza tudo relacionado a estilos no console: cores ANSI, formatação de tabelas, mensagens de erro, progress bar e seleção de texto. Substitui hacks com `,(0,i.jsx)(`code`,{children:`Write-Host -ForegroundColor`}),`por uma API oficial, multiplataforma e composable.`]}),(0,i.jsx)(n,{type:`info`,title:`Por que ANSI e não Write-Host?`,children:(0,i.jsxs)(`p`,{children:[(0,i.jsx)(`code`,{children:`Write-Host`}),` escreve no host, ignora pipeline e não é composable. ANSI é um protocolo padrão entendido por todo terminal moderno (Windows Terminal, iTerm2, VS Code) — você embute códigos no texto e a string colorida flui pelo pipeline normalmente.`]})}),(0,i.jsx)(`h2`,{children:`Conceito — $PSStyle como tema central`}),(0,i.jsx)(t,{title:`Explorar o objeto`,code:`$PSStyle | Get-Member -MemberType Properties

# Principais sub-objetos:
$PSStyle.Foreground       # Cores de texto
$PSStyle.Background       # Cor de fundo
$PSStyle.Formatting       # Mensagens de sistema (erro, warning, debug, table)
$PSStyle.Progress         # Estilo do progress bar
$PSStyle.FileInfo         # Cores ls (Get-ChildItem) por extensão
$PSStyle.Reset            # Volta ao normal — SEMPRE use no fim`}),(0,i.jsx)(`h2`,{children:`Estilos básicos — bold, itálico, sublinhado`}),(0,i.jsx)(t,{title:`Inline em strings`,code:`"$($PSStyle.Bold)Texto em negrito$($PSStyle.Reset)"
"$($PSStyle.Italic)Itálico$($PSStyle.Reset)"
"$($PSStyle.Underline)Sublinhado$($PSStyle.Reset)"
"$($PSStyle.Strikethrough)Riscado$($PSStyle.Reset)"
"$($PSStyle.Reverse)Invertido$($PSStyle.Reset)"
"$($PSStyle.Blink)Pisca$($PSStyle.Reset)         # Use com moderação"

# Combinando
"$($PSStyle.Bold)$($PSStyle.Underline)Importante$($PSStyle.Reset)"`}),(0,i.jsx)(`h2`,{children:`Cores — 16, 256 e RGB completo`}),(0,i.jsx)(t,{title:`Foreground e Background`,code:`# Cores nomeadas (16 padrão)
"$($PSStyle.Foreground.Red)Vermelho$($PSStyle.Reset)"
"$($PSStyle.Foreground.BrightCyan)Cyan claro$($PSStyle.Reset)"
"$($PSStyle.Background.Yellow)Fundo amarelo$($PSStyle.Reset)"

# Paleta 256 (xterm)
"$($PSStyle.Foreground.FromConsoleColor('Magenta'))Magenta$($PSStyle.Reset)"

# RGB true-color (24-bit)
"$($PSStyle.Foreground.FromRgb(255, 105, 180))Rosa choque$($PSStyle.Reset)"
"$($PSStyle.Foreground.FromRgb(0x9c, 0xdc, 0xfe))Azul VS Code$($PSStyle.Reset)"

# Hex curto
$verde = $PSStyle.Foreground.FromRgb(0x00, 0xff, 0x88)
"${verde}Verde neon$($PSStyle.Reset)"`}),(0,i.jsx)(`h2`,{children:`Modos de renderização — controle global`}),(0,i.jsx)(t,{title:`OutputRendering — quando aplicar ANSI`,code:`# Comportamento padrão
$PSStyle.OutputRendering    # Host (renderiza só se terminal suporta)

# Forçar sempre — útil em CI que loga ANSI
$PSStyle.OutputRendering = 'Ansi'

# Nunca renderizar — texto puro (logs limpos)
$PSStyle.OutputRendering = 'PlainText'

# Reverter ao padrão
$PSStyle.OutputRendering = 'Host'`}),(0,i.jsx)(n,{type:`tip`,title:`Logs limpos para arquivo`,children:(0,i.jsxs)(`p`,{children:[`Ao redirecionar para arquivo, `,(0,i.jsx)(`code`,{children:`OutputRendering = Host`}),`detecta automaticamente que não há terminal e remove ANSI. Mas se estiver capturando para variável e depois salvando, force`,(0,i.jsx)(`code`,{children:`PlainText`}),` antes:`]})}),(0,i.jsx)(`h2`,{children:`Formatting — estilizar mensagens de sistema`}),(0,i.jsx)(t,{title:`Mudar como erros, warnings e tabelas aparecem`,code:`# Inspecionar valores atuais
$PSStyle.Formatting

# Customizar mensagens
$PSStyle.Formatting.Error           = $PSStyle.Foreground.BrightRed + $PSStyle.Bold
$PSStyle.Formatting.Warning         = $PSStyle.Foreground.BrightYellow
$PSStyle.Formatting.Debug           = $PSStyle.Foreground.BrightCyan
$PSStyle.Formatting.Verbose         = $PSStyle.Foreground.BrightMagenta
$PSStyle.Formatting.TableHeader     = $PSStyle.Bold + $PSStyle.Foreground.Blue
$PSStyle.Formatting.FormatAccent    = $PSStyle.Foreground.Yellow + $PSStyle.Italic
$PSStyle.Formatting.ErrorAccent     = $PSStyle.Foreground.Cyan
$PSStyle.Formatting.FeedbackName    = $PSStyle.Foreground.Yellow
$PSStyle.Formatting.FeedbackText    = $PSStyle.Foreground.BrightCyan
$PSStyle.Formatting.FeedbackAction  = $PSStyle.Foreground.BrightWhite

# Testar
Write-Error 'falhou aqui'
Write-Warning 'cuidado'
Get-ChildItem | Format-Table`}),(0,i.jsx)(`h2`,{children:`Progress — ProgressView estilizado`}),(0,i.jsx)(t,{title:`Barra de progresso minimalista (PS 7.2+)`,code:`# Estilo clássico (multi-linha, padrão até PS 7.1)
$PSStyle.Progress.View = 'Classic'

# Estilo moderno minimalista (default em PS 7.2+)
$PSStyle.Progress.View = 'Minimal'

# Customizar cor e comprimento
$PSStyle.Progress.Style       = $PSStyle.Foreground.BrightBlue + $PSStyle.Background.Black
$PSStyle.Progress.MaxWidth    = 80
$PSStyle.Progress.UseOSCIndicator = $true   # Mostra na barra do Windows Terminal

# Testar
1..50 | ForEach-Object {
    Write-Progress -Activity "Processando" -Status "Item $_ de 50" -PercentComplete ($_ * 2)
    Start-Sleep -Milliseconds 80
}`}),(0,i.jsx)(`h2`,{children:`FileInfo — Get-ChildItem com cores por extensão`}),(0,i.jsx)(t,{title:`Tipo LS_COLORS do Linux, nativo no PS 7.2+`,code:`# Inspecionar cores ativas
$PSStyle.FileInfo.Directory     # Pastas
$PSStyle.FileInfo.SymbolicLink  # Links
$PSStyle.FileInfo.Executable    # .exe, .ps1, etc.
$PSStyle.FileInfo.Extension     # Hashtable por extensão

# Adicionar cores customizadas
$PSStyle.FileInfo.Extension['.log']    = $PSStyle.Foreground.BrightYellow
$PSStyle.FileInfo.Extension['.json']   = $PSStyle.Foreground.BrightCyan
$PSStyle.FileInfo.Extension['.bak']    = $PSStyle.Foreground.BrightBlack + $PSStyle.Italic
$PSStyle.FileInfo.Extension['.lock']   = $PSStyle.Foreground.Red

# Pastas em verde negrito
$PSStyle.FileInfo.Directory = $PSStyle.Bold + $PSStyle.Foreground.BrightGreen

# Testar
Get-ChildItem`}),(0,i.jsx)(`h2`,{children:`Caso prático 1 — Função de log colorida e tematizada`}),(0,i.jsx)(t,{title:`Substitui Write-Host -ForegroundColor`,code:`function Write-Log {
    param(
        [Parameter(Mandatory)][string]$Message,
        [ValidateSet('Info','Success','Warning','Error','Debug')]
        [string]$Level = 'Info'
    )

    $cor = switch ($Level) {
        'Info'    { $PSStyle.Foreground.BrightBlue }
        'Success' { $PSStyle.Foreground.BrightGreen }
        'Warning' { $PSStyle.Foreground.BrightYellow }
        'Error'   { $PSStyle.Foreground.BrightRed + $PSStyle.Bold }
        'Debug'   { $PSStyle.Foreground.BrightBlack + $PSStyle.Italic }
    }
    $marca = switch ($Level) {
        'Info'    { 'INFO' }
        'Success' { ' OK ' }
        'Warning' { 'WARN' }
        'Error'   { 'FAIL' }
        'Debug'   { 'DBG ' }
    }
    $hora = Get-Date -Format 'HH:mm:ss'
    "$($PSStyle.Foreground.BrightBlack)[$hora]$($PSStyle.Reset) ${cor}[$marca] $Message$($PSStyle.Reset)"
}

Write-Log 'Iniciando deploy' -Level Info
Write-Log 'Build OK'         -Level Success
Write-Log 'Cache vazio'      -Level Warning
Write-Log 'Falhou em X'      -Level Error`}),(0,i.jsx)(`h2`,{children:`Caso prático 2 — Tabela com diff visual`}),(0,i.jsx)(t,{title:`Marcar linhas alteradas em tabela`,code:`function Format-Diff {
    param([object[]]$Itens, [string]$CampoStatus = 'Status')

    $Itens | ForEach-Object {
        $estilo = switch ($_.$CampoStatus) {
            'Adicionado' { $PSStyle.Foreground.BrightGreen + '+ ' }
            'Removido'   { $PSStyle.Foreground.BrightRed   + '- ' }
            'Alterado'   { $PSStyle.Foreground.Yellow      + '~ ' }
            default      { '  ' }
        }
        "${estilo}$($_.Nome)$($PSStyle.Reset)"
    }
}

@(
    [pscustomobject]@{ Nome = 'README.md';    Status = 'Alterado'   }
    [pscustomobject]@{ Nome = 'src/index.ts'; Status = 'Adicionado' }
    [pscustomobject]@{ Nome = 'old.config';   Status = 'Removido'   }
) | Format-Diff`}),(0,i.jsx)(`h2`,{children:`Caso prático 3 — Hyperlinks clicáveis (OSC 8)`}),(0,i.jsx)(t,{title:`Texto que abre URL ao Ctrl+Click no terminal`,code:`function Format-Hyperlink {
    param([string]$Url, [string]$Texto = $Url)
    "$([char]27)]8;;$Url$([char]27)\\$Texto$([char]27)]8;;$([char]27)\\"
}

Format-Hyperlink -Url 'https://learn.microsoft.com/powershell' -Texto 'Docs PowerShell'

# Em mensagem
"Veja a documentação em $(Format-Hyperlink 'https://learn.microsoft.com' 'learn.microsoft.com')"`}),(0,i.jsx)(`h2`,{children:`Compatibilidade — fallback para PS 5.1`}),(0,i.jsx)(t,{title:`Detectar e degradar com graça`,code:`function Write-Colored {
    param([string]$Texto, [string]$Cor = 'Cyan')

    if ($PSStyle) {
        # PS 7.2+ — usa ANSI
        $estilo = $PSStyle.Foreground.PSObject.Properties[$Cor].Value
        "${estilo}$Texto$($PSStyle.Reset)"
    } else {
        # PS 5.1 — fallback
        Write-Host $Texto -ForegroundColor $Cor
    }
}

Write-Colored 'Funciona em qualquer versão' -Cor Yellow`}),(0,i.jsx)(n,{type:`warning`,title:`Não esqueça o Reset`,children:(0,i.jsxs)(`p`,{children:[`Se você abrir um estilo (cor, bold) e não fechar com`,(0,i.jsx)(`code`,{children:`$PSStyle.Reset`}),`, todo texto subsequente — inclusive de comandos posteriores — herda o estilo até alguma escrita resetar. Resultado: prompt vermelho permanente.`]})}),(0,i.jsx)(`h2`,{children:`Cheat — códigos ANSI puros (sem PSStyle)`}),(0,i.jsx)(t,{title:`Funciona em qualquer terminal compatível`,code:`$ESC = [char]27
"${ESC}[31mVermelho${ESC}[0m"          # Cor texto
"${ESC}[42mFundo verde${ESC}[0m"       # Cor fundo
"${ESC}[1mNegrito${ESC}[0m"
"${ESC}[4mSublinhado${ESC}[0m"

# RGB foreground
"${ESC}[38;2;255;105;180mRosa${ESC}[0m"
# RGB background
"${ESC}[48;2;0;0;0mFundo preto${ESC}[0m"

# Reset total
"${ESC}[0m"`}),(0,i.jsx)(n,{type:`success`,title:`Resumão`,children:(0,i.jsxs)(`p`,{children:[(0,i.jsx)(`code`,{children:`$PSStyle`}),` é o jeito moderno e portável de colorir saída no PowerShell 7.2+. Use `,(0,i.jsx)(`code`,{children:`Foreground`}),` / `,(0,i.jsx)(`code`,{children:`Background`}),`para cores, `,(0,i.jsx)(`code`,{children:`Formatting`}),` para mensagens do sistema,`,(0,i.jsx)(`code`,{children:`FileInfo`}),` para Get-ChildItem, e configure tudo no`,(0,i.jsx)(`code`,{children:`$PROFILE`}),` para um tema consistente em qualquer sessão.`]})})]})}export{a as default};