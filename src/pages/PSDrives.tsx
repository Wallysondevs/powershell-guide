import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PSDrives() {
  return (
    <PageContainer
      title="PSProviders e PSDrives — Tudo é Filesystem"
      subtitle="Navegue Registry, Variáveis, Alias, Cert, Function e até Active Directory com cd, dir, Get-Item e Get-ChildItem. O conceito mais Unix-like do PowerShell."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        Um <strong>PSProvider</strong> é um adaptador que expõe qualquer fonte
        de dados como se fosse sistema de arquivos. Um <strong>PSDrive</strong>
        é uma "letra" montando esse provider. É por isso que você pode fazer
        <code>cd HKLM:\\</code> ou <code>dir Cert:\\CurrentUser\\My</code> — para
        o PowerShell, registry e certificados são pastas.
      </p>

      <AlertBox type="info" title="A grande sacada">
        <p>
          Ao aprender <code>cd</code>, <code>dir</code>, <code>Get-Item</code>,
          <code>Get-ItemProperty</code>, <code>New-Item</code>, <code>Remove-Item</code>,
          você ganha automaticamente como navegar TODA fonte de dados que
          tenha um provider. Em vez de 50 cmdlets diferentes para registry,
          AD, IIS — sempre os mesmos 6 verbos.
        </p>
      </AlertBox>

      <h2>Conceito — providers built-in</h2>
      <CodeBlock title="O que vem pronto" code={`# Listar todos os providers carregados
Get-PSProvider

# Saída típica:
# Name                 Capabilities                Drives
# ----                 ------------                ------
# Alias                ShouldProcess               {Alias}
# Environment          ShouldProcess               {Env}
# FileSystem           Filter, ShouldProcess       {C, D}
# Function             ShouldProcess               {Function}
# Registry             ShouldProcess, Transactions {HKLM, HKCU}
# Variable             ShouldProcess               {Variable}
# Certificate          ShouldProcess               {Cert}
# WSMan                Credentials                 {WSMan}

# Listar todos os drives ativos
Get-PSDrive`} />

      <h2>Os 6 cmdlets universais</h2>
      <CodeBlock title="Funcionam em QUALQUER provider" code={`# Get-PSDrive  → listar drives
# New-PSDrive  → criar drive (montar)
# Remove-PSDrive → desmontar
# Push-Location / Pop-Location → cd com pilha
# Get-Location → pwd

# Item-level (em qualquer provider)
Get-Item        # 1 item
Get-ChildItem   # filhos (dir, ls)
New-Item        # criar
Remove-Item     # apagar
Copy-Item / Move-Item / Rename-Item
Test-Path       # existe?

# Property-level (registry, AD, etc.)
Get-ItemProperty
Set-ItemProperty
New-ItemProperty
Remove-ItemProperty
Clear-ItemProperty`} />

      <h2>Drive Variable — variáveis como arquivos</h2>
      <CodeBlock title="Exploração interativa de variáveis" code={`# Listar TODAS as variáveis em escopo
Get-ChildItem Variable:

# Inspecionar uma específica
Get-Item Variable:PROFILE
Get-Item Variable:HOME

# Criar variável via provider
New-Item Variable:meuTeste -Value "Olá mundo"
Get-Item Variable:meuTeste | Select-Object Name, Value

# Apagar
Remove-Item Variable:meuTeste

# Apagar TODAS variáveis user-defined (cuidado)
Get-ChildItem Variable: | Where-Object {
    $_.Options -notmatch 'ReadOnly|Constant'
} | Remove-Item -ErrorAction SilentlyContinue`} />

      <h2>Drive Env — variáveis de ambiente</h2>
      <CodeBlock title="Mais limpo que [Environment]::GetEnvironmentVariable" code={`# Listar
Get-ChildItem Env:

# Ler
$env:PATH                    # Atalho
(Get-Item Env:PATH).Value    # Via provider

# Criar/atualizar (apenas sessão)
$env:MY_VAR = 'valor'
New-Item -Path Env:MY_VAR -Value 'valor' -Force

# Apagar (sessão)
Remove-Item Env:MY_VAR

# Persistir (registry — User ou Machine)
[Environment]::SetEnvironmentVariable('MY_VAR', 'valor', 'User')
[Environment]::SetEnvironmentVariable('MY_VAR', $null,    'User')   # apaga`} />

      <h2>Drive Alias — funções e atalhos</h2>
      <CodeBlock title="Criar e gerenciar aliases" code={`# Listar todos
Get-ChildItem Alias:

# Filtrar por prefixo
Get-ChildItem Alias:g*

# Inspecionar um
Get-Item Alias:ls    # Mostra que aponta para Get-ChildItem

# Criar (mesma coisa que Set-Alias)
New-Item -Path Alias:ll -Value Get-ChildItem
ll

# Apagar
Remove-Item Alias:ll`} />

      <h2>Drive Function — listar e editar funções</h2>
      <CodeBlock title="Toda função do PowerShell vira arquivo" code={`# Listar todas as funções carregadas
Get-ChildItem Function:

# Ver corpo de uma função
Get-Item Function:prompt
(Get-Item Function:prompt).Definition

# Sobrescrever prompt rapidamente
Set-Item Function:prompt -Value {
    "$($PSStyle.Foreground.BrightCyan)PS $($PSStyle.Foreground.Yellow)$(Split-Path -Leaf (Get-Location))$($PSStyle.Reset) > "
}

# Apagar uma função
Remove-Item Function:MinhaFuncao`} />

      <h2>Drive Registry — HKLM e HKCU</h2>
      <CodeBlock title="Navegar e modificar como pastas" code={`# Navegar
Set-Location HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion
Get-ChildItem | Select-Object -First 10

# Ler valores (Properties)
Get-ItemProperty .\\Run

# Adicionar app no startup
Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' \`
    -Name 'MeuApp' -Value 'C:\\Tools\\meuapp.exe'

# Criar chave + valor
$path = 'HKCU:\\Software\\MinhaEmpresa\\Config'
New-Item -Path $path -Force | Out-Null
New-ItemProperty -Path $path -Name 'Tema' -Value 'Dark' -PropertyType String
New-ItemProperty -Path $path -Name 'Versao' -Value 3 -PropertyType DWord

# Ler
(Get-ItemProperty $path).Tema

# Remover valor
Remove-ItemProperty -Path $path -Name 'Tema'

# Apagar chave inteira
Remove-Item $path -Recurse`} />

      <AlertBox type="warning" title="Cuidado com HKLM (Local Machine)">
        <p>
          Escrever em <code>HKLM:</code> exige terminal elevado (admin). Sem
          isso, falha silenciosamente em alguns casos. Sempre teste com
          <code>Test-Path</code> + <code>-WhatIf</code> antes em scripts de
          deploy.
        </p>
      </AlertBox>

      <h2>Drive Cert — certificados como arquivos</h2>
      <CodeBlock title="Inspecionar e mover certificados" code={`# Listar lojas de certificados
Get-ChildItem Cert:

# Listar certificados pessoais do usuário
Get-ChildItem Cert:\\CurrentUser\\My

# Filtrar por validade
Get-ChildItem Cert:\\LocalMachine\\My -Recurse |
    Where-Object NotAfter -lt (Get-Date).AddDays(30) |
    Select-Object Subject, NotAfter, Thumbprint

# Inspecionar detalhes
$cert = Get-Item Cert:\\CurrentUser\\My\\<thumbprint>
$cert.Subject
$cert.Issuer
$cert.HasPrivateKey
$cert.EnhancedKeyUsageList

# Exportar para .pfx
$senha = Read-Host -AsSecureString
Export-PfxCertificate -Cert $cert -FilePath ./cert.pfx -Password $senha

# Apagar (use Remove-Item, não delete manual)
Remove-Item "Cert:\\CurrentUser\\My\\<thumbprint>"`} />

      <h2>New-PSDrive — montar drives customizados</h2>
      <CodeBlock title="Atalhos para pastas, shares de rede e mais" code={`# Atalho para uma pasta de projetos
New-PSDrive -Name dev -PSProvider FileSystem -Root 'C:\\Users\\Wally\\dev'
Set-Location dev:
ls

# Compartilhamento de rede com credencial
$cred = Get-Credential
New-PSDrive -Name backup -PSProvider FileSystem \`
    -Root '\\\\fileserver\\backup' -Credential $cred -Persist

# Persistir entre sessões (Windows: vira mapa de rede)
# -Persist requer letra única (ex: -Name Z)

# Drive em registry com escopo restrito
New-PSDrive -Name appcfg -PSProvider Registry -Root 'HKCU:\\Software\\MinhaEmpresa\\Config'
Set-Location appcfg:
Get-ItemProperty .

# Remover quando não precisar mais
Remove-PSDrive backup`} />

      <AlertBox type="tip" title="No $PROFILE">
        <p>
          Drives criados em uma sessão somem ao fechar. Para tê-los sempre,
          coloque os <code>New-PSDrive</code> no seu <code>$PROFILE</code>.
        </p>
      </AlertBox>

      <h2>Caso prático 1 — Snapshot do registry antes de mudar</h2>
      <CodeBlock title="Versão segura para deploy" code={`function Backup-RegistryKey {
    param([string]$Path, [string]$DestinoJson)

    $itens = Get-ChildItem $Path -Recurse | ForEach-Object {
        [pscustomobject]@{
            Path       = $_.PSPath
            Properties = Get-ItemProperty $_.PSPath |
                         Select-Object * -ExcludeProperty PSPath, PSParentPath, PSChildName, PSDrive, PSProvider
        }
    }
    $itens | ConvertTo-Json -Depth 5 | Set-Content $DestinoJson -Encoding UTF8
}

Backup-RegistryKey -Path 'HKCU:\\Software\\MinhaApp' -DestinoJson .\\backup.json
# faça mudanças
# se algo quebrar, restaure manualmente do JSON`} />

      <h2>Caso prático 2 — Auditoria de aplicações instaladas</h2>
      <CodeBlock title="Sem WMI, direto do registry" code={`$paths = @(
    'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
    'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
    'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\*'
)

Get-ItemProperty $paths -ErrorAction SilentlyContinue |
    Where-Object DisplayName |
    Select-Object DisplayName, DisplayVersion, Publisher, InstallDate |
    Sort-Object DisplayName |
    Export-Csv apps_instaladas.csv -NoTypeInformation`} />

      <h2>Caso prático 3 — Buscar valor em todo o registry</h2>
      <CodeBlock title="Tipo grep em HKLM/HKCU" code={`function Search-Registry {
    param(
        [string]$Padrao,
        [string]$Hive = 'HKLM:\\SOFTWARE'
    )
    Get-ChildItem $Hive -Recurse -ErrorAction SilentlyContinue |
        ForEach-Object {
            $props = Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue
            $props.PSObject.Properties |
                Where-Object { $_.Value -like "*$Padrao*" } |
                ForEach-Object {
                    [pscustomobject]@{
                        Key   = $props.PSPath
                        Name  = $_.Name
                        Value = $_.Value
                    }
                }
        }
}

Search-Registry -Padrao 'C:\\Program Files\\MinhaApp'`} />

      <h2>Capabilities — o que cada provider suporta</h2>
      <CodeBlock title="Inspecionar antes de assumir" code={`Get-PSProvider | Select-Object Name, Capabilities, Drives | Format-Table -AutoSize

# Capabilities possíveis:
# ShouldProcess - aceita -WhatIf / -Confirm
# Filter        - aceita -Filter (mais rápido que -Include)
# Credentials   - aceita -Credential (FileSystem, WSMan)
# Transactions  - suporte a Start-Transaction (Registry)
# ExpandWildcards - aceita curingas

# Exemplo: transação no registry (rollback automático em falha)
Start-Transaction
Set-ItemProperty HKCU:\\Software\\Teste -Name X -Value 1 -UseTransaction
# se algo der errado:
Undo-Transaction        # desfaz
# se ok:
Complete-Transaction    # commita`} />

      <h2>Cheat — drives mais úteis</h2>
      <CodeBlock title="Decorar para sempre" code={`Variable:        # Variáveis em escopo
Env:             # Variáveis de ambiente
Alias:           # Aliases
Function:        # Funções carregadas
HKLM:            # Registry — Local Machine
HKCU:            # Registry — Current User
Cert:            # Certificados (CurrentUser, LocalMachine)
WSMan:           # Configuração de remoting

# Módulos extras adicionam mais:
AD:              # ActiveDirectory module
IIS:             # WebAdministration
SQLSERVER:       # SqlServer module
Az: / Az.Ssh:    # Azure
Kubernetes:      # PSKubectl`} />

      <AlertBox type="success" title="Resumão">
        <p>
          PSProvider é o "tudo é arquivo" do Unix levado a sério no Windows. Um
          punhado de cmdlets <code>Get/Set/New/Remove-Item</code> serve para
          navegar variáveis, certificados, registry e qualquer fonte que tenha
          provider. Aprenda 6 verbos uma vez, use em 50 contextos.
        </p>
      </AlertBox>
    </PageContainer>
  );
}
