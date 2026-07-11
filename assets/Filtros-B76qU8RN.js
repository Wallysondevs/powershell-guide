import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Filtros e Seleção de Dados`,subtitle:`Refinando seus resultados com Where-Object, Select-Object e Sort-Object.`,difficulty:`iniciante`,timeToRead:`25 min`,children:[(0,i.jsx)(`p`,{children:`Uma das tarefas mais comuns no PowerShell é filtrar grandes quantidades de dados para encontrar exatamente o que você precisa. Graças à natureza orientada a objetos do PowerShell, podemos filtrar por propriedades específicas de forma intuitiva.`}),(0,i.jsx)(`h2`,{children:`Where-Object: O Filtro Principal`}),(0,i.jsxs)(`p`,{children:[`O cmdlet `,(0,i.jsx)(`code`,{children:`Where-Object`}),` (alias `,(0,i.jsx)(`code`,{children:`?`}),`) seleciona objetos de uma coleção com base em seus valores de propriedade. Ele suporta duas sintaxes: a clássica (com bloco de script) e a simplificada.`]}),(0,i.jsx)(t,{title:`Sintaxe de Bloco de Script (Clássica)`,code:`# Filtra processos que usam mais de 500MB de RAM
# $_ representa o objeto atual
Get-Process | Where-Object { $_.WorkingSet -gt 500MB }

# Múltiplas condições com operadores lógicos (-and, -or, -not)
Get-Service | Where-Object { $_.Status -eq 'Running' -and $_.StartType -eq 'Automatic' }
`}),(0,i.jsx)(t,{title:`Sintaxe Simplificada (PS 3.0+)`,code:`# Mais legível para filtros simples de uma única propriedade
Get-Process | Where-Object WorkingSet -gt 500MB

# Funciona muito bem para verificar booleanos ou existência
Get-Service | Where-Object CanStop
`}),(0,i.jsxs)(n,{type:`info`,title:`Operadores de Comparação`,children:[`Lembre-se que no PowerShell usamos `,(0,i.jsx)(`code`,{children:`-eq`}),` (equal), `,(0,i.jsx)(`code`,{children:`-ne`}),` (not equal), `,(0,i.jsx)(`code`,{children:`-gt`}),` (greater than),`,(0,i.jsx)(`code`,{children:`-lt`}),` (less than), `,(0,i.jsx)(`code`,{children:`-like`}),` (wildcards) e `,(0,i.jsx)(`code`,{children:`-match`}),` (regex).`]}),(0,i.jsx)(`h2`,{children:`Select-Object: Escolhendo Propriedades`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Select-Object`}),` permite escolher quais propriedades de um objeto você deseja manter, ou até criar novas propriedades.`]}),(0,i.jsx)(t,{title:`Selecionando Propriedades Específicas`,code:`# Mantém apenas Nome e ID do processo
Get-Process | Select-Object -Property Name, Id

# Seleciona os primeiros ou últimos itens
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Selecionar apenas valores únicos
"A", "B", "A", "C" | Select-Object -Unique
`}),(0,i.jsx)(`h2`,{children:`Propriedades Calculadas`}),(0,i.jsxs)(`p`,{children:[`Você pode criar propriedades "on-the-fly" usando uma Hashtable dentro do `,(0,i.jsx)(`code`,{children:`Select-Object`}),`. Isso é extremamente útil para converter unidades ou renomear campos.`]}),(0,i.jsx)(t,{title:`Criando Propriedades Calculadas`,code:`# Converte bytes para MB e formata o nome da coluna
Get-ChildItem -File | Select-Object Name, @{
    Name = "TamanhoMB"
    Expression = { "{0:N2}" -f ($_.Length / 1MB) }
}
`}),(0,i.jsx)(`h2`,{children:`Sort-Object: Ordenando Resultados`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Sort-Object`}),` ordena os objetos com base em uma ou mais propriedades.`]}),(0,i.jsx)(t,{title:`Ordenação Simples e Composta`,code:`# Ordena por nome (padrão é ascendente)
Get-Service | Sort-Object Name

# Ordena por Status e depois por Nome (descendente)
Get-Service | Sort-Object Status, Name -Descending

# Remove duplicatas durante a ordenação
Get-Process | Sort-Object Name -Unique
`}),(0,i.jsx)(`h2`,{children:`Group-Object: Agrupando Dados`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Group-Object`}),` agrupa objetos que contêm o mesmo valor em propriedades especificadas.`]}),(0,i.jsx)(t,{title:`Agrupando Processos por Empresa`,code:`# Agrupa e conta quantos processos cada empresa tem rodando
Get-Process | Group-Object Company | Select-Object Count, Name | Sort-Object Count -Descending

# Agrupando arquivos por extensão
Get-ChildItem -Path C:\\Windows -File | Group-Object Extension -NoElement
`}),(0,i.jsx)(`h2`,{children:`Measure-Object: Estatísticas e Contagens`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Measure-Object`}),` calcula propriedades numéricas de objetos, como soma, média, mínimo e máximo.`]}),(0,i.jsx)(t,{title:`Calculando Estatísticas de Arquivos`,code:`# Calcula estatísticas de tamanho para arquivos na pasta atual
Get-ChildItem -File | Measure-Object -Property Length -Sum -Average -Max -Min

# Contando linhas em um arquivo de texto
Get-Content "./log.txt" | Measure-Object -Line -Word -Character
`}),(0,i.jsxs)(n,{type:`success`,title:`Dica de Ouro: ExpandProperty`,children:[`Se você precisa apenas do valor de uma propriedade (como uma string) e não de um objeto com essa propriedade, use `,(0,i.jsx)(`code`,{children:`Select-Object -ExpandProperty NomeDaPropriedade`}),`.`]}),(0,i.jsx)(t,{title:`ExpandProperty vs Property`,code:`# Retorna um objeto PSCustomObject com a propriedade 'Name'
$obj = Get-Service -Name bits | Select-Object Name
$obj.GetType().Name # Retorna 'PSCustomObject'

# Retorna diretamente a string do nome
$str = Get-Service -Name bits | Select-Object -ExpandProperty Name
$str.GetType().Name # Retorna 'String'
`}),(0,i.jsx)(`h2`,{children:`Filtros com Wildcards e Regex`}),(0,i.jsx)(`p`,{children:`Muitas vezes você não sabe o nome exato. O PowerShell oferece suporte nativo a padrões.`}),(0,i.jsx)(t,{title:`Usando -like e -match`,code:`# -like usa wildcards (* e ?)
Get-Service | Where-Object Name -like "win*"

# -match usa Expressões Regulares (Regex)
Get-Process | Where-Object Name -match "^s[a-z]h"
`}),(0,i.jsxs)(n,{type:`danger`,title:`Cuidado com Filtros Ineficientes`,children:[`Evite fazer `,(0,i.jsx)(`code`,{children:`Get-ChildItem -Recurse | Where-Object Name -eq "alvo.txt"`}),` em discos grandes. Muitos cmdlets têm parâmetros de filtro nativos (`,(0,i.jsx)(`code`,{children:`-Filter`}),`, `,(0,i.jsx)(`code`,{children:`-Include`}),`, `,(0,i.jsx)(`code`,{children:`-Name`}),`) que são processados pelo provedor (sistema de arquivos, AD, etc) de forma MUITO mais rápida que o pipeline.`]})]})}export{a as default};