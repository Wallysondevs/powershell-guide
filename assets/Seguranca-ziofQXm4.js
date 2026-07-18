import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Segurança no PowerShell`,subtitle:`Políticas de execução, assinatura de scripts, credenciais seguras e proteção contra exploits.`,difficulty:`avançado`,timeToRead:`30 min`,children:[(0,i.jsx)(`p`,{children:`Segurança em PowerShell abrange múltiplas camadas: da política de execução e assinatura de código à proteção de credenciais e implementação de JEA (Just Enough Administration). Entender essas camadas é essencial em ambientes corporativos.`}),(0,i.jsx)(`h2`,{children:`Políticas de Execução`}),(0,i.jsx)(t,{title:`Gerenciando Execution Policy`,code:`# Ver política atual (todas as escopos)
Get-ExecutionPolicy -List
# MachinePolicy   Undefined
# UserPolicy      Undefined
# Process         Undefined
# CurrentUser     RemoteSigned
# LocalMachine    Restricted

# Políticas disponíveis:
# Restricted  — Nenhum script (padrão no Windows)
# AllSigned   — Apenas scripts assinados
# RemoteSigned — Scripts locais OK; remotos precisam de assinatura
# Unrestricted — Todos os scripts (aviso para remotos)
# Bypass       — Sem restrições, sem avisos

# Alterar política (requer Administrador para LocalMachine)
Set-ExecutionPolicy RemoteSigned -Scope LocalMachine
Set-ExecutionPolicy Bypass -Scope Process  # Só para esta sessão

# Verificar se script está bloqueado (Zone.Identifier)
Get-Item "C:Downloadsscript.ps1" -Stream *
Unblock-File -Path "C:Downloadsscript.ps1"  # Desbloquear

# Executar script ignorando política (uso cuidadoso!)
powershell.exe -ExecutionPolicy Bypass -File "script.ps1"
`}),(0,i.jsx)(`h2`,{children:`Gerenciamento Seguro de Credenciais`}),(0,i.jsx)(t,{title:`SecureString, PSCredential e Secret Management`,code:`# Nunca salve senhas em texto plano!
# RUIM:
# $senha = "MinhaSenha123"

# BOM: SecureString
$senhaSegura = Read-Host "Digite a senha" -AsSecureString
$senhaSegura = ConvertTo-SecureString "SomenteParaTeste!" -AsPlainText -Force

# PSCredential
$cred = [PSCredential]::new("EMPRESAadmin", $senhaSegura)
$cred = Get-Credential -Message "Credenciais do servidor" -UserName "admin"

# Salvar credencial criptografada no disco (só funciona na mesma conta/máquina)
$cred.Password | ConvertFrom-SecureString | Set-Content "cred.enc"
$senhaCarregada = Get-Content "cred.enc" | ConvertTo-SecureString
$credRecuperada = [PSCredential]::new("admin", $senhaCarregada)

# Módulo SecretManagement (recomendado)
Install-Module Microsoft.PowerShell.SecretManagement -Force
Install-Module Microsoft.PowerShell.SecretStore -Force

# Configurar vault local
Register-SecretVault -Name "VaultLocal" -ModuleName Microsoft.PowerShell.SecretStore
Set-SecretStoreConfiguration -Authentication Password -Interaction None

# Armazenar e recuperar segredos
Set-Secret -Name "DbPassword" -Secret "SenhaDoSQL@2024"
Set-Secret -Name "ApiToken"   -Secret (ConvertTo-SecureString "token-secreto" -AsPlainText -Force)

$dbPass  = Get-Secret -Name "DbPassword" -AsPlainText
$apiToken = Get-Secret -Name "ApiToken" -AsPlainText
`}),(0,i.jsx)(`h2`,{children:`Assinatura de Scripts`}),(0,i.jsx)(t,{title:`Criar e verificar assinatura digital`,code:`# Verificar se script tem assinatura
Get-AuthenticodeSignature "C:Scriptsdeploy.ps1"

# Criar certificado de assinatura auto-assinado (para testes)
$cert = New-SelfSignedCertificate  -Subject "CN=PowerShell Scripts,OU=TI,O=Empresa"  -CertStoreLocation "Cert:CurrentUserMy"  -Type CodeSigningCert  -KeyUsage DigitalSignature  -KeyAlgorithm RSA  -KeyLength 2048  -NotAfter (Get-Date).AddYears(3)

