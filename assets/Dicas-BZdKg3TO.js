import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Dicas e Truques`,subtitle:`Aumente sua produtividade com atalhos, aliases, splatting e configurações avançadas de console.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsx)(`p`,{children:`Dominar o PowerShell não é apenas conhecer os cmdlets, mas também saber como interagir com o shell de forma eficiente. Aqui estão as dicas que separam iniciantes de especialistas — do uso de atalhos de teclado a técnicas avançadas de composição de comandos.`}),(0,i.jsx)(`h2`,{children:`Atalhos de Teclado Essenciais`}),(0,i.jsx)(`p`,{children:`O PowerShell com o módulo PSReadLine oferece atalhos poderosos para edição de linha de comando. Esses atalhos economizam minutos por hora de trabalho.`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Tab / Shift+Tab:`}),` Completa comandos, arquivos e parâmetros. Continue apertando para ciclar entre as opções.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + Espaço:`}),` Abre o menu de sugestões do IntelliSense (PSReadLine).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + R:`}),` Pesquisa reversa no histórico de comandos — comece a digitar e ele encontra.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`F7:`}),` Exibe um menu pop-up com o histórico de comandos (no console clássico).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + L:`}),` Limpa a tela (equivalente ao `,(0,i.jsx)(`code`,{children:`Clear-Host`}),`).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Alt + . (ponto):`}),` Insere o último argumento do comando anterior — extremamente útil!`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + ← / →:`}),` Move palavra por palavra na linha de comando.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + A / E:`}),` Vai ao início / fim da linha (estilo Bash).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + U:`}),` Apaga da posição atual até o início da linha.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + K:`}),` Apaga da posição atual até o fim da linha.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Seta para cima / baixo:`}),` Navega no histórico de comandos.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ctrl + Z:`}),` Desfaz a edição atual na linha de comando.`]})]}),(0,i.jsx)(`h2`,{children:`Aliases: Os Atalhos de Comandos`}),(0,i.jsx)(`p`,{children:`Aliases são nomes curtos para comandos longos. O PowerShell já vem com muitos inspirados no CMD e no Bash.`}),(0,i.jsx)(t,{title:`Trabalhando com aliases`,language:`powershell`,code:`# Listar todos os aliases disponíveis
Get-Alias

# Descobrir o comando real por trás de um alias
Get-Alias ls      # → Get-ChildItem
Get-Alias dir     # → Get-ChildItem
Get-Alias ?       # → Where-Object
Get-Alias %       # → ForEach-Object

# Encontrar aliases de um cmdlet específico
Get-Alias -Definition "Get-ChildItem"

# Criar seu próprio alias (dura apenas a sessão atual)
Set-Alias -Name "grep" -Value Select-String
Set-Alias -Name "touch" -Value New-Item

# Alias com função (mais poderoso que Set-Alias)
function Get-IP { (Invoke-RestMethod ifconfig.me/ip).Trim() }
Set-Alias -Name "meuip" -Value Get-IP

# Exportar aliases para um arquivo
Export-Alias -Path "$env:USERPROFILE\\aliases.csv"

# Importar aliases de um arquivo
Import-Alias -Path "$env:USERPROFILE\\aliases.csv" -Force`}),(0,i.jsxs)(n,{type:`warning`,title:`Regra de Ouro para Scripts`,children:[(0,i.jsx)(`strong`,{children:`Nunca use aliases em scripts!`}),` Use nomes completos (ex: `,(0,i.jsx)(`code`,{children:`Where-Object`}),` em vez de `,(0,i.jsx)(`code`,{children:`?`}),`, `,(0,i.jsx)(`code`,{children:`ForEach-Object`}),` em vez de `,(0,i.jsx)(`code`,{children:`%`}),`). Scripts precisam ser legíveis e manuteníveis por outras pessoas — e aliases podem variar de ambiente para ambiente.`]}),(0,i.jsx)(`h2`,{children:`Splatting: Limpando Comandos Longos`}),(0,i.jsx)(`p`,{children:`Splatting é uma técnica para passar parâmetros a um comando usando uma Hashtable. Isso evita linhas quilométricas e facilita a manutenção — você pode adicionar ou remover parâmetros facilmente.`}),(0,i.jsx)(t,{title:`Splatting na prática`,language:`powershell`,code:`# SEM Splatting — difícil de ler e manter
Copy-Item -Path "C:\\origem\\arquivo.log" -Destination "D:\\backup" -Force -Recurse -Verbose

