import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Permissoes() {
  return (
    <PageContainer
      title="Permissões de Arquivos e ACLs"
      subtitle="Gerenciando Listas de Controle de Acesso (ACL) e segurança no Windows via PowerShell."
      difficulty="avancado"
      timeToRead="25 min"
    >
      <p>
        A segurança do sistema de arquivos no Windows é baseada em <strong>Access Control Lists (ACLs)</strong>. Cada arquivo ou pasta possui uma lista de <strong>Access Control Entries (ACEs)</strong> que definem quem (usuário ou grupo) tem qual permissão (Ler, Escrever, Modificar, etc).
      </p>

      <h2>Visualizando Permissões: Get-Acl</h2>
      <p>
        O cmdlet <code>Get-Acl</code> permite visualizar as permissões de um item. Ele retorna um objeto que contém o proprietário e a lista de acessos.
      </p>

      <CodeBlock
        title="Verificando quem tem acesso"
        code={`# Obtém a ACL de uma pasta
$acl = Get-Acl -Path "C:\\Dados\\Privado"

# Exibe as permissões de forma legível
$acl.Access | Select-Object IdentityReference, FileSystemRights, AccessControlType

# Verifica o proprietário (Owner) do arquivo
$acl.Owner
`}
      />

      <AlertBox type="info" title="FileSystemRights">
        As permissões comuns incluem: <code>ReadAndExecute</code>, <code>Modify</code>, <code>FullControl</code>, <code>Read</code>, <code>Write</code> e <code>Delete</code>.
      </AlertBox>

      <h2>Modificando Permissões: O Fluxo de Trabalho</h2>
      <p>
        Diferente de outros sistemas, no PowerShell você não "aplica" uma permissão diretamente. O fluxo padrão é:
        <ol>
          <li>Obter a ACL atual com <code>Get-Acl</code>.</li>
          <li>Criar uma nova regra de acesso (Access Rule).</li>
          <li>Adicionar a regra ao objeto ACL em memória.</li>
          <li>Aplicar o objeto ACL modificado de volta ao arquivo com <code>Set-Acl</code>.</li>
        </ol>
      </p>

      <CodeBlock
        title="Adicionando permissão de escrita para um usuário"
        code={`# 1. Obtém a ACL atual
$path = "C:\\Scripts\\meuscript.ps1"
$acl = Get-Acl -Path $path

# 2. Define o usuário e a permissão
$usuario = "DOMINIO\\UsuarioExemplo"
$permissoes = "Write, ReadAndExecute"
$tipoAcesso = "Allow"

# 3. Cria a nova regra de acesso
$regra = New-Object System.Security.AccessControl.FileSystemAccessRule($usuario, $permissoes, $tipoAcesso)

# 4. Adiciona a regra à ACL
$acl.AddAccessRule($regra)

# 5. Aplica as mudanças
Set-Acl -Path $path -AclObject $acl
`}
      />

      <h2>Removendo Permissões</h2>
      <p>
        Para remover uma permissão específica, usamos o método <code>RemoveAccessRule</code> no objeto ACL.
      </p>

      <CodeBlock
        title="Removendo acesso de um grupo"
        code={`$acl = Get-Acl "C:\\Temp"
# Define a regra exata que deseja remover
$regra = New-Object System.Security.AccessControl.FileSystemAccessRule("Todos", "FullControl", "Allow")
$acl.RemoveAccessRule($regra)
Set-Acl "C:\\Temp" $acl
`}
      />

      <AlertBox type="danger" title="Cuidado com Set-Acl">
        Ao usar <code>Set-Acl</code>, você está sobrescrevendo a lista de segurança inteira. Se você cometer um erro ao manipular o objeto ACL em memória, pode acabar bloqueando o acesso de todos (inclusive o seu) ao arquivo.
      </AlertBox>

      <h2>Gerenciando Herança (Inheritance)</h2>
      <p>
        Por padrão, pastas e arquivos herdam permissões de seus pais. Às vezes, você precisa quebrar essa herança para definir permissões exclusivas.
      </p>

      <CodeBlock
        title="Desabilitando a herança de permissões"
        code={`$acl = Get-Acl "C:\\PastaPrivada"

# SetAccessRuleProtection(isProtected, preserveInheritance)
# isProtected = $true (Desabilita a herança)
# preserveInheritance = $true (Copia as permissões herdadas como explícitas)
$acl.SetAccessRuleProtection($true, $true)

Set-Acl "C:\\PastaPrivada" $acl
`}
      />

      <h2>Alterando o Proprietário (Owner)</h2>
      <p>
        Mudar o dono de um arquivo requer privilégios administrativos e, muitas vezes, o uso de métodos de baixo nível.
      </p>

      <CodeBlock
        title="Mudando o dono do arquivo"
        code={`$acl = Get-Acl "C:\\Arquivo.txt"
$novoDono = New-Object System.Security.Principal.NTAccount("Administradores")
$acl.SetOwner($novoDono)
Set-Acl "C:\\Arquivo.txt" $acl
`}
      />

      <h2>Executando como Administrador</h2>
      <p>
        Muitas tarefas de permissão falharão se o PowerShell não estiver rodando com privilégios elevados. Você pode verificar isso via script:
      </p>

      <CodeBlock
        title="Verificando privilégios de Admin"
        code={`$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Warning "Este script precisa ser executado como Administrador!"
    # Reinicia o script como admin se necessário
    # Start-Process pwsh -Verb RunAs -ArgumentList $PSCommandPath
}
`}
      />

      <AlertBox type="success" title="PowerShell vs icacls">
        Embora o <code>Set-Acl</code> seja a forma "nativa" e orientada a objetos, o comando legado <code>icacls.exe</code> ainda é muito útil e às vezes mais simples para operações rápidas em massa. Você pode usá-lo dentro do PowerShell sem problemas!
      </AlertBox>
    </PageContainer>
  );
}
