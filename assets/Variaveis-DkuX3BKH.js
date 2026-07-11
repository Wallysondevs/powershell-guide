import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Variáveis no PowerShell`,subtitle:`Entenda como armazenar e manipular dados usando variáveis, tipos e escopos.`,difficulty:`iniciante`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`No PowerShell, uma variável é uma unidade de memória na qual você pode armazenar dados. Diferente de muitas linguagens de programação tradicionais, as variáveis no PowerShell podem armazenar objetos completos, não apenas texto ou números simples. Todas as variáveis começam com o caractere especial `,(0,i.jsx)(`code`,{children:`$`}),`.`]}),(0,i.jsx)(`h2`,{children:`Declaração Básica`}),(0,i.jsxs)(`p`,{children:[`Para criar uma variável, basta digitar o nome precedido por `,(0,i.jsx)(`code`,{children:`$`}),` e atribuir um valor usando o operador de atribuição (`,(0,i.jsx)(`code`,{children:`=`}),`).`]}),(0,i.jsx)(t,{title:`Exemplos de atribuição simples`,code:`# Armazenando uma string
$nome = "PowerShell"

# Armazenando um número inteiro
$versao = 7

# Armazenando o resultado de um comando (objeto)
$processos = Get-Process

# Exibindo o conteúdo
$nome
$versao
`}),(0,i.jsxs)(n,{type:`info`,title:`Sensibilidade a maiúsculas`,children:[`O PowerShell não diferencia maiúsculas de minúsculas (case-insensitive) para nomes de variáveis.`,(0,i.jsx)(`code`,{children:`$Nome`}),` e `,(0,i.jsx)(`code`,{children:`$nome`}),` referem-se à mesma variável.`]}),(0,i.jsx)(`h2`,{children:`Tipos de Dados e Tipagem`}),(0,i.jsx)(`p`,{children:`O PowerShell é uma linguagem dinamicamente tipada por padrão, o que significa que ele tenta adivinhar o tipo de dado automaticamente. No entanto, você pode forçar um tipo específico usando "Type Casting".`}),(0,i.jsx)(t,{title:`Trabalhando com tipos de dados`,code:`# Tipagem dinâmica (automática)
$valor = 10         # System.Int32
$valor = "Dez"      # System.String

# Type Casting (Forçando o tipo)
[int]$numero = "10" # Converte a string "10" para o inteiro 10
[bool]$ligado = 1    # Converte 1 para True

# Aceleradores de tipo comuns
# [string], [int], [double], [bool], [array], [hashtable], [datetime], [xml]

# Verificando o tipo de uma variável
$numero.GetType().FullName
`}),(0,i.jsx)(`h2`,{children:`Variáveis Automáticas`}),(0,i.jsx)(`p`,{children:`O PowerShell reserva algumas variáveis para fins específicos. Estas são criadas e mantidas pelo próprio motor do PowerShell.`}),(0,i.jsx)(t,{title:`Variáveis de sistema importantes`,code:`# $_ ou $PSItem: Representa o objeto atual no pipeline
1..5 | ForEach-Object { $_ * 2 }

# $args: Array de argumentos passados para uma função/script não nomeados
# $Error: Array que contém os erros mais recentes ( $Error[0] é o último )
# $LastExitCode: O código de saída do último programa executado (útil para apps .exe)
# $ExecutionContext: Informações sobre o ambiente de execução

# Variáveis Booleanas
$true   # Representa verdadeiro
$false  # Representa falso
$null   # Representa um valor nulo ou vazio
`}),(0,i.jsxs)(n,{type:`warning`,title:`Dica de Comparação com $null`,children:[`Ao comparar variáveis com $null, coloque sempre o $null à esquerda:`,(0,i.jsx)(`code`,{children:`if ($null -eq $variavel)`}),`. Isso evita comportamentos inesperados ao lidar com coleções/arrays.`]}),(0,i.jsx)(`h2`,{children:`Variáveis de Ambiente`}),(0,i.jsxs)(`p`,{children:[`Você pode acessar variáveis de ambiente do sistema operacional (como PATH ou USERNAME) usando o drive `,(0,i.jsx)(`code`,{children:`env:`}),`.`]}),(0,i.jsx)(t,{title:`Acessando o ambiente`,code:`# Listar todas as variáveis de ambiente
Get-ChildItem env:

# Acessar uma variável específica
$env:COMPUTERNAME
$env:USERPROFILE

# Criar ou modificar uma variável de ambiente (apenas para a sessão atual)
$env:MINHA_VAR = "AlgumValor"
`}),(0,i.jsx)(`h2`,{children:`Escopo de Variáveis`}),(0,i.jsx)(`p`,{children:`O escopo determina onde uma variável pode ser lida ou alterada. Os escopos principais são: Global, Local, Script e Private.`}),(0,i.jsx)(t,{title:`Exemplos de escopo`,code:`# Escopo Global: Disponível em toda a sessão atual
$global:configuracao = "Geral"

# Escopo de Script: Disponível apenas dentro do arquivo .ps1 atual
$script:interna = 123

# Escopo Local: Padrão dentro de funções ou no contexto atual
$valorLocal = "Oi"

# Usando o modificador 'using' para passar variáveis para sessões remotas ou jobs
$x = 10
Start-Job -ScriptBlock { $using:x + 5 } | Receive-Job -Wait
`}),(0,i.jsx)(`h2`,{children:`Cmdlets de Gerenciamento`}),(0,i.jsxs)(`p`,{children:[`Embora o uso de `,(0,i.jsx)(`code`,{children:`$var = valor`}),` seja o mais comum, existem cmdlets que oferecem mais controle, como a criação de constantes ou variáveis somente leitura.`]}),(0,i.jsx)(t,{title:`Controle avançado de variáveis`,code:`# Criar uma constante (não pode ser alterada nem removida na sessão)
Set-Variable -Name PI -Value 3.14159 -Option Constant

# Criar uma variável somente leitura (pode ser removida com -Force)
Set-Variable -Name VersaoApp -Value "1.0.0" -Option ReadOnly

# Obter informações sobre uma variável
Get-Variable -Name PI

# Remover uma variável
Remove-Variable -Name valorLocal
`}),(0,i.jsxs)(n,{type:`danger`,title:`Cuidado com Constantes`,children:[`Variáveis definidas com a opção `,(0,i.jsx)(`code`,{children:`Constant`}),` não podem ser alteradas ou removidas até que a sessão do PowerShell seja fechada. Use com parcimônia.`]})]})}export{a as default};