import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function ActiveDirectory() {
    return (
      <PageContainer
        title="Active Directory com PowerShell"
        subtitle="Gerencie usuários, grupos, OUs, computadores, contas de serviço e políticas em ambientes Windows Server."
        difficulty="avançado"
        timeToRead="45 min"
      >
        <p>
          O módulo <code>ActiveDirectory</code> (parte do RSAT) é uma das ferramentas mais poderosas
          para administração de ambientes Windows corporativos. Com ele é possível automatizar
          praticamente qualquer tarefa de gerenciamento de identidade, acesso e estrutura de domínio.
        </p>

        <AlertBox type="info" title="Instalação do RSAT">
          Workstation: <code>Get-WindowsCapability -Name "Rsat.ActiveDirectory*" -Online | Add-WindowsCapability -Online</code><br/>
          Servidor: <code>Install-WindowsFeature RSAT-AD-PowerShell</code>
        </AlertBox>

        <h2>Usuários — CRUD Completo</h2>
        <CodeBlock title="Criar, ler, modificar e excluir usuários" code={`Import-Module ActiveDirectory

  # Buscar usuário (básico e com todas as propriedades)
  Get-ADUser -Identity "joao.silva" -Properties *
  Get-ADUser -Filter "Department -eq 'TI'" -Properties Department, Title, EmailAddress |
      Select-Object Name, SamAccountName, Title, Department

  # Criar novo usuário
  $senha = ConvertTo-SecureString "Senha@2024!" -AsPlainText -Force
  New-ADUser `
    -Name "Carlos Rodrigues" `
    -GivenName "Carlos" -Surname "Rodrigues" `
    -SamAccountName "carlos.rodrigues" `
    -UserPrincipalName "carlos.rodrigues@empresa.com" `
    -Path "OU=Funcionarios,OU=TI,DC=empresa,DC=com" `
    -AccountPassword $senha `
    -Enabled $true `
    -Department "TI" -Title "Desenvolvedor Pleno" `
    -EmailAddress "carlos.rodrigues@empresa.com" `
    -ChangePasswordAtLogon $true `
    -PassThru

  # Modificar usuário
  Set-ADUser -Identity "carlos.rodrigues" `
    -Department "Engenharia" `
    -Title "Desenvolvedor Sênior" `
    -Replace @{ telephoneNumber = "+55 11 99999-0000"; l = "São Paulo" }

  # Redefinir senha e forçar troca
  Set-ADAccountPassword -Identity "carlos.rodrigues" `
    -NewPassword (ConvertTo-SecureString "NovaSenha@2024!" -AsPlainText -Force) -Reset
  Set-ADUser -Identity "carlos.rodrigues" -ChangePasswordAtLogon $true

  # Desabilitar, habilitar, desbloquear e remover
  Disable-ADAccount  -Identity "carlos.rodrigues"
  Enable-ADAccount   -Identity "carlos.rodrigues"
  Unlock-ADAccount   -Identity "carlos.rodrigues"
  Remove-ADUser      -Identity "carlos.rodrigues" -Confirm:$false
  `} />

        <h2>Grupos</h2>
        <CodeBlock title="Gerenciamento de grupos de segurança e distribuição" code={`# Criar grupo de segurança global
  New-ADGroup -Name "GRP-TI-Devs" `
    -GroupScope Global `
    -GroupCategory Security `
    -Path "OU=Grupos,DC=empresa,DC=com" `
    -Description "Desenvolvedores de TI"

  # Criar grupo de distribuição (para e-mail)
  New-ADGroup -Name "DL-TI-Todos" `
    -GroupScope Universal `
    -GroupCategory Distribution `
    -Path "OU=Grupos,DC=empresa,DC=com"

  # Adicionar e remover membros
  Add-ADGroupMember    -Identity "GRP-TI-Devs" -Members "joao.silva","carlos.rodrigues"
  Remove-ADGroupMember -Identity "GRP-TI-Devs" -Members "joao.silva" -Confirm:$false

  # Grupos de um usuário (diretos e aninhados)
  Get-ADPrincipalGroupMembership -Identity "carlos.rodrigues" |
      Select-Object Name, GroupScope, GroupCategory | Sort-Object Name

  # Membros do grupo (incluindo grupos aninhados)
  Get-ADGroupMember -Identity "GRP-TI-Devs" -Recursive |
      Select-Object Name, SamAccountName, ObjectClass | Sort-Object Name

  # Copiar membros de um grupo para outro
  $membros = Get-ADGroupMember "GRP-TI-Devs"
  Add-ADGroupMember -Identity "GRP-TI-Sêniors" -Members $membros

  # Grupos vazios (candidatos a limpeza)
  Get-ADGroup -Filter * -Properties Members |
      Where-Object { -not $_.Members } |
      Select-Object Name, DistinguishedName | Format-Table
  `} />

        <h2>Unidades Organizacionais (OUs)</h2>
        <CodeBlock title="Criando e gerenciando a estrutura de OUs" code={`# Listar todas as OUs
  Get-ADOrganizationalUnit -Filter * -Properties Description |
      Select-Object Name, Description, DistinguishedName |
      Sort-Object DistinguishedName | Format-Table

  # Criar estrutura hierárquica de OUs
  $base = "DC=empresa,DC=com"
  $depts = "TI","RH","Financeiro","Comercial"

  foreach ($dept in $depts) {
      New-ADOrganizationalUnit -Name $dept -Path $base -Description "Departamento $dept"
      # Criar sub-OUs dentro de cada departamento
      New-ADOrganizationalUnit -Name "Usuarios"    -Path "OU=$dept,$base"
      New-ADOrganizationalUnit -Name "Computadores" -Path "OU=$dept,$base"
      New-ADOrganizationalUnit -Name "Grupos"       -Path "OU=$dept,$base"
      Write-Host "Estrutura criada para: $dept" -ForegroundColor Green
  }

  # Mover objeto para outra OU
  Move-ADObject `
    -Identity "CN=carlos.rodrigues,OU=TI,OU=Funcionarios,DC=empresa,DC=com" `
    -TargetPath "OU=Engenharia,OU=Funcionarios,DC=empresa,DC=com"

  # Proteger OU contra exclusão acidental
  Set-ADOrganizationalUnit -Identity "OU=TI,DC=empresa,DC=com" `
    -ProtectedFromAccidentalDeletion $true

  # Renomear OU
  Rename-ADObject `
    -Identity "OU=TI,DC=empresa,DC=com" `
    -NewName "TI-Engenharia"
  `} />

        <h2>Contas de Serviço Gerenciadas (MSA/gMSA)</h2>
        <CodeBlock title="Contas de serviço seguras com senha automática" code={`# gMSA (Group Managed Service Account) — senha gerenciada pelo AD automaticamente
  # Pré-requisito: KDS Root Key deve existir
  # Em prod: Add-KdsRootKey -EffectiveImmediately (requer esperar propagação)
  # Em lab: Add-KdsRootKey -EffectiveTime ((Get-Date).AddHours(-10))

  # Criar gMSA
  New-ADServiceAccount `
    -Name "svc-webapp" `
    -DNSHostName "svc-webapp.empresa.com" `
    -PrincipalsAllowedToRetrieveManagedPassword "GRP-WebServers"  # Grupo de servidores que podem usar

  # Instalar gMSA no servidor
  Install-ADServiceAccount -Identity "svc-webapp"
  Test-ADServiceAccount    -Identity "svc-webapp"  # Deve retornar True

  # Usar gMSA em um serviço Windows (via SC ou New-Service)
  # Na senha, use '$' no final do nome da conta e deixe a senha em branco
  New-Service -Name "MeuWebApp" `
    -BinaryPathName "C:\\Apps\\WebApp\\service.exe" `
    -Credential (New-Object PSCredential("EMPRESA\\svc-webapp$", (New-Object System.Security.SecureString)))
  `} />

        <h2>Computadores</h2>
        <CodeBlock title="Gerenciando contas de computador" code={`# Buscar computadores com propriedades
  Get-ADComputer -Filter * -Properties OperatingSystem, LastLogonDate |
      Select-Object Name, OperatingSystem, LastLogonDate | Sort-Object Name

  # Computadores não logados há 90 dias (candidatos a desativação)
  $limite = (Get-Date).AddDays(-90)
  $inativos = Get-ADComputer -Filter { LastLogonDate -lt $limite -and Enabled -eq $true } `
      -Properties LastLogonDate, OperatingSystem |
      Select-Object Name, LastLogonDate, OperatingSystem |
      Sort-Object LastLogonDate

  $inativos | Export-Csv "computadores-inativos.csv" -NoTypeInformation -Encoding UTF8
  Write-Host "Computadores inativos: $($inativos.Count)"

  # Mover computador para OU correta
  Move-ADObject `
    -Identity "CN=WS-TI-001,CN=Computers,DC=empresa,DC=com" `
    -TargetPath "OU=Computadores,OU=TI,DC=empresa,DC=com"

  # Pre-criar conta de computador (para juntar ao domínio depois)
  New-ADComputer -Name "WS-NOVO-001" `
    -Path "OU=Computadores,OU=TI,DC=empresa,DC=com" `
    -Enabled $true

  # Redefinir conta de computador (resolver problemas de canal seguro)
  Reset-ComputerMachinePassword -Server "dc01.empresa.com" -Credential (Get-Credential)
  `} />

        <h2>Relatórios, Auditoria e Importação em Massa</h2>
        <CodeBlock title="Relatórios de segurança, compliance e onboarding" code={`# Contas inativas (sem login há 90+ dias)
  $limite = (Get-Date).AddDays(-90)
  Get-ADUser -Filter { LastLogonDate -lt $limite -and Enabled -eq $true } `
    -Properties LastLogonDate, Department |
    Select-Object Name, SamAccountName, LastLogonDate, Department |
    Sort-Object LastLogonDate |
    Export-Csv "contas-inativas.csv" -NoTypeInformation -Encoding UTF8

  # Contas com senha que nunca expira (risco de segurança)
  Get-ADUser -Filter { PasswordNeverExpires -eq $true -and Enabled -eq $true } `
    -Properties PasswordNeverExpires, Department, PasswordLastSet |
    Select-Object Name, SamAccountName, Department, PasswordLastSet |
    Export-Csv "senha-nao-expira.csv" -NoTypeInformation

  # Importação em massa de usuários via CSV
  # Formato do CSV: Nome;Sobrenome;Login;Departamento;Cargo;OU
  $usuarios = Import-Csv "novos-usuarios.csv" -Delimiter ";"
  foreach ($u in $usuarios) {
      $senha = ConvertTo-SecureString "BemVindo@$(Get-Date -Format 'yyyy')!" -AsPlainText -Force
      try {
          New-ADUser `
            -Name "$($u.Nome) $($u.Sobrenome)" `
            -SamAccountName $u.Login `
            -UserPrincipalName "$($u.Login)@empresa.com" `
            -Department $u.Departamento `
            -Title $u.Cargo `
            -Path $u.OU `
            -AccountPassword $senha `
            -Enabled $true `
            -ChangePasswordAtLogon $true
          Write-Host "✔ Criado: $($u.Login)" -ForegroundColor Green
      } catch {
          Write-Warning "Erro ao criar $($u.Login): $($_.Exception.Message)"
      }
  }

  # Relatório completo do AD — usuários com grupos e último login
  Get-ADUser -Filter { Enabled -eq $true } `
    -Properties MemberOf, LastLogonDate, Department, Title |
    Select-Object Name, SamAccountName, Department, Title, LastLogonDate,
      @{N="Grupos"; E={ ($_.MemberOf | ForEach-Object {
          (Get-ADGroup $_).Name }) -join "; " }} |
    Export-Csv "relatorio-completo-ad.csv" -NoTypeInformation -Encoding UTF8
  `} />

        <AlertBox type="warning" title="LastLogonDate vs LastLogon">
          Use <code>LastLogonDate</code> (replicado entre DCs) em vez de <code>LastLogon</code>
          (armazenado apenas no DC que autenticou). Isso garante dados consistentes em
          ambientes com múltiplos controladores de domínio.
        </AlertBox>
      </PageContainer>
    );
  }
  