# COM Splatting — organizado e fácil de modificar
$copiaParams = @{
    Path        = "C:\\origem\\arquivo.log"
    Destination = "D:\\backup"
    Force       = $true
    Recurse     = $true
    Verbose     = $true
}
Copy-Item @copiaParams   # Use @, não $, para fazer o splatting!

# Splatting com Send-MailMessage
$emailParams = @{
    To         = "chefe@empresa.com"
    From       = "automacao@empresa.com"
    Subject    = "Relatório Diário — $(Get-Date -Format 'dd/MM/yyyy')"
    Body       = "Segue o relatório em anexo."
    SmtpServer = "smtp.empresa.com"
    Port       = 587
    Attachment = "C:\\Relatorio.pdf"
    UseSsl     = $true
}
Send-MailMessage @emailParams

# Splatting condicional — adicionar parâmetros dinamicamente
$params = @{ Path = "C:\\Logs"; Recurse = $true }
if ($filtro) { $params["Filter"] = "*.log" }
if ($profundidade) { $params["Depth"] = $profundidade }
Get-ChildItem @params`}),(0,i.jsx)(`h2`,{children:`$PSDefaultParameterValues — Padrões Globais`}),(0,i.jsxs)(`p`,{children:[`Se você se pega repetindo sempre o mesmo parâmetro para um comando, defina-o como padrão para toda a sessão (ou coloque no seu `,(0,i.jsx)(`code`,{children:`$PROFILE`}),` para persistir).`]}),(0,i.jsx)(t,{title:`Configurando padrões globais de parâmetros`,language:`powershell`,code:`# Sempre usar -AutoSize no Format-Table
$PSDefaultParameterValues["Format-Table:AutoSize"] = $true

# Sempre usar UTF8 sem BOM no Out-File e Set-Content
$PSDefaultParameterValues["Out-File:Encoding"]    = "utf8"
$PSDefaultParameterValues["Set-Content:Encoding"] = "utf8"

# Sempre habilitar -Verbose em scripts de teste
$PSDefaultParameterValues["*:Verbose"] = $true   # Para TODOS os cmdlets!

# Desabilitar quando terminar de depurar
$PSDefaultParameterValues.Remove("*:Verbose")

# Ver todos os padrões configurados
$PSDefaultParameterValues

# Limpar todos os padrões
$PSDefaultParameterValues.Clear()`}),(0,i.jsx)(`h2`,{children:`Calculated Properties — Colunas Personalizadas`}),(0,i.jsx)(`p`,{children:`Você pode criar colunas "na hora" ao selecionar ou formatar objetos, transformando os dados originais em formatos mais legíveis.`}),(0,i.jsx)(t,{title:`Criando propriedades personalizadas`,language:`powershell`,code:`# Mostrar tamanho de arquivos em MB em vez de Bytes
Get-ChildItem "C:\\Windows\\System32\\*.dll" |
    Select-Object Name,
        @{Name="Tamanho (MB)"; Expression={ [math]::Round($_.Length / 1MB, 3) }},
        LastWriteTime |
    Sort-Object "Tamanho (MB)" -Descending |
    Select-Object -First 10

# Mostrar há quanto tempo o PC está ligado
Get-CimInstance Win32_OperatingSystem |
    Select-Object @{N="Uptime"; E={ (Get-Date) - $_.LastBootUpTime }}

# Formatar saída de processos em formato legível
Get-Process | Sort-Object WS -Descending | Select-Object -First 10 |
    Select-Object Name, Id,
        @{N="RAM (MB)";  E={ [math]::Round($_.WS / 1MB, 1) }},
        @{N="CPU (s)";   E={ [math]::Round($_.CPU, 1) }},
        @{N="Handles";   E={ $_.Handles }} |
    Format-Table -AutoSize`}),(0,i.jsx)(`h2`,{children:`One-Liners Poderosos do Dia a Dia`}),(0,i.jsx)(t,{title:`Comandos de uma linha para tarefas comuns`,language:`powershell`,code:`# Top 5 processos por uso de memória RAM
