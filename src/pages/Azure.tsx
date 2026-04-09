import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Azure() {
    return (
      <PageContainer
        title="Azure PowerShell"
        subtitle="Gerencie VMs, storage, redes, RBAC, App Services e muito mais com o módulo Az."
        difficulty="avançado"
        timeToRead="40 min"
      >
        <p>
          O módulo Az é a interface oficial do PowerShell para gerenciar recursos no Microsoft Azure.
          Com mais de 70 sub-módulos, cobre desde VMs e storage até Kubernetes, Functions,
          bancos de dados e segurança — tudo com suporte a automação e CI/CD.
        </p>

        <h2>Instalação e Autenticação</h2>
        <CodeBlock title="Configurando o ambiente Az" code={`# Instalar módulo Az
  Install-Module -Name Az -Scope CurrentUser -Force -AllowClobber

  # Atualizar módulo
  Update-Module -Name Az

  # Autenticação interativa (abre browser)
  Connect-AzAccount

  # Autenticação com Service Principal (automação/CI-CD)
  $cred = [PSCredential]::new("CLIENT_ID", (ConvertTo-SecureString "CLIENT_SECRET" -AsPlainText -Force))
  Connect-AzAccount -ServicePrincipal -Credential $cred -Tenant "TENANT_ID"

  # Autenticação com identidade gerenciada (dentro de VM ou Azure Function)
  Connect-AzAccount -Identity

  # Listar e selecionar subscription
  Get-AzSubscription | Select-Object Name, Id, State
  Set-AzContext -SubscriptionId "sua-subscription-id"

  # Salvar contexto para scripts não interativos
  $ctx = Get-AzContext
  Save-AzContext -Path "C:\\Temp\\azure-context.json"
  Import-AzContext -Path "C:\\Temp\\azure-context.json"
  `} />

        <h2>Resource Groups e VMs</h2>
        <CodeBlock title="Gerenciando máquinas virtuais" code={`# Resource Groups
  New-AzResourceGroup -Name "RG-Producao" -Location "brazilsouth"
  Get-AzResourceGroup | Select-Object ResourceGroupName, Location, ProvisioningState

  # Listar VMs e status
  Get-AzVM | Select-Object Name, ResourceGroupName, Location |
      ForEach-Object {
          $status = (Get-AzVM -Name $_.Name -ResourceGroupName $_.ResourceGroupName -Status).Statuses |
              Where-Object Code -like "PowerState/*"
          [PSCustomObject]@{
              Nome  = $_.Name
              Grupo = $_.ResourceGroupName
              Estado = $status.DisplayStatus
          }
      }

  # Criar VM
  $adminCred = Get-Credential "adminPS"
  New-AzVM `
    -ResourceGroupName "RG-Producao" `
    -Name "VM-WebServer" `
    -Location "brazilsouth" `
    -Image "Win2022Datacenter" `
    -Size "Standard_B2s" `
    -Credential $adminCred `
    -OpenPorts 80, 443, 3389

  # Iniciar, parar e desalocar VMs
  Start-AzVM      -Name "VM-WebServer" -ResourceGroupName "RG-Producao"
  Stop-AzVM       -Name "VM-WebServer" -ResourceGroupName "RG-Producao" -Force
  # Desalocar libera o IP e para a cobrança de computação:
  Stop-AzVM       -Name "VM-WebServer" -ResourceGroupName "RG-Producao" -Force

  # Redimensionar VM
  $vm = Get-AzVM -Name "VM-WebServer" -ResourceGroupName "RG-Producao"
  $vm.HardwareProfile.VmSize = "Standard_B4ms"
  Update-AzVM -VM $vm -ResourceGroupName "RG-Producao"

  # Snapshot de disco
  $disco = (Get-AzVM -Name "VM-WebServer" -ResourceGroupName "RG-Producao").StorageProfile.OsDisk.ManagedDisk
  $config = New-AzSnapshotConfig -SourceResourceId $disco.Id -Location "brazilsouth" -CreateOption Copy
  New-AzSnapshot -ResourceGroupName "RG-Producao" -SnapshotName "Snap-OsDisk-$(Get-Date -Format 'yyyyMMdd')" -Snapshot $config
  `} />

        <h2>Storage Account</h2>
        <CodeBlock title="Gerenciando blobs, filas e tabelas" code={`# Criar Storage Account
  New-AzStorageAccount `
    -ResourceGroupName "RG-Producao" `
    -Name "storageempresa2024" `
    -Location "brazilsouth" `
    -SkuName "Standard_LRS" `
    -Kind StorageV2 `
    -AccessTier Hot

  # Obter contexto de storage
  $ctx = (Get-AzStorageAccount -ResourceGroupName "RG-Producao" -Name "storageempresa2024").Context

  # Criar container e fazer upload
  New-AzStorageContainer -Name "backups" -Context $ctx -Permission Off

  # Upload de arquivo
  Set-AzStorageBlobContent -Container "backups" `
    -File "C:\\Temp\\backup.zip" `
    -Blob "2025/01/backup.zip" `
    -Context $ctx

  # Download de arquivo
  Get-AzStorageBlobContent -Container "backups" `
    -Blob "2025/01/backup.zip" `
    -Destination "C:\\Restaurado" `
    -Context $ctx

  # Listar blobs
  Get-AzStorageBlob -Container "backups" -Context $ctx |
      Select-Object Name, Length, LastModified | Format-Table

  # Gerar SAS URL temporária (validade 1 hora)
  $sas = New-AzStorageBlobSASToken `
    -Container "backups" `
    -Blob "2025/01/backup.zip" `
    -Permission r `
    -ExpiryTime (Get-Date).AddHours(1) `
    -Context $ctx `
    -FullUri
  Write-Host "URL de acesso (1h): $sas"

  # Deletar blobs antigos (mais de 30 dias)
  $limite = (Get-Date).AddDays(-30)
  Get-AzStorageBlob -Container "backups" -Context $ctx |
      Where-Object { $_.LastModified -lt $limite } |
      Remove-AzStorageBlob -Force
  `} />

        <h2>Redes e Segurança</h2>
        <CodeBlock title="VNets, NSGs e firewall" code={`# Criar Virtual Network e subnet
  $vnet = New-AzVirtualNetwork `
    -Name "VNET-Producao" `
    -ResourceGroupName "RG-Producao" `
    -Location "brazilsouth" `
    -AddressPrefix "10.0.0.0/16"

  Add-AzVirtualNetworkSubnetConfig `
    -Name "Subnet-Web" `
    -VirtualNetwork $vnet `
    -AddressPrefix "10.0.1.0/24"
  $vnet | Set-AzVirtualNetwork

  # Criar Network Security Group com regras
  $nsg = New-AzNetworkSecurityGroup `
    -Name "NSG-Web" `
    -ResourceGroupName "RG-Producao" `
    -Location "brazilsouth"

  $nsg | Add-AzNetworkSecurityRuleConfig `
    -Name "Allow-HTTPS" `
    -Direction Inbound `
    -Priority 100 `
    -Protocol Tcp `
    -SourceAddressPrefix Internet `
    -SourcePortRange "*" `
    -DestinationAddressPrefix "*" `
    -DestinationPortRange 443 `
    -Access Allow | Set-AzNetworkSecurityGroup

  # Listar IPs públicos
  Get-AzPublicIpAddress -ResourceGroupName "RG-Producao" |
      Select-Object Name, IpAddress, IdleTimeoutInMinutes, PublicIpAllocationMethod
  `} />

        <h2>RBAC e Políticas de Acesso</h2>
        <CodeBlock title="Controle de acesso com funções e políticas" code={`# Listar atribuições de função (RBAC)
  Get-AzRoleAssignment -ResourceGroupName "RG-Producao" |
      Select-Object DisplayName, RoleDefinitionName, Scope | Format-Table

  # Atribuir função a usuário (Contributor no Resource Group)
  $usuario = Get-AzADUser -UserPrincipalName "carlos@empresa.com"
  New-AzRoleAssignment `
    -ObjectId $usuario.Id `
    -RoleDefinitionName "Contributor" `
    -ResourceGroupName "RG-Producao"

  # Atribuir função a Service Principal (automação)
  $sp = Get-AzADServicePrincipal -DisplayName "CI-CD-Pipeline"
  New-AzRoleAssignment `
    -ObjectId $sp.Id `
    -RoleDefinitionName "Reader" `
    -Scope "/subscriptions/$((Get-AzContext).Subscription.Id)"

  # Remover atribuição
  Remove-AzRoleAssignment -ObjectId $usuario.Id `
    -RoleDefinitionName "Contributor" `
    -ResourceGroupName "RG-Producao"

  # Azure Policy — verificar conformidade
  Get-AzPolicyState -ResourceGroupName "RG-Producao" |
      Where-Object ComplianceState -eq "NonCompliant" |
      Select-Object ResourceId, PolicyDefinitionName, ComplianceState
  `} />

        <h2>Tags e Gestão de Custos</h2>
        <CodeBlock title="Organizando recursos com tags e monitorando custos" code={`# Aplicar tags a um Resource Group
  Set-AzResourceGroup -Name "RG-Producao" -Tag @{
      Ambiente    = "Producao"
      CentrodeCusto = "TI-001"
      Responsavel = "carlos@empresa.com"
      Projeto     = "ERP-Migração"
  }

  # Aplicar tags a uma VM específica
  $vm = Get-AzVM -Name "VM-WebServer" -ResourceGroupName "RG-Producao"
  Update-AzTag -ResourceId $vm.Id -Tag @{ Ambiente="Producao"; Tier="Web" } -Operation Merge

  # Listar todos os recursos sem a tag "Ambiente"
  Get-AzResource | Where-Object { -not $_.Tags.ContainsKey("Ambiente") } |
      Select-Object Name, ResourceType, ResourceGroupName

  # Relatório de custo por tag (via Azure Cost Management)
  # (requer módulo Az.CostManagement)
  Install-Module -Name Az.CostManagement -Scope CurrentUser
  Get-AzCostManagementExport -Scope "/subscriptions/$((Get-AzContext).Subscription.Id)"

  # Automatizar desligamento de VMs de desenvolvimento fora do horário
  $vmsDesenv = Get-AzVM -ResourceGroupName "RG-Desenvolvimento"
  $horaAtual = (Get-Date).Hour
  if ($horaAtual -ge 20 -or $horaAtual -lt 8) {
      foreach ($vm in $vmsDesenv) {
          Stop-AzVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Force -AsJob
          Write-Host "Desligando $($vm.Name)..."
      }
  }
  `} />

        <AlertBox type="info" title="Az vs AzureRM">
          O módulo <code>Az</code> é o módulo atual e recomendado. O antigo <code>AzureRM</code>
          foi aposentado em 29 de fevereiro de 2024. Migre seus scripts para <code>Az</code>.
          Geralmente basta renomear <code>Login-AzureRmAccount</code> para <code>Connect-AzAccount</code>
          e <code>AzureRm</code> para <code>Az</code> nos nomes dos cmdlets.
        </AlertBox>
      </PageContainer>
    );
  }
  