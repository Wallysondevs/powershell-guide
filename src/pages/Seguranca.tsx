import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Seguranca() {
  return (
    <PageContainer
      title="Segurança no PowerShell"
      subtitle="Políticas de execução, assinatura de scripts, credenciais seguras e proteção contra exploits."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        Segurança em PowerShell abrange múltiplas camadas: da política de execução e assinatura 
        de código à proteção de credenciais e implementação de JEA (Just Enough Administration). 
        Entender essas camadas é essencial em ambientes corporativos.
      </p>

      <h2>Políticas de Execução</h2>
      <CodeBlock title="Gerenciando Execution Policy" code={`# Ver política atual (todas as escopos)
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
Get-Item "C:\Downloads\script.ps1" -Stream *
Unblock-File -Path "C:\Downloads\script.ps1"  # Desbloquear

# Executar script ignorando política (uso cuidadoso!)
powershell.exe -ExecutionPolicy Bypass -File "script.ps1"
`} />

      <h2>Gerenciamento Seguro de Credenciais</h2>
      <CodeBlock title="SecureString, PSCredential e Secret Management" code={`# Nunca salve senhas em texto plano!
# RUIM:
# $senha = "MinhaSenha123"

# BOM: SecureString
$senhaSegura = Read-Host "Digite a senha" -AsSecureString
$senhaSegura = ConvertTo-SecureString "SomenteParaTeste!" -AsPlainText -Force

# PSCredential
$cred = [PSCredential]::new("EMPRESA\admin", $senhaSegura)
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
`} />

      <h2>Assinatura de Scripts</h2>
      <CodeBlock title="Criar e verificar assinatura digital" code={`# Verificar se script tem assinatura
Get-AuthenticodeSignature "C:\Scripts\deploy.ps1"

# Criar certificado de assinatura auto-assinado (para testes)
$cert = New-SelfSignedCertificate \ -Subject "CN=PowerShell Scripts,OU=TI,O=Empresa" \ -CertStoreLocation "Cert:\CurrentUser\My" \ -Type CodeSigningCert \ -KeyUsage DigitalSignature \ -KeyAlgorithm RSA \ -KeyLength 2048 \ -NotAfter (Get-Date).AddYears(3)

# Assinar script
Set-AuthenticodeSignature -FilePath "C:\Scripts\deploy.ps1" \ -Certificate $cert

# Verificar assinatura
$sig = Get-AuthenticodeSignature "C:\Scripts\deploy.ps1"
$sig.Status  # Valid
$sig.SignerCertificate.Subject

# Assinar todos os scripts de uma pasta
Get-ChildItem "C:\Scripts" -Filter "*.ps1" -Recurse | ForEach-Object {
    $resultado = Set-AuthenticodeSignature $_.FullName $cert
    "$($_.Name): $($resultado.Status)"
}
`} />

      <h2>Just Enough Administration (JEA)</h2>
      <CodeBlock title="Configurando JEA para mínimos privilégios" code={`# JEA: Usuários não-admin podem executar comandos específicos como admin

# 1. Criar arquivo de capacidades (Role Capability)
New-PSRoleCapabilityFile -Path "C:\JEA\OperadorRede.psrc" \ -VisibleCmdlets @{
        Name = "Get-NetAdapter","Get-NetIPAddress","Test-NetConnection",
               "Restart-NetAdapter"
    } \ -VisibleFunctions "Get-NetworkStatus" \ -VisibleProviders "FileSystem" \ -ScriptsToProcess "C:\JEA\Inicializar.ps1"

# 2. Criar configuração de sessão
New-PSSessionConfigurationFile -Path "C:\JEA\OperadorRede.pssc" \ -SessionType RestrictedRemoteServer \ -RunAsVirtualAccount \ -RoleDefinitions @{
        "EMPRESA\GRP-Operadores-Rede" = @{
            RoleCapabilities = "OperadorRede"
        }
    }

# 3. Registrar o endpoint JEA
Register-PSSessionConfiguration -Name "OperadorRede" \ -Path "C:\JEA\OperadorRede.pssc" \ -Force

# 4. Conectar ao endpoint JEA (como operador de rede)
Enter-PSSession -ComputerName "servidor01" -ConfigurationName "OperadorRede"
# PS servidor01 [OperadorRede]> Get-NetAdapter  # Funciona
# PS servidor01 [OperadorRede]> Get-Process     # NÃO permitido
`} />

      <h2>Logging e Auditoria</h2>
      <CodeBlock title="Habilitando logs detalhados de PowerShell" code={`# Habilitar Script Block Logging (via GPO ou registro)
$caminho = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging"
New-Item -Path $caminho -Force | Out-Null
Set-ItemProperty -Path $caminho -Name "EnableScriptBlockLogging" -Value 1

# Habilitar Module Logging
$caminho2 = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ModuleLogging"
New-Item -Path $caminho2 -Force | Out-Null
Set-ItemProperty -Path $caminho2 -Name "EnableModuleLogging" -Value 1

# Transcription (grava todas as sessões em arquivo)
$caminho3 = "HKLM:\SOFTWARE\Policies\Microsoft\Windows\PowerShell\Transcription"
New-Item -Path $caminho3 -Force | Out-Null
Set-ItemProperty -Path $caminho3 -Name "EnableTranscripting" -Value 1
Set-ItemProperty -Path $caminho3 -Name "OutputDirectory" -Value "C:\PSTranscripts"

# Ler logs do Event Viewer
Get-WinEvent -LogName "Microsoft-Windows-PowerShell/Operational" -MaxEvents 50 |
    Where-Object Id -eq 4104 |  # Script Block Log
    Select-Object TimeCreated, Message |
    Format-List
`} />

      <AlertBox type="danger" title="Constrained Language Mode">
        Em ambientes de alta segurança, configure o PowerShell em Constrained Language Mode 
        via AppLocker ou WDAC. Isso restringe acesso a tipos .NET e APIs do sistema, 
        dificultando ataques de escalada de privilégio.
      </AlertBox>
    </PageContainer>
  );
}