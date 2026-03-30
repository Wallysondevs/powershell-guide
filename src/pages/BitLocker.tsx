import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BitLocker() {
  return (
    <PageContainer
      title="BitLocker com PowerShell"
      subtitle="Habilite, monitore e gerencie criptografia de disco com BitLocker em ambientes corporativos."
      difficulty="avançado"
      timeToRead="20 min"
    >
      <p>
        O BitLocker protege dados em repouso criptografando volumes inteiros. O PowerShell
        oferece controle completo sobre habilitação, monitoramento e recuperação do BitLocker
        em escala corporativa.
      </p>

      <h2>Habilitando BitLocker</h2>
      <CodeBlock title="Criptografando volumes com BitLocker" code={`# Verificar status de todos os volumes
Get-BitLockerVolume | Format-Table MountPoint, ProtectionStatus, EncryptionPercentage, VolumeStatus

# Habilitar BitLocker no volume C: com TPM + PIN
$pin = ConvertTo-SecureString "1234" -AsPlainText -Force
Enable-BitLocker -MountPoint "C:"  -EncryptionMethod XtsAes256  -TpmAndPinProtector  -Pin $pin

# Adicionar protetor de recuperação (chave de recuperação)
Add-BitLockerKeyProtector -MountPoint "C:" -RecoveryPasswordProtector

# Habilitar em disco de dados (sem TPM)
Enable-BitLocker -MountPoint "D:"  -EncryptionMethod XtsAes256  -PasswordProtector  -Password (ConvertTo-SecureString "SenhaForte@123" -AsPlainText -Force)

# Backup da chave de recuperação para AD
$protectors = (Get-BitLockerVolume -MountPoint "C:").KeyProtector |
    Where-Object KeyProtectorType -eq RecoveryPassword
foreach ($p in $protectors) {
    Backup-BitLockerKeyProtector -MountPoint "C:" -KeyProtectorId $p.KeyProtectorId
}
`} />

      <h2>Monitoramento em Massa</h2>
      <CodeBlock title="Relatório de BitLocker em toda a empresa" code={`# Via WMI em computadores remotos
$computadores = Get-ADComputer -Filter "OperatingSystem -like '*Windows*'" |
    Select-Object -ExpandProperty Name

$relatorio = Invoke-Command -ComputerName $computadores -ScriptBlock {
    $volumes = Get-BitLockerVolume
    foreach ($v in $volumes) {
        [PSCustomObject]@{
            Computador   = $env:COMPUTERNAME
            Volume       = $v.MountPoint
            Criptografado = $v.ProtectionStatus -eq "On"
            Percentual   = $v.EncryptionPercentage
            Metodo       = $v.EncryptionMethod
        }
    }
} -ErrorAction SilentlyContinue

# Computadores SEM BitLocker no disco do sistema
$relatorio |
    Where-Object { $_.Volume -eq "C:" -and -not $_.Criptografado } |
    Export-Csv "sem-bitlocker.csv" -NoTypeInformation -Encoding UTF8

Write-Host "Computadores não protegidos: $($semProtecao.Count)"
`} />

      <h2>Recuperação e Suspensão</h2>
      <CodeBlock title="Operações de manutenção com BitLocker" code={`# Suspender BitLocker temporariamente (para atualizações de firmware/BIOS)
Suspend-BitLocker -MountPoint "C:" -RebootCount 1  # Reativa após 1 reinicialização

# Retomar proteção
Resume-BitLocker -MountPoint "C:"

# Obter chave de recuperação
(Get-BitLockerVolume -MountPoint "C:").KeyProtector |
    Where-Object KeyProtectorType -eq RecoveryPassword |
    Select-Object KeyProtectorId, RecoveryPassword

# Desabilitar BitLocker (descriptografa o volume)
Disable-BitLocker -MountPoint "C:"

# Monitorar progresso de criptografia
do {
    $vol  = Get-BitLockerVolume -MountPoint "C:"
    $pct  = $vol.EncryptionPercentage
    Write-Progress -Activity "Criptografando C:" -PercentComplete $pct  -Status "$pct% concluído — Status: $($vol.VolumeStatus)"
    Start-Sleep -Seconds 5
} while ($vol.VolumeStatus -eq "EncryptionInProgress")
Write-Host "Criptografia concluída!" -ForegroundColor Green
`} />

      <AlertBox type="warning" title="Guarde as Chaves de Recuperação">
        Sempre faça backup das chaves de recuperação do BitLocker no Active Directory ou em
        local seguro. Sem a chave de recuperação, dados em volumes criptografados são
        irrecuperáveis caso o TPM seja resetado ou o PIN seja esquecido.
      </AlertBox>
    </PageContainer>
  );
}
