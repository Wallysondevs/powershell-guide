import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`PSProviders e PSDrives — Tudo é Filesystem`,subtitle:`Navegue Registry, Variáveis, Alias, Cert, Function e até Active Directory com cd, dir, Get-Item e Get-ChildItem. O conceito mais Unix-like do PowerShell.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`Um `,(0,i.jsx)(`strong`,{children:`PSProvider`}),` é um adaptador que expõe qualquer fonte de dados como se fosse sistema de arquivos. Um `,(0,i.jsx)(`strong`,{children:`PSDrive`}),`é uma "letra" montando esse provider. É por isso que você pode fazer`,(0,i.jsx)(`code`,{children:`cd HKLM:\\\\`}),` ou `,(0,i.jsx)(`code`,{children:`dir Cert:\\\\CurrentUser\\\\My`}),` — para o PowerShell, registry e certificados são pastas.`]}),(0,i.jsx)(n,{type:`info`,title:`A grande sacada`,children:(0,i.jsxs)(`p`,{children:[`Ao aprender `,(0,i.jsx)(`code`,{children:`cd`}),`, `,(0,i.jsx)(`code`,{children:`dir`}),`, `,(0,i.jsx)(`code`,{children:`Get-Item`}),`,`,(0,i.jsx)(`code`,{children:`Get-ItemProperty`}),`, `,(0,i.jsx)(`code`,{children:`New-Item`}),`, `,(0,i.jsx)(`code`,{children:`Remove-Item`}),`, você ganha automaticamente como navegar TODA fonte de dados que tenha um provider. Em vez de 50 cmdlets diferentes para registry, AD, IIS — sempre os mesmos 6 verbos.`]})}),(0,i.jsx)(`h2`,{children:`Conceito — providers built-in`}),(0,i.jsx)(t,{title:`O que vem pronto`,code:`# Listar todos os providers carregados
Get-PSProvider

# Saída típica:
# Name                 Capabilities                Drives
# ----                 ------------                ------
# Alias                ShouldProcess               {Alias}
# Environment          ShouldProcess               {Env}
# FileSystem           Filter, ShouldProcess       {C, D}
# Function             ShouldProcess               {Function}
# Registry             ShouldProcess, Transactions {HKLM, HKCU}
# Variable             ShouldProcess               {Variable}
# Certificate          ShouldProcess               {Cert}
# WSMan                Credentials                 {WSMan}

# Listar todos os drives ativos
Get-PSDrive`}),(0,i.jsx)(`h2`,{children:`Os 6 cmdlets universais`}),(0,i.jsx)(t,{title:`Funcionam em QUALQUER provider`,code:`# Get-PSDrive  → listar drives
# New-PSDrive  → criar drive (montar)
# Remove-PSDrive → desmontar
# Push-Location / Pop-Location → cd com pilha
# Get-Location → pwd

# Item-level (em qualquer provider)
Get-Item        # 1 item
Get-ChildItem   # filhos (dir, ls)
New-Item        # criar
Remove-Item     # apagar
Copy-Item / Move-Item / Rename-Item
Test-Path       # existe?

# Property-level (registry, AD, etc.)
Get-ItemProperty
Set-ItemProperty
New-ItemProperty
Remove-ItemProperty
Clear-ItemProperty`}),(0,i.jsx)(`h2`,{children:`Drive Variable — variáveis como arquivos`}),(0,i.jsx)(t,{title:`Exploração interativa de variáveis`,code:`# Listar TODAS as variáveis em escopo
Get-ChildItem Variable:

# Inspecionar uma específica
Get-Item Variable:PROFILE
Get-Item Variable:HOME

# Criar variável via provider
New-Item Variable:meuTeste -Value "Olá mundo"
Get-Item Variable:meuTeste | Select-Object Name, Value

# Apagar
Remove-Item Variable:meuTeste

# Apagar TODAS variáveis user-defined (cuidado)
Get-ChildItem Variable: | Where-Object {
    $_.Options -notmatch 'ReadOnly|Constant'
} | Remove-Item -ErrorAction SilentlyContinue`}),(0,i.jsx)(`h2`,{children:`Drive Env — variáveis de ambiente`}),(0,i.jsx)(t,{title:`Mais limpo que [Environment]::GetEnvironmentVariable`,code:`# Listar
Get-ChildItem Env:

# Ler
$env:PATH                    # Atalho
(Get-Item Env:PATH).Value    # Via provider

# Criar/atualizar (apenas sessão)
$env:MY_VAR = 'valor'
New-Item -Path Env:MY_VAR -Value 'valor' -Force

# Apagar (sessão)
Remove-Item Env:MY_VAR

# Persistir (registry — User ou Machine)
[Environment]::SetEnvironmentVariable('MY_VAR', 'valor', 'User')
[Environment]::SetEnvironmentVariable('MY_VAR', $null,    'User')   # apaga`}),(0,i.jsx)(`h2`,{children:`Drive Alias — funções e atalhos`}),(0,i.jsx)(t,{title:`Criar e gerenciar aliases`,code:`# Listar todos
Get-ChildItem Alias:

