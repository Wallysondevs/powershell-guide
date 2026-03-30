import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Criptografia() {
  return (
    <PageContainer
      title="Criptografia e Hashing"
      subtitle="Hash MD5/SHA, criptografia AES, certificados e manipulação segura de dados sensíveis."
      difficulty="avançado"
      timeToRead="25 min"
    >
      <p>
        PowerShell tem acesso completo à biblioteca criptográfica do .NET (<code>System.Security.Cryptography</code>),
        permitindo calcular hashes, criptografar/descriptografar dados e gerenciar certificados 
        digitais — tudo sem dependências externas.
      </p>

      <h2>Hashing de Arquivos e Strings</h2>
      <CodeBlock title="Calculando hashes" code={`# Cmdlet nativo Get-FileHash
Get-FileHash "C:\instaler.exe" -Algorithm SHA256
Get-FileHash "C:\instaler.exe" -Algorithm MD5
Get-FileHash "C:\instaler.exe" -Algorithm SHA512

# Comparar integridade de arquivo
$hashEsperado = "3A7BD3E2360A3D29EEA436FCFB7E44C735D117C42D1C1835420B6B9942DD4F1B"
$hashArquivo  = (Get-FileHash "arquivo-baixado.zip" -Algorithm SHA256).Hash
if ($hashArquivo -eq $hashEsperado) {
    "Arquivo íntegro! ✓"
} else {
    "ATENÇÃO: Hash não confere! Arquivo pode estar corrompido ou adulterado."
}

# Hash de string
function Get-StringHash {
    param([string]$Texto, [string]$Algoritmo = "SHA256")
    $bytes  = [System.Text.Encoding]::UTF8.GetBytes($Texto)
    $hasher = [System.Security.Cryptography.HashAlgorithm]::Create($Algoritmo)
    $hash   = $hasher.ComputeHash($bytes)
    return [System.BitConverter]::ToString($hash) -replace '-',''
}

Get-StringHash "PowerShell é incrível!"  # SHA256
Get-StringHash "senha123" -Algoritmo "MD5"

# Verificar senhas com PBKDF2 (para armazenamento seguro)
function New-PasswordHash {
    param([string]$Senha)
    $salt      = [byte[]]::new(16)
    [System.Security.Cryptography.RandomNumberGenerator]::Fill($salt)
    $pbkdf2    = [System.Security.Cryptography.Rfc2898DeriveBytes]::new($Senha, $salt, 100000, "SHA256")
    $hash      = $pbkdf2.GetBytes(32)
    return [Convert]::ToBase64String($salt) + ":" + [Convert]::ToBase64String($hash)
}
`} />

      <h2>Criptografia AES Simétrica</h2>
      <CodeBlock title="Criptografar e descriptografar dados com AES" code={`function Protect-Dados {
    param([string]$Texto, [string]$Chave)
    
    $aes = [System.Security.Cryptography.Aes]::Create()
    $aes.KeySize = 256
    $aes.Mode    = [System.Security.Cryptography.CipherMode]::CBC
    
    # Derivar chave de 256 bits a partir da string
    $sha256   = [System.Security.Cryptography.SHA256]::Create()
    $aes.Key  = $sha256.ComputeHash([Text.Encoding]::UTF8.GetBytes($Chave))
    $aes.GenerateIV()  # IV aleatório
    
    $encryptor  = $aes.CreateEncryptor()
    $bytesTexto = [Text.Encoding]::UTF8.GetBytes($Texto)
    $cifrado    = $encryptor.TransformFinalBlock($bytesTexto, 0, $bytesTexto.Length)
    
    # Retornar IV + dados criptografados em Base64
    $resultado = $aes.IV + $cifrado
    return [Convert]::ToBase64String($resultado)
}

function Unprotect-Dados {
    param([string]$TextoCifrado, [string]$Chave)
    
    $aes = [System.Security.Cryptography.Aes]::Create()
    $aes.KeySize = 256
    $aes.Mode    = [System.Security.Cryptography.CipherMode]::CBC
    
    $sha256   = [System.Security.Cryptography.SHA256]::Create()
    $aes.Key  = $sha256.ComputeHash([Text.Encoding]::UTF8.GetBytes($Chave))
    
    $bytes    = [Convert]::FromBase64String($TextoCifrado)
    $aes.IV   = $bytes[0..15]       # Primeiros 16 bytes = IV
    $cifrado  = $bytes[16..($bytes.Length - 1)]
    
    $decryptor = $aes.CreateDecryptor()
    $original  = $decryptor.TransformFinalBlock($cifrado, 0, $cifrado.Length)
    return [Text.Encoding]::UTF8.GetString($original)
}

# Uso
$chaveSecreta = "MinhaSenhaDeChave2024!"
$cifrado = Protect-Dados   "Dados confidenciais do cliente" $chaveSecreta
$original = Unprotect-Dados $cifrado $chaveSecreta
"Original: $original"
`} />

      <h2>Certificados</h2>
      <CodeBlock title="Gerenciando certificados" code={`# Listar certificados do usuário atual
Get-ChildItem Cert:\CurrentUser\My | Format-Table Thumbprint, Subject, NotAfter

# Certificados prestes a expirar (próximos 30 dias)
Get-ChildItem Cert:\LocalMachine\My |
    Where-Object { $_.NotAfter -lt (Get-Date).AddDays(30) } |
    Select-Object Subject, NotAfter, Thumbprint

# Exportar certificado (sem chave privada)
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -like "*Empresa*"
Export-Certificate -Cert $cert -FilePath "C:\Certs\empresa.cer" -Type CER

# Exportar com chave privada (PFX)
$senha = ConvertTo-SecureString "SenhaPFX@2024" -AsPlainText -Force
Export-PfxCertificate -Cert $cert -FilePath "C:\Certs\empresa.pfx" -Password $senha

# Importar PFX
Import-PfxCertificate -FilePath "C:\Certs\empresa.pfx" \ -CertStoreLocation Cert:\LocalMachine\My \ -Password $senha

# Verificar cadeia de confiança
$cert = Get-ChildItem Cert:\CurrentUser\My | Select-Object -First 1
$cadeia = [System.Security.Cryptography.X509Certificates.X509Chain]::new()
$valido = $cadeia.Build($cert)
"Certificado válido: $valido"
$cadeia.ChainStatus | ForEach-Object { "Status: $($_.StatusInformation)" }
`} />

      <AlertBox type="warning" title="Chaves Privadas">
        Nunca inclua chaves privadas ou senhas diretamente no código-fonte. 
        Use variáveis de ambiente, o módulo SecretManagement ou Azure Key Vault para 
        armazenar segredos de forma segura.
      </AlertBox>
    </PageContainer>
  );
}