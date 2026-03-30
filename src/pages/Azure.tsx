import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Azure() {
  return (
    <PageContainer
      title="Azure PowerShell"
      subtitle="Gerencie recursos na nuvem Azure com o módulo Az: VMs, storage, redes e automação."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        O módulo Azure PowerShell (Az) é a interface de linha de comando para gerenciar todos os
        recursos do Microsoft Azure. Com ele, você pode automatizar completamente o ciclo de vida
        de infraestrutura na nuvem.
      </p>

      <h2>Instalação e Autenticação</h2>
      <CodeBlock title="Setup do módulo Az" code={`# Instalar módulo Az
Install-Module -Name Az -Repository PSGallery -Force

# Atualizar módulo existente
Update-Module -Name Az

# Autenticar (browser interativo)
Connect-AzAccount

# Autenticar com Service Principal (para automação)
$tenantId = $env:AZURE_TENANT_ID
$clientId = $env:AZURE_CLIENT_ID
$secret   = ConvertTo-SecureString $env:AZURE_CLIENT_SECRET -AsPlainText -Force
$cred     = [System.Management.Automation.PSCredential]::new($clientId, $secret)

Connect-AzAccount -ServicePrincipal  -Credential $cred  -TenantId $tenantId

# Verificar contexto atual
Get-AzContext
Get-AzSubscription | Format-Table Name, Id, State
Set-AzContext -SubscriptionId "sua-subscription-id"
`} />

      <h2>Resource Groups e VMs</h2>
      <CodeBlock title="Gerenciamento de recursos e máquinas virtuais" code={`# Criar Resource Group
New-AzResourceGroup -Name "rg-producao" -Location "brazilsouth"

# Listar VMs
Get-AzVM | Select-Object Name, ResourceGroupName, Location,
    @{N="Size"; E={$_.HardwareProfile.VmSize}},
    @{N="OS";   E={$_.StorageProfile.OsDisk.OsType}}

# Criar VM simples
$credAdmin = Get-Credential -Message "Credenciais do admin"
New-AzVM -ResourceGroupName "rg-producao"  -Name "vm-web01"  -Location "brazilsouth"  -VirtualNetworkName "vnet-prod"  -SubnetName "subnet-web"  -SecurityGroupName "nsg-web"  -PublicIpAddressName "pip-web01"  -Credential $credAdmin  -Size "Standard_B2s"  -Image "Win2022Datacenter"

# Iniciar, parar, reiniciar VMs
Start-AzVM   -ResourceGroupName "rg-prod" -Name "vm-web01"
Stop-AzVM    -ResourceGroupName "rg-prod" -Name "vm-web01" -Force
Restart-AzVM -ResourceGroupName "rg-prod" -Name "vm-web01"

# Listar VMs paradas (desalocadas) — evitar cobranças
Get-AzVM -Status | Where-Object PowerState -eq "VM deallocated" |
    Select-Object Name, ResourceGroupName
`} />

      <h2>Storage Account</h2>
      <CodeBlock title="Gerenciando blobs e arquivos Azure Storage" code={`# Criar Storage Account
New-AzStorageAccount -ResourceGroupName "rg-producao"  -Name "storagebackupsprod"  -Location "brazilsouth"  -SkuName "Standard_LRS"  -Kind "StorageV2"

# Obter contexto do storage
$storageKey = (Get-AzStorageAccountKey -ResourceGroupName "rg-producao"  -Name "storagebackupsprod")[0].Value
$ctx = New-AzStorageContext -StorageAccountName "storagebackupsprod"  -StorageAccountKey $storageKey

# Criar container e fazer upload
New-AzStorageContainer -Name "backups" -Context $ctx -Permission Off

# Upload de arquivo
Set-AzStorageBlobContent -File "C:\\Backup\\db.bak"  -Container "backups"  -Blob "backups/db-$(Get-Date -Format 'yyyyMMdd').bak"  -Context $ctx

# Listar blobs
Get-AzStorageBlob -Container "backups" -Context $ctx |
    Select-Object Name, Length, LastModified

# Download
Get-AzStorageBlobContent -Container "backups"  -Blob "backups/db-20240315.bak"  -Destination "C:\\Restore\\"  -Context $ctx

# Limpar blobs antigos (30+ dias)
Get-AzStorageBlob -Container "backups" -Context $ctx |
    Where-Object { $_.LastModified -lt (Get-Date).AddDays(-30) } |
    Remove-AzStorageBlob
`} />

      <h2>Azure Automation e Tags</h2>
      <CodeBlock title="Automação e organização de recursos" code={`# Aplicar tags em recursos
$tags = @{ Ambiente="Producao"; Time="TI"; CostCenter="CC-001" }
Set-AzResource -ResourceGroupName "rg-producao"  -ResourceName "vm-web01"  -ResourceType "Microsoft.Compute/virtualMachines"  -Tag $tags -Force

# Listar todos os recursos de um ambiente por tag
Get-AzResource -TagName "Ambiente" -TagValue "Producao" |
    Select-Object Name, ResourceType, Location

# Custo estimado: listar VMs com tamanho caro
Get-AzVM | Where-Object {
    $_.HardwareProfile.VmSize -like "Standard_D*" -or
    $_.HardwareProfile.VmSize -like "Standard_E*"
} | Select-Object Name, @{N="Size";E={$_.HardwareProfile.VmSize}}

# Desligar VMs de desenvolvimento às 19h (via Runbook ou Agendamento)
Get-AzVM -Status |
    Where-Object { $_.Tags["Ambiente"] -eq "Desenvolvimento" -and $_.PowerState -eq "VM running" } |
    Stop-AzVM -Force -NoWait
`} />

      <AlertBox type="info" title="Azure Cloud Shell">
        O Azure PowerShell já vem instalado no Azure Cloud Shell, acessível em
        shell.azure.com. Nenhuma instalação local necessária — use para gerenciamento
        direto do portal Azure.
      </AlertBox>
    </PageContainer>
  );
}
