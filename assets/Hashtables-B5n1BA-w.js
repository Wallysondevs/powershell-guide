import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Hashtables (Dicionários)`,subtitle:`Aprenda a organizar dados usando pares de Chave-Valor e objetos personalizados.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`Uma Hashtable (ou tabela de hash) é uma estrutura de dados que armazena pares de`,(0,i.jsx)(`b`,{children:`Chave`}),` e `,(0,i.jsx)(`b`,{children:`Valor`}),`. No PowerShell, elas são extremamente versáteis, sendo usadas para tudo, desde configurações simples até a passagem de parâmetros complexos para cmdlets (Splatting).`]}),(0,i.jsx)(`h2`,{children:`Criação de Hashtables`}),(0,i.jsxs)(`p`,{children:[`Diferente de arrays que usam `,(0,i.jsx)(`code`,{children:`@()`}),`, hashtables usam `,(0,i.jsx)(`code`,{children:`@{}`}),`.`]}),(0,i.jsx)(t,{title:`Declarando chaves e valores`,code:`# Hashtable simples
$usuario = @{
    ID = 1
    Nome = "Cassiano"
    Ativo = $true
}

# Hashtable em uma única linha
$config = @{ Cor = "Azul"; Fonte = "Consolas" }

# Hashtable Ordenada (Mantém a ordem em que os itens foram criados)
$ordenada = [ordered]@{
    Primeiro = 1
    Segundo = 2
    Terceiro = 3
}
`}),(0,i.jsxs)(n,{type:`info`,title:`Hashtables vs [ordered]`,children:[`Por padrão, Hashtables normais não garantem a ordem dos elementos. Se a ordem de exibição ou iteração for importante, use sempre o acelerador de tipo `,(0,i.jsx)(`code`,{children:`[ordered]`}),`.`]}),(0,i.jsx)(`h2`,{children:`Acessando e Modificando Valores`}),(0,i.jsx)(`p`,{children:`Você pode acessar os dados usando a notação de ponto ou colchetes.`}),(0,i.jsx)(t,{title:`Manipulação de dados`,code:`$carro = @{ Marca = "Ford"; Modelo = "Focus" }

# Leitura
$carro.Marca          # "Ford"
$carro["Modelo"]      # "Focus"

# Adição e Alteração
$carro.Ano = 2019     # Adiciona nova chave
$carro.Modelo = "Ka"  # Altera valor existente
$carro.Add("Cor", "Prata") # Método formal

# Remoção
$carro.Remove("Ano")
`}),(0,i.jsx)(`h2`,{children:`Iteração (Loops)`}),(0,i.jsx)(`p`,{children:`Para percorrer uma hashtable, você precisa iterar sobre suas chaves ou usar o enumerador.`}),(0,i.jsx)(t,{title:`Percorrendo o dicionário`,code:`$precos = @{ Arroz = 20; Feijao = 10; Macarrao = 5 }

# Iterando pelas Chaves
foreach ($item in $precos.Keys) {
    "O preço de $item é $($precos[$item])"
}

# Usando GetEnumerator (mais performático para objetos grandes)
$precos.GetEnumerator() | ForEach-Object {
    $_.Key
    $_.Value
}
`}),(0,i.jsx)(`h2`,{children:`Splatting: O Superpoder das Hashtables`}),(0,i.jsx)(`p`,{children:`Splatting é uma técnica para passar um conjunto de parâmetros para um comando usando uma única variável. Isso torna os scripts muito mais legíveis.`}),(0,i.jsx)(t,{title:`Melhorando a legibilidade com Splatting`,code:`# Sem Splatting (Linha muito longa e difícil de ler)
Copy-Item -Path "C:\\Fonte\\file.txt" -Destination "D:\\Backup" -Force -Recurse -Verbose

# Com Splatting
$copiaParams = @{
    Path        = "C:\\Fonte\\file.txt"
    Destination = "D:\\Backup"
    Force       = $true
    Recurse     = $true
    Verbose     = $true
}

# Note o uso do '@' em vez de '$' ao chamar o comando
Copy-Item @copiaParams
`}),(0,i.jsx)(`h2`,{children:`PSCustomObject`}),(0,i.jsxs)(`p`,{children:[`Muitas vezes você quer uma hashtable que se comporte mais como um objeto real (com colunas em uma tabela). Para isso, convertemos a hashtable em um `,(0,i.jsx)(`code`,{children:`PSCustomObject`}),`.`]}),(0,i.jsx)(t,{title:`Criando objetos personalizados`,code:`$obj = [PSCustomObject]@{
    Servidor = "Srv-01"
    IP       = "192.168.1.10"
    Status   = "Online"
}

# Agora ele se comporta como um objeto do PowerShell
$obj | Select-Object Servidor, Status
$obj | Format-Table
`}),(0,i.jsxs)(n,{type:`success`,title:`Dica: JSON`,children:[`Hashtables e PSCustomObjects podem ser facilmente convertidos para JSON e vice-versa, o que é excelente para APIs e arquivos de configuração.`,(0,i.jsx)(`br`,{}),(0,i.jsx)(`code`,{children:`$obj | ConvertTo-Json`})]}),(0,i.jsx)(`h2`,{children:`Propriedades e Métodos Úteis`}),(0,i.jsx)(t,{title:`Exploração`,code:`$ht = @{ A = 1; B = 2 }

$ht.Count            # Quantidade de pares
$ht.ContainsKey("A") # True
$ht.ContainsValue(2) # True
$ht.Values           # Retorna apenas os valores
$ht.Clear()          # Remove todos os itens
`})]})}export{a as default};