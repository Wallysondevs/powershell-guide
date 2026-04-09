import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function BitLocker() {
    return (
      <PageContainer
        title="BitLocker com PowerShell"
        subtitle="Habilite, monitore, gerencie e audite criptografia de disco com BitLocker em escala corporativa."
        difficulty="avançado"
        timeToRead="35 min"
      >
        <p>
          O BitLocker protege dados em repouso criptografando volumes inteiros. O PowerShell
          oferece controle completo sobre habilitação, monitoramento, recuperação e auditoria
          do BitLocker em toda a empresa, integrado ao Active Directory e ao Microsoft Intune.
        </p>

        <h2>Habilitando BitLocker</h2>
        <CodeBlock title="Criptografando volumes com BitLocker" code={`# Verificar status de todos os volumes
  Get-BitLockerVolume | Format-Table MountPoint, ProtectionStatus, EncryptionPercentage, VolumeStatus

  # Habilitar BitLocker no volume C: com TPM + PIN
  $pin = ConvertTo-SecureString "1234" -AsPlainText -Force
  Enable-BitLocker -MountPoint "C:" `
    -EncryptionMethod XtsAes256 `
    -TpmAndPinProtector `
    -Pin $pin

  # Adicionar protetor de recuperação (chave de recuperação)
  Add-BitLockerKeyProtector -MountPoint "C:" -RecoveryPasswordProtector

  # Habilitar em disco de dados (sem TPM)
  Enable-BitLocker -MountPoint "D:" `
    -EncryptionMethod XtsAes256 `
    -PasswordProtector `
    -Password (ConvertTo-SecureString "SenhaForte@123" -AsPlainText -Force)

  # Habilitar com apenas TPM (sem PIN — mais conveniente, menos seguro)
  Enable-BitLocker -MountPoint "C:" -TpmProtector -EncryptionMethod XtsAes256

  # Verificar se TPM está disponível e pronto
  Get-Tpm | Select-Object TpmPresent, TpmReady, TpmEnabled, TpmActivated, ManufacturerId
  `} />

        <h2>Backup de Chave de Recuperação</h2>
        <CodeBlock title="Fazendo backup das chaves no Active Directory" code={`# Backup da chave de recuperação para AD (requer permissão no AD)
  $protectors = (Get-BitLockerVolume -MountPoint "C:").KeyProtector |
      Where-Object KeyProtectorType -eq RecoveryPassword
  foreach ($p in $protectors) {
      Backup-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId $p.KeyProtectorId
      Write-Host "Chave $($p.KeyProtectorId) salva no AD" -ForegroundColor Green
  }

  # Obter chave de recuperação completa
  (Get-BitLockerVolume -MountPoint "C:").KeyProtector |
      Where-Object KeyProtectorType -eq RecoveryPassword |
      Select-Object KeyProtectorId, RecoveryPassword

  # Exportar chave para arquivo criptografado (emergência)
  $chave = (Get-BitLockerVolume -MountPoint "C:").KeyProtector |
      Where-Object KeyProtectorType -eq RecoveryPassword
  $chave | Export-Csv "bitlocker-chaves-$env:COMPUTERNAME.csv" -NoTypeInformation

  # Verificar se a chave foi salva no AD
  $objeto = Get-ADComputer $env:COMPUTERNAME -Properties msFVE-RecoveryInformation
  $objeto.'msFVE-RecoveryInformation'
  `} />

        <h2>Monitoramento em Massa</h2>
        <CodeBlock title="Relatório de BitLocker em toda a empresa" code={`# Via WMI em computadores remotos
  $computadores = Get-ADComputer -Filter "OperatingSystem -like '*Windows*'" |
      Select-Object -ExpandProperty Name

  $relatorio = Invoke-Command -ComputerName $computadores -ScriptBlock {
      $volumes = Get-BitLockerVolume
      foreach ($v in $volumes) {
          [PSCustomObject]@{
              Computador    = $env:COMPUTERNAME
              Volume        = $v.MountPoint
              Criptografado = $v.ProtectionStatus -eq "On"
              Percentual    = $v.EncryptionPercentage
              Metodo        = $v.EncryptionMethod
              VolumeStatus  = $v.VolumeStatus
              Protetores    = ($v.KeyProtector | ForEach-Object { $_.KeyProtectorType }) -join ", "
          }
      }
  } -ErrorAction SilentlyContinue

  # Computadores SEM BitLocker no disco do sistema
  $semProtecao = $relatorio |
      Where-Object { $_.Volume -eq "C:" -and -not $_.Criptografado }

  $semProtecao | Export-Csv "sem-bitlocker.csv" -NoTypeInformation -Encoding UTF8
  Write-Host "Computadores não protegidos: $($semProtecao.Count)" -ForegroundColor Red

  # Computadores com criptografia em andamento
  $relatorio | Where-Object { $_.VolumeStatus -eq "EncryptionInProgress" } |
      Select-Object Computador, Volume, Percentual
  `} />

        <h2>Recuperação e Suspensão</h2>
        <CodeBlock title="Operações de manutenção com BitLocker" code={`# Suspender BitLocker temporariamente (para atualizações de firmware/BIOS)
  Suspend-BitLocker -MountPoint "C:" -RebootCount 1  # Reativa após 1 reinicialização

  # Retomar proteção
  Resume-BitLocker -MountPoint "C:"

  # Desabilitar BitLocker (descriptografa o volume — leva horas)
  Disable-BitLocker -MountPoint "C:"

  # Monitorar progresso de criptografia/descriptografia
  do {
      $vol  = Get-BitLockerVolume -MountPoint "C:"
      $pct  = $vol.EncryptionPercentage
      Write-Progress -Activity "Criptografando C:" `
          -PercentComplete $pct `
          -Status "$pct% concluído — Status: $($vol.VolumeStatus)"
      Start-Sleep -Seconds 5
  } while ($vol.VolumeStatus -in "EncryptionInProgress","DecryptionInProgress")
  Write-Host "Operação concluída!" -ForegroundColor Green
  `} />

        <h2>Network Unlock (Desbloqueio por Rede)</h2>
        <CodeBlock title="Configurando Network Unlock para servidores" code={`# Network Unlock permite que servidores iniciem sem intervenção manual
  # quando conectados à rede corporativa confiável

  # Verificar se Network Unlock está configurado como protetor
  $protectores = (Get-BitLockerVolume -MountPoint "C:").KeyProtector
  $networkUnlock = $protectores | Where-Object KeyProtectorType -eq "TpmNetworkKey"
  if ($networkUnlock) {
      Write-Host "Network Unlock configurado" -ForegroundColor Green
  } else {
      Write-Warning "Network Unlock NÃO configurado"
  }

  # Adicionar protetor de Network Unlock (requer certificado de servidor WDS)
  # Pré-requisito: servidor Windows Deployment Services (WDS) com o papel
  # "BitLocker Network Unlock" instalado e GPO configurada

  # No servidor WDS — instalar função
  Install-WindowsFeature BitLocker-NetworkUnlock

  # Verificar protetores atuais e seus tipos
  (Get-BitLockerVolume -MountPoint "C:").KeyProtector |
      Select-Object KeyProtectorType, KeyProtectorId |
      Format-Table -AutoSize
  `} />

        <h2>Habilitação em Massa via Script</h2>
        <CodeBlock title="Automatizando BitLocker em múltiplos computadores" code={`function Enable-BitLockerMassa {
      param(
          [string[]]$Computadores,
          [string]$LogPath = "C:\Logs\BitLocker-$(Get-Date -Format 'yyyyMMdd').csv"
      )

      $resultados = Invoke-Command -ComputerName $Computadores -ScriptBlock {
          try {
              $vol = Get-BitLockerVolume -MountPoint "C:"
              if ($vol.ProtectionStatus -eq "On") {
                  return [PSCustomObject]@{
                      Host   = $env:COMPUTERNAME
                      Status = "Já criptografado"
                      Erro   = $null
                  }
              }

              # Adicionar protetor TPM (sem PIN para automação)
              Add-BitLockerKeyProtector -MountPoint "C:" -TpmProtector | Out-Null
              # Adicionar chave de recuperação
              Add-BitLockerKeyProtector -MountPoint "C:" -RecoveryPasswordProtector | Out-Null
              # Habilitar criptografia
              Enable-BitLocker -MountPoint "C:" -EncryptionMethod XtsAes256 -TpmProtector -SkipHardwareTest | Out-Null

              [PSCustomObject]@{
                  Host   = $env:COMPUTERNAME
                  Status = "Criptografia iniciada"
                  Erro   = $null
              }
          } catch {
              [PSCustomObject]@{
                  Host   = $env:COMPUTERNAME
                  Status = "Erro"
                  Erro   = $_.Exception.Message
              }
          }
      } -ErrorAction SilentlyContinue

      $resultados | Export-Csv $LogPath -NoTypeInformation -Encoding UTF8
      Write-Host "Relatório salvo: $LogPath"
      $resultados | Group-Object Status | Format-Table Name, Count
  }

  # Executar em todos os computadores do domínio
  $pcs = Get-ADComputer -Filter "OperatingSystem -like '*Windows 10*' -or OperatingSystem -like '*Windows 11*'" |
      Select-Object -ExpandProperty Name

  Enable-BitLockerMassa -Computadores $pcs
  `} />

        <h2>Gerenciamento de PIN e Protetores</h2>
        <CodeBlock title="Alterando e gerenciando protetores de chave" code={`# Alterar PIN do BitLocker
  $novoPIN = ConvertTo-SecureString "9876" -AsPlainText -Force
  $vol = Get-BitLockerVolume -MountPoint "C:"
  $tpmPinProtector = $vol.KeyProtector | Where-Object KeyProtectorType -eq "TpmPin"

  if ($tpmPinProtector) {
      Remove-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId $tpmPinProtector.KeyProtectorId
  }
  Add-BitLockerKeyProtector -MountPoint "C:" -TpmAndPinProtector -Pin $novoPIN
  Write-Host "PIN alterado com sucesso" -ForegroundColor Green

  # Adicionar chave de recuperação USB como segundo fator
  $usb = Get-Volume | Where-Object { $_.DriveLetter -and $_.DriveType -eq "Removable" }
  if ($usb) {
      Add-BitLockerKeyProtector -MountPoint "C:" `
          -StartupKeyPath ($usb.DriveLetter + ":\") `
          -StartupKeyProtector
  }

  # Listar e remover protetores redundantes
  $protectores = (Get-BitLockerVolume -MountPoint "C:").KeyProtector
  foreach ($p in $protectores) {
      Write-Host "Tipo: $($p.KeyProtectorType) | ID: $($p.KeyProtectorId)"
  }
  `} />

        <AlertBox type="warning" title="Guarde as Chaves de Recuperação">
          Sempre faça backup das chaves de recuperação do BitLocker no Active Directory ou em
          local seguro. Sem a chave de recuperação, dados em volumes criptografados são
          irrecuperáveis caso o TPM seja resetado, o PIN seja esquecido ou a placa-mãe seja trocada.
        </AlertBox>

        <AlertBox type="info" title="Algoritmos de Criptografia">
          Use <code>XtsAes256</code> para discos fixos (mais seguro) e <code>XtsAes128</code>
          para compatibilidade com versões antigas do Windows. Para unidades removíveis use
          <code>Aes256</code> (BitLocker To Go).
        </AlertBox>
      </PageContainer>
    );
  }
  