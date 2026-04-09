import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function HyperV() {
    return (
      <PageContainer
        title="Hyper-V com PowerShell"
        subtitle="Crie, configure, gerencie, replique e automatize máquinas virtuais Hyper-V."
        difficulty="avançado"
        timeToRead="35 min"
      >
        <p>
          O módulo Hyper-V do PowerShell permite gerenciar completamente a plataforma de
          virtualização da Microsoft: criar e configurar VMs, gerenciar snapshots, 
          configurar redes virtuais, gerenciar discos VHDX e automatizar replicação e migração.
        </p>

        <AlertBox type="info" title="Pré-requisito">
          Requer Windows 10/11 Pro/Enterprise ou Windows Server com Hyper-V habilitado.
          Ative via: <code>Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All</code>
        </AlertBox>

        <h2>Gerenciamento de VMs</h2>
        <CodeBlock title="Criar, iniciar e monitorar VMs" code={`# Listar VMs com uso de recursos
  Get-VM | ForEach-Object {
      [PSCustomObject]@{
          Nome     = $_.Name
          Estado   = $_.State
          CPU_pct  = $_.CPUUsage
          RAM_MB   = [math]::Round($_.MemoryAssigned/1MB)
          Uptime   = $_.Uptime
          Gen      = $_.Generation
      }
  } | Format-Table -AutoSize

  # Criar nova VM (Geração 2 — UEFI, Secure Boot)
  New-VM -Name "WebServer-Prod" `
    -MemoryStartupBytes 4GB `
    -NewVHDPath "D:\\VMs\\WebServer-Prod\\disk.vhdx" `
    -NewVHDSizeBytes 80GB `
    -Generation 2 `
    -SwitchName "External Switch"

  # Configurar CPU, memória dinâmica e configurações avançadas
  Set-VMProcessor -VMName "WebServer-Prod" -Count 4 -Reserve 20 -Maximum 100
  Set-VMMemory -VMName "WebServer-Prod" `
    -DynamicMemoryEnabled $true `
    -MinimumBytes 2GB `
    -StartupBytes 4GB `
    -MaximumBytes 8GB `
    -Buffer 20  # 20% de buffer adicional

  # Desabilitar Secure Boot (para Linux)
  Set-VMFirmware -VMName "WebServer-Prod" -EnableSecureBoot Off

  # Montar ISO e definir ordem de boot
  Add-VMDvdDrive -VMName "WebServer-Prod" -Path "D:\\ISOs\\ubuntu-22.04.iso"
  $dvd = Get-VMDvdDrive -VMName "WebServer-Prod"
  Set-VMFirmware -VMName "WebServer-Prod" -BootOrder $dvd

  # Iniciar e aguardar IP
  Start-VM -Name "WebServer-Prod"
  Wait-VM -Name "WebServer-Prod" -For IPAddress -Timeout 300
  (Get-VMNetworkAdapter -VMName "WebServer-Prod").IPAddresses

  # Parar VMs de diferentes formas
  Stop-VM -Name "WebServer-Prod"          # Graceful (guest shutdown)
  Stop-VM -Name "WebServer-Prod" -Force   # Force off (se travada)
  Stop-VM -Name "WebServer-Prod" -TurnOff # Power off
  `} />

        <h2>Snapshots e Checkpoints</h2>
        <CodeBlock title="Gerenciando checkpoints de forma segura" code={`# Criar checkpoint
  Checkpoint-VM -Name "WebServer-Prod" `
    -SnapshotName "Pre-Update-$(Get-Date -Format 'yyyyMMdd-HHmm')"

  # Listar checkpoints com tamanho
  Get-VMCheckpoint -VMName "WebServer-Prod" |
      Select-Object Name, CreationTime, Id | Format-Table

  # Restaurar checkpoint específico
  $cp = Get-VMCheckpoint -VMName "WebServer-Prod" |
      Where-Object Name -like "*Pre-Update*" |
      Sort-Object CreationTime -Descending |
      Select-Object -First 1

  Stop-VM -Name "WebServer-Prod" -Force -ErrorAction SilentlyContinue
  Restore-VMCheckpoint -VMCheckpoint $cp -Confirm:$false
  Start-VM -Name "WebServer-Prod"
  Write-Host "VM restaurada para: $($cp.Name)" -ForegroundColor Green

  # Rotação de checkpoints — manter apenas 5 mais recentes
  Get-VM | ForEach-Object {
      $cps = Get-VMCheckpoint -VMName $_.Name |
          Sort-Object CreationTime -Descending
      if ($cps.Count -gt 5) {
          $cps | Select-Object -Skip 5 | Remove-VMCheckpoint -Confirm:$false
          Write-Host "Removidos $($cps.Count - 5) checkpoints antigos de $($_.Name)"
      }
  }

  # Política: nunca manter checkpoints por mais de 7 dias
  $limite = (Get-Date).AddDays(-7)
  Get-VM | ForEach-Object {
      Get-VMCheckpoint -VMName $_.Name |
          Where-Object CreationTime -lt $limite |
          Remove-VMCheckpoint -Confirm:$false
  }
  `} />

        <h2>Gerenciamento de VHDX</h2>
        <CodeBlock title="Criando, redimensionando e otimizando discos virtuais" code={`# Criar VHDX de tamanho fixo (melhor performance)
  New-VHD -Path "D:\\VMs\\dados.vhdx" `
    -SizeBytes 100GB `
    -Fixed

  # Criar VHDX de expansão dinâmica
  New-VHD -Path "D:\\VMs\\backup.vhdx" `
    -SizeBytes 500GB `
    -Dynamic

  # Adicionar disco a VM existente
  Add-VMHardDiskDrive -VMName "WebServer-Prod" `
    -Path "D:\\VMs\\dados.vhdx" `
    -ControllerType SCSI

  # Expandir disco (enquanto VM está desligada)
  Stop-VM "WebServer-Prod" -Force
  Resize-VHD -Path "D:\\VMs\\WebServer-Prod\\disk.vhdx" -SizeBytes 120GB
  Start-VM "WebServer-Prod"
  # Dentro da VM, use Disk Management ou diskpart para expandir a partição

  # Otimizar/compactar VHDX dinâmico (liberar espaço não usado)
  Optimize-VHD -Path "D:\\VMs\\backup.vhdx" -Mode Full

  # Converter entre Fixed e Dynamic
  Convert-VHD -Path "D:\\VMs\\disco.vhd" -DestinationPath "D:\\VMs\\disco.vhdx"

  # Informações do disco virtual
  Get-VHD -Path "D:\\VMs\\WebServer-Prod\\disk.vhdx" |
      Select-Object VhdType, Size, FileSize, MinimumSize, Fragmentation
  `} />

        <h2>Exportação, Clonagem e Backup</h2>
        <CodeBlock title="Exportar, importar e automatizar backups" code={`# Exportar VM completa (inclui todos os arquivos)
  Export-VM -Name "WebServer-Prod" -Path "D:\\Backups\\VMs"

  # Importar com novo ID (clone)
  Import-VM `
    -Path "D:\\Backups\\VMs\\WebServer-Prod\\WebServer-Prod.vmcx" `
    -Copy `
    -GenerateNewId `
    -VhdDestinationPath "D:\\VMs\\WebServer-Clone" `
    -VirtualMachinePath "D:\\VMs\\WebServer-Clone"

  # Script de backup automático de todas as VMs em execução
  function Backup-VMs {
      param(
          [string]$Destino = "D:\\Backups\\VMs",
          [int]$ManterUltimos = 3
      )
      Get-VM | Where-Object State -eq "Running" | ForEach-Object {
          $nome     = $_.Name
          $pasta    = Join-Path $Destino $nome
          $dataStamp = Get-Date -Format "yyyyMMdd_HHmm"
          $destFinal = "$pasta\\$dataStamp"

          Write-Host "Exportando $nome..."
          Checkpoint-VM -Name $nome -SnapshotName "Backup-$dataStamp"
          Export-VM -Name $nome -Path $destFinal

          # Remover backups antigos
          Get-ChildItem $pasta -Directory |
              Sort-Object LastWriteTime -Descending |
              Select-Object -Skip $ManterUltimos |
              Remove-Item -Recurse -Force
      }
      Write-Host "Backup concluído!" -ForegroundColor Green
  }
  Backup-VMs -Destino "E:\\VM-Backups" -ManterUltimos 5
  `} />

        <h2>Redes Virtuais e Live Migration</h2>
        <CodeBlock title="Switches, adaptadores e migração sem downtime" code={`# Listar e criar switches virtuais
  Get-VMSwitch | Format-Table Name, SwitchType, NetAdapterInterfaceDescription
  New-VMSwitch -Name "ExternalSwitch" -NetAdapterName "Ethernet" -AllowManagementOS $true
  New-VMSwitch -Name "InternalSwitch" -SwitchType Internal
  New-VMSwitch -Name "PrivateSwitch"  -SwitchType Private

  # VLAN em adaptador de rede
  Set-VMNetworkAdapterVlan -VMName "WebServer-Prod" -VlanId 100 -Access

  # Adicionar múltiplos adaptadores de rede
  Add-VMNetworkAdapter -VMName "WebServer-Prod" -SwitchName "InternalSwitch" -Name "LAN-Interna"
  Connect-VMNetworkAdapter -VMName "WebServer-Prod" -SwitchName "ExternalSwitch"

  # Live Migration (migrar VM entre hosts sem downtime)
  Enable-VMMigration -ComputerName "HV-Host01","HV-Host02"
  Set-VMMigrationNetwork -ComputerName "HV-Host01" -Subnet "10.10.10.0/24"

  Move-VM -Name "WebServer-Prod" `
    -ComputerName "HV-Host01" `
    -DestinationHost "HV-Host02" `
    -IncludeStorage `
    -DestinationStoragePath "D:\\VMs"

  # Quick Migration (requer Cluster) — mesmo resultado, usa storage compartilhado
  # Move-VMStorage -Name "WebServer-Prod" -DestinationStoragePath "\\\\Storage\\VMs"
  `} />

        <AlertBox type="info" title="Checkpoints em Produção">
          Evite manter checkpoints em VMs de produção por longos períodos — eles acumulam
          um arquivo de diferença (AVHDX) que cresce continuamente e pode degradar a
          performance. Use-os apenas para testes antes/depois de atualizações e remova logo em seguida.
        </AlertBox>
      </PageContainer>
    );
  }
  