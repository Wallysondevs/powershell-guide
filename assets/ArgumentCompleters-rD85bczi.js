import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Argument Completers — Tab inteligente`,subtitle:`Register-ArgumentCompleter, ValidateSet dinâmico e ArgumentCompletions: complete parâmetros com valores reais (nomes de VMs, branches do git, conexões do RM).`,difficulty:`avancado`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[(0,i.jsx)(`strong`,{children:`Argument completer`}),` é uma função que o PowerShell chama quando você aperta `,(0,i.jsx)(`kbd`,{children:`Tab`}),` sobre o valor de um parâmetro. Em vez de adivinhar, ele oferece `,(0,i.jsx)(`strong`,{children:`os valores que fazem sentido naquele contexto`}),` — nomes de subscriptions Azure ativas, services rodando, branches do repositório atual, etc.`]}),(0,i.jsx)(n,{type:`info`,title:`Três níveis, do simples ao poderoso`,children:(0,i.jsxs)(`ol`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`[ValidateSet(...)]`}),` — lista estática conhecida em design time.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`[ArgumentCompletions(...)]`}),` — sugere mas aceita outros valores (PS 6+).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`code`,{children:`Register-ArgumentCompleter`}),` — função dinâmica que roda no momento do Tab.`]})]})}),(0,i.jsx)(`h2`,{children:`Nível 1 — ValidateSet (estático e validado)`}),(0,i.jsx)(t,{title:`Restringe E completa`,code:`function Set-AmbienteAtivo {
    param(
        [ValidateSet('dev', 'staging', 'prod')]
        [string]$Ambiente
    )
    $env:APP_ENV = $Ambiente
    "Ambiente alterado para: $Ambiente"
}

# Tab cicla entre dev/staging/prod, valor fora da lista dispara erro`}),(0,i.jsx)(`h2`,{children:`Nível 2 — ArgumentCompletions (sugere, não restringe)`}),(0,i.jsx)(t,{title:`Sugere comuns mas aceita customizados`,code:`function New-Projeto {
    param(
        [ArgumentCompletions('node', 'python', 'dotnet', 'java', 'rust', 'go')]
        [string]$Stack
    )
    "Bootstrapping projeto $Stack..."
}

# Tab → mostra opções, mas você pode digitar 'cobol' e funciona`}),(0,i.jsx)(`h2`,{children:`Nível 3 — ValidateSet dinâmico via classe`}),(0,i.jsxs)(`p`,{children:[`Quando a lista de valores válidos depende de algo em runtime (arquivos existentes, pastas, conexões), use uma classe que estende`,(0,i.jsx)(`code`,{children:`IValidateSetValuesGenerator`}),`:`]}),(0,i.jsx)(t,{title:`Lista vem de runtime, ainda valida`,code:`class NomesDeBranches : System.Management.Automation.IValidateSetValuesGenerator {
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

# Tab → lista branches reais do repositório atual`}),(0,i.jsx)(`h2`,{children:`Nível 4 — Register-ArgumentCompleter (poder total)`}),(0,i.jsx)(`p`,{children:`Permite completar parâmetros de cmdlets de TERCEIROS sem alterá-los, e ter acesso ao contexto completo do que o usuário já digitou.`}),(0,i.jsx)(t,{title:`Anatomia de um completer`,code:`Register-ArgumentCompleter -CommandName 'Get-Service' -ParameterName 'Name' -ScriptBlock {
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

# Agora: Get-Service -Name <Tab> mostra apenas serviços REAIS, com status`}),(0,i.jsx)(`h2`,{children:`Caso prático 1 — Completer para nomes de Azure VM`}),(0,i.jsx)(t,{title:`Tab inteligente em chamadas Az`,code:`Register-ArgumentCompleter -CommandName Start-AzVM, Stop-AzVM, Restart-AzVM \`
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
    }`}),(0,i.jsx)(`h2`,{children:`Caso prático 2 — Completer para arquivos de config locais`}),(0,i.jsx)(t,{title:`Sugere arquivos .json/.yaml em ./configs/`,code:`Register-ArgumentCompleter -CommandName Deploy-App -ParameterName 'ConfigFile' \`
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
    }`}),(0,i.jsx)(`h2`,{children:`Caso prático 3 — Completer para nativos (git, docker, kubectl)`}),(0,i.jsxs)(`p`,{children:[`Use `,(0,i.jsx)(`code`,{children:`-Native`}),` para completar argumentos de executáveis fora do PowerShell. Não tem parameter binding, então você inspeciona o AST manualmente:`]}),(0,i.jsx)(t,{title:`Tab para subcomandos do git`,code:`Register-ArgumentCompleter -Native -CommandName git -ScriptBlock {
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
}`}),(0,i.jsxs)(n,{type:`tip`,title:`Já existe pronto: posh-git, DockerCompletion, etc.`,children:[(0,i.jsx)(`p`,{children:`Para git, docker, kubectl, az, gh, npm, terraform: instale módulos prontos em vez de reinventar.`}),(0,i.jsx)(t,{language:`powershell`,code:`Install-Module posh-git -Scope CurrentUser
Install-Module DockerCompletion
Install-Module PSKubectlCompletion
Import-Module posh-git    # adicione no $PROFILE`})]}),(0,i.jsx)(`h2`,{children:`CompletionResult — os 4 argumentos`}),(0,i.jsx)(t,{title:`Anatomia da sugestão`,code:`[System.Management.Automation.CompletionResult]::new(
    'valor-inserido',     # 1. CompletionText: vai pra linha de comando
    'Texto Exibido',      # 2. ListItemText:    aparece no menu
    'ParameterValue',     # 3. ResultType:      categoria (afeta ícone)
    'Tooltip ao hover'    # 4. ToolTip:         info detalhada
)

# Tipos comuns:
# Command, ParameterName, ParameterValue, Property, Method,
# Variable, Namespace, Type, Keyword, EnumValue, History`}),(0,i.jsx)(`h2`,{children:`Fakebound parameters — completer contextual`}),(0,i.jsx)(t,{title:`Completar 'Database' baseado no 'Server' já passado`,code:`Register-ArgumentCompleter -CommandName Invoke-Sqlcmd -ParameterName 'Database' \`
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
    }`}),(0,i.jsx)(`h2`,{children:`Listar e remover completers`}),(0,i.jsx)(t,{title:`Inspeção e limpeza`,code:`# Listar todos os custom completers registrados
$ExecutionContext.InvokeProvider.Item.Get('function:tabexpansion2', $true) |
    Out-Null

# Forma prática: usar Get-PSReadLineKeyHandler para ver o que TAB faz
Get-PSReadLineKeyHandler -Chord Tab

# Remover completer (recarregando módulo onde foi definido)
Remove-Module NomeDoModulo -Force
Import-Module NomeDoModulo

# Resetar TabExpansion2 inteiro (volta ao default)
Remove-Item Function:TabExpansion2 -ErrorAction SilentlyContinue`}),(0,i.jsx)(`h2`,{children:`Onde colocar — perfil ou módulo`}),(0,i.jsx)(t,{title:`Estratégias`,code:`# 1. No $PROFILE — ativa em toda sessão
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
# Coloque o módulo em $env:PSModulePath e ele carrega sob demanda`}),(0,i.jsxs)(n,{type:`warning`,title:`Performance — completer NÃO pode ser lento`,children:[(0,i.jsxs)(`p`,{children:[`Toda vez que o usuário aperta `,(0,i.jsx)(`kbd`,{children:`Tab`}),`, o scriptblock roda. Se ele leva 2 segundos (chamada HTTP, query SQL pesada), o terminal trava. Faça cache:`]}),(0,i.jsx)(t,{language:`powershell`,code:`$script:vmCache = $null
$script:vmCacheExpira = [datetime]::MinValue

Register-ArgumentCompleter -CommandName Start-AzVM -ParameterName Name -ScriptBlock {
    param($c, $p, $w, $a, $b)
    if ([datetime]::Now -gt $script:vmCacheExpira) {
        $script:vmCache = (Get-AzVM).Name
        $script:vmCacheExpira = [datetime]::Now.AddMinutes(5)
    }
    $script:vmCache | Where-Object { $_ -like "$w*" }
}`})]}),(0,i.jsx)(`h2`,{children:`Cheat — qual escolher?`}),(0,i.jsx)(t,{title:`Decisão rápida`,code:`# Lista FIXA conhecida em design time   → [ValidateSet('a','b','c')]
# Lista FIXA mas aceita outros           → [ArgumentCompletions('a','b','c')]
# Lista DINÂMICA mas valida              → class : IValidateSetValuesGenerator
# Lista DINÂMICA com tooltip + cache     → Register-ArgumentCompleter
# Completar EXECUTÁVEL externo (git/az)  → Register-ArgumentCompleter -Native`}),(0,i.jsx)(n,{type:`success`,title:`Resumão`,children:(0,i.jsxs)(`p`,{children:[`Argument completers transformam o terminal de "decorar nomes" em "explorar opções". Comece com `,(0,i.jsx)(`code`,{children:`ValidateSet`}),` nas suas funções, evolua para `,(0,i.jsx)(`code`,{children:`Register-ArgumentCompleter`}),` quando o conjunto de valores depende do estado do sistema. Em poucas semanas você não usa mais Get-Help para descobrir argumentos.`]})})]})}export{a as default};