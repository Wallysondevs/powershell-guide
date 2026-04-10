import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Permissoes() {
    return (
      <PageContainer
        title="Permissões de Arquivos e ACLs"
        subtitle="Gerencie Listas de Controle de Acesso (ACL), proprietários, herança e auditoria no Windows."
        difficulty="avancado"
        timeToRead="30 min"
      >
        <p>
          O sistema de permissões do Windows baseia-se em ACLs (Access Control Lists).
          Cada arquivo e pasta tem uma DACL (controle de acesso) e uma SACL (auditoria).
          PowerShell oferece <code>Get-Acl</code> e <code>Set-Acl</code> para ler e modificar
          essas permissões programaticamente.
        </p>

        <h2>Visualizando Permissões com Get-Acl</h2>
        <CodeBlock title="Inspecionando ACLs de arquivos e pastas" code={`# Permissão de um arquivo
  $acl = Get-Acl -Path "C:\\Dados\\relatorio.xlsx"
  $acl.Access | Format-Table IdentityReference, FileSystemRights, AccessControlType -AutoSize

  # Proprietário
  $acl.Owner   # EMPRESA\\Carlos.Silva

  # Permissões de uma pasta
  Get-Acl "C:\\Apps" | Select-Object -ExpandProperty Access |
      Format-Table IdentityReference, FileSystemRights, AccessControlType, IsInherited

  # Verificar se herança está ativada
  $acl = Get-Acl "C:\\Dados"
  $acl.AreAccessRulesProtected  # False = herança ativada, True = herança bloqueada

  # Auditoria (SACL) — quem tem acesso de leitura ao arquivo de auditoria
  $acl = Get-Acl -Path "C:\\Dados" -Audit
  $acl.Audit | Format-Table IdentityReference, FileSystemRights, AuditFlags

  # Relatório de permissões recursivo
  Get-ChildItem "C:\\Projetos" -Recurse -ErrorAction SilentlyContinue |
      ForEach-Object {
          $acl = Get-Acl $_.FullName
          foreach ($entrada in $acl.Access) {
              [PSCustomObject]@{
                  Caminho      = $_.FullName
                  Identidade   = $entrada.IdentityReference
                  Direitos     = $entrada.FileSystemRights
                  Tipo         = $entrada.AccessControlType
                  Herdado      = $entrada.IsInherited
              }
          }
      } | Export-Csv "permissoes-projetos.csv" -NoTypeInformation
  `} />

        <h2>Modificando Permissões — O Fluxo Correto</h2>
        <CodeBlock title="Adicionando e modificando entradas de ACL" code={`# Fluxo: Get-Acl → Criar regra → Adicionar → Set-Acl

  # 1. Ler ACL atual
  $acl = Get-Acl -Path "C:\\Dados\\Projeto"

  # 2. Criar nova regra de acesso
  # Parâmetros: Identidade, Direitos, Herança, Propagação, Tipo(Allow/Deny)
  $regra = [System.Security.AccessControl.FileSystemAccessRule]::new(
      "EMPRESA\\Dev-Team",           # Quem (usuário ou grupo)
      "ReadAndExecute, Synchronize",   # Que direitos
      "ContainerInherit, ObjectInherit",  # Herança: aplica a subpastas e arquivos
      "None",                          # Sem propagação especial
      "Allow"                          # Allow ou Deny
  )

  # 3. Adicionar regra à ACL
  $acl.AddAccessRule($regra)

  # 4. Aplicar a ACL ao objeto (admin necessário)
  Set-Acl -Path "C:\\Dados\\Projeto" -AclObject $acl
  Write-Host "Permissão adicionada com sucesso!" -ForegroundColor Green

  # Adicionar permissão de modificação para um usuário específico
  function Add-PermissaoArquivo {
      param(
          [string]$Caminho,
          [string]$Identidade,
          [string]$Direitos = "Modify",
          [string]$Tipo = "Allow"
      )
      $acl   = Get-Acl $Caminho
      $regra = [System.Security.AccessControl.FileSystemAccessRule]::new(
          $Identidade, $Direitos, "ContainerInherit,ObjectInherit", "None", $Tipo
      )
      $acl.AddAccessRule($regra)
      Set-Acl -Path $Caminho -AclObject $acl
      Write-Host "[$Tipo] $Direitos concedido a $Identidade em $Caminho"
  }

  Add-PermissaoArquivo "C:\\Dados\\Projeto" "EMPRESA\\joao.silva" "Read"
  Add-PermissaoArquivo "C:\\Dados\\Projeto" "EMPRESA\\ti-equipe" "FullControl"
  `} />

        <h2>Removendo Permissões</h2>
        <CodeBlock title="Removendo entradas específicas de ACL" code={`# Remover permissão específica de um usuário
  $caminho = "C:\\Dados\\Projeto"
  $acl     = Get-Acl -Path $caminho

  # Criar regra idêntica à que deseja remover
  $regra = [System.Security.AccessControl.FileSystemAccessRule]::new(
      "EMPRESA\\joao.silva", "Read", "ContainerInherit,ObjectInherit", "None", "Allow"
  )
  $acl.RemoveAccessRule($regra)
  Set-Acl -Path $caminho -AclObject $acl

  # Remover TODAS as permissões de um usuário (qualquer direito)
  $acl = Get-Acl -Path $caminho
  $acl.Access |
      Where-Object { $_.IdentityReference -like "*joao.silva*" } |
      ForEach-Object { $acl.RemoveAccessRule($_) }
  Set-Acl -Path $caminho -AclObject $acl

  # Limpar todas as permissões explícitas (manter apenas herdadas)
  $acl = Get-Acl -Path $caminho
  $acl.Access |
      Where-Object { -not $_.IsInherited } |
      ForEach-Object { $acl.RemoveAccessRule($_) }
  Set-Acl -Path $caminho -AclObject $acl
  `} />

        <h2>Gerenciando Herança</h2>
        <CodeBlock title="Bloqueando e restaurando herança de ACL" code={`# Verificar herança de uma pasta
  $acl = Get-Acl "C:\\Dados\\Sigiloso"
  "Herança bloqueada: $($acl.AreAccessRulesProtected)"  # False = herdando do pai

  # Bloquear herança (preservar cópias das regras herdadas)
  $acl.SetAccessRuleProtection($true, $true)  # ($bloqueada, $copiarRegrasHerdadas)
  Set-Acl "C:\\Dados\\Sigiloso" $acl

  # Bloquear herança sem copiar regras (ACL zerada)
  $acl.SetAccessRuleProtection($true, $false)
  Set-Acl "C:\\Dados\\Sigiloso" $acl

  # Restaurar herança
  $acl.SetAccessRuleProtection($false, $false)
  Set-Acl "C:\\Dados\\Sigiloso" $acl

  # Copiar ACL de um objeto para outro
  $aclOrigem = Get-Acl "C:\\Template\\Pasta"
  Set-Acl "C:\\Dados\\NovaPasta" $aclOrigem

  # Padronizar permissões em múltiplas pastas
  $modelo  = Get-Acl "C:\\Template\\Pasta"
  Get-ChildItem "C:\\Projetos" -Directory | ForEach-Object {
      Set-Acl -Path $_.FullName -AclObject $modelo
      Write-Host "ACL aplicada em: $($_.FullName)"
  }
  `} />

        <h2>Alterando o Proprietário</h2>
        <CodeBlock title="Mudando o Owner de arquivos e pastas" code={`# Ver proprietário atual
  (Get-Acl "C:\\Dados\\arquivo.txt").Owner  # EMPRESA\\fulano

  # Mudar proprietário (requer privilégio SeTakeOwnershipPrivilege)
  $acl = Get-Acl "C:\\Dados\\arquivo.txt"
  $novoOwner = [System.Security.Principal.NTAccount]"EMPRESA\\ti-admin"
  $acl.SetOwner($novoOwner)
  Set-Acl "C:\\Dados\\arquivo.txt" $acl

  # Assumir propriedade em massa de pasta herdada (icacls é mais rápido)
  # Tomar posse recursivamente de toda uma pasta:
  icacls "C:\\Dados\\Legado" /setowner "EMPRESA\\ti-admin" /T /C /Q

  # Redefinir permissões padrão com icacls
  icacls "C:\\Dados\\Projeto" /reset /T    # Restaurar herança
  icacls "C:\\Dados\\Projeto" /inheritance:e  # Habilitar herança
  `} />

        <h2>Auditoria de Permissões</h2>
        <CodeBlock title="Encontrar arquivos com permissões problemáticas" code={`# Arquivos acessíveis por "Everyone" (risco de segurança)
  Get-ChildItem "C:\\Dados" -Recurse -ErrorAction SilentlyContinue |
      Where-Object {
          $acl = Get-Acl $_.FullName -ErrorAction SilentlyContinue
          $acl.Access | Where-Object {
              $_.IdentityReference -match "Everyone|Todos" -and
              $_.FileSystemRights -match "FullControl|Write|Modify"
          }
      } | Select-Object FullName, LastWriteTime

  # Verificar permissões de um usuário em um arquivo
  function Test-Permissao {
      param([string]$Caminho, [string]$Usuario)
      $acl = Get-Acl $Caminho
      $identidade = [Security.Principal.NTAccount]$Usuario
      $sid = $identidade.Translate([Security.Principal.SecurityIdentifier])
      $acl.Access | Where-Object {
          $_.IdentityReference.Translate([Security.Principal.SecurityIdentifier]).Value -eq $sid.Value
      } | Select-Object FileSystemRights, AccessControlType
  }
  Test-Permissao "C:\\Dados\\relatorio.xlsx" "EMPRESA\\joao.silva"
  `} />

        <AlertBox type="warning" title="Cuidado com Deny">
          Regras <code>Deny</code> têm precedência sobre <code>Allow</code>, mesmo que
          o usuário seja membro de um grupo com permissão Allow. Use Deny com cautela —
          prefira estruturar os grupos de AD para controlar acesso em vez de usar Deny explícito.
        </AlertBox>

        <AlertBox type="info" title="Alternativa: icacls">
          Para operações em massa ou recursivas em muitos arquivos, <code>icacls.exe</code>
          é significativamente mais rápido que o PowerShell Get-Acl/Set-Acl em loop.
          Use PowerShell para lógica e <code>icacls</code> para execução em lote.
        </AlertBox>
      </PageContainer>
    );
  }
  