# Filtrar por prefixo
Get-ChildItem Alias:g*

# Inspecionar um
Get-Item Alias:ls    # Mostra que aponta para Get-ChildItem

# Criar (mesma coisa que Set-Alias)
New-Item -Path Alias:ll -Value Get-ChildItem
ll

# Apagar
Remove-Item Alias:ll`}),(0,i.jsx)(`h2`,{children:`Drive Function — listar e editar funções`}),(0,i.jsx)(t,{title:`Toda função do PowerShell vira arquivo`,code:`# Listar todas as funções carregadas
Get-ChildItem Function:

# Ver corpo de uma função
Get-Item Function:prompt
(Get-Item Function:prompt).Definition

# Sobrescrever prompt rapidamente
Set-Item Function:prompt -Value {
    "$($PSStyle.Foreground.BrightCyan)PS $($PSStyle.Foreground.Yellow)$(Split-Path -Leaf (Get-Location))$($PSStyle.Reset) > "
}

# Apagar uma função
Remove-Item Function:MinhaFuncao`}),(0,i.jsx)(`h2`,{children:`Drive Registry — HKLM e HKCU`}),(0,i.jsx)(t,{title:`Navegar e modificar como pastas`,code:`# Navegar
Set-Location HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion
Get-ChildItem | Select-Object -First 10

# Ler valores (Properties)
Get-ItemProperty .\\Run

# Adicionar app no startup
Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' \`
    -Name 'MeuApp' -Value 'C:\\Tools\\meuapp.exe'

# Criar chave + valor
$path = 'HKCU:\\Software\\MinhaEmpresa\\Config'
New-Item -Path $path -Force | Out-Null
New-ItemProperty -Path $path -Name 'Tema' -Value 'Dark' -PropertyType String
New-ItemProperty -Path $path -Name 'Versao' -Value 3 -PropertyType DWord

# Ler
(Get-ItemProperty $path).Tema

# Remover valor
Remove-ItemProperty -Path $path -Name 'Tema'

# Apagar chave inteira
Remove-Item $path -Recurse`}),(0,i.jsx)(n,{type:`warning`,title:`Cuidado com HKLM (Local Machine)`,children:(0,i.jsxs)(`p`,{children:[`Escrever em `,(0,i.jsx)(`code`,{children:`HKLM:`}),` exige terminal elevado (admin). Sem isso, falha silenciosamente em alguns casos. Sempre teste com`,(0,i.jsx)(`code`,{children:`Test-Path`}),` + `,(0,i.jsx)(`code`,{children:`-WhatIf`}),` antes em scripts de deploy.`]})}),(0,i.jsx)(`h2`,{children:`Drive Cert — certificados como arquivos`}),(0,i.jsx)(t,{title:`Inspecionar e mover certificados`,code:`# Listar lojas de certificados
Get-ChildItem Cert:

# Listar certificados pessoais do usuário
Get-ChildItem Cert:\\CurrentUser\\My

# Filtrar por validade
Get-ChildItem Cert:\\LocalMachine\\My -Recurse |
    Where-Object NotAfter -lt (Get-Date).AddDays(30) |
    Select-Object Subject, NotAfter, Thumbprint

# Inspecionar detalhes
$cert = Get-Item Cert:\\CurrentUser\\My\\<thumbprint>
$cert.Subject
$cert.Issuer
$cert.HasPrivateKey
$cert.EnhancedKeyUsageList

# Exportar para .pfx
$senha = Read-Host -AsSecureString
Export-PfxCertificate -Cert $cert -FilePath ./cert.pfx -Password $senha

# Apagar (use Remove-Item, não delete manual)
Remove-Item "Cert:\\CurrentUser\\My\\<thumbprint>"`}),(0,i.jsx)(`h2`,{children:`New-PSDrive — montar drives customizados`}),(0,i.jsx)(t,{title:`Atalhos para pastas, shares de rede e mais`,code:`# Atalho para uma pasta de projetos
New-PSDrive -Name dev -PSProvider FileSystem -Root 'C:\\Users\\Wally\\dev'
Set-Location dev:
ls

