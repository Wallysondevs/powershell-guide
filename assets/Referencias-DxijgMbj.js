import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Referências e Ecossistema`,subtitle:`Onde continuar sua jornada e como se manter atualizado no mundo PowerShell.`,difficulty:`iniciante`,timeToRead:`15 min`,children:[(0,i.jsx)(`p`,{children:`O PowerShell é mais do que apenas uma linguagem; é um ecossistema vibrante com suporte da Microsoft e de uma comunidade global apaixonada. Esta página reúne os principais recursos para consulta, aprendizado contínuo e ferramentas essenciais que todo profissional PowerShell deve conhecer.`}),(0,i.jsx)(`h2`,{children:`Documentação Oficial`}),(0,i.jsx)(`p`,{children:`A fonte primária de verdade para qualquer comando ou conceito do PowerShell.`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Microsoft Learn:`}),` `,(0,i.jsx)(`a`,{href:`https://learn.microsoft.com/powershell/`,target:`_blank`,className:`text-primary hover:underline`,children:`learn.microsoft.com/powershell`}),` — documentação oficial completa, atualizada a cada versão.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Repositório GitHub:`}),` `,(0,i.jsx)(`a`,{href:`https://github.com/PowerShell/PowerShell`,target:`_blank`,className:`text-primary hover:underline`,children:`github.com/PowerShell/PowerShell`}),` — onde o desenvolvimento do PS 7+ acontece. Você pode abrir issues e contribuir.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Blog da Equipe PowerShell:`}),` Fique por dentro de novas versões, recursos experimentais e dicas da equipe da Microsoft.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Changelog do PowerShell:`}),` Sempre verifique o `,(0,i.jsx)(`code`,{children:`CHANGELOG.md`}),` no GitHub ao atualizar para uma nova versão principal.`]})]}),(0,i.jsx)(`h2`,{children:`Convenções de Nomenclatura (Verbo-Substantivo)`}),(0,i.jsxs)(`p`,{children:[`O PowerShell segue uma estrutura rígida de nomes que facilita a descoberta de comandos. Sempre use `,(0,i.jsx)(`strong`,{children:`Verbos Aprovados`}),` ao escrever funções e módulos.`]}),(0,i.jsx)(t,{title:`Descobrindo e usando verbos válidos`,language:`powershell`,code:`# Listar todos os verbos aprovados pela Microsoft
Get-Verb

# Filtrar por categoria (ex: verbos de dados)
Get-Verb | Where-Object Group -eq "Data"

# Ver todos os grupos disponíveis
Get-Verb | Select-Object -ExpandProperty Group | Sort-Object -Unique

# Grupos comuns:
# Common   - Get, Set, New, Remove, Clear, Reset, Show, Hide...
# Data     - Backup, Restore, Import, Export, Convert, Compress...
# Lifecycle - Start, Stop, Restart, Suspend, Resume, Wait...
# Security - Block, Grant, Protect, Revoke, Unlock...`}),(0,i.jsx)(`h2`,{children:`Módulos da Comunidade Indispensáveis`}),(0,i.jsx)(`p`,{children:`Esses módulos estendem o PowerShell para quase qualquer tarefa imaginável:`}),(0,i.jsx)(t,{title:`Os módulos que você deve conhecer`,language:`powershell`,code:`# PSReadLine — Melhora drástica na edição da linha de comando (pré-instalado no Win10+)
# Habilita Ctrl+R, realce de sintaxe, previsão inteligente de comandos
Install-Module PSReadLine -Force -SkipPublisherCheck

# Posh-Git — Informações de status do Git no seu prompt
Install-Module posh-git -Scope CurrentUser

# ImportExcel — Leia e escreva arquivos Excel (.xlsx) SEM precisar do Office instalado
Install-Module ImportExcel -Scope CurrentUser
# Exemplo:
Get-Process | Export-Excel "processos.xlsx" -AutoSize -AutoFilter -Show

# Pester — O framework padrão para testes unitários no PowerShell
Install-Module Pester -Force -Scope CurrentUser

# DbaTools — O "canivete suíço" para administradores de SQL Server
Install-Module dbatools -Scope CurrentUser

# PSScriptAnalyzer — Linter: verifica erros de sintaxe e melhores práticas
Install-Module PSScriptAnalyzer -Scope CurrentUser
Invoke-ScriptAnalyzer -Path .\\meu_script.ps1

# Terminal-Icons — Ícones coloridos no terminal ao usar ls/dir
Install-Module -Name Terminal-Icons -Repository PSGallery -Scope CurrentUser

# Oh-My-Posh — Prompt visual altamente customizável (suporta Git, ambiente, etc)
winget install JanDeLaara.OhMyPosh`}),(0,i.jsx)(`h2`,{children:`PowerShell Remoting`}),(0,i.jsx)(`p`,{children:`Uma das características mais poderosas do PowerShell é a capacidade de executar comandos em milhares de máquinas simultaneamente de forma segura.`}),(0,i.jsx)(t,{title:`Remoting básico e avançado`,language:`powershell`,code:`# Habilitar o Remoting (executar como Administrador)
Enable-PSRemoting -Force

# Abrir uma sessão interativa com um servidor remoto
Enter-PSSession -ComputerName "Servidor01"
Enter-PSSession -ComputerName "Servidor01" -Credential (Get-Credential)

# Executar um comando em múltiplos servidores ao mesmo tempo
Invoke-Command -ComputerName "SRV01", "SRV02", "SRV03" -ScriptBlock {
    Get-Service "WinRM" | Select-Object Name, Status
}

# Reutilizando sessões persistentes (mais eficiente que criar sempre novas)
$servidores = New-PSSession -ComputerName "SRV01", "SRV02", "SRV03"
Invoke-Command -Session $servidores -ScriptBlock { hostname }
$servidores | Remove-PSSession

# Copiar um arquivo local para vários servidores
Copy-Item -Path "C:\\Update.exe" -Destination "C:\\Temp" -ToSession $servidores

# Remoting via SSH (PowerShell 7+, funciona em Linux/macOS também)
Enter-PSSession -HostName "ubuntu-server" -UserName "admin" -SSHTransport`}),(0,i.jsxs)(n,{type:`warning`,title:`Firewall e WinRM`,children:[`Por padrão, o WinRM usa as portas `,(0,i.jsx)(`strong`,{children:`5985 (HTTP)`}),` e `,(0,i.jsx)(`strong`,{children:`5986 (HTTPS)`}),`. Certifique-se de que essas portas estão abertas nos firewalls entre os hosts antes de tentar conexões remotas.`]}),(0,i.jsx)(`h2`,{children:`Integração com .NET`}),(0,i.jsx)(`p`,{children:`Como o PowerShell é construído sobre o .NET, você tem acesso direto a toda a biblioteca de classes. Se o PS não tem um cmdlet nativo para algo, recorra ao .NET.`}),(0,i.jsx)(t,{title:`Usando classes .NET diretamente`,language:`powershell`,code:`# Matemática avançada
[System.Math]::Sqrt(144)   # Raiz quadrada
[System.Math]::PI          # Constante Pi
[System.Math]::Round(3.14159, 2)  # Arredondar

# Manipulação de caminho de arquivo
[System.IO.Path]::GetRandomFileName()
[System.IO.Path]::Combine("C:\\Projetos", "Meu App", "config.json")
[System.IO.Path]::GetExtension("documento.pdf")  # .pdf

# Rede e DNS
[System.Net.Dns]::GetHostEntry("google.com")
[System.Net.IPAddress]::Parse("192.168.1.1")

# Criptografia
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$bytes = [System.Text.Encoding]::UTF8.GetBytes("texto secreto")
$hash = $sha256.ComputeHash($bytes)
[BitConverter]::ToString($hash).Replace("-", "").ToLower()`}),(0,i.jsx)(`h2`,{children:`Aprendizado e Comunidade`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PowerShell.org:`}),` Fóruns, eventos e guias gratuitos escritos pela comunidade global.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Reddit r/PowerShell:`}),` Um dos melhores lugares para tirar dúvidas rápidas e ver scripts criativos.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`YouTube — "PowerShell Master Class"`}),` por John Savill: série gratuita de altíssima qualidade.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Eventos:`}),` Procure pelo `,(0,i.jsx)(`em`,{children:`PowerShell Summit`}),` (EUA) e `,(0,i.jsx)(`em`,{children:`PowerShell User Groups`}),` locais.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Stack Overflow:`}),` Tag `,(0,i.jsx)(`code`,{children:`[powershell]`}),` tem mais de 130.000 perguntas respondidas.`]})]}),(0,i.jsx)(`h2`,{children:`Diferenças de Edições`}),(0,i.jsx)(`p`,{children:`É importante saber qual "sabor" do PowerShell você está usando:`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Windows PowerShell (5.1):`}),` Construído sobre o .NET Framework 4.x. Focado em compatibilidade com Windows antigo. Não recebe mais novos recursos (apenas correções de segurança).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`PowerShell (7.x+):`}),` Construído sobre o .NET 6/7/8+. Multiplataforma (Windows, Linux, macOS), muito mais rápido e moderno. É o presente e futuro.`]})]}),(0,i.jsx)(t,{title:`Verificando e atualizando sua versão`,language:`powershell`,code:`# Ver a versão atual
$PSVersionTable

# A propriedade PSEdition mostra "Core" (PS 7) ou "Desktop" (PS 5.1)
$PSVersionTable.PSEdition

# Instalar o PowerShell 7 via winget
winget install --id Microsoft.PowerShell --source winget

# Instalar via Microsoft Store
# Busque por "PowerShell" na Store

# Executar PS 7 lado a lado com o 5.1
pwsh       # Inicia o PowerShell 7
powershell # Inicia o Windows PowerShell 5.1`}),(0,i.jsx)(`h2`,{children:`Boas Práticas de Segurança em Scripts`}),(0,i.jsx)(t,{title:`Práticas recomendadas`,language:`powershell`,code:`# 1. Sempre use [CmdletBinding()] para funções avançadas
function Minha-Funcao {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$Alvo)

    if ($PSCmdlet.ShouldProcess($Alvo, "Operação perigosa")) {
        Write-Verbose "Executando em: $Alvo"
    }
}
# Isso habilita -WhatIf, -Verbose, -Confirm automaticamente

# 2. Nunca salve senhas em texto puro — use SecureString
$senha = Read-Host "Senha" -AsSecureString
$cred = New-Object PSCredential("usuario", $senha)

# 3. Valide parâmetros rigorosamente
param(
    [ValidatePattern("^d{1,3}.d{1,3}.d{1,3}.d{1,3}$")]
    [string]$IPAddress
)

# 4. Assinar seus scripts digitalmente em produção
Set-AuthenticodeSignature -FilePath .\\script.ps1 -Certificate $cert`}),(0,i.jsx)(n,{type:`success`,title:`Parabéns pela jornada!`,children:`Você chegou ao fim deste guia! O PowerShell é uma jornada de aprendizado contínuo. Pratique diariamente, automatize as pequenas tarefas do seu dia a dia e logo você estará dominando infraestruturas inteiras com apenas algumas linhas de código. A comunidade brasileira de PowerShell está crescendo — compartilhe seu conhecimento!`})]})}export{a as default};