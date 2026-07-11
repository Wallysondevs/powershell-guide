import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Gerenciamento de Usuários e Grupos`,subtitle:`Aprenda a administrar contas locais e grupos de segurança usando PowerShell.`,difficulty:`intermediario`,timeToRead:`15 min`,children:[(0,i.jsxs)(`p`,{children:[`O gerenciamento de usuários é uma parte fundamental da administração do Windows. O módulo `,(0,i.jsx)(`code`,{children:`Microsoft.PowerShell.LocalAccounts`}),` fornece cmdlets modernos para gerenciar usuários e grupos locais, substituindo os comandos legados do `,(0,i.jsx)(`code`,{children:`net user`}),` e `,(0,i.jsx)(`code`,{children:`net localgroup`}),`.`]}),(0,i.jsx)(`h2`,{children:`1. Gerenciando Usuários Locais`}),(0,i.jsxs)(`p`,{children:[`Para listar os usuários presentes na máquina local, usamos o `,(0,i.jsx)(`code`,{children:`Get-LocalUser`}),`.`]}),(0,i.jsx)(t,{title:`Consultando usuários`,code:`# Listar todos os usuários locais
Get-LocalUser

# Obter detalhes de um usuário específico
Get-LocalUser -Name "Administrador"

# Listar apenas usuários ativos (habilitados)
Get-LocalUser | Where-Object Enabled -eq $true
`}),(0,i.jsx)(`h2`,{children:`2. Criando Novos Usuários`}),(0,i.jsxs)(`p`,{children:[`A criação de um usuário requer um cuidado especial com a senha, que deve ser passada como um objeto de `,(0,i.jsx)(`code`,{children:`SecureString`}),`.`]}),(0,i.jsx)(t,{title:`Criando um usuário`,code:`# Definir a senha de forma segura
$password = Read-Host "Digite a senha do novo usuário" -AsSecureString

# Criar o usuário
New-LocalUser -Name "DevUser"  -Password $password  -FullName "Desenvolvedor de Teste"  -Description "Conta usada para testes de ambiente"  -PasswordNeverExpires

# Ativar o usuário (caso venha desativado por padrão)
Enable-LocalUser -Name "DevUser"
`}),(0,i.jsxs)(n,{type:`warning`,title:`Segurança`,children:[`Nunca escreva senhas em texto puro nos seus scripts. Sempre use `,(0,i.jsx)(`code`,{children:`Read-Host -AsSecureString`}),` ou recupere de um cofre de senhas (como o módulo SecretManagement).`]}),(0,i.jsx)(`h2`,{children:`3. Modificando e Removendo Usuários`}),(0,i.jsx)(`p`,{children:`Podemos alterar propriedades ou excluir contas facilmente.`}),(0,i.jsx)(t,{title:`Alterando e removendo`,code:`# Alterar a descrição de um usuário
Set-LocalUser -Name "DevUser" -Description "Nova descrição atualizada"

# Desativar um usuário temporariamente
Disable-LocalUser -Name "DevUser"

# Remover um usuário permanentemente
Remove-LocalUser -Name "DevUser"
`}),(0,i.jsx)(`h2`,{children:`4. Gerenciando Grupos Locais`}),(0,i.jsx)(`p`,{children:`Grupos são usados para atribuir permissões a múltiplos usuários de uma vez.`}),(0,i.jsx)(t,{title:`Trabalhando com grupos`,code:`# Listar todos os grupos locais
Get-LocalGroup

# Criar um novo grupo
New-LocalGroup -Name "Desenvolvedores" -Description "Acesso às ferramentas de dev"

# Adicionar um usuário a um grupo (ex: dar permissão de Admin)
Add-LocalGroupMember -Group "Administradores" -Member "DevUser"

# Listar membros de um grupo específico
Get-LocalGroupMember -Group "Administradores"
`}),(0,i.jsx)(`h2`,{children:`5. Identidade do Usuário Atual`}),(0,i.jsx)(`p`,{children:`Muitas vezes precisamos saber quem está executando o script ou se temos privilégios elevados.`}),(0,i.jsx)(t,{title:`Verificando identidade`,code:`# Quem sou eu? (comando clássico)
whoami

# Obter o SID do usuário atual via .NET
[System.Security.Principal.WindowsIdentity]::GetCurrent().User

# Verificar se o script está rodando como Administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "Executando como Administrador!" -ForegroundColor Green
} else {
    Write-Warning "Este script requer privilégios de Administrador."
}
`}),(0,i.jsx)(`h2`,{children:`6. Comparação com Comandos Antigos`}),(0,i.jsx)(`p`,{children:`Se você está acostumado com o CMD, veja a equivalência:`}),(0,i.jsxs)(`table`,{className:`min-w-full divide-y divide-border border rounded-lg overflow-hidden my-4`,children:[(0,i.jsx)(`thead`,{className:`bg-muted`,children:(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`th`,{className:`px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider`,children:`CMD (net.exe)`}),(0,i.jsx)(`th`,{className:`px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider`,children:`PowerShell`})]})}),(0,i.jsxs)(`tbody`,{className:`divide-y divide-border`,children:[(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-blue-400`,children:`net user`}),(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-green-400`,children:`Get-LocalUser`})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-blue-400`,children:`net user user /add`}),(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-green-400`,children:`New-LocalUser`})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-blue-400`,children:`net localgroup`}),(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-green-400`,children:`Get-LocalGroup`})]}),(0,i.jsxs)(`tr`,{children:[(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-blue-400`,children:`net localgroup grp /add`}),(0,i.jsx)(`td`,{className:`px-4 py-2 font-mono text-sm text-green-400`,children:`Add-LocalGroupMember`})]})]})]}),(0,i.jsxs)(n,{type:`info`,title:`Active Directory`,children:[`Este guia cobre usuários `,(0,i.jsx)(`b`,{children:`locais`}),`. Para gerenciar usuários de um domínio (Active Directory), você precisará do módulo `,(0,i.jsx)(`code`,{children:`ActiveDirectory`}),` (RSAT) e cmdlets como `,(0,i.jsx)(`code`,{children:`Get-ADUser`}),`, `,(0,i.jsx)(`code`,{children:`New-ADUser`}),`, etc.`]})]})}export{a as default};