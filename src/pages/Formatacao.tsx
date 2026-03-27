import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Formatacao() {
  return (
    <PageContainer
      title="Formatação e Saída de Dados"
      subtitle="Transformando objetos em tabelas, listas, CSV, JSON e muito mais."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        No PowerShell, a visualização dos dados e a exportação para diferentes formatos são processos distintos. 
        Enquanto os objetos fluem pelo pipeline, os cmdlets de formatação (Format-*) preparam esses dados para o 
        consumo humano, e os cmdlets de exportação (Export-*) os preparam para o consumo por outras ferramentas.
      </p>

      <h2>Visualização: Format-Table, Format-List e Format-Wide</h2>
      <p>
        Estes cmdlets são usados para controlar como os objetos aparecem no console.
      </p>

      <CodeBlock
        title="Formatando no Console"
        code={`# Format-Table (ft): Visualização em colunas (padrão para muitos objetos)
Get-Process | Select-Object -First 5 | Format-Table -AutoSize

# Format-List (fl): Mostra cada propriedade em uma nova linha (ótimo para muitos campos)
Get-Service -Name "bits" | Format-List *

# Format-Wide (fw): Mostra apenas uma propriedade em múltiplas colunas
Get-ChildItem -Name | Format-Wide -Column 3
`}
      />

      <AlertBox type="danger" title="Regra de Ouro da Formatação">
        <strong>Nunca</strong> coloque um cmdlet <code>Format-*</code> no meio de um pipeline se você pretende 
        processar os dados depois. Os cmdlets de formatação destroem o objeto original e o transformam em objetos 
        de formatação de texto. A formatação deve ser sempre o <strong>último</strong> passo.
      </AlertBox>

      <h2>Exportando Dados: CSV e Excel</h2>
      <p>
        O formato CSV é universal e o PowerShell lida com ele de forma brilhante, mapeando propriedades para colunas 
        automaticamente.
      </p>

      <CodeBlock
        title="Trabalhando com CSV"
        code={`# Exportando processos para CSV
Get-Process | Select-Object Name, CPU, WorkingSet | 
    Export-Csv -Path "./processos.csv" -NoTypeInformation -Encoding UTF8

# Importando de volta (recria objetos automaticamente!)
$dados = Import-Csv -Path "./processos.csv"
$dados | Where-Object { [double]$_.CPU -gt 10 }
`}
      />

      <h2>O Poder do JSON</h2>
      <p>
        Para APIs modernas e configurações complexas, o JSON é o formato de escolha. O PowerShell facilita a 
        conversão entre objetos e strings JSON.
      </p>

      <CodeBlock
        title="Convertendo de/para JSON"
        code={`# Criando um objeto complexo
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
`}
      />

      <h2>Out-GridView: A Interface Gráfica Instantânea</h2>
      <p>
        Se você precisa filtrar dados de forma interativa, o <code>Out-GridView</code> abre uma janela separada 
        com recursos de busca e ordenação.
      </p>

      <CodeBlock
        title="Interface Interativa"
        code={`# Abre uma janela com todos os serviços
Get-Service | Out-GridView

# Modo de seleção: o usuário escolhe itens e eles voltam para o pipeline
$selecionados = Get-Process | Out-GridView -Title "Escolha os processos para parar" -PassThru
$selecionados | Stop-Process -WhatIf
`}
      />

      <AlertBox type="info" title="Disponibilidade do Out-GridView">
        No PowerShell Core (Linux/macOS), o <code>Out-GridView</code> pode não estar disponível ou requerer o 
        módulo <code>Microsoft.PowerShell.GraphicalHost</code>. No Windows, ele é nativo.
      </AlertBox>

      <h2>Redirecionamento de Saída</h2>
      <p>
        Além dos cmdlets, você pode usar operadores clássicos de redirecionamento, embora <code>Out-File</code> 
        seja geralmente preferido por oferecer controle de codificação.
      </p>

      <CodeBlock
        title="Salvando em Arquivos"
        code={`# Operadores clássicos (sobrescrever e anexar)
"Olá Mundo" > log.txt
"Nova linha" >> log.txt

# Usando Out-File (Mais seguro e com controle de codificação)
Get-Process | Out-File -FilePath "./processos.txt" -Encoding UTF8 -Append

# Out-String: Converte objetos em uma única string de texto
$servicosStr = Get-Service | Out-String
`}
      />

      <h2>HTML e XML</h2>
      <p>
        Precisa gerar um relatório rápido para enviar por e-mail? O <code>ConvertTo-Html</code> cria tabelas HTML 
        prontas para uso. Para persistência de dados complexos .NET, use <code>Export-Clixml</code>.
      </p>

      <CodeBlock
        title="Relatórios e XML"
        code={`# Gerando um relatório HTML básico
Get-Service | Select-Object Status, Name, DisplayName | 
    ConvertTo-Html -Title "Relatório de Serviços" | 
    Out-File "./servicos.html"

# Clixml preserva tipos complexos e até credenciais criptografadas
$cred = Get-Credential
$cred | Export-Clixml -Path "./minha_credencial.xml"

# Recuperando o objeto exato
$credOriginal = Import-Clixml -Path "./minha_credencial.xml"
`}
      />

      <h2>Limpando a Saída</h2>
      <p>
        Às vezes você quer executar um comando mas não quer ver nada na tela.
      </p>

      <CodeBlock
        title="Descartando Saída"
        code={`# Envia para o 'buraco negro' (equivalente ao /dev/null)
$null = Algum-Comando-Barulhento
Algum-Comando-Barulhento | Out-Null
`}
      />

      <AlertBox type="warning" title="Codificação de Arquivos">
        No Windows PowerShell 5.1, o padrão de codificação costuma ser <code>UTF16</code>. No PowerShell 7+, o 
        padrão é <code>UTF8 sem BOM</code>. Sempre especifique <code>-Encoding UTF8</code> ao trabalhar com 
        arquivos que serão lidos por outras ferramentas (como editores de código ou Linux).
      </AlertBox>
    </PageContainer>
  );
}
