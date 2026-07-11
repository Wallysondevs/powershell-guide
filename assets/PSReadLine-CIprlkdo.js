import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`PSReadLine — Terminal turbinado`,subtitle:`Histórico inteligente, predições, syntax highlighting, atalhos estilo Bash/Emacs/Vi e edição multi-linha no console PowerShell.`,difficulty:`intermediario`,timeToRead:`22 min`,children:[(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`PSReadLine`}),` é o módulo que `,(0,i.jsx)(`strong`,{children:`desenha tudo o que você digita`}),` no console — cores, autocomplete, histórico persistente, atalhos de teclado e até predições baseadas em IA local. Já vem instalado no Windows PowerShell 5.1 e no PowerShell 7+, e é o segredo por trás de boa parte da produtividade no terminal.`]}),(0,i.jsx)(n,{type:`info`,title:`Por que se importar?`,children:(0,i.jsxs)(`p`,{children:[`Sem PSReadLine bem configurado o terminal é cego: você digita comandos, aperta `,(0,i.jsx)(`kbd`,{children:`↑`}),` e ele só repete os 50 últimos. Com 5 linhas no perfil, você ganha histórico permanente entre sessões, autocomplete inteligente e predição de comandos baseada no que você já fez antes.`]})}),(0,i.jsx)(`h2`,{children:`Versão atual e atualização`}),(0,i.jsx)(t,{title:`Confirmar e atualizar PSReadLine`,code:`# Versão instalada
Get-Module PSReadLine -ListAvailable | Select-Object Name, Version

# Sempre prefira a última (PS 5.1 ainda vem com a 2.0.0 antiga)
Install-Module PSReadLine -Force -SkipPublisherCheck -Scope CurrentUser

# Carregar versão nova mesmo sem reabrir terminal
Remove-Module PSReadLine -Force -ErrorAction SilentlyContinue
Import-Module PSReadLine

# A partir da 2.2.x você ganha PredictiveIntelliSense
(Get-Module PSReadLine).Version`}),(0,i.jsx)(`h2`,{children:`Conceito — o que ele controla`}),(0,i.jsxs)(`p`,{children:[`Tudo que acontece entre você apertar uma tecla e o comando ser enviado para o engine PowerShell passa por PSReadLine: cores de tokens (`,(0,i.jsx)(`code`,{children:`Variable`}),`, `,(0,i.jsx)(`code`,{children:`String`}),`, `,(0,i.jsx)(`code`,{children:`Command`}),`), cursor, seleção, sugestões inline, busca no histórico, multi-line edit e até bracket matching.`]}),(0,i.jsx)(`h2`,{children:`Configuração mínima sensata`}),(0,i.jsx)(t,{title:`Cole no $PROFILE — funciona em PS 5.1 e PS 7`,code:`# === HISTÓRICO ===
Set-PSReadLineOption -HistoryNoDuplicates             # Sem repetidos
Set-PSReadLineOption -HistorySaveStyle SaveIncrementally
Set-PSReadLineOption -MaximumHistoryCount 8000

# === PREDIÇÕES (PSReadLine >= 2.2 / PS 7.2+) ===
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -PredictionViewStyle ListView    # ou InlineView
Set-PSReadLineOption -EditMode Windows                # Emacs / Vi também

# === SUGESTÕES INLINE ===
Set-PSReadLineOption -Colors @{
    Command          = 'Cyan'
    Parameter        = '#9CDCFE'
    String           = '#CE9178'
    Variable         = '#9CDCFE'
    Comment          = '#6A9955'
    InlinePrediction = '#5A6B82'   # cor "fantasma" da sugestão
}

# === ATALHOS produtivos ===
Set-PSReadLineKeyHandler -Key Tab          -Function MenuComplete
Set-PSReadLineKeyHandler -Key Ctrl+Spacebar -Function MenuComplete
Set-PSReadLineKeyHandler -Key UpArrow      -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow    -Function HistorySearchForward
Set-PSReadLineKeyHandler -Key Ctrl+d       -Function DeleteCharOrExit`}),(0,i.jsx)(`h2`,{children:`Histórico — onde fica e como buscar`}),(0,i.jsx)(t,{title:`Tudo que você digitou desde sempre`,code:`# Caminho do arquivo de histórico
(Get-PSReadLineOption).HistorySavePath
# Windows: %APPDATA%\\Microsoft\\Windows\\PowerShell\\PSReadLine\\ConsoleHost_history.txt
# Linux/Mac: ~/.local/share/powershell/PSReadLine/ConsoleHost_history.txt

# Buscar no histórico (Ctrl+R = reverse search interativo)
Get-Content (Get-PSReadLineOption).HistorySavePath -Tail 50

# Limpar histórico atual da sessão (não apaga o arquivo)
Clear-History

# Apagar arquivo inteiro (cuidado!)
Remove-Item (Get-PSReadLineOption).HistorySavePath -Force`}),(0,i.jsx)(n,{type:`warning`,title:`Senhas no histórico`,children:(0,i.jsxs)(`p`,{children:[`Tudo que você digita vai pro arquivo, inclusive`,(0,i.jsx)(`code`,{children:`$senha = 'abc123'`}),` ou tokens passados em linha de comando. Evite secrets em texto puro: use `,(0,i.jsx)(`code`,{children:`Read-Host -AsSecureString`}),`ou o módulo `,(0,i.jsx)(`code`,{children:`SecretManagement`}),`. Para excluir uma linha do histórico use `,(0,i.jsx)(`code`,{children:`HistoryHandler`}),` (próxima seção).`]})}),(0,i.jsx)(`h2`,{children:`Filtrar o que NÃO entra no histórico`}),(0,i.jsx)(t,{title:`Bloqueia comandos sensíveis automaticamente`,code:`Set-PSReadLineOption -AddToHistoryHandler {
    param([string]$line)
    # Não salvar comandos com secrets explícitos
    if ($line -match 'password|secret|token|apikey|-AsSecureString') {
        return $false                       # Não adiciona
    }
    if ($line -match '^\\s*#') { return $false }  # Comentários
    return $true                            # Salva
}`}),(0,i.jsx)(`h2`,{children:`Predições — IntelliSense no terminal`}),(0,i.jsxs)(`p`,{children:[`Em PSReadLine 2.2+ aparece uma sugestão "fantasma" cinza enquanto você digita, baseada no histórico. `,(0,i.jsx)(`kbd`,{children:`→`}),` aceita a sugestão inteira,`,(0,i.jsx)(`kbd`,{children:`Ctrl`}),`+`,(0,i.jsx)(`kbd`,{children:`→`}),` aceita só a próxima palavra.`]}),(0,i.jsx)(t,{title:`Plugin de predição (Az / DSC / customizado)`,code:`# Plugin oficial da Microsoft com sugestões contextuais
Install-Module Az.Tools.Predictor -Force
Enable-AzPredictor

# Listar plugins ativos
Get-PSSubsystem -Kind CommandPredictor

# Modos de exibição
Set-PSReadLineOption -PredictionViewStyle InlineView   # Fantasma na linha
Set-PSReadLineOption -PredictionViewStyle ListView     # Lista abaixo

# Origem das predições
Set-PSReadLineOption -PredictionSource None
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionSource Plugin
Set-PSReadLineOption -PredictionSource HistoryAndPlugin   # Recomendado`}),(0,i.jsx)(`h2`,{children:`Atalhos que mudam tudo no dia a dia`}),(0,i.jsx)(t,{title:`Cheat sheet — combine com EditMode Windows`,code:`# === Edição ===
Ctrl+A          # Início da linha
Ctrl+E          # Fim da linha
Ctrl+W          # Apaga palavra anterior
Ctrl+U          # Apaga até início
Ctrl+K          # Apaga até fim
Alt+D           # Apaga próxima palavra
Ctrl+L          # Limpa tela (Clear-Host)

# === Histórico ===
↑ / ↓           # Navega comandos do histórico
Ctrl+R          # Busca reversa interativa
F2              # Filtra histórico (PSReadLine 2.1+)
F8              # Busca prefixada (digite 'git' + F8)

# === Predição ===
→ ou End        # Aceita sugestão inteira
Ctrl+→          # Aceita próxima palavra
F2              # Alterna entre Inline e ListView

# === Multi-linha ===
Shift+Enter     # Quebra linha sem executar
Esc + Enter     # Limpa buffer

# === Pares de chaves ===
Ctrl+]          # Pula para par correspondente { ( [
Ctrl+Alt+?      # Mostra todos os keybindings`}),(0,i.jsx)(`h2`,{children:`Caso prático 1 — Bracket matching automático`}),(0,i.jsx)(t,{title:`Auto-fecha pares ao digitar abertura`,code:`$pares = @{
    '(' = ')'
    '{' = '}'
    '[' = ']'
    '"' = '"'
    "'" = "'"
}

foreach ($abre in $pares.Keys) {
    Set-PSReadLineKeyHandler -Key $abre -BriefDescription "AutoFechar$abre" \`
        -ScriptBlock {
            param($key, $arg)
            $fecha = $pares[$key.KeyChar.ToString()]
            [Microsoft.PowerShell.PSConsoleReadLine]::Insert("$($key.KeyChar)$fecha")
            [Microsoft.PowerShell.PSConsoleReadLine]::SetCursorPosition(
                [Microsoft.PowerShell.PSConsoleReadLine]::GetCursorPosition() - 1
            )
        }
}`}),(0,i.jsx)(`h2`,{children:`Caso prático 2 — Macro "abrir último log"`}),(0,i.jsx)(t,{title:`F7 abre o último arquivo .log do diretório`,code:`Set-PSReadLineKeyHandler -Key F7 -BriefDescription "Abrir último log" \`
    -ScriptBlock {
        $log = Get-ChildItem -Path . -Filter *.log -File -Recurse |
               Sort-Object LastWriteTime -Descending |
               Select-Object -First 1
        if ($log) {
            [Microsoft.PowerShell.PSConsoleReadLine]::RevertLine()
            [Microsoft.PowerShell.PSConsoleReadLine]::Insert("Get-Content '$($log.FullName)' -Tail 50 -Wait")
        }
    }`}),(0,i.jsx)(`h2`,{children:`Modo Vi — para quem vem do Vim`}),(0,i.jsx)(t,{title:`EditMode Vi com indicador visual`,code:`Set-PSReadLineOption -EditMode Vi
Set-PSReadLineOption -ViModeIndicator Cursor
# Cursor muda de bloco (normal) para linha (insert) automaticamente

# Atalhos típicos:
# Esc      → modo normal
# i / a    → modo insert
# dd       → apaga linha
# /termo   → busca`}),(0,i.jsx)(`h2`,{children:`Tema visual — combinando com Oh My Posh`}),(0,i.jsx)(t,{title:`PSReadLine + tema customizado`,code:`# Instalar Oh My Posh (prompts bonitos com Git status, etc.)
winget install JanDeDobbeleer.OhMyPosh -s winget

# No $PROFILE
oh-my-posh init pwsh --config "$env:POSH_THEMES_PATH/atomic.omp.json" | Invoke-Expression

# Combine com PSReadLine para experiência completa
Import-Module PSReadLine
Set-PSReadLineOption -PredictionSource HistoryAndPlugin
Set-PSReadLineOption -PredictionViewStyle ListView`}),(0,i.jsx)(`h2`,{children:`Inspecionar configuração atual`}),(0,i.jsx)(t,{title:`Tudo que está aplicado agora`,code:`# Configuração completa
Get-PSReadLineOption

# Cores em uso
(Get-PSReadLineOption).Colors

# Todos os atalhos definidos
Get-PSReadLineKeyHandler -Bound

# Atalhos disponíveis mas não-mapeados
Get-PSReadLineKeyHandler -Unbound

# Função de uma tecla específica
Get-PSReadLineKeyHandler -Chord 'Tab'`}),(0,i.jsxs)(n,{type:`danger`,title:`Conflito comum: Ctrl+C`,children:[(0,i.jsxs)(`p`,{children:[`Em `,(0,i.jsx)(`code`,{children:`EditMode Emacs`}),` o `,(0,i.jsx)(`kbd`,{children:`Ctrl`}),`+`,(0,i.jsx)(`kbd`,{children:`C`}),` copia texto selecionado em vez de cancelar o comando atual. Se isso te incomoda, force o comportamento clássico:`]}),(0,i.jsx)(t,{language:`powershell`,code:`Set-PSReadLineKeyHandler -Key Ctrl+c -Function CancelLine`})]}),(0,i.jsx)(`h2`,{children:`Resetar tudo se quebrar`}),(0,i.jsx)(t,{title:`Voltar ao padrão de fábrica`,code:`# Limpa todas as opções customizadas (não desinstala)
Remove-Module PSReadLine -Force
Import-Module PSReadLine
# Pronto: defaults restaurados

# Apagar perfil para começar do zero
Remove-Item $PROFILE -Force
notepad $PROFILE     # Recriar do zero`}),(0,i.jsx)(n,{type:`success`,title:`Resumão`,children:(0,i.jsx)(`p`,{children:`PSReadLine + 5 linhas de configuração + um tema do Oh My Posh transformam o terminal em IDE leve. Histórico permanente, autocomplete inteligente, predição contextual e atalhos consistentes fazem mais pela produtividade do que qualquer plugin de editor.`})})]})}export{a as default};