# Compartilhamento de rede com credencial
$cred = Get-Credential
New-PSDrive -Name backup -PSProvider FileSystem \`
    -Root '\\\\fileserver\\backup' -Credential $cred -Persist

# Persistir entre sessões (Windows: vira mapa de rede)
# -Persist requer letra única (ex: -Name Z)

# Drive em registry com escopo restrito
New-PSDrive -Name appcfg -PSProvider Registry -Root 'HKCU:\\Software\\MinhaEmpresa\\Config'
Set-Location appcfg:
Get-ItemProperty .

# Remover quando não precisar mais
Remove-PSDrive backup`}),(0,i.jsx)(n,{type:`tip`,title:`No $PROFILE`,children:(0,i.jsxs)(`p`,{children:[`Drives criados em uma sessão somem ao fechar. Para tê-los sempre, coloque os `,(0,i.jsx)(`code`,{children:`New-PSDrive`}),` no seu `,(0,i.jsx)(`code`,{children:`$PROFILE`}),`.`]})}),(0,i.jsx)(`h2`,{children:`Caso prático 1 — Snapshot do registry antes de mudar`}),(0,i.jsx)(t,{title:`Versão segura para deploy`,code:`function Backup-RegistryKey {
    param([string]$Path, [string]$DestinoJson)

    $itens = Get-ChildItem $Path -Recurse | ForEach-Object {
        [pscustomobject]@{
            Path       = $_.PSPath
            Properties = Get-ItemProperty $_.PSPath |
                         Select-Object * -ExcludeProperty PSPath, PSParentPath, PSChildName, PSDrive, PSProvider
        }
    }
    $itens | ConvertTo-Json -Depth 5 | Set-Content $DestinoJson -Encoding UTF8
}

Backup-RegistryKey -Path 'HKCU:\\Software\\MinhaApp' -DestinoJson .\\backup.json
# faça mudanças
# se algo quebrar, restaure manualmente do JSON`}),(0,i.jsx)(`h2`,{children:`Caso prático 2 — Auditoria de aplicações instaladas`}),(0,i.jsx)(t,{title:`Sem WMI, direto do registry`,code:`$paths = @(
    'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
    'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
    'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
)

Get-ItemProperty $paths -ErrorAction SilentlyContinue |
    Where-Object DisplayName |
    Select-Object DisplayName, DisplayVersion, Publisher, InstallDate |
    Sort-Object DisplayName |
    Export-Csv apps_instaladas.csv -NoTypeInformation`}),(0,i.jsx)(`h2`,{children:`Caso prático 3 — Buscar valor em todo o registry`}),(0,i.jsx)(t,{title:`Tipo grep em HKLM/HKCU`,code:`function Search-Registry {
    param(
        [string]$Padrao,
        [string]$Hive = 'HKLM:\\SOFTWARE'
    )
    Get-ChildItem $Hive -Recurse -ErrorAction SilentlyContinue |
        ForEach-Object {
            $props = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue
            $props.PSObject.Properties |
                Where-Object { $_.Value -like "*$Padrao*" } |
                ForEach-Object {
                    [pscustomobject]@{
                        Key   = $props.PSPath
                        Name  = $_.Name
                        Value = $_.Value
                    }
                }
        }
}

Search-Registry -Padrao 'C:\\Program Files\\MinhaApp'`}),(0,i.jsx)(`h2`,{children:`Capabilities — o que cada provider suporta`}),(0,i.jsx)(t,{title:`Inspecionar antes de assumir`,code:`Get-PSProvider | Select-Object Name, Capabilities, Drives | Format-Table -AutoSize

# Capabilities possíveis:
# ShouldProcess - aceita -WhatIf / -Confirm
# Filter        - aceita -Filter (mais rápido que -Include)
# Credentials   - aceita -Credential (FileSystem, WSMan)
# Transactions  - suporte a Start-Transaction (Registry)
# ExpandWildcards - aceita curingas

# Exemplo: transação no registry (rollback automático em falha)
Start-Transaction
Set-ItemProperty HKCU:\\Software\\Teste -Name X -Value 1 -UseTransaction
# se algo der errado:
Undo-Transaction        # desfaz
# se ok:
Complete-Transaction    # commita`}),(0,i.jsx)(`h2`,{children:`Cheat — drives mais úteis`}),(0,i.jsx)(t,{title:`Decorar para sempre`,code:`Variable:        # Variáveis em escopo
Env:             # Variáveis de ambiente
Alias:           # Aliases
Function:        # Funções carregadas
HKLM:            # Registry — Local Machine
HKCU:            # Registry — Current User
Cert:            # Certificados (CurrentUser, LocalMachine)
WSMan:           # Configuração de remoting

# Módulos extras adicionam mais:
AD:              # ActiveDirectory module
IIS:             # WebAdministration
SQLSERVER:       # SqlServer module
Az: / Az.Ssh:    # Azure
Kubernetes:      # PSKubectl`}),(0,i.jsx)(n,{type:`success`,title:`Resumão`,children:(0,i.jsxs)(`p`,{children:[`PSProvider é o "tudo é arquivo" do Unix levado a sério no Windows. Um punhado de cmdlets `,(0,i.jsx)(`code`,{children:`Get/Set/New/Remove-Item`}),` serve para navegar variáveis, certificados, registry e qualquer fonte que tenha provider. Aprenda 6 verbos uma vez, use em 50 contextos.`]})})]})}export{a as default};