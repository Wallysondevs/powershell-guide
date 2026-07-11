import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Formatação e Saída de Dados`,subtitle:`Transformando objetos em tabelas, listas, CSV, JSON e muito mais.`,difficulty:`intermediario`,timeToRead:`25 min`,children:[(0,i.jsx)(`p`,{children:`No PowerShell, a visualização dos dados e a exportação para diferentes formatos são processos distintos. Enquanto os objetos fluem pelo pipeline, os cmdlets de formatação (Format-*) preparam esses dados para o consumo humano, e os cmdlets de exportação (Export-*) os preparam para o consumo por outras ferramentas.`}),(0,i.jsx)(`h2`,{children:`Visualização: Format-Table, Format-List e Format-Wide`}),(0,i.jsx)(`p`,{children:`Estes cmdlets são usados para controlar como os objetos aparecem no console.`}),(0,i.jsx)(t,{title:`Formatando no Console`,code:`# Format-Table (ft): Visualização em colunas (padrão para muitos objetos)
Get-Process | Select-Object -First 5 | Format-Table -AutoSize

# Format-List (fl): Mostra cada propriedade em uma nova linha (ótimo para muitos campos)
Get-Service -Name "bits" | Format-List *

# Format-Wide (fw): Mostra apenas uma propriedade em múltiplas colunas
Get-ChildItem -Name | Format-Wide -Column 3
`}),(0,i.jsxs)(n,{type:`danger`,title:`Regra de Ouro da Formatação`,children:[(0,i.jsx)(`strong`,{children:`Nunca`}),` coloque um cmdlet `,(0,i.jsx)(`code`,{children:`Format-*`}),` no meio de um pipeline se você pretende processar os dados depois. Os cmdlets de formatação destroem o objeto original e o transformam em objetos de formatação de texto. A formatação deve ser sempre o `,(0,i.jsx)(`strong`,{children:`último`}),` passo.`]}),(0,i.jsx)(`h2`,{children:`Exportando Dados: CSV e Excel`}),(0,i.jsx)(`p`,{children:`O formato CSV é universal e o PowerShell lida com ele de forma brilhante, mapeando propriedades para colunas automaticamente.`}),(0,i.jsx)(t,{title:`Trabalhando com CSV`,code:`# Exportando processos para CSV
Get-Process | Select-Object Name, CPU, WorkingSet | 
    Export-Csv -Path "./processos.csv" -NoTypeInformation -Encoding UTF8

# Importando de volta (recria objetos automaticamente!)
$dados = Import-Csv -Path "./processos.csv"
$dados | Where-Object { [double]$_.CPU -gt 10 }
`}),(0,i.jsx)(`h2`,{children:`O Poder do JSON`}),(0,i.jsx)(`p`,{children:`Para APIs modernas e configurações complexas, o JSON é o formato de escolha. O PowerShell facilita a conversão entre objetos e strings JSON.`}),(0,i.jsx)(t,{title:`Convertendo de/para JSON`,code:`# Criando um objeto complexo
$config = @{
    AppName = "MinhaApp"
    Version = "1.2.0"
    Settings = @{
        Debug = $true
        Port = 8080
    }
}

# Convertendo para JSON (Depth define quantos níveis de aninhamento processar)
$json = $config | ConvertTo-Json -Depth 5
$json | Out-File "./config.json"

# Lendo JSON de volta
$obj = Get-Content "./config.json" | ConvertFrom-Json
$obj.Settings.Port # Retorna 8080
`}),(0,i.jsx)(`h2`,{children:`Out-GridView: A Interface Gráfica Instantânea`}),(0,i.jsxs)(`p`,{children:[`Se você precisa filtrar dados de forma interativa, o `,(0,i.jsx)(`code`,{children:`Out-GridView`}),` abre uma janela separada com recursos de busca e ordenação.`]}),(0,i.jsx)(t,{title:`Interface Interativa`,code:`# Abre uma janela com todos os serviços
Get-Service | Out-GridView

# Modo de seleção: o usuário escolhe itens e eles voltam para o pipeline
$selecionados = Get-Process | Out-GridView -Title "Escolha os processos para parar" -PassThru
$selecionados | Stop-Process -WhatIf
`}),(0,i.jsxs)(n,{type:`info`,title:`Disponibilidade do Out-GridView`,children:[`No PowerShell Core (Linux/macOS), o `,(0,i.jsx)(`code`,{children:`Out-GridView`}),` pode não estar disponível ou requerer o módulo `,(0,i.jsx)(`code`,{children:`Microsoft.PowerShell.GraphicalHost`}),`. No Windows, ele é nativo.`]}),(0,i.jsx)(`h2`,{children:`Redirecionamento de Saída`}),(0,i.jsxs)(`p`,{children:[`Além dos cmdlets, você pode usar operadores clássicos de redirecionamento, embora `,(0,i.jsx)(`code`,{children:`Out-File`}),`seja geralmente preferido por oferecer controle de codificação.`]}),(0,i.jsx)(t,{title:`Salvando em Arquivos`,code:`# Operadores clássicos (sobrescrever e anexar)
"Olá Mundo" > log.txt
"Nova linha" >> log.txt

# Usando Out-File (Mais seguro e com controle de codificação)
Get-Process | Out-File -FilePath "./processos.txt" -Encoding UTF8 -Append

# Out-String: Converte objetos em uma única string de texto
$servicosStr = Get-Service | Out-String
`}),(0,i.jsx)(`h2`,{children:`HTML e XML`}),(0,i.jsxs)(`p`,{children:[`Precisa gerar um relatório rápido para enviar por e-mail? O `,(0,i.jsx)(`code`,{children:`ConvertTo-Html`}),` cria tabelas HTML prontas para uso. Para persistência de dados complexos .NET, use `,(0,i.jsx)(`code`,{children:`Export-Clixml`}),`.`]}),(0,i.jsx)(t,{title:`Relatórios e XML`,code:`# Gerando um relatório HTML básico
Get-Service | Select-Object Status, Name, DisplayName | 
    ConvertTo-Html -Title "Relatório de Serviços" | 
    Out-File "./servicos.html"

# Clixml preserva tipos complexos e até credenciais criptografadas
$cred = Get-Credential
$cred | Export-Clixml -Path "./minha_credencial.xml"

# Recuperando o objeto exato
$credOriginal = Import-Clixml -Path "./minha_credencial.xml"
`}),(0,i.jsx)(`h2`,{children:`Limpando a Saída`}),(0,i.jsx)(`p`,{children:`Às vezes você quer executar um comando mas não quer ver nada na tela.`}),(0,i.jsx)(t,{title:`Descartando Saída`,code:`# Envia para o 'buraco negro' (equivalente ao /dev/null)
$null = Algum-Comando-Barulhento
Algum-Comando-Barulhento | Out-Null
`}),(0,i.jsxs)(n,{type:`warning`,title:`Codificação de Arquivos`,children:[`No Windows PowerShell 5.1, o padrão de codificação costuma ser `,(0,i.jsx)(`code`,{children:`UTF16`}),`. No PowerShell 7+, o padrão é `,(0,i.jsx)(`code`,{children:`UTF8 sem BOM`}),`. Sempre especifique `,(0,i.jsx)(`code`,{children:`-Encoding UTF8`}),` ao trabalhar com arquivos que serão lidos por outras ferramentas (como editores de código ou Linux).`]})]})}export{a as default};