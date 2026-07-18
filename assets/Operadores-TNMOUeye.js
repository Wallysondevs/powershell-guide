import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Operadores no PowerShell`,subtitle:`Domine os operadores aritméticos, de comparação, lógicos e de manipulação de strings.`,difficulty:`iniciante`,timeToRead:`25 min`,children:[(0,i.jsxs)(`p`,{children:[`Operadores são símbolos ou palavras-chave que permitem realizar ações sobre dados. O PowerShell possui uma sintaxe de operadores única (como `,(0,i.jsx)(`code`,{children:`-eq`}),` em vez de `,(0,i.jsx)(`code`,{children:`==`}),`), que facilita o uso em linhas de comando e scripts.`]}),(0,i.jsx)(`h2`,{children:`Operadores Aritméticos`}),(0,i.jsx)(`p`,{children:`Usados para realizar cálculos matemáticos padrão. O PowerShell segue a ordem de precedência matemática.`}),(0,i.jsx)(t,{title:`Matemática básica`,code:`# Soma, Subtração, Multiplicação, Divisão e Módulo
5 + 5          # 10
10 - 2         # 8
4 * 3          # 12
20 / 4         # 5
10 % 3         # 1 (resto da divisão)

# Operações com strings e arrays
"Power" + "Shell"  # Concatenação: "PowerShell"
"abc " * 3         # Repetição: "abc abc abc "
@(1,2) + @(3,4)    # Junção de arrays: 1, 2, 3, 4
`}),(0,i.jsx)(`h2`,{children:`Operadores de Comparação`}),(0,i.jsxs)(`p`,{children:[`Estes são fundamentais para lógica de decisão. Por padrão, eles `,(0,i.jsx)(`b`,{children:`não`}),` diferenciam maiúsculas de minúsculas.`]}),(0,i.jsx)(t,{title:`Comparando valores`,code:`# Igualdade e Diferença
"teste" -eq "TESTE"  # True (Case-insensitive)
5 -ne 10             # True

# Maior e Menor
10 -gt 5             # True (Greater Than)
10 -ge 10            # True (Greater or Equal)
3 -lt 7              # True (Less Than)
5 -le 5              # True (Less or Equal)

# Diferenciando maiúsculas/minúsculas (prefixo 'c')
"A" -ceq "a"         # False (Case-sensitive equal)
"A" -ieq "a"         # True (Explicitly case-insensitive)
`}),(0,i.jsxs)(n,{type:`info`,title:`Operadores de Coleção`,children:[`Quando usados com uma coleção (como um array) à esquerda, os operadores de comparação filtram os elementos em vez de retornar apenas True/False.`,(0,i.jsx)(`code`,{children:`1,2,3,4 -gt 2`}),` retornará `,(0,i.jsx)(`code`,{children:`3, 4`}),`.`]}),(0,i.jsx)(`h2`,{children:`Operadores de Texto e Correspondência`}),(0,i.jsx)(`p`,{children:`O PowerShell oferece ferramentas poderosas para buscar e manipular padrões de texto.`}),(0,i.jsx)(t,{title:`Wildcards e Regex`,code:`# -like: Usa curingas (* e ?)
"Log_2023.txt" -like "Log_*.txt"  # True
"abc" -like "a??"                # True

# -match: Usa Expressões Regulares (Regex)
"123-456" -match "\\d{3}-\\d{3}"    # True
$Matches[0]                        # Contém o valor capturado

# -replace: Substituição de texto
"Olá Mundo" -replace "Mundo", "PowerShell"
"123-456" -replace "\\d", "*"       # "***-***"
`}),(0,i.jsx)(`h2`,{children:`Operadores Lógicos`}),(0,i.jsx)(`p`,{children:`Usados para combinar múltiplas condições booleanas.`}),(0,i.jsx)(t,{title:`E, Ou, Não`,code:`# AND: Verdadeiro se ambos forem verdadeiros
(5 -lt 10) -and (2 -gt 1)

# OR: Verdadeiro se pelo menos um for verdadeiro
$true -or $false

# NOT: Inverte o valor booleano
-not $true    # False
! $true       # False (Abreviação)

# XOR: Verdadeiro se apenas um for verdadeiro
$true -xor $true  # False
`}),(0,i.jsx)(`h2`,{children:`Operadores de Tipo`}),(0,i.jsx)(`p`,{children:`Verificam ou alteram o tipo de um objeto.`}),(0,i.jsx)(t,{title:`Checando tipos`,code:`# -is: Verifica se é de um tipo
$valor = 10
$valor -is [int]     # True
$valor -is [string]  # False

# -as: Tenta converter (retorna $null se falhar em vez de erro)
"123" -as [int]      # 123
"texto" -as [int]    # $null
`}),(0,i.jsx)(`h2`,{children:`Operadores Modernos (PowerShell 7+)`}),(0,i.jsx)(`p`,{children:`Versões recentes do PowerShell adicionaram operadores comuns em linguagens como C# e JavaScript.`}),(0,i.jsx)(t,{title:`Ternário e Coalescência`,code:`# Ternário: condicao ? valor_se_true : valor_se_false
$status = (2 -gt 1) ? "Maior" : "Menor"

# Coalescência de Nulo (??): Retorna o primeiro valor se não for nulo
$config = $null ?? "Padrao"  # "Padrao"

# Atribuição de Coalescência (??=)
$x ??= 10  # Atribui 10 apenas se $x for nulo
`}),(0,i.jsxs)(n,{type:`warning`,title:`Compatibilidade`,children:[`Os operadores Ternário (`,(0,i.jsx)(`code`,{children:`?:`}),`) e Coalescência Nula (`,(0,i.jsx)(`code`,{children:`??`}),`) só funcionam no PowerShell Core 7.0 ou superior. Eles causarão erro no Windows PowerShell 5.1.`]}),(0,i.jsx)(`h2`,{children:`Operadores de Atribuição`}),(0,i.jsx)(`p`,{children:`Modificam o valor de uma variável de forma abreviada.`}),(0,i.jsx)(t,{title:`Atribuição composta`,code:`$n = 10
$n += 5   # $n agora é 15
$n -= 2   # $n agora é 13
$n *= 2   # $n agora é 26
$n /= 2   # $n agora é 13

# Incremento e Decremento
$n++
$n--
`})]})}export{a as default};