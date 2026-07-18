import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`O Pipeline no PowerShell`,subtitle:`A verdadeira força do PowerShell: passando objetos, não apenas texto.`,difficulty:`iniciante`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`O pipeline (representado pelo caractere `,(0,i.jsx)(`code`,{children:`|`}),`) é o conceito mais fundamental e poderoso do PowerShell. Diferente de shells tradicionais como Bash ou CMD, onde o pipeline passa fluxos de texto, o PowerShell passa`,(0,i.jsx)(`strong`,{children:`objetos completos`}),` entre os comandos. Isso elimina a necessidade de parsing complexo de texto com ferramentas como `,(0,i.jsx)(`code`,{children:`grep`}),`, `,(0,i.jsx)(`code`,{children:`sed`}),` ou `,(0,i.jsx)(`code`,{children:`awk`}),`.`]}),(0,i.jsx)(`h2`,{children:`Como funciona o Pipeline de Objetos`}),(0,i.jsxs)(`p`,{children:[`Quando você executa um comando e passa o resultado para outro, o PowerShell mantém a estrutura do objeto. Por exemplo, ao listar processos, você não recebe apenas o nome do processo como uma string, mas um objeto do tipo `,(0,i.jsx)(`code`,{children:`System.Diagnostics.Process`}),` que contém propriedades como CPU, Memória, ID e muito mais.`]}),(0,i.jsx)(t,{title:`Exemplo básico de Pipeline`,code:`# Obtém todos os processos
# Filtra apenas os que estão usando mais de 100MB de memória (WorkingSet)
# Ordena pelo uso de CPU de forma decrescente
# Seleciona apenas os 5 primeiros
Get-Process | Where-Object { $_.WorkingSet -gt 100MB } | Sort-Object CPU -Descending | Select-Object -First 5
`}),(0,i.jsxs)(n,{type:`info`,title:`O Objeto Atual: $_ e $PSItem`,children:[`Dentro de um bloco de script no pipeline (como no `,(0,i.jsx)(`code`,{children:`Where-Object`}),`), a variável automática `,(0,i.jsx)(`code`,{children:`$_`}),`(ou `,(0,i.jsx)(`code`,{children:`$PSItem`}),` no PowerShell 3.0+) representa o objeto que está passando pelo pipeline naquele momento.`]}),(0,i.jsx)(`h2`,{children:`Encadeamento de Comandos`}),(0,i.jsx)(`p`,{children:`Você pode encadear quantos comandos desejar. Cada comando no pipeline processa os objetos um por um conforme eles chegam, o que é muito eficiente em termos de memória, pois o PowerShell não precisa carregar toda a coleção antes de começar o processamento.`}),(0,i.jsx)(t,{title:`Pipeline com múltiplos estágios`,code:`# Lista arquivos .log no diretório do Windows
# Filtra arquivos modificados nos últimos 7 dias
# Seleciona o nome e o tamanho
# Exporta para um arquivo CSV
Get-ChildItem -Path C:\\Windows\\*.log -Recurse | 
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) } | 
    Select-Object Name, @{Name="SizeKB"; Expression={$_.Length / 1KB}} | 
    Export-Csv -Path "./LogReport.csv" -NoTypeInformation
`}),(0,i.jsx)(`h2`,{children:`Pipeline Input: ValueFromPipeline e ByPropertyName`}),(0,i.jsxs)(`p`,{children:[`O PowerShell decide como conectar os comandos baseando-se no tipo do objeto (`,(0,i.jsx)(`code`,{children:`ValueFromPipeline`}),`) ou no nome da propriedade (`,(0,i.jsx)(`code`,{children:`ValueFromPipelineByPropertyName`}),`).`]}),(0,i.jsx)(t,{title:`Entrada por Nome de Propriedade`,code:`# Criamos um objeto com uma propriedade 'Name'
$myProcess = [PSCustomObject]@{ Name = "explorer" }

# Passamos para o Stop-Process. Como Stop-Process aceita 'Name' do pipeline, ele funciona!
$myProcess | Stop-Process -WhatIf
`}),(0,i.jsx)(`h2`,{children:`ForEach-Object e blocos de processamento`}),(0,i.jsxs)(`p`,{children:[`O comando `,(0,i.jsx)(`code`,{children:`ForEach-Object`}),` (alias `,(0,i.jsx)(`code`,{children:`%`}),`) permite executar um bloco de código para cada objeto no pipeline. Ele possui três blocos opcionais: `,(0,i.jsx)(`code`,{children:`begin`}),`, `,(0,i.jsx)(`code`,{children:`process`}),` e `,(0,i.jsx)(`code`,{children:`end`}),`.`]}),(0,i.jsx)(t,{title:`Uso avançado do ForEach-Object`,code:`# Usando blocos begin, process e end para somar tamanhos de arquivos
Get-ChildItem -File | ForEach-Object -Begin {
    $totalSize = 0
    Write-Host "Iniciando contagem..." -ForegroundColor Cyan
} -Process {
    $totalSize += $_.Length
    Write-Host "Processando: $($_.Name)"
} -End {
    Write-Host "Tamanho Total: $($totalSize / 1MB) MB" -ForegroundColor Green
}
`}),(0,i.jsxs)(n,{type:`warning`,title:`foreach vs ForEach-Object`,children:[`A palavra-chave `,(0,i.jsx)(`code`,{children:`foreach ($item in $colecao)`}),` carrega toda a coleção na memória antes de processar. Já o `,(0,i.jsx)(`code`,{children:`ForEach-Object`}),` no pipeline processa um item por vez. Use o primeiro para performance com coleções pequenas e o segundo para fluxos de dados grandes ou quando o consumo de memória for crítico.`]}),(0,i.jsx)(`h2`,{children:`Tee-Object: Dividindo o Pipeline`}),(0,i.jsxs)(`p`,{children:[`Às vezes você quer ver o resultado na tela E salvar em um arquivo simultaneamente. O `,(0,i.jsx)(`code`,{children:`Tee-Object`}),`serve exatamente para isso.`]}),(0,i.jsx)(t,{title:`Usando Tee-Object`,code:`# Lista serviços parados, mostra na tela e salva no arquivo ao mesmo tempo
Get-Service | Where-Object Status -eq "Stopped" | Tee-Object -FilePath "./servicos_parados.txt" | Select-Object -First 5
`}),(0,i.jsx)(`h2`,{children:`Operadores de Encadeamento no PS7+ (&& e ||)`}),(0,i.jsx)(`p`,{children:`Inspirado em shells Unix, o PowerShell 7 introduziu operadores de encadeamento condicional baseados no sucesso do comando anterior.`}),(0,i.jsx)(t,{title:`Encadeamento Condicional`,code:`# Executa o segundo comando apenas se o primeiro for bem-sucedido (&&)
mkdir "NovoProjeto" && cd "NovoProjeto"

# Executa o segundo comando apenas se o primeiro falhar (||)
Test-Path "./config.json" || Write-Error "Arquivo de configuração não encontrado!"
`}),(0,i.jsx)(`h2`,{children:`Dicas de Performance no Pipeline`}),(0,i.jsx)(`p`,{children:`Filtre o mais cedo possível ("Filter left, format right"). É muito mais eficiente pedir ao comando inicial para filtrar do que filtrar depois no pipeline.`}),(0,i.jsx)(t,{title:`Bom vs Ruim (Performance)`,code:`# INEFICIENTE: Obtém tudo e depois filtra
Get-Service | Where-Object Name -eq "bits"

# EFICIENTE: O comando já busca apenas o necessário
Get-Service -Name "bits"

# INEFICIENTE: Lê o arquivo todo e depois filtra
Get-Content "./grande.log" | Where-Object { $_ -match "Error" }

# EFICIENTE: Usa o Select-String para ler de forma otimizada
Select-String -Path "./grande.log" -Pattern "Error"
`}),(0,i.jsx)(n,{type:`danger`,title:`Pipeline Nulo`,children:`Se um comando no meio do pipeline não retornar nada, o restante do pipeline não será executado para aquele objeto específico. Certifique-se de que seus filtros não estão sendo restritivos demais por acidente.`})]})}export{a as default};