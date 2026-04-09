import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function GPO() {
    return (
      <PageContainer
        title="Group Policy com PowerShell"
        subtitle="Crie, modifique, aplique, filtre e reporte políticas de grupo usando o módulo GroupPolicy."
        difficulty="avançado"
        timeToRead="40 min"
      >
        <p>
          O módulo GroupPolicy permite gerenciar completamente as GPOs (Group Policy Objects) de um
          domínio Active Directory via PowerShell, automatizando a criação de políticas, geração de
          relatórios, aplicação em OUs específicas e filtragem avançada com WMI.
        </p>

        <AlertBox type="info" title="Pré-requisito">
          Instale o RSAT: <code>Get-WindowsCapability -Online -Name "Rsat.GroupPolicy.Management.Tools*" | Add-WindowsCapability -Online</code>
          <br/>No Windows Server: <code>Install-WindowsFeature GPMC</code>
        </AlertBox>

        <h2>Gerenciando GPOs</h2>
        <CodeBlock title="Criar, listar e modificar GPOs" code={`Import-Module GroupPolicy

  # Listar todas as GPOs do domínio com status
  Get-GPO -All | Select-Object DisplayName, GpoStatus, CreationTime, ModificationTime |
      Sort-Object DisplayName | Format-Table -AutoSize

  # Criar nova GPO
  New-GPO -Name "Politica-Seguranca-TI" -Comment "Políticas de segurança para o departamento de TI"

  # Vincular GPO a uma OU
  New-GPLink -Name "Politica-Seguranca-TI" `
    -Target "OU=TI,OU=Funcionarios,DC=empresa,DC=com" `
    -LinkEnabled Yes `
    -Order 1

  # Habilitar/desabilitar link sem excluir
  Set-GPLink -Name "Politica-Seguranca-TI" `
    -Target "OU=TI,OU=Funcionarios,DC=empresa,DC=com" `
    -LinkEnabled No

  # Desabilitar parte da GPO (User ou Computer Configuration)
  Set-GPO -Name "Politica-Seguranca-TI" -Status UserSettingsDisabled
  # Opções: AllSettingsEnabled, UserSettingsDisabled, ComputerSettingsDisabled, AllSettingsDisabled

  # Ver todas as GPOs vinculadas a uma OU
  (Get-ADOrganizationalUnit "OU=TI,OU=Funcionarios,DC=empresa,DC=com").LinkedGroupPolicyObjects

  # Modificar configuração de registro via GPO
  Set-GPRegistryValue -Name "Politica-Seguranca-TI" `
    -Key "HKLM\\Software\\Policies\\Microsoft\\Windows NT\\Terminal Services" `
    -ValueName "fDenyTSConnections" `
    -Type DWord -Value 0  # 0 = Habilitar RDP via GPO

  # Remover configuração de registro
  Remove-GPRegistryValue -Name "Politica-Seguranca-TI" `
    -Key "HKLM\\Software\\Policies\\Microsoft\\Windows NT\\Terminal Services" `
    -ValueName "fDenyTSConnections"
  `} />

        <h2>Filtros WMI</h2>
        <CodeBlock title="Aplicar GPOs apenas em hardware/SO específico" code={`# Filtros WMI permitem aplicar GPOs apenas em máquinas que satisfazem critérios

  # Criar filtro WMI — somente Windows 11
  $queryW11 = "SELECT * FROM Win32_OperatingSystem WHERE Caption LIKE '%Windows 11%'"
  $dominio  = (Get-ADDomain).DistinguishedName

  $filtro = New-Object Microsoft.GroupPolicy.WmiFilter
  $filtro.Description = "Apenas Windows 11"
  $filtro.Domain      = (Get-ADDomain).DNSRoot
  # (criação de WMI filter via ADSI — não há cmdlet nativo)
  $adsi = [ADSI]"LDAP://CN=SOM,CN=WMIPolicy,CN=System,$dominio"
  $novoFiltro = $adsi.Children.Add("CN={$(New-Guid)}", "msWMI-Som")
  $novoFiltro.Put("msWMI-Name", "Windows 11 Only")
  $novoFiltro.Put("msWMI-Parm1", "Windows 11 filter")
  $novoFiltro.Put("msWMI-Parm2", "1;3;10;18;WQL;root\\CIMv2;$queryW11;")
  $novoFiltro.SetInfo()
  Write-Host "Filtro WMI criado: $($novoFiltro.Path)"

  # Exemplos de consultas WMI para filtros
  # Somente laptops:
  $queryLaptop = "SELECT * FROM Win32_SystemEnclosure WHERE ChassisTypes='9' OR ChassisTypes='10' OR ChassisTypes='14'"
  # Somente 64-bit:
  $query64bit  = "SELECT * FROM Win32_OperatingSystem WHERE OSArchitecture='64-bit'"
  # Mínimo de RAM (4GB):
  $queryRAM    = "SELECT * FROM Win32_ComputerSystem WHERE TotalPhysicalMemory >= 4294967296"
  `} />

        <h2>Filtragem de Segurança</h2>
        <CodeBlock title="Controlar quem recebe a GPO com permissões" code={`# Ver filtragem de segurança atual de uma GPO
  $gpo = Get-GPO -Name "Politica-Seguranca-TI"
  $acl = Get-GPPermission -Name "Politica-Seguranca-TI" -All
  $acl | Select-Object Trustee, Permission | Format-Table

  # Por padrão, "Authenticated Users" recebe a GPO
  # Para restringir apenas a um grupo específico:

  # 1. Remover Authenticated Users (Apply)
  Set-GPPermission -Name "Politica-Seguranca-TI" `
    -TargetName "Authenticated Users" `
    -TargetType Group `
    -PermissionLevel None

  # 2. Adicionar apenas o grupo desejado
  Set-GPPermission -Name "Politica-Seguranca-TI" `
    -TargetName "GRP-TI-Devs" `
    -TargetType Group `
    -PermissionLevel GpoApply

  # Adicionar permissão de leitura (ver mas não receber a GPO)
  Set-GPPermission -Name "Politica-Seguranca-TI" `
    -TargetName "GRP-Auditoria" `
    -TargetType Group `
    -PermissionLevel GpoRead

  # Scripts via GPO (Startup/Logon/Shutdown/Logoff)
  Set-GPRegistryValue -Name "Politica-TI" `
    -Key "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run" `
    -ValueName "IniciaTI" `
    -Type String `
    -Value "powershell.exe -ExecutionPolicy Bypass -File \\\\servidor\\scripts\\inicio.ps1"
  `} />

        <h2>Relatórios de GPO</h2>
        <CodeBlock title="Gerando relatórios HTML e XML" code={`# Relatório HTML de uma GPO específica
  Get-GPOReport -Name "Default Domain Policy" `
    -ReportType HTML `
    -Path "C:\\Relatorios\\DefaultDomainPolicy.html"

  # Relatório XML (para processamento automatizado)
  Get-GPOReport -Name "Politica-Seguranca-TI" `
    -ReportType XML `
    -Path "C:\\Relatorios\\SegurancaTI.xml"

  # Relatório de TODAS as GPOs do domínio
  $pasta = "C:\\Relatorios\\GPO-$(Get-Date -Format 'yyyyMMdd')"
  New-Item -ItemType Directory -Path $pasta -Force | Out-Null
  Get-GPO -All | ForEach-Object {
      $nome = $_.DisplayName -replace '[\\\/:*?"<>|]', '_'
      Get-GPOReport -Name $_.DisplayName `
        -ReportType HTML `
        -Path "$pasta\\$nome.html"
      Write-Host "✔ Relatório: $nome"
  }
  Write-Host "Todos os relatórios em: $pasta"

  # GPOs sem link (órfãs — desperdício, candidatos a remoção)
  $todasGPOs    = Get-GPO -All
  $gposVinculadas = Get-ADDomain | ForEach-Object {
      (Get-GPInheritance -Target $_.DistinguishedName).GpoLinks.DisplayName
  }
  $orfas = $todasGPOs | Where-Object { $_.DisplayName -notin $gposVinculadas }
  $orfas | Select-Object DisplayName, CreationTime | Format-Table
  `} />

        <h2>Backup e Restore de GPOs</h2>
        <CodeBlock title="Backup completo de políticas de grupo" code={`$dataPasta = Get-Date -Format 'yyyyMMdd'

  # Backup de GPO específica
  Backup-GPO -Name "Politica-Seguranca-TI" `
    -Path "C:\\GPO-Backups" `
    -Comment "Backup antes da atualização Q1 2025"

  # Backup de TODAS as GPOs do domínio
  $backupPath = "C:\\GPO-Backups\\$dataPasta"
  New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
  Backup-GPO -All -Path $backupPath `
    -Comment "Backup mensal $(Get-Date -Format 'MM/yyyy')"

  # Listar backups disponíveis
  Get-GPOBackup -Path "C:\\GPO-Backups" |
      Sort-Object Timestamp -Descending |
      Select-Object DisplayName, Timestamp, Id |
      Format-Table -AutoSize

  # Restaurar GPO de backup
  $backup = Get-GPOBackup -Path "C:\\GPO-Backups" |
      Where-Object DisplayName -eq "Politica-Seguranca-TI" |
      Sort-Object Timestamp -Descending |
      Select-Object -First 1

  Restore-GPO -Name "Politica-Seguranca-TI" `
    -Path "C:\\GPO-Backups" `
    -BackupId $backup.Id

  # Importar GPO de outro domínio (migração)
  Import-GPO -BackupId $backup.Id `
    -Path "C:\\GPO-Backups" `
    -TargetName "Politica-Nova-Importada" `
    -CreateIfNeeded
  `} />

        <h2>Resultante de Políticas (RSoP)</h2>
        <CodeBlock title="Analisando políticas aplicadas a um usuário/computador" code={`# Simular RSoP — sem aplicar políticas, só visualizar o resultado
  Get-GPResultantSetOfPolicy `
    -Computer "WS-TI-001" `
    -User "EMPRESA\\joao.silva" `
    -ReportType HTML `
    -Path "C:\\Relatorios\\rsop-joao.html"

  # Abrir relatório automaticamente
  Start-Process "C:\\Relatorios\\rsop-joao.html"

  # Forçar atualização de política em máquina remota
  Invoke-GPUpdate -Computer "WS-TI-001" -Force -RandomDelayInMinutes 0

  # Forçar gpupdate em TODOS os computadores de uma OU
  $computadores = Get-ADComputer -SearchBase "OU=TI,OU=Funcionarios,DC=empresa,DC=com" `
      -Filter * | Select-Object -ExpandProperty Name

  $jobs = $computadores | ForEach-Object {
      Invoke-GPUpdate -Computer $_ -Force -AsJob
  }
  $jobs | Wait-Job | Receive-Job
  Write-Host "GPUpdate concluído em $($computadores.Count) máquinas"

  # Verificar herança de políticas em uma OU
  Get-GPInheritance -Target "OU=TI,OU=Funcionarios,DC=empresa,DC=com" |
      Select-Object -ExpandProperty GpoLinks |
      Format-Table DisplayName, Enabled, Enforced, Order
  `} />

        <AlertBox type="info" title="GPO Enforced vs Block Inheritance">
          Use <code>-Enforced Yes</code> no <code>New-GPLink</code> para que a GPO não possa ser
          sobreposta por OUs filhas. Use <code>Set-GPInheritance -IsBlocked Yes</code> em uma OU
          para bloquear herança de políticas de nível superior — útil em ambientes com políticas
          conflitantes entre departamentos.
        </AlertBox>
      </PageContainer>
    );
  }
  