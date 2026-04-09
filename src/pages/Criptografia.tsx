import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Criptografia() {
    return (
      <PageContainer
        title="Criptografia e Segurança de Dados"
        subtitle="Hash MD5/SHA, AES, RSA, assinaturas digitais, certificados e SecretManagement."
        difficulty="avançado"
        timeToRead="35 min"
      >
        <p>
          PowerShell tem acesso completo à biblioteca criptográfica do .NET (<code>System.Security.Cryptography</code>),
          permitindo calcular hashes, criptografar/descriptografar dados, assinar arquivos
          e gerenciar certificados digitais — tudo sem dependências externas.
        </p>

        <h2>Hashing de Arquivos e Strings</h2>
        <CodeBlock title="Calculando e verificando hashes" code={`# Cmdlet nativo Get-FileHash (SHA256 é o padrão)
  Get-FileHash "C:\\instalador.exe" -Algorithm SHA256
  Get-FileHash "C:\\instalador.exe" -Algorithm MD5
  Get-FileHash "C:\\instalador.exe" -Algorithm SHA512

  # Verificar integridade de arquivo baixado
  $hashEsperado = "3A7BD3E2360A3D29EEA436FCFB7E44C735D117C42D1C1835420B6B9942DD4F1B"
  $hashArquivo  = (Get-FileHash "arquivo-baixado.zip" -Algorithm SHA256).Hash
  if ($hashArquivo -eq $hashEsperado) {
      Write-Host "Arquivo íntegro ✓" -ForegroundColor Green
  } else {
      Write-Warning "Hash diverge! Arquivo pode estar corrompido ou adulterado."
  }

  # Hash de string (útil para tokens, chaves de cache)
  function Get-StringHash {
      param([string]$Texto, [string]$Algoritmo = "SHA256")
      $bytes  = [System.Text.Encoding]::UTF8.GetBytes($Texto)
      $hasher = [System.Security.Cryptography.HashAlgorithm]::Create($Algoritmo)
      $hash   = $hasher.ComputeHash($bytes)
      return ([System.BitConverter]::ToString($hash) -replace '-','').ToLower()
  }
  Get-StringHash "PowerShell é incrível!"        # sha256
  Get-StringHash "minha-string" -Algoritmo "MD5" # md5

  # Hash com PBKDF2 — para armazenamento seguro de senhas
  function New-PasswordHash {
      param([string]$Senha, [int]$Iteracoes = 100000)
      $salt   = [byte[]]::new(16)
      [System.Security.Cryptography.RandomNumberGenerator]::Fill($salt)
      $pbkdf2 = [System.Security.Cryptography.Rfc2898DeriveBytes]::new($Senha, $salt, $Iteracoes, "SHA256")
      $hash   = $pbkdf2.GetBytes(32)
      return [Convert]::ToBase64String($salt) + ":" + [Convert]::ToBase64String($hash)
  }

  function Test-PasswordHash {
      param([string]$Senha, [string]$HashArmazenado)
      $partes = $HashArmazenado.Split(":")
      $salt   = [Convert]::FromBase64String($partes[0])
      $hashRef = [Convert]::FromBase64String($partes[1])
      $pbkdf2 = [System.Security.Cryptography.Rfc2898DeriveBytes]::new($Senha, $salt, 100000, "SHA256")
      $hashTeste = $pbkdf2.GetBytes(32)
      return [System.Linq.Enumerable]::SequenceEqual($hashRef, $hashTeste)
  }

  $hash = New-PasswordHash "MinhaSenha@2024"
  Test-PasswordHash "MinhaSenha@2024" $hash  # True
  Test-PasswordHash "SenhaErrada"     $hash  # False
  `} />

        <h2>Criptografia AES Simétrica</h2>
        <CodeBlock title="Criptografar e descriptografar dados com AES-256-CBC" code={`function Protect-String {
      param([string]$Texto, [securestring]$ChaveSegura)

      $aes     = [System.Security.Cryptography.Aes]::Create()
      $aes.KeySize = 256
      $aes.Mode    = [System.Security.Cryptography.CipherMode]::CBC
      $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7

      # Derivar chave de 256 bits a partir da SecureString
      $bstr   = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($ChaveSegura)
      $chave  = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
      $sha256 = [System.Security.Cryptography.SHA256]::Create()
      $aes.Key = $sha256.ComputeHash([Text.Encoding]::UTF8.GetBytes($chave))
      $aes.GenerateIV()

      $encryptor  = $aes.CreateEncryptor()
      $bytesTexto = [Text.Encoding]::UTF8.GetBytes($Texto)
      $cifrado    = $encryptor.TransformFinalBlock($bytesTexto, 0, $bytesTexto.Length)
      return [Convert]::ToBase64String($aes.IV + $cifrado)
  }

  function Unprotect-String {
      param([string]$TextoCifrado, [securestring]$ChaveSegura)

      $aes = [System.Security.Cryptography.Aes]::Create()
      $aes.KeySize = 256; $aes.Mode = [System.Security.Cryptography.CipherMode]::CBC
      $aes.Padding = [System.Security.Cryptography.PaddingMode]::PKCS7

      $bstr   = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($ChaveSegura)
      $chave  = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
      $sha256 = [System.Security.Cryptography.SHA256]::Create()
      $aes.Key = $sha256.ComputeHash([Text.Encoding]::UTF8.GetBytes($chave))

      $bytes   = [Convert]::FromBase64String($TextoCifrado)
      $aes.IV  = $bytes[0..15]
      $cifrado = $bytes[16..($bytes.Length - 1)]
      $dec     = $aes.CreateDecryptor().TransformFinalBlock($cifrado, 0, $cifrado.Length)
      return [Text.Encoding]::UTF8.GetString($dec)
  }

  # Uso com SecureString (não expõe a chave em memória)
  $chave    = Read-Host "Chave de criptografia" -AsSecureString
  $cifrado  = Protect-String   "Dados confidenciais do cliente" $chave
  $original = Unprotect-String $cifrado $chave
  Write-Host "Original: $original"

  # Criptografar arquivo inteiro
  function Protect-File {
      param([string]$Arquivo, [string]$Destino, [securestring]$Chave)
      $conteudo = [IO.File]::ReadAllText($Arquivo)
      $cifrado  = Protect-String $conteudo $Chave
      Set-Content -Path $Destino -Value $cifrado -Encoding UTF8
      Write-Host "Arquivo criptografado: $Destino"
  }
  `} />

        <h2>SecretManagement — Cofre de Senhas</h2>
        <CodeBlock title="Armazenando segredos com Microsoft.PowerShell.SecretManagement" code={`# Instalar módulos
  Install-Module Microsoft.PowerShell.SecretManagement -Scope CurrentUser
  Install-Module Microsoft.PowerShell.SecretStore      -Scope CurrentUser  # Backend local

  # Configurar o cofre
  Register-SecretVault -Name "MeuCofre" -ModuleName Microsoft.PowerShell.SecretStore

  # Armazenar segredos
  Set-Secret -Name "DbPassword"    -Secret "SenhaDB@2024!" -Vault "MeuCofre"
  Set-Secret -Name "ApiKey-GitHub" -Secret "ghp_xxxxx..."  -Vault "MeuCofre"
  Set-Secret -Name "Credenciais"   -Secret (Get-Credential "admin@empresa.com") -Vault "MeuCofre"

  # Recuperar segredos
  $dbPass = Get-Secret -Name "DbPassword" -AsPlainText
  $cred   = Get-Secret -Name "Credenciais"   # Retorna PSCredential

  # Listar segredos (sem revelar valores)
  Get-SecretInfo -Vault "MeuCofre" | Select-Object Name, Type, VaultName

  # Usar em conexões de forma segura
  $senha = Get-Secret "DbPassword" -AsPlainText
  $conn  = "Server=srv01;Database=Prod;User=admin;Password=$senha"

  # Remover segredo
  Remove-Secret -Name "ApiKey-GitHub" -Vault "MeuCofre"
  `} />

        <h2>Certificados Digitais</h2>
        <CodeBlock title="Gerenciando o repositório de certificados" code={`# Listar certificados do repositório local
  Get-ChildItem Cert:\\LocalMachine\\My |
      Select-Object Subject, Thumbprint, NotAfter, HasPrivateKey |
      Format-Table -AutoSize

  # Certificados prestes a expirar (próximos 30 dias)
  $prazo = (Get-Date).AddDays(30)
  Get-ChildItem Cert:\\LocalMachine\\My |
      Where-Object NotAfter -lt $prazo |
      Select-Object Subject, NotAfter, Thumbprint |
      Sort-Object NotAfter

  # Criar certificado autoassinado (para dev/test)
  $cert = New-SelfSignedCertificate `
    -DnsName "servidor01.empresa.local" `
    -CertStoreLocation "Cert:\\LocalMachine\\My" `
    -NotAfter (Get-Date).AddYears(2) `
    -KeySpec Signature

  # Exportar certificado sem chave privada (distribuir para clientes)
  Export-Certificate -Cert $cert `
    -FilePath "C:\\Certs\\servidor01.cer" `
    -Type CER

  # Exportar com chave privada (PFX — backup ou migração)
  $senha = Read-Host "Senha PFX" -AsSecureString
  Export-PfxCertificate -Cert $cert `
    -FilePath "C:\\Certs\\servidor01.pfx" `
    -Password $senha

  # Importar PFX
  Import-PfxCertificate -FilePath "C:\\Certs\\servidor01.pfx" `
    -CertStoreLocation "Cert:\\LocalMachine\\My" `
    -Password $senha

  # Assinar script PowerShell com certificado de code signing
  $certAssinatura = Get-ChildItem Cert:\\CurrentUser\\My -CodeSigningCert | Select-Object -First 1
  Set-AuthenticodeSignature -FilePath "C:\\Scripts\\MeuScript.ps1" -Certificate $certAssinatura

  # Verificar assinatura de script
  Get-AuthenticodeSignature "C:\\Scripts\\MeuScript.ps1" | Select-Object Status, SignatureType
  `} />

        <AlertBox type="warning" title="Nunca Hardcode Segredos">
          Nunca coloque senhas, tokens ou chaves diretamente no código-fonte.
          Use variáveis de ambiente (<code>$env:DB_PASSWORD</code>),
          o módulo <code>SecretManagement</code> ou serviços como Azure Key Vault
          ou AWS Secrets Manager para armazenar segredos de forma segura.
        </AlertBox>

        <AlertBox type="info" title="Diferença entre Criptografia e Hashing">
          <strong>Hash</strong> (SHA256, bcrypt, PBKDF2): unidirecional — não é possível
          reverter. Use para senhas, integridade de arquivos, assinaturas.
          <strong>Criptografia</strong> (AES, RSA): bidirecional — você pode descriptografar
          com a chave correta. Use para dados que precisam ser recuperados.
        </AlertBox>
      </PageContainer>
    );
  }
  