# Assinar script
Set-AuthenticodeSignature -FilePath "C:Scriptsdeploy.ps1"  -Certificate $cert

# Verificar assinatura
$sig = Get-AuthenticodeSignature "C:Scriptsdeploy.ps1"
$sig.Status  # Valid
$sig.SignerCertificate.Subject

# Assinar todos os scripts de uma pasta
Get-ChildItem "C:Scripts" -Filter "*.ps1" -Recurse | ForEach-Object {
    $resultado = Set-AuthenticodeSignature $_.FullName $cert
    "$($_.Name): $($resultado.Status)"
}
`}),(0,i.jsx)(`h2`,{children:`Just Enough Administration (JEA)`}),(0,i.jsx)(t,{title:`Configurando JEA para mínimos privilégios`,code:`# JEA: Usuários não-admin podem executar comandos específicos como admin

# 1. Criar arquivo de capacidades (Role Capability)
New-PSRoleCapabilityFile -Path "C:JEAOperadorRede.psrc"  -VisibleCmdlets @{
        Name = "Get-NetAdapter","Get-NetIPAddress","Test-NetConnection",
               "Restart-NetAdapter"
    }  -VisibleFunctions "Get-NetworkStatus"  -VisibleProviders "FileSystem"  -ScriptsToProcess "C:JEAInicializar.ps1"

# 2. Criar configuração de sessão
New-PSSessionConfigurationFile -Path "C:JEAOperadorRede.pssc"  -SessionType RestrictedRemoteServer  -RunAsVirtualAccount  -RoleDefinitions @{
        "EMPRESAGRP-Operadores-Rede" = @{
            RoleCapabilities = "OperadorRede"
        }
    }

# 3. Registrar o endpoint JEA
Register-PSSessionConfiguration -Name "OperadorRede"  -Path "C:JEAOperadorRede.pssc"  -Force

# 4. Conectar ao endpoint JEA (como operador de rede)
Enter-PSSession -ComputerName "servidor01" -ConfigurationName "OperadorRede"
# PS servidor01 [OperadorRede]> Get-NetAdapter  # Funciona
# PS servidor01 [OperadorRede]> Get-Process     # NÃO permitido
`}),(0,i.jsx)(`h2`,{children:`Logging e Auditoria`}),(0,i.jsx)(t,{title:`Habilitando logs detalhados de PowerShell`,code:`# Habilitar Script Block Logging (via GPO ou registro)
$caminho = "HKLM:SOFTWAREPoliciesMicrosoftWindowsPowerShellScriptBlockLogging"
New-Item -Path $caminho -Force | Out-Null
Set-ItemProperty -Path $caminho -Name "EnableScriptBlockLogging" -Value 1

# Habilitar Module Logging
$caminho2 = "HKLM:SOFTWAREPoliciesMicrosoftWindowsPowerShellModuleLogging"
New-Item -Path $caminho2 -Force | Out-Null
Set-ItemProperty -Path $caminho2 -Name "EnableModuleLogging" -Value 1

# Transcription (grava todas as sessões em arquivo)
$caminho3 = "HKLM:SOFTWAREPoliciesMicrosoftWindowsPowerShellTranscription"
New-Item -Path $caminho3 -Force | Out-Null
Set-ItemProperty -Path $caminho3 -Name "EnableTranscripting" -Value 1
Set-ItemProperty -Path $caminho3 -Name "OutputDirectory" -Value "C:PSTranscripts"

# Ler logs do Event Viewer
Get-WinEvent -LogName "Microsoft-Windows-PowerShell/Operational" -MaxEvents 50 |
    Where-Object Id -eq 4104 |  # Script Block Log
    Select-Object TimeCreated, Message |
    Format-List
`}),(0,i.jsx)(n,{type:`danger`,title:`Constrained Language Mode`,children:`Em ambientes de alta segurança, configure o PowerShell em Constrained Language Mode via AppLocker ou WDAC. Isso restringe acesso a tipos .NET e APIs do sistema, dificultando ataques de escalada de privilégio.`})]})}export{a as default};