Get-Process | Sort-Object WS -Descending | Select-Object -First 5 Name, @{N="RAM(MB)";E={[math]::Round($_.WS/1MB)}}

# Arquivos modificados nas últimas 24 horas na pasta atual
Get-ChildItem -Recurse | Where-Object { $_.LastWriteTime -gt (Get-Date).AddHours(-24) }

# Gerar senha aleatória de 16 caracteres (letras + números)
-join ((65..90)+(97..122)+(48..57) | Get-Random -Count 16 | ForEach-Object { [char]$_ })

# Abrir a pasta atual no Windows Explorer
Invoke-Item .
# ou com o alias: ii .

# Fazer ping em vários servidores e mostrar só os que responderam
"SRV01","SRV02","SRV03" | Where-Object { Test-Connection $_ -Count 1 -Quiet } | ForEach-Object { "$_ está online" }

# Copiar conteúdo de um comando para a área de transferência
Get-Process | Out-String | Set-Clipboard

# Contar linhas, palavras e chars de um arquivo de texto
$txt = Get-Content "C:\\relatorio.txt"; [pscustomobject]@{Linhas=$txt.Count; Palavras=($txt -split 's+').Count}

# Baixar um arquivo da internet
Invoke-WebRequest "https://example.com/arquivo.zip" -OutFile "C:\\Temp\\arquivo.zip" -UseBasicParsing`}),(0,i.jsxs)(n,{type:`info`,title:`Você sabia?`,children:[`O alias `,(0,i.jsx)(`code`,{children:`ii`}),` é para `,(0,i.jsx)(`code`,{children:`Invoke-Item`}),`, que "executa" o arquivo ou pasta no programa padrão do Windows: `,(0,i.jsx)(`code`,{children:`ii .`}),` abre o Explorer, `,(0,i.jsx)(`code`,{children:`ii arquivo.pdf`}),` abre no leitor padrão, `,(0,i.jsx)(`code`,{children:`ii https://google.com`}),` abre o navegador padrão!`]}),(0,i.jsx)(`h2`,{children:`Configurações Avançadas do PSReadLine`}),(0,i.jsx)(t,{title:`Personalizando o comportamento do terminal`,language:`powershell`,code:`# Instalar versão mais recente
Install-Module PSReadLine -Force -SkipPublisherCheck

# Habilitar realce de sintaxe por tipo de token
Set-PSReadLineOption -Colors @{
    Command   = 'Cyan'
    Parameter = 'DarkGray'
    String    = 'Yellow'
    Number    = 'Magenta'
    Variable  = 'Green'
    Error     = 'Red'
}

# Ativar previsão de comandos baseada no histórico
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView    # Exibe lista de sugestões

# Configurar Ctrl+D para fechar o terminal (estilo Linux)
Set-PSReadLineKeyHandler -Key Ctrl+d -Function DeleteCharOrExit

# Mapeamento personalizado: Ctrl+/ para comentar linha
Set-PSReadLineKeyHandler -Key "Ctrl+/" -BriefDescription "Comentar" -ScriptBlock {
    $line = $null; $cursor = $null
    [Microsoft.PowerShell.PSConsoleReadLine]::GetBufferState([ref]$line, [ref]$cursor)
    [Microsoft.PowerShell.PSConsoleReadLine]::ReplaceLine("# $line")
}`}),(0,i.jsxs)(n,{type:`success`,title:`Ambiente Visual Completo`,children:[`Para um terminal visualmente impressionante e produtivo, combine: `,(0,i.jsx)(`strong`,{children:`Windows Terminal`}),` (melhor terminal do Windows) + `,(0,i.jsx)(`strong`,{children:`Oh My Posh`}),` (prompt customizável) + `,(0,i.jsx)(`strong`,{children:`Terminal-Icons`}),` (ícones de arquivo) + `,(0,i.jsx)(`strong`,{children:`PSReadLine`}),` (edição inteligente). A experiência fica no nível de terminais Linux modernos!`]})]})}export{a as default};