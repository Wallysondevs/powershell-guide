import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Funções e Scripts Avançados`,subtitle:`Criando comandos reutilizáveis, modulares e profissionais.`,difficulty:`intermediario`,timeToRead:`25 min`,children:[(0,i.jsx)(`p`,{children:`Funções são os blocos fundamentais de construção no PowerShell. Elas permitem encapsular lógica complexa em comandos simples e nomeados. Quando você adiciona funcionalidades avançadas como suporte ao pipeline e validação de parâmetros, suas funções passam a se comportar exatamente como os cmdlets nativos do sistema.`}),(0,i.jsx)(`h2`,{children:`Anatomia de uma Função Básica`}),(0,i.jsxs)(`p`,{children:[`Uma função simples consiste na palavra-chave `,(0,i.jsx)(`code`,{children:`function`}),`, um nome (preferencialmente no formato Verbo-Substantivo) e um bloco de código.`]}),(0,i.jsx)(t,{title:`Função simples`,code:`function Get-Saudacao {
    param($Nome)
    return "Olá, $Nome! Bem-vindo ao PowerShell."
}

# Chamando a função
Get-Saudacao -Nome "Usuário"
`}),(0,i.jsx)(`h2`,{children:`O Bloco Param e Tipagem`}),(0,i.jsxs)(`p`,{children:[`Para scripts profissionais, você deve sempre usar o bloco `,(0,i.jsx)(`code`,{children:`param()`}),`. Isso permite definir tipos, valores padrão e metadados para seus parâmetros.`]}),(0,i.jsx)(t,{title:`Parâmetros tipados e obrigatórios`,code:`function New-UserFolder {
    param(
        [Parameter(Mandatory=$true)]
        [string]$UserName,

        [int]$QuotaGB = 5, # Valor padrão

        [ValidateSet("Projetos", "Documentos", "Backup")]
        [string]$FolderType = "Documentos"
    )

    $path = "C:\\Users\\$UserName\\$FolderType"
    Write-Host "Criando pasta em $path com limite de $QuotaGB GB"
}
`}),(0,i.jsx)(`h2`,{children:`Advanced Functions (CmdletBinding)`}),(0,i.jsxs)(`p`,{children:[`Ao adicionar o atributo `,(0,i.jsx)(`code`,{children:`[CmdletBinding()]`}),`, sua função ganha superpoderes: suporte a `,(0,i.jsx)(`code`,{children:`-Verbose`}),`, `,(0,i.jsx)(`code`,{children:`-Debug`}),`, `,(0,i.jsx)(`code`,{children:`-WhatIf`}),` e `,(0,i.jsx)(`code`,{children:`-Confirm`}),` automaticamente.`]}),(0,i.jsx)(t,{title:`Função avançada com suporte a Verbose`,code:`function Remove-OldLogs {
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [int]$Days = 30
    )

    Write-Verbose "Iniciando busca por logs mais antigos que $Days dias..."
    
    # O SupportsShouldProcess habilita o -WhatIf
    if ($PSCmdlet.ShouldProcess("C:\\Logs", "Remover arquivos antigos")) {
        # Lógica de remoção aqui
        Write-Host "Arquivos removidos com sucesso."
    }
}

# Executando com Verbose para ver as mensagens ocultas
# Remove-OldLogs -Days 10 -Verbose

# Executando com WhatIf para testar sem deletar nada
# Remove-OldLogs -Days 10 -WhatIf
`}),(0,i.jsx)(`h2`,{children:`Aceitando Entrada do Pipeline`}),(0,i.jsxs)(`p`,{children:[`Para que sua função aceite objetos vindos de outros comandos via `,(0,i.jsx)(`code`,{children:`|`}),`, você precisa configurar o parâmetro para aceitar entrada do pipeline e usar os blocos `,(0,i.jsx)(`code`,{children:`begin`}),`, `,(0,i.jsx)(`code`,{children:`process`}),` e `,(0,i.jsx)(`code`,{children:`end`}),`.`]}),(0,i.jsx)(t,{title:`Função que processa o Pipeline`,code:`function ConvertTo-Uppercase {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string[]]$InputString
    )

    begin {
        Write-Verbose "Iniciando conversão..."
    }
    process {
        # O bloco process executa uma vez para CADA item no pipeline
        foreach ($line in $InputString) {
            $line.ToUpper()
        }
    }
    end {
        Write-Verbose "Conversão finalizada."
    }
}

# Uso:
"oi", "mundo" | ConvertTo-Uppercase
`}),(0,i.jsxs)(n,{type:`info`,title:`A Importância do Process`,children:[`Sem o bloco `,(0,i.jsx)(`code`,{children:`process`}),`, sua função só processará o último item enviado pelo pipeline. Sempre use `,(0,i.jsxs)(`code`,{children:[`process `,`{ ... }`]}),` quando sua função for projetada para receber dados via pipe.`]}),(0,i.jsx)(`h2`,{children:`Atributos de Validação`}),(0,i.jsx)(`p`,{children:`Evite erros no meio da execução validando os dados assim que eles entram na função.`}),(0,i.jsx)(t,{title:`Exemplos de validação de parâmetros`,code:`param(
    # Garante que o número está entre 1 e 100
    [ValidateRange(1, 100)]
    [int]$Percentual,

    # Garante que a string segue um padrão (Regex)
    [ValidatePattern('^\\d{5}-\\d{3}$')]
    [string]$CEP,

    # Garante que a string não é vazia ou nula
    [ValidateNotNullOrEmpty()]
    [string]$Servidor,

    # Validação via script customizado (deve retornar true/false)
    [ValidateScript({ Test-Path $_ })]
    [string]$CaminhoArquivo
)
`}),(0,i.jsx)(`h2`,{children:`Escopo de Variáveis`}),(0,i.jsxs)(`p`,{children:[`Por padrão, variáveis criadas dentro de uma função são locais a ela. Para alterar variáveis fora, você deve entender os escopos: `,(0,i.jsx)(`code`,{children:`Global:`}),`, `,(0,i.jsx)(`code`,{children:`Script:`}),` e `,(0,i.jsx)(`code`,{children:`Local:`}),`.`]}),(0,i.jsx)(t,{title:`Entendendo escopos`,code:`$GlobalVar = "Original"

function Test-Scope {
    $LocalVar = "Interna" # Só existe aqui
    $Global:GlobalVar = "Alterada Globalmente" # Altera a variável lá fora
}

Test-Scope
Write-Host $GlobalVar # Resultado: Alterada Globalmente
`}),(0,i.jsx)(`h2`,{children:`Retornando Valores vs Write-Output`}),(0,i.jsxs)(`p`,{children:[`No PowerShell, qualquer dado "solto" no código da função é enviado para o pipeline de saída. A palavra-chave `,(0,i.jsx)(`code`,{children:`return`}),` envia o dado e sai da função imediatamente.`]}),(0,i.jsx)(t,{title:`Saída de dados`,code:`function Get-Numbers {
    # Ambas as linhas abaixo enviam dados para quem chamou
    Write-Output 10
    20
    
    return 30 # Envia 30 e PARA a execução da função aqui
    40 # Isso nunca será executado
}

$resultado = Get-Numbers # $resultado será um array [10, 20, 30]
`}),(0,i.jsxs)(n,{type:`warning`,title:`Cuidado com Lixo na Saída`,children:[`Evite usar `,(0,i.jsx)(`code`,{children:`Write-Host`}),` dentro de funções que devem retornar dados, pois o `,(0,i.jsx)(`code`,{children:`Write-Host`}),` escreve direto no console e não pode ser capturado por variáveis ou passado pelo pipeline. Use `,(0,i.jsx)(`code`,{children:`Write-Output`}),` ou apenas deixe o objeto solto.`]}),(0,i.jsx)(`h2`,{children:`Documentando com Comment-Based Help`}),(0,i.jsxs)(`p`,{children:[`Adicione ajuda nativa às suas funções para que outros usuários (ou você no futuro) possam usar `,(0,i.jsx)(`code`,{children:`Get-Help Sua-Funcao`}),`.`]}),(0,i.jsx)(t,{title:`Ajuda baseada em comentários`,code:`function Test-NetworkPort {
    <#
    .SYNOPSIS
        Testa se uma porta TCP está aberta em um host remoto.
    .DESCRIPTION
        Uma versão simplificada do Test-NetConnection focada apenas em portas TCP.
    .PARAMETER ComputerName
        O nome ou IP do computador remoto.
    .PARAMETER Port
        O número da porta TCP.
    .EXAMPLE
        Test-NetworkPort -ComputerName "google.com" -Port 80
    #>
    param($ComputerName, $Port)
    # Lógica...
}
`})]})}export{a as default};