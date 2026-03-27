import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Navegacao() {
  return (
    <PageContainer
      title="Navegação no Sistema de Arquivos"
      subtitle="Dominando a movimentação e exploração de diretórios e unidades no PowerShell."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        Navegar pelo sistema de arquivos é uma das tarefas mais fundamentais em qualquer shell. No PowerShell, essa experiência é enriquecida pelo conceito de <strong>Providers</strong> (Provedores), que permitem tratar diferentes tipos de armazenamento (como o Registro do Windows ou Certificados) da mesma forma que tratamos pastas e arquivos.
      </p>

      <h2>Localização Atual: Get-Location</h2>
      <p>
        Antes de se mover, é preciso saber onde você está. O cmdlet <code>Get-Location</code> (ou os aliases <code>pwd</code> e <code>gl</code>) informa o caminho do diretório atual.
      </p>

      <CodeBlock
        title="Verificando o diretório atual"
        code={`# Obtém o caminho completo do diretório onde você está
Get-Location

# Usando o alias comum de sistemas Unix
pwd

# Armazenando a localização em uma variável para uso posterior
$currentDir = Get-Location
Write-Host "Estamos trabalhando em: $($currentDir.Path)"
`}
      />

      <AlertBox type="info" title="Aliases de Navegação">
        O PowerShell inclui aliases familiares para usuários de CMD (<code>dir</code>, <code>cd</code>, <code>cls</code>) e Bash (<code>ls</code>, <code>cd</code>, <code>pwd</code>, <code>clear</code>), facilitando a transição de outros ambientes.
      </AlertBox>

      <h2>Mudando de Diretório: Set-Location</h2>
      <p>
        Para navegar entre pastas, utilizamos o <code>Set-Location</code> (aliases <code>cd</code>, <code>chdir</code> ou <code>sl</code>). O PowerShell suporta caminhos relativos e absolutos.
      </p>

      <CodeBlock
        title="Navegando entre pastas"
        code={`# Vai para a pasta Documentos do usuário atual
Set-Location -Path "$HOME\\Documents"

# Volta um nível na árvore de diretórios
cd ..

# Vai para a raiz da unidade C:
sl C:\\

# Navega para um caminho com espaços (use aspas)
cd "C:\\Program Files\\PowerShell"
`}
      />

      <h2>Explorando Conteúdo: Get-ChildItem</h2>
      <p>
        O <code>Get-ChildItem</code> (aliases <code>ls</code>, <code>dir</code>, <code>gci</code>) é a ferramenta principal para listar arquivos e subdiretórios.
      </p>

      <CodeBlock
        title="Listagem detalhada de arquivos"
        code={`# Lista arquivos e pastas no diretório atual
Get-ChildItem

# Lista apenas arquivos (.exe) recursivamente
Get-ChildItem -Path "C:\\Windows" -Filter "*.exe" -Recurse -ErrorAction SilentlyContinue

# Lista pastas ocultas e do sistema
Get-ChildItem -Force

# Lista apenas diretórios
Get-ChildItem -Directory

# Limita a profundidade da busca recursiva
Get-ChildItem -Recurse -Depth 2
`}
      />

      <AlertBox type="warning" title="Performance com -Recurse">
        Usar <code>-Recurse</code> em diretórios muito grandes (como <code>C:\\Windows</code>) pode ser lento. Use o parâmetro <code>-Depth</code> para limitar a varredura se souber o quão profundo deseja ir.
      </AlertBox>

      <h2>Trabalhando com Caminhos de Forma Segura</h2>
      <p>
        Manipular strings de caminhos manualmente pode gerar erros, especialmente devido a barras invertidas (Windows) vs barras normais (Linux/macOS). O PowerShell oferece cmdlets para lidar com isso de forma robusta.
      </p>

      <CodeBlock
        title="Manipulação inteligente de caminhos"
        code={`# Unindo partes de um caminho de forma segura
$path = Join-Path -Path "C:\\Users\\Public" -ChildPath "Downloads"
# Resultado: C:\\Users\\Public\\Downloads

# Extraindo partes de um caminho
$fullPath = "C:\\Windows\\System32\\drivers\\etc\\hosts"
Split-Path -Path $fullPath -Leaf      # Retorna: hosts
Split-Path -Path $fullPath -Parent    # Retorna: C:\\Windows\\System32\\drivers\\etc
Split-Path -Path $fullPath -Qualifier # Retorna: C:

# Resolvendo caminhos relativos para absolutos
Resolve-Path -Path "..\\Downloads"

# Validando se um caminho existe
if (Test-Path -Path "C:\\Temp") {
    Write-Host "A pasta temporária existe!"
}
`}
      />

      <h2>Pilha de Localização: Push e Pop</h2>
      <p>
        Às vezes você precisa ir para uma pasta, realizar uma tarefa e voltar exatamente para onde estava. As funções <code>Push-Location</code> (<code>pushd</code>) e <code>Pop-Location</code> (<code>popd</code>) gerenciam uma pilha de diretórios para isso.
      </p>

      <CodeBlock
        title="Usando a pilha de diretórios"
        code={`# Salva o diretório atual na pilha e vai para o novo caminho
Push-Location -Path "C:\\Windows\\Logs"

# Faz alguma tarefa...
Get-ChildItem -Filter "*.log"

# Volta para o diretório que estava antes do Push-Location
Pop-Location
`}
      />

      <h2>PowerShell Providers e Drives</h2>
      <p>
        A característica mais poderosa da navegação no PowerShell é que o sistema de arquivos é apenas um dos muitos "Drives". Você pode "entrar" no Registro ou na pasta de Certificados usando o mesmo <code>cd</code>.
      </p>

      <CodeBlock
        title="Explorando outros provedores"
        code={`# Lista todos os drives disponíveis (FileSystem, Registry, Alias, etc)
Get-PSDrive

# Navegando no Registro do Windows (HKCU) como se fosse um disco
Set-Location -Path HKCU:\\Software\\Microsoft

# Listando variáveis de ambiente como arquivos
Get-ChildItem -Path Env:

# Criando um novo drive temporário para uma pasta profunda
New-PSDrive -Name "Logs" -PSProvider FileSystem -Root "C:\\Windows\\System32\\LogFiles"
cd Logs:
`}
      />

      <AlertBox type="info" title="Provedores (Providers)">
        Os Provedores traduzem repositórios de dados complexos em uma estrutura de árvore amigável. Os principais são: <code>FileSystem</code>, <code>Registry</code>, <code>Alias</code>, <code>Environment</code>, <code>Variable</code> e <code>Function</code>.
      </AlertBox>

      <h2>Resumo de Comandos de Navegação</h2>
      <p>
        Aqui estão os comandos essenciais para o seu dia a dia:
      </p>
      <ul>
        <li><strong>Get-Location (pwd):</strong> Onde estou?</li>
        <li><strong>Set-Location (cd):</strong> Quero ir para lá.</li>
        <li><strong>Get-ChildItem (ls):</strong> O que tem aqui?</li>
        <li><strong>Test-Path:</strong> Isso realmente existe?</li>
        <li><strong>Join-Path / Split-Path:</strong> Construindo e desmontando caminhos.</li>
      </ul>
    </PageContainer>
  );
}
