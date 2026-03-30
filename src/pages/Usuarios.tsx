import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Usuarios() {
  return (
    <PageContainer
      title="Gerenciamento de Usuários e Grupos"
      subtitle="Aprenda a administrar contas locais e grupos de segurança usando PowerShell."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        O gerenciamento de usuários é uma parte fundamental da administração do Windows. O módulo <code>Microsoft.PowerShell.LocalAccounts</code> fornece cmdlets modernos para gerenciar usuários e grupos locais, substituindo os comandos legados do <code>net user</code> e <code>net localgroup</code>.
      </p>

      <h2>1. Gerenciando Usuários Locais</h2>
      <p>
        Para listar os usuários presentes na máquina local, usamos o <code>Get-LocalUser</code>.
      </p>

      <CodeBlock
        title="Consultando usuários"
        code={`# Listar todos os usuários locais
Get-LocalUser

# Obter detalhes de um usuário específico
Get-LocalUser -Name "Administrador"

# Listar apenas usuários ativos (habilitados)
Get-LocalUser | Where-Object Enabled -eq $true
`}
      />

      <h2>2. Criando Novos Usuários</h2>
      <p>
        A criação de um usuário requer um cuidado especial com a senha, que deve ser passada como um objeto de <code>SecureString</code>.
      </p>

      <CodeBlock
        title="Criando um usuário"
        code={`# Definir a senha de forma segura
$password = Read-Host "Digite a senha do novo usuário" -AsSecureString

# Criar o usuário
New-LocalUser -Name "DevUser"  -Password $password  -FullName "Desenvolvedor de Teste"  -Description "Conta usada para testes de ambiente"  -PasswordNeverExpires

# Ativar o usuário (caso venha desativado por padrão)
Enable-LocalUser -Name "DevUser"
`}
      />

      <AlertBox type="warning" title="Segurança">
        Nunca escreva senhas em texto puro nos seus scripts. Sempre use <code>Read-Host -AsSecureString</code> ou recupere de um cofre de senhas (como o módulo SecretManagement).
      </AlertBox>

      <h2>3. Modificando e Removendo Usuários</h2>
      <p>
        Podemos alterar propriedades ou excluir contas facilmente.
      </p>

      <CodeBlock
        title="Alterando e removendo"
        code={`# Alterar a descrição de um usuário
Set-LocalUser -Name "DevUser" -Description "Nova descrição atualizada"

# Desativar um usuário temporariamente
Disable-LocalUser -Name "DevUser"

# Remover um usuário permanentemente
Remove-LocalUser -Name "DevUser"
`}
      />

      <h2>4. Gerenciando Grupos Locais</h2>
      <p>
        Grupos são usados para atribuir permissões a múltiplos usuários de uma vez.
      </p>

      <CodeBlock
        title="Trabalhando com grupos"
        code={`# Listar todos os grupos locais
Get-LocalGroup

# Criar um novo grupo
New-LocalGroup -Name "Desenvolvedores" -Description "Acesso às ferramentas de dev"

# Adicionar um usuário a um grupo (ex: dar permissão de Admin)
Add-LocalGroupMember -Group "Administradores" -Member "DevUser"

# Listar membros de um grupo específico
Get-LocalGroupMember -Group "Administradores"
`}
      />

      <h2>5. Identidade do Usuário Atual</h2>
      <p>
        Muitas vezes precisamos saber quem está executando o script ou se temos privilégios elevados.
      </p>

      <CodeBlock
        title="Verificando identidade"
        code={`# Quem sou eu? (comando clássico)
whoami

# Obter o SID do usuário atual via .NET
[System.Security.Principal.WindowsIdentity]::GetCurrent().User

# Verificar se o script está rodando como Administrador
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "Executando como Administrador!" -ForegroundColor Green
} else {
    Write-Warning "Este script requer privilégios de Administrador."
}
`}
      />

      <h2>6. Comparação com Comandos Antigos</h2>
      <p>
        Se você está acostumado com o CMD, veja a equivalência:
      </p>
      <table className="min-w-full divide-y divide-border border rounded-lg overflow-hidden my-4">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">CMD (net.exe)</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">PowerShell</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <tr>
            <td className="px-4 py-2 font-mono text-sm text-blue-400">net user</td>
            <td className="px-4 py-2 font-mono text-sm text-green-400">Get-LocalUser</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-mono text-sm text-blue-400">net user user /add</td>
            <td className="px-4 py-2 font-mono text-sm text-green-400">New-LocalUser</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-mono text-sm text-blue-400">net localgroup</td>
            <td className="px-4 py-2 font-mono text-sm text-green-400">Get-LocalGroup</td>
          </tr>
          <tr>
            <td className="px-4 py-2 font-mono text-sm text-blue-400">net localgroup grp /add</td>
            <td className="px-4 py-2 font-mono text-sm text-green-400">Add-LocalGroupMember</td>
          </tr>
        </tbody>
      </table>

      <AlertBox type="info" title="Active Directory">
        Este guia cobre usuários <b>locais</b>. Para gerenciar usuários de um domínio (Active Directory), você precisará do módulo <code>ActiveDirectory</code> (RSAT) e cmdlets como <code>Get-ADUser</code>, <code>New-ADUser</code>, etc.
      </AlertBox>

    </PageContainer>
  );
}
