import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Módulos e Perfil`,subtitle:`Organize seu código em pacotes reutilizáveis e personalize seu ambiente de trabalho.`,difficulty:`intermediario`,timeToRead:`25 min`,children:[(0,i.jsx)(`p`,{children:`Módulos são a unidade básica de compartilhamento de código no PowerShell. Eles permitem agrupar funções, variáveis, aliases e recursos em um único pacote que pode ser facilmente distribuído, versionado e importado. Dominar módulos é o que separa scripts avulsos de automações profissionais de nível enterprise.`}),(0,i.jsx)(`h2`,{children:`Gerenciando Módulos`}),(0,i.jsx)(`p`,{children:`O PowerShell vem com centenas de módulos pré-instalados, mas você pode adicionar muito mais através da PowerShell Gallery (PSGallery) — o repositório central da comunidade.`}),(0,i.jsx)(t,{title:`Comandos essenciais de módulos`,language:`powershell`,code:`# Listar todos os módulos carregados na sessão atual
Get-Module

# Listar todos os módulos instalados no sistema (em todos os PSModulePaths)
Get-Module -ListAvailable

# Buscar um módulo específico instalado
Get-Module -ListAvailable -Name "*Azure*"

# Importar um módulo manualmente (normalmente é automático no PS 3.0+)
Import-Module -Name ActiveDirectory -Force -Verbose

# Remover um módulo da sessão atual (não deleta do disco)
Remove-Module -Name NetTCPIP

# Ver os comandos exportados por um módulo
Get-Command -Module ActiveDirectory | Select-Object Name, CommandType

# Ver detalhes de um módulo (versão, autor, dependências)
Get-Module -Name PSReadLine | Format-List *`}),(0,i.jsx)(`h2`,{children:`Descobrindo e Instalando Módulos da Gallery`}),(0,i.jsx)(t,{title:`Usando a PowerShell Gallery`,language:`powershell`,code:`# Procurar módulos por nome ou tags
Find-Module -Name "*SQL*"
Find-Module -Tag "ActiveDirectory", "Windows"
Find-Module -Name "ImportExcel" | Select-Object Name, Version, Description

# Instalar um módulo da Gallery
Install-Module -Name Az -Scope CurrentUser -AllowClobber

# Instalar uma versão específica
Install-Module -Name Pester -RequiredVersion 5.4.0 -Force

# Instalar sem confirmação (útil em automações/CI)
Install-Module -Name PSScriptAnalyzer -Scope CurrentUser -Force -Confirm:$false

# Atualizar um módulo para a versão mais recente
Update-Module -Name ImportExcel

# Atualizar todos os módulos instalados pelo usuário de uma vez
Get-InstalledModule | Update-Module -Force

# Desinstalar um módulo
Uninstall-Module -Name OldModule -AllVersions`}),(0,i.jsxs)(n,{type:`info`,title:`PSModulePath`,children:[`O PowerShell procura módulos automaticamente nos caminhos definidos em `,(0,i.jsx)(`code`,{children:`$env:PSModulePath`}),`. Geralmente inclui:`,(0,i.jsxs)(`ul`,{style:{marginTop:`0.5rem`},children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`C:\\Users\\Você\\Documents\\PowerShell\\Modules`}),` (usuário)`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`C:\\Program Files\\PowerShell\\7\\Modules`}),` (sistema, PS 7)`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\Modules`}),` (legado)`]})]}),`Coloque seus módulos personalizados na pasta do usuário para não precisar de privilégio de administrador.`]}),(0,i.jsx)(`h2`,{children:`Criando seu Próprio Módulo`}),(0,i.jsxs)(`p`,{children:[`Um módulo básico consiste em um arquivo `,(0,i.jsx)(`code`,{children:`.psm1`}),` contendo suas funções. Para módulos profissionais, usamos também um manifesto `,(0,i.jsx)(`code`,{children:`.psd1`}),` que define metadados, dependências e controle de exportação.`]}),(0,i.jsx)(t,{title:`Estrutura de um módulo profissional`,language:`powershell`,code:`# Estrutura de pasta recomendada:
# MeuModulo/
# ├── MeuModulo.psm1        (código principal)
# ├── MeuModulo.psd1        (manifesto — metadados)
# ├── Public/               (funções exportadas)
# │   ├── Get-Relatorio.ps1
# │   └── Send-AlertaEmail.ps1
# └── Private/              (funções internas — não exportadas)
#     └── Format-Dados.ps1

# MeuModulo.psm1 — Carrega e exporta funções organizadas em pastas
$Public  = Get-ChildItem "$PSScriptRoot\\Public\\*.ps1"  -ErrorAction SilentlyContinue
$Private = Get-ChildItem "$PSScriptRoot\\Private\\*.ps1" -ErrorAction SilentlyContinue

foreach ($funcao in ($Public + $Private)) {
    try {
        . $funcao.FullName
    } catch {
        Write-Error "Falha ao importar $($funcao.Name): $_"
    }
}

# Exporta APENAS as funções da pasta Public
Export-ModuleMember -Function $Public.BaseName -Alias *`}),(0,i.jsx)(t,{title:`Gerando o manifesto do módulo (MeuModulo.psd1)`,language:`powershell`,code:`# Criar um manifesto profissional automaticamente
New-ModuleManifest -Path ".\\MeuModulo\\MeuModulo.psd1"  -RootModule "MeuModulo.psm1"  -ModuleVersion "1.2.0"  -Author "Seu Nome"  -CompanyName "Empresa Ltda"  -Description "Automações internas de TI para Windows Server"  -PowerShellVersion "5.1"  -RequiredModules @("ActiveDirectory")  -FunctionsToExport @("Get-Relatorio", "Send-AlertaEmail")  -Tags @("Windows", "ActiveDirectory", "Automacao")  -ProjectUri "https://github.com/empresa/MeuModulo"

# Publicar na Gallery (requer conta na PowerShell Gallery)
Publish-Module -Path ".\\MeuModulo" -NuGetApiKey "sua_api_key"`}),(0,i.jsx)(`h2`,{children:`O Perfil do PowerShell ($PROFILE)`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`$PROFILE`}),` é um script que o PowerShell executa automaticamente toda vez que você abre o terminal. É o lugar perfeito para definir aliases favoritos, funções utilitárias, mudanças visuais e importações de módulos.`]}),(0,i.jsx)(t,{title:`Configurando um perfil completo e profissional`,language:`powershell`,code:`# Há 4 perfis por host (CurrentUser/AllUsers x CurrentHost/AllHosts)
$PROFILE                    # CurrentUser, CurrentHost (o mais comum)
$PROFILE.AllUsersAllHosts   # Afeta TODOS os usuários e hosts

# Verificar o caminho e criar o arquivo se não existir
if (!(Test-Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}

# Editar no VSCode
code $PROFILE

# Exemplo de conteúdo rico para o $PROFILE:

# 1. Importar módulos úteis na inicialização
Import-Module PSReadLine
Import-Module Terminal-Icons

# 2. Configurar PSReadLine para previsão de comandos
Set-PSReadLineOption -PredictionSource History
Set-PSReadLineOption -PredictionViewStyle ListView
Set-PSReadLineKeyHandler -Key UpArrow   -Function HistorySearchBackward
Set-PSReadLineKeyHandler -Key DownArrow -Function HistorySearchForward

# 3. Aliases personalizados
Set-Alias -Name "g"   -Value "git"
Set-Alias -Name "k"   -Value "kubectl"
Set-Alias -Name "tf"  -Value "terraform"
Set-Alias -Name "np"  -Value "notepad"

# 4. Funções rápidas do dia a dia
function which { Get-Command $args[0] | Select-Object -ExpandProperty Source }
function touch { New-Item -ItemType File -Path $args[0] -Force }
function reload { . $PROFILE; Write-Host "Perfil recarregado!" -ForegroundColor Green }
function .. { Set-Location .. }
function ... { Set-Location .... }

# 5. Prompt personalizado com informações de Git
function prompt {
    $local = Split-Path -Leaf (Get-Location)
    $hora  = Get-Date -Format "HH:mm"
    $branch = git branch --show-current 2>$null
    $gitInfo = if ($branch) { " ($branch)" } else { "" }
    "\`e[32m[$hora]\`e[0m \`e[36m$local\`e[33m$gitInfo\`e[0m PS> "
}`}),(0,i.jsxs)(n,{type:`warning`,title:`Quatro tipos de perfil`,children:[`Existem 4 perfis baseados em `,(0,i.jsx)(`strong`,{children:`usuário`}),` (CurrentUser/AllUsers) e `,(0,i.jsx)(`strong`,{children:`host`}),` (CurrentHost/AllHosts). A variável `,(0,i.jsx)(`code`,{children:`$PROFILE`}),` sozinha aponta para o "Usuário Atual, Host Atual". Para configurações que se aplicam a todos os hosts (terminal, VS Code, ISE), use `,(0,i.jsx)(`code`,{children:`$PROFILE.CurrentUserAllHosts`}),`.`]}),(0,i.jsx)(`h2`,{children:`Repositórios Corporativos Internos`}),(0,i.jsx)(t,{title:`Gerenciando repositórios internos`,language:`powershell`,code:`# Registrar um repositório de rede interna da empresa
Register-PSRepository -Name "InternalRepo"  -SourceLocation "\\\\servidor\\PSGallery"  -PublishLocation "\\\\servidor\\PSGallery\\publish"  -InstallationPolicy Trusted

# Listar repositórios disponíveis
Get-PSRepository

# Instalar módulo do repositório interno
Install-Module -Name AutomacaoTI -Repository InternalRepo

# Publicar seu módulo no repo interno
Publish-Module -Name MeuModulo -Repository InternalRepo -NuGetApiKey "interna"

# Remover repositório quando não precisar mais
Unregister-PSRepository -Name "InternalRepo"`}),(0,i.jsxs)(n,{type:`success`,title:`Dica: Organização de Módulos`,children:[`Ao criar módulos corporativos, adote um prefixo padrão para suas funções (ex: `,(0,i.jsx)(`code`,{children:`BRT-`}),` para "Brasil TI"). Isso evita colisões com cmdlets nativos e fica claro que é um módulo interno: `,(0,i.jsx)(`code`,{children:`BRT-Get-ServidoresAtivos`}),`, `,(0,i.jsx)(`code`,{children:`BRT-Send-AlertaEquipe`}),`. Use o `,(0,i.jsx)(`code`,{children:`PSScriptAnalyzer`}),` para verificar boas práticas automaticamente.`]})]})}export{a as default};