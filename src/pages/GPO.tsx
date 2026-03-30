import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GPO() {
  return (
    <PageContainer
      title="Group Policy com PowerShell"
      subtitle="Crie, modifique, aplique e reporte políticas de grupo usando o módulo GroupPolicy."
      difficulty="avançado"
      timeToRead="25 min"
    >
      <p>
        O módulo GroupPolicy permite gerenciar completamente as GPOs (Group Policy Objects) de um
        domínio Active Directory via PowerShell, automatizando a criação de políticas, geração de
        relatórios e aplicação em OUs específicas.
      </p>

      <AlertBox type="info" title="Pré-requisito">
        Instale o RSAT: <code>Get-WindowsCapability -Online -Name "Rsat.GroupPolicy.Management.Tools*" | Add-WindowsCapability -Online</code>
      </AlertBox>

      <h2>Gerenciando GPOs</h2>
      <CodeBlock title="Criar, listar e modificar GPOs" code={`Import-Module GroupPolicy

# Listar todas as GPOs do domínio
Get-GPO -All | Select-Object DisplayName, GpoStatus, CreationTime, ModificationTime

# Criar nova GPO
New-GPO -Name "Politica-Seguranca-TI" -Comment "Políticas de segurança para o departamento de TI"

# Vincular GPO a uma OU
New-GPLink -Name "Politica-Seguranca-TI"  -Target "OU=TI,OU=Funcionarios,DC=empresa,DC=com"  -LinkEnabled Yes  -Order 1

# Desabilitar link sem excluir
Set-GPLink -Name "Politica-Seguranca-TI"  -Target "OU=TI,OU=Funcionarios,DC=empresa,DC=com"  -LinkEnabled No

# Ver todas as GPOs vinculadas a uma OU
(Get-ADOrganizationalUnit "OU=TI,OU=Funcionarios,DC=empresa,DC=com").LinkedGroupPolicyObjects

# Modificar configuração de registro via GPO
Set-GPRegistryValue -Name "Politica-Seguranca-TI"  -Key "HKLM\\Software\\Policies\\Microsoft\\Windows NT\\Terminal Services"  -ValueName "fDenyTSConnections"  -Type DWord -Value 0  # Habilitar RDP
`} />

      <h2>Relatórios de GPO</h2>
      <CodeBlock title="Gerando relatórios HTML e XML" code={`# Relatório HTML de uma GPO específica
Get-GPOReport -Name "Default Domain Policy"  -ReportType HTML  -Path "C:\\Relatorios\\DefaultDomainPolicy.html"
Start-Process "C:\\Relatorios\\DefaultDomainPolicy.html"  # Abrir no browser

# Relatório XML (para processamento)
Get-GPOReport -Name "Politica-Seguranca-TI"  -ReportType XML  -Path "C:\\Relatorios\\SegurancaTI.xml"

# Relatório de TODAS as GPOs
Get-GPO -All | ForEach-Object {
    $nome = $_.DisplayName -replace '[\\\\/:*?"<>|]', '_'
    Get-GPOReport -Name $_.DisplayName  -ReportType HTML  -Path "C:\\Relatorios\\$nome.html"
    Write-Host "Relatório gerado: $nome"
}

# GPOs sem link (órfãs)
$gpos    = Get-GPO -All
$vinculadas = (Get-ADDomain).LinkedGroupPolicyObjects
$gpos | Where-Object {
    $_.Id.ToString() -notin ($vinculadas | ForEach-Object { $_ -replace '.*{|}.*','' })
} | Select-Object DisplayName, CreationTime
`} />

      <h2>Backup e Restore de GPOs</h2>
      <CodeBlock title="Backup completo de políticas de grupo" code={`# Backup de GPO específica
Backup-GPO -Name "Politica-Seguranca-TI"  -Path "C:\\GPO-Backups"  -Comment "Backup antes da atualização Q1 2024"

# Backup de TODAS as GPOs
Backup-GPO -All -Path "C:\\GPO-Backups\\$(Get-Date -Format 'yyyyMMdd')"  -Comment "Backup mensal $(Get-Date -Format 'MM/yyyy')"

# Listar backups disponíveis
Get-GPOBackup -Path "C:\\GPO-Backups" | Format-Table DisplayName, Timestamp, Id

# Restaurar GPO de backup
Restore-GPO -Name "Politica-Seguranca-TI"  -Path "C:\\GPO-Backups"  -BackupId "{GUID-do-backup}"

# Importar GPO de outro domínio
Import-GPO -BackupId "{GUID}"  -Path "C:\\GPO-Backups"  -TargetName "Politica-Nova"  -CreateIfNeeded
`} />

      <h2>Resultante de Políticas (RSoP)</h2>
      <CodeBlock title="Analisando políticas aplicadas a um usuário/computador" code={`# Simular RSoP (sem aplicar)
Get-GPResultantSetOfPolicy -Computer "WS-TI-001"  -User "EMPRESA\\joao.silva"  -ReportType HTML  -Path "C:\\Relatorios\\rsop-joao.html"

# Forçar atualização de política em máquina remota
Invoke-GPUpdate -Computer "WS-TI-001" -Force -RandomDelayInMinutes 0

# Forçar em múltiplas máquinas
Get-ADComputer -Filter "OperatingSystem -like '*Windows 10*'" |
    Select-Object -ExpandProperty Name |
    ForEach-Object {
        Invoke-GPUpdate -Computer $_ -Force -AsJob | Out-Null
        Write-Host "GPUpdate iniciado em $_"
    }
`} />
    </PageContainer>
  );
}
