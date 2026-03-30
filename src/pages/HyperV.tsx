import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HyperV() {
  return (
    <PageContainer
      title="Hyper-V com PowerShell"
      subtitle="Crie, configure, gerencie e automatize máquinas virtuais Hyper-V com scripts PowerShell."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        O módulo Hyper-V do PowerShell permite gerenciar completamente a plataforma de
        virtualização da Microsoft: criar VMs, gerenciar snapshots, configurar redes virtuais
        e automatizar tarefas de manutenção.
      </p>

      <AlertBox type="info" title="Pré-requisito">
        Requer Windows 10/11 Pro/Enterprise ou Windows Server com Hyper-V habilitado.
        Ative via: <code>Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All</code>
      </AlertBox>

      <h2>Gerenciamento de VMs</h2>
      <CodeBlock title="Criar, iniciar e monitorar VMs" code={`# Listar todas as VMs
Get-VM | Format-Table Name, State, CPUUsage, MemoryAssigned, Uptime

# Criar nova VM
New-VM -Name "WebServer-Prod"  -MemoryStartupBytes 4GB  -NewVHDPath "D:\\VMs\\WebServer-Prod\\disk.vhdx"  -NewVHDSizeBytes 80GB  -Generation 2  -SwitchName "External Switch"

# Configurar CPU e memória dinâmica
Set-VMProcessor -VMName "WebServer-Prod" -Count 4
Set-VMMemory -VMName "WebServer-Prod"  -DynamicMemoryEnabled $true  -MinimumBytes 2GB  -MaximumBytes 8GB  -StartupBytes 4GB

# Montar ISO para instalação
Add-VMDvdDrive -VMName "WebServer-Prod"  -Path "D:\\ISOs\\windows-server-2022.iso"

# Iniciar e aguardar IP
Start-VM -Name "WebServer-Prod"
Wait-VM -Name "WebServer-Prod" -For IPAddress -Timeout 300

# Parar VMs
Stop-VM -Name "WebServer-Prod" -Force     # Graceful
Stop-VM -Name "WebServer-Prod" -TurnOff  # Desligamento forçado
`} />

      <h2>Snapshots e Checkpoints</h2>
      <CodeBlock title="Gerenciando checkpoints de VM" code={`# Criar checkpoint (snapshot)
Checkpoint-VM -Name "WebServer-Prod"  -SnapshotName "Pre-Update-$(Get-Date -Format 'yyyyMMdd')"

# Listar checkpoints
Get-VMCheckpoint -VMName "WebServer-Prod" | Format-Table Name, CreationTime

# Restaurar checkpoint
$ponto = Get-VMCheckpoint -VMName "WebServer-Prod" |
    Where-Object Name -like "*Pre-Update*" |
    Sort-Object CreationTime -Descending |
    Select-Object -First 1

Restore-VMCheckpoint -VMCheckpoint $ponto -Confirm:$false
Start-VM -Name "WebServer-Prod"

# Remover checkpoints antigos (manter apenas últimos 5)
Get-VMCheckpoint -VMName "WebServer-Prod" |
    Sort-Object CreationTime -Descending |
    Select-Object -Skip 5 |
    Remove-VMCheckpoint -Confirm:$false
`} />

      <h2>Exportação e Clonagem</h2>
      <CodeBlock title="Exportar, importar e clonar VMs" code={`# Exportar VM
Export-VM -Name "WebServer-Prod" -Path "D:\\Backups\\VMs"

# Importar VM exportada como clone
Import-VM -Path "D:\\Backups\\VMs\\WebServer-Prod\\WebServer-Prod.vmcx"  -Copy  -GenerateNewId  -VhdDestinationPath "D:\\VMs\\WebServer-Clone"  -VirtualMachinePath "D:\\VMs\\WebServer-Clone"

# Script de backup automático
Get-VM | Where-Object State -eq "Running" | ForEach-Object {
    $nome = $_.Name
    Write-Host "Exportando $nome..."
    Checkpoint-VM -Name $nome -SnapshotName "BackupDiario"
    Export-VM -Name $nome -Path "D:\\Backups\\VMs\\$nome"
}
`} />

      <h2>Redes Virtuais</h2>
      <CodeBlock title="Configurando switches e adaptadores de rede" code={`# Listar switches virtuais
Get-VMSwitch | Format-Table Name, SwitchType, NetAdapterInterfaceDescription

# Criar switch externo (conectado à rede física)
New-VMSwitch -Name "ExternalSwitch" -NetAdapterName "Ethernet" -AllowManagementOS $true

# Criar switch interno (host + VMs) e privado (só VMs)
New-VMSwitch -Name "InternalSwitch" -SwitchType Internal
New-VMSwitch -Name "PrivateSwitch"  -SwitchType Private

# Conectar VM a switch
Connect-VMNetworkAdapter -VMName "WebServer-Prod" -SwitchName "ExternalSwitch"

# Adicionar segundo adaptador de rede
Add-VMNetworkAdapter -VMName "WebServer-Prod"  -SwitchName "InternalSwitch" -Name "InternalNic"

# Relatório de recursos de todas as VMs
Get-VM | ForEach-Object {
    [PSCustomObject]@{
        Nome     = $_.Name
        Estado   = $_.State
        CPU_pct  = $_.CPUUsage
        RAM_MB   = [math]::Round($_.MemoryAssigned/1MB)
        Uptime   = $_.Uptime
    }
} | Format-Table -AutoSize
`} />

      <AlertBox type="warning" title="Live Migration">
        Para migrar VMs entre hosts Hyper-V sem downtime, configure o Live Migration:
        <code>Enable-VMMigration -ComputerName "host01","host02"</code> e depois
        <code>Move-VM -Name "VM" -DestinationHost "host02" -IncludeStorage -DestinationStoragePath "D:\VMs"</code>
      </AlertBox>
    </PageContainer>
  );
}
