import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Processamento de XML`,subtitle:`Leia, modifique, crie e consulte documentos XML com XPath e a API nativa do PowerShell.`,difficulty:`intermediário`,timeToRead:`25 min`,children:[(0,i.jsx)(`p`,{children:`O PowerShell tem suporte nativo excelente para XML. Você pode carregar documentos, navegar pela hierarquia com notação de ponto, executar queries XPath e gerar XML programaticamente — tudo sem instalar bibliotecas externas.`}),(0,i.jsx)(`h2`,{children:`Carregando e Acessando XML`}),(0,i.jsx)(t,{title:`Lendo XML como objetos`,code:`# XML inline
[xml]$xml = @"
<empresa>
  <nome>Acme Corp</nome>
  <funcionarios>
    <pessoa id="1" cargo="Dev">
      <nome>Ana Silva</nome>
      <departamento>TI</departamento>
      <salario>8500.00</salario>
    </pessoa>
    <pessoa id="2" cargo="QA">
      <nome>Bruno Costa</nome>
      <departamento>TI</departamento>
      <salario>7200.00</salario>
    </pessoa>
    <pessoa id="3" cargo="PM">
      <nome>Carla Mendes</nome>
      <departamento>Produto</departamento>
      <salario>9800.00</salario>
    </pessoa>
  </funcionarios>
</empresa>
"@

# Acessar elementos com notação de ponto
$xml.empresa.nome                          # Acme Corp
$xml.empresa.funcionarios.pessoa.Count     # 3

# Acessar atributos
$xml.empresa.funcionarios.pessoa[0].id     # 1
$xml.empresa.funcionarios.pessoa[0].cargo  # Dev

# Filtrar
$xml.empresa.funcionarios.pessoa |
    Where-Object departamento -eq "TI" |
    ForEach-Object { "$($_.nome): R$ $($_.salario)" }
`}),(0,i.jsx)(`h2`,{children:`Carregando XML de Arquivo`}),(0,i.jsx)(t,{title:`Get-Content e Select-Xml`,code:`# Carregar de arquivo
[xml]$config = Get-Content "C:Appconfig.xml" -Encoding UTF8

# Select-Xml com XPath
$nodes = Select-Xml -Path "C:Appconfig.xml" -XPath "//connectionString[@name='Principal']"
$nodes.Node.value

# XPath mais complexo
$xml = [xml](Get-Content "web.config")
Select-Xml -Xml $xml -XPath "//add[@key='Environment']" |
    Select-Object -ExpandProperty Node |
    Select-Object key, value

# Todos os elementos com determinado atributo
Select-Xml -Xml $xml -XPath "//*[@enabled='true']" |
    ForEach-Object { $_.Node.LocalName + ": " + $_.Node.InnerText }
`}),(0,i.jsx)(`h2`,{children:`Modificando XML`}),(0,i.jsx)(t,{title:`Alterando elementos e atributos`,code:`[xml]$xml = Get-Content "C:Appsettings.xml"

# Modificar texto de um elemento
$xml.settings.database.server = "novo-servidor.empresa.com"

# Modificar atributo
$node = $xml.SelectSingleNode("//connectionString[@name='DB']")
$node.SetAttribute("timeout", "60")

# Adicionar novo elemento filho
$novo = $xml.CreateElement("cache")
$xml.settings.AppendChild($novo) | Out-Null
$novo.InnerText = "redis://localhost:6379"

# Adicionar elemento com atributos
$itemEl = $xml.CreateElement("item")
$itemEl.SetAttribute("key", "MaxRetries")
$itemEl.SetAttribute("value", "3")
$xml.settings.AppendChild($itemEl) | Out-Null

# Remover elemento
$remover = $xml.SelectSingleNode("//legacyConfig")
if ($remover) { $remover.ParentNode.RemoveChild($remover) | Out-Null }

# Salvar as alterações
$xml.Save("C:Appsettings.xml")
Write-Host "XML salvo com sucesso"
`}),(0,i.jsx)(`h2`,{children:`Criando XML do Zero`}),(0,i.jsx)(t,{title:`Gerando documentos XML`,code:`$doc = [System.Xml.XmlDocument]::new()

# Declaração XML
$decl = $doc.CreateXmlDeclaration("1.0", "UTF-8", $null)
$doc.AppendChild($decl) | Out-Null

# Elemento raiz
$root = $doc.CreateElement("relatorio")
$root.SetAttribute("gerado", (Get-Date -Format "yyyy-MM-dd"))
$root.SetAttribute("versao", "2.0")
$doc.AppendChild($root) | Out-Null

# Adicionar servidor com subelementos
$servidores = @(
    @{ Nome="SRV01"; IP="192.168.1.10"; CPU=45; RAM=72 },
    @{ Nome="SRV02"; IP="192.168.1.11"; CPU=23; RAM=41 },
    @{ Nome="SRV03"; IP="192.168.1.12"; CPU=87; RAM=95 }
)

foreach ($srv in $servidores) {
    $el = $doc.CreateElement("servidor")
    $el.SetAttribute("nome", $srv.Nome)
    foreach ($campo in @("IP","CPU","RAM")) {
        $filho = $doc.CreateElement($campo.ToLower())
        $filho.InnerText = $srv[$campo]
        $el.AppendChild($filho) | Out-Null
    }
    $root.AppendChild($el) | Out-Null
}

$doc.Save("C:\relatorio.xml")
Get-Content "C:\relatorio.xml"
`}),(0,i.jsxs)(n,{type:`info`,title:`XPath Cheat Sheet`,children:[(0,i.jsx)(`code`,{children:`/root/filho`}),` — caminho absoluto.`,(0,i.jsx)(`code`,{children:`//elemento`}),` — qualquer nível.`,(0,i.jsx)(`code`,{children:`[@atrib='valor']`}),` — filtro por atributo.`,(0,i.jsx)(`code`,{children:`[posicao()=1]`}),` ou `,(0,i.jsx)(`code`,{children:`[last()]`}),` — posição.`,(0,i.jsx)(`code`,{children:`*`}),` — qualquer elemento.`,(0,i.jsx)(`code`,{children:`text()`}),` — nó de texto.`]})]})}export{a as default};