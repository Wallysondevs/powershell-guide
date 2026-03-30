import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ActiveDirectory() {
  return (
    <PageContainer
      title="Active Directory com PowerShell"
      subtitle="Gerencie usuários, grupos, OUs, computadores e políticas em ambientes Windows Server."
      difficulty="avançado"
      timeToRead="40 min"
    >
      <p>
        O módulo <code>ActiveDirectory</code> (parte do RSAT) é uma das ferramentas mais poderosas
        para administração de ambientes Windows corporativos. Com ele é possível automatizar
        praticamente qualquer tarefa de gerenciamento de identidade e acesso em um domínio AD.
      </p>

      <AlertBox type="info" title="Instalação do RSAT">
        <code>Get-WindowsCapability -Name "Rsat.ActiveDirectory*" -Online | Add-WindowsCapability -Online</code>
        No Windows Server: <code>Install-WindowsFeature RSAT-AD-PowerShell</code>
      </AlertBox>

      <h2>Usuários — CRUD Completo</h2>
      <CodeBlock title="Criar, ler, modificar e excluir usuários" code={`Import-Module ActiveDirectory

# Buscar usuário (básico e completo)
Get-ADUser -Identity "joao.silva" -Properties *
Get-ADUser -Filter "Department -eq 'TI'" -Properties Department, Title, EmailAddress |
    Select-Object Name, SamAccountName, Title

# Criar novo usuário
$senha = ConvertTo-SecureString "Senha@2024!" -AsPlainText -Force
New-ADUser -Name "Carlos Rodrigues"  -GivenName "Carlos"  -Surname "Rodrigues"  -SamAccountName "carlos.rodrigues"  -UserPrincipalName "carlos.rodrigues@empresa.com"  -Path "OU=Funcionarios,OU=TI,DC=empresa,DC=com"  -AccountPassword $senha  -Enabled $true  -Department "TI"  -Title "Desenvolvedor Pleno"  -EmailAddress "carlos.rodrigues@empresa.com"  -ChangePasswordAtLogon $true

# Modificar usuário
Set-ADUser -Identity "carlos.rodrigues"  -Department "Engenharia"  -Title "Desenvolvedor Sênior"  -Replace @{ telephoneNumber = "+55 11 99999-0000" }

# Redefinir senha e forçar troca
Set-ADAccountPassword -Identity "carlos.rodrigues"  -NewPassword (ConvertTo-SecureString "NovaSenha@2024!" -AsPlainText -Force) -Reset
Set-ADUser -Identity "carlos.rodrigues" -ChangePasswordAtLogon $true

# Desabilitar, habilitar e desbloquear
Disable-ADAccount  -Identity "carlos.rodrigues"
Enable-ADAccount   -Identity "carlos.rodrigues"
Unlock-ADAccount   -Identity "carlos.rodrigues"
Remove-ADUser      -Identity "carlos.rodrigues" -Confirm:$false
`} />

      <h2>Grupos</h2>
      <CodeBlock title="Gerenciamento de grupos de segurança" code={`# Criar grupo de segurança
New-ADGroup -Name "GRP-TI-Devs"  -GroupScope Global  -GroupCategory Security  -Path "OU=Grupos,DC=empresa,DC=com"  -Description "Desenvolvedores de TI"

# Adicionar e remover membros
Add-ADGroupMember    -Identity "GRP-TI-Devs" -Members "joao.silva","carlos.rodrigues"
Remove-ADGroupMember -Identity "GRP-TI-Devs" -Members "joao.silva" -Confirm:$false

# Grupos de um usuário (diretos e aninhados)
Get-ADPrincipalGroupMembership -Identity "carlos.rodrigues" |
    Select-Object Name, GroupScope, GroupCategory | Sort-Object Name

# Membros do grupo (incluindo grupos aninhados)
Get-ADGroupMember -Identity "GRP-TI-Devs" -Recursive |
    Select-Object Name, SamAccountName | Sort-Object Name

# Grupos vazios (candidatos a remoção)
Get-ADGroup -Filter * -Properties Members |
    Where-Object { -not $_.Members } |
    Select-Object Name, DistinguishedName
`} />

      <h2>Computadores</h2>
      <CodeBlock title="Gerenciando contas de computador" code={`# Buscar computadores
Get-ADComputer -Filter * -Properties OperatingSystem, LastLogonDate |
    Select-Object Name, OperatingSystem, LastLogonDate

# Computadores não logados há 90 dias
$limite = (Get-Date).AddDays(-90)
Get-ADComputer -Filter { LastLogonDate -lt $limite -and Enabled -eq $true }  -Properties LastLogonDate, OperatingSystem |
    Select-Object Name, LastLogonDate, OperatingSystem |
    Sort-Object LastLogonDate

# Mover computador para outra OU
Move-ADObject -Identity "CN=WS-TI-001,OU=Computadores,DC=empresa,DC=com"  -TargetPath "OU=TI,OU=Computadores,DC=empresa,DC=com"
`} />

      <h2>Relatórios e Auditoria</h2>
      <CodeBlock title="Relatórios de segurança e compliance" code={`# Contas inativas (sem login há 90+ dias)
$limite = (Get-Date).AddDays(-90)
Get-ADUser -Filter { LastLogonDate -lt $limite -and Enabled -eq $true }  -Properties LastLogonDate, Department |
    Select-Object Name, SamAccountName, LastLogonDate, Department |
    Sort-Object LastLogonDate |
    Export-Csv "contas-inativas.csv" -NoTypeInformation -Encoding UTF8

# Contas com senha que nunca expira (risco de segurança)
Get-ADUser -Filter { PasswordNeverExpires -eq $true -and Enabled -eq $true }  -Properties PasswordNeverExpires, Department |
    Select-Object Name, SamAccountName, Department |
    Export-Csv "senha-nao-expira.csv" -NoTypeInformation

# Importação em massa de usuários via CSV
$usuarios = Import-Csv "novos-usuarios.csv" -Delimiter ";"
foreach ($u in $usuarios) {
    $senha = ConvertTo-SecureString "BemVindo@$((Get-Date).Year)!" -AsPlainText -Force
    try {
        New-ADUser -Name "$($u.Nome) $($u.Sobrenome)"  -SamAccountName $u.Login  -UserPrincipalName "$($u.Login)@empresa.com"  -Department $u.Departamento  -Path $u.OU  -AccountPassword $senha  -Enabled $true
        Write-Host "Criado: $($u.Login)" -ForegroundColor Green
    } catch {
        Write-Warning "Erro ao criar $($u.Login): $_"
    }
}
`} />

      <AlertBox type="warning" title="Conta de Serviço com Mínimos Privilégios">
        Para scripts automatizados, crie uma conta de serviço dedicada com apenas as permissões
        necessárias (Principle of Least Privilege). Nunca use o administrador de domínio para
        automações rotineiras.
      </AlertBox>
    </PageContainer>
  );
}
