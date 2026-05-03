import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ArgumentCompleters() {
  return (
    <PageContainer
      title="Argument Completers — Tab inteligente"
      subtitle="Register-ArgumentCompleter, ValidateSet dinâmico e ArgumentCompletions: complete parâmetros com valores reais (nomes de VMs, branches do git, conexões do RM)."
      difficulty="avancado"
      timeToRead="20 min"
    >
      <p>
        <strong>Argument completer</strong> é uma função que o PowerShell chama
        quando você aperta <kbd>Tab</kbd> sobre o valor de um parâmetro. Em vez
        de adivinhar, ele oferece <strong>os valores que fazem sentido naquele
        contexto</strong> — nomes de subscriptions Azure ativas, services
        rodando, branches do repositório atual, etc.
      </p>

      <AlertBox type="info" title="Três níveis, do simples ao poderoso">
        <ol>
          <li><code>[ValidateSet(...)]</code> — lista estática conhecida em design time.</li>
          <li><code>[ArgumentCompletions(...)]</code> — sugere mas aceita outros valores (PS 6+).</li>
          <li><code>Register-ArgumentCompleter</code> — função dinâmica que roda no momento do Tab.</li>
        </ol>
      </AlertBox>

      <h2>Nível 1 — ValidateSet (estático e validado)</h2>
      <CodeBlock title="Restringe E completa" code={`function Set-AmbienteAtivo {
    param(
        [ValidateSet('dev', 'staging', 'prod')]
        [string]$Ambiente
    )
    $env:APP_ENV = $Ambiente
    "Ambiente alterado para: $Ambiente"
}

# Tab cicla entre dev/staging/prod, valor fora da lista dispara erro`} />

      <h2>Nível 2 — ArgumentCompletions (sugere, não restringe)</h2>
      <CodeBlock title="Sugere comuns mas aceita customizados" code={`function New-Projeto {
    param(
        [ArgumentCompletions('node', 'python', 'dotnet', 'java', 'rust', 'go')]
        [string]$Stack
    )
    "Bootstrapping projeto $Stack..."
}

# Tab → mostra opções, mas você pode digitar 'cobol' e funciona`} />

      <h2>Nível 3 — ValidateSet dinâmico via classe</h2>
      <p>
        Quando a lista de valores válidos depende de algo em runtime (arquivos
        existentes, pastas, conexões), use uma classe que estende
        <code>IValidateSetValuesGenerator</code>:
      </p>
      <CodeBlock title="Lista vem de runtime, ainda valida" code={`class NomesDeBranches : System.Management.Automation.IValidateSetValuesGenerator {
    [string[]] GetValidValues() {
        return (git branch --format='%(refname:short)' 2>$null)
    }
}

function Switch-Branch {
    param(
        [ValidateSet([NomesDeBranches])]
        [string]$Branch
    )
    git checkout $Branch
}

# Tab → lista branches reais do repositório atual`} />

      <h2>Nível 4 — Register-ArgumentCompleter (poder total)</h2>
      <p>
        Permite completar parâmetros de cmdlets de TERCEIROS sem alterá-los, e
        ter acesso ao contexto completo do que o usuário já digitou.
      </p>

      <CodeBlock title="Anatomia de um completer" code={`Register-ArgumentCompleter -CommandName 'Get-Service' -ParameterName 'Name' -ScriptBlock {
    param(
        $commandName,         # 'Get-Service'
        $parameterName,       # 'Name'
        $wordToComplete,      # O que o usuário já digitou (ex: 'Wi')
        $commandAst,          # AST inteira do comando
        $fakeBoundParameters  # Hashtable com parâmetros já bound
    )

    Get-Service -Name "$wordToComplete*" |
        ForEach-Object {
            [System.Management.Automation.CompletionResult]::new(
                $_.Name,                     # Texto inserido
                "$($_.Name) [$($_.Status)]", # Texto exibido (lista)
                'ParameterValue',
                "$($_.DisplayName)"          # Tooltip
            )
        }
}

# Agora: Get-Service -Name <Tab> mostra apenas serviços REAIS, com status`} />

      <h2>Caso prático 1 — Completer para nomes de Azure VM</h2>
      <CodeBlock title="Tab inteligente em chamadas Az" code={`Register-ArgumentCompleter -CommandName Start-AzVM, Stop-AzVM, Restart-AzVM \`
    -ParameterName 'Name' -ScriptBlock {
        param($cmd, $param, $word, $ast, $bound)

        # Se o usuário já passou -ResourceGroupName, filtra por ela
        $rg = $bound['ResourceGroupName']
        $filter = if ($rg) { @{ ResourceGroupName = $rg } } else { @{} }

        Get-AzVM @filter |
            Where-Object Name -like "$word*" |
            ForEach-Object {
                $tooltip = "RG: $($_.ResourceGroupName) | Size: $($_.HardwareProfile.VmSize)"
                [System.Management.Automation.CompletionResult]::new(
                    $_.Name, $_.Name, 'ParameterValue', $tooltip
                )
            }
    }`} />

      <h2>Caso prático 2 — Completer para arquivos de config locais</h2>
      <CodeBlock title="Sugere arquivos .json/.yaml em ./configs/" code={`Register-ArgumentCompleter -CommandName Deploy-App -ParameterName 'ConfigFile' \`
    -ScriptBlock {
        param($cmd, $param, $word, $ast, $bound)
        Get-ChildItem -Path ./configs -Include *.json, *.yaml -File -Recurse 2>$null |
            Where-Object Name -like "$word*" |
            Sort-Object LastWriteTime -Descending |
            ForEach-Object {
                [System.Management.Automation.CompletionResult]::new(
                    "'$($_.FullName)'",
                    $_.Name,
                    'ParameterValue',
                    "Modificado: $($_.LastWriteTime)"
                )
            }
    }`} />

      <h2>Caso prático 3 — Completer para nativos (git, docker, kubectl)</h2>
      <p>
        Use <code>-Native</code> para completar argumentos de executáveis fora
        do PowerShell. Não tem parameter binding, então você inspeciona o AST
        manualmente:
      </p>
      <CodeBlock title="Tab para subcomandos do git" code={`Register-ArgumentCompleter -Native -CommandName git -ScriptBlock {
    param($wordToComplete, $commandAst, $cursorPosition)

    $tokens = $commandAst.CommandElements.Value
    $subcomando = $tokens[1]

    if ($tokens.Count -eq 2) {
        # Sugerir subcomandos
        @('add','branch','checkout','commit','diff','log','merge','pull','push','rebase','status') |
            Where-Object { $_ -like "$wordToComplete*" } |
            ForEach-Object {
                [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', "git $_")
            }
    }
    elseif ($subcomando -in 'checkout','merge','rebase','branch') {
        # Sugerir branches reais
        git branch --format='%(refname:short)' |
            Where-Object { $_ -like "$wordToComplete*" } |
            ForEach-Object {
                [System.Management.Automation.CompletionResult]::new($_, $_, 'ParameterValue', "branch")
            }
    }
}`} />

      <AlertBox type="tip" title="Já existe pronto: posh-git, DockerCompletion, etc.">
        <p>
          Para git, docker, kubectl, az, gh, npm, terraform: instale módulos
          prontos em vez de reinventar.
        </p>
        <CodeBlock language="powershell" code={`Install-Module posh-git -Scope CurrentUser
Install-Module DockerCompletion
Install-Module PSKubectlCompletion
Import-Module posh-git    # adicione no $PROFILE`} />
      </AlertBox>

      <h2>CompletionResult — os 4 argumentos</h2>
      <CodeBlock title="Anatomia da sugestão" code={`[System.Management.Automation.CompletionResult]::new(
    'valor-inserido',     # 1. CompletionText: vai pra linha de comando
    'Texto Exibido',      # 2. ListItemText:    aparece no menu
    'ParameterValue',     # 3. ResultType:      categoria (afeta ícone)
    'Tooltip ao hover'    # 4. ToolTip:         info detalhada
)

# Tipos comuns:
# Command, ParameterName, ParameterValue, Property, Method,
# Variable, Namespace, Type, Keyword, EnumValue, History`} />

      <h2>Fakebound parameters — completer contextual</h2>
      <CodeBlock title="Completar 'Database' baseado no 'Server' já passado" code={`Register-ArgumentCompleter -CommandName Invoke-Sqlcmd -ParameterName 'Database' \`
    -ScriptBlock {
        param($cmd, $param, $word, $ast, $bound)

        $servidor = $bound['ServerInstance']
        if (-not $servidor) { return }   # Sem servidor, sem sugestão

        try {
            Invoke-Sqlcmd -ServerInstance $servidor -Query "SELECT name FROM sys.databases" -ErrorAction Stop |
                Where-Object name -like "$word*" |
                ForEach-Object {
                    [System.Management.Automation.CompletionResult]::new(
                        $_.name, $_.name, 'ParameterValue', "DB em $servidor"
                    )
                }
        } catch { }
    }`} />

      <h2>Listar e remover completers</h2>
      <CodeBlock title="Inspeção e limpeza" code={`# Listar todos os custom completers registrados
$ExecutionContext.InvokeProvider.Item.Get('function:tabexpansion2', $true) |
    Out-Null

# Forma prática: usar Get-PSReadLineKeyHandler para ver o que TAB faz
Get-PSReadLineKeyHandler -Chord Tab

# Remover completer (recarregando módulo onde foi definido)
Remove-Module NomeDoModulo -Force
Import-Module NomeDoModulo

# Resetar TabExpansion2 inteiro (volta ao default)
Remove-Item Function:TabExpansion2 -ErrorAction SilentlyContinue`} />

      <h2>Onde colocar — perfil ou módulo</h2>
      <CodeBlock title="Estratégias" code={`# 1. No $PROFILE — ativa em toda sessão
notepad $PROFILE
# Adicione blocos Register-ArgumentCompleter

# 2. Em um módulo (.psm1) — distribuível
# MeusCompleters.psm1
function Register-MeusCompleters {
    Register-ArgumentCompleter -CommandName Set-AmbienteAtivo -ParameterName Ambiente -ScriptBlock { ... }
    Register-ArgumentCompleter -CommandName Deploy-App -ParameterName ConfigFile -ScriptBlock { ... }
}
Register-MeusCompleters

# Export-ModuleMember -Function Register-MeusCompleters

# 3. Auto-import via PSModulePath
# Coloque o módulo em $env:PSModulePath e ele carrega sob demanda`} />

      <AlertBox type="warning" title="Performance — completer NÃO pode ser lento">
        <p>
          Toda vez que o usuário aperta <kbd>Tab</kbd>, o scriptblock roda. Se
          ele leva 2 segundos (chamada HTTP, query SQL pesada), o terminal
          trava. Faça cache:
        </p>
        <CodeBlock language="powershell" code={`$script:vmCache = $null
$script:vmCacheExpira = [datetime]::MinValue

Register-ArgumentCompleter -CommandName Start-AzVM -ParameterName Name -ScriptBlock {
    param($c, $p, $w, $a, $b)
    if ([datetime]::Now -gt $script:vmCacheExpira) {
        $script:vmCache = (Get-AzVM).Name
        $script:vmCacheExpira = [datetime]::Now.AddMinutes(5)
    }
    $script:vmCache | Where-Object { $_ -like "$w*" }
}`} />
      </AlertBox>

      <h2>Cheat — qual escolher?</h2>
      <CodeBlock title="Decisão rápida" code={`# Lista FIXA conhecida em design time   → [ValidateSet('a','b','c')]
# Lista FIXA mas aceita outros           → [ArgumentCompletions('a','b','c')]
# Lista DINÂMICA mas valida              → class : IValidateSetValuesGenerator
# Lista DINÂMICA com tooltip + cache     → Register-ArgumentCompleter
# Completar EXECUTÁVEL externo (git/az)  → Register-ArgumentCompleter -Native`} />

      <AlertBox type="success" title="Resumão">
        <p>
          Argument completers transformam o terminal de "decorar nomes" em
          "explorar opções". Comece com <code>ValidateSet</code> nas suas
          funções, evolua para <code>Register-ArgumentCompleter</code> quando o
          conjunto de valores depende do estado do sistema. Em poucas semanas
          você não usa mais Get-Help para descobrir argumentos.
        </p>
      </AlertBox>
    </PageContainer>
  );
}
