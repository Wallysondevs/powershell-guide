import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CSV() {
  return (
    <PageContainer
      title="Manipulação de CSV e Dados Tabulares"
      subtitle="Importe, exporte, filtre e transforme dados CSV para automação e relatórios."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        CSV (Comma-Separated Values) é o formato universal para troca de dados tabulares.
        O PowerShell oferece cmdlets nativos poderosos para importar, exportar e transformar 
        dados CSV com facilidade.
      </p>

      <h2>Import-Csv e Export-Csv</h2>
      <CodeBlock title="Operações básicas com CSV" code={`# Importar CSV (cabeçalho na primeira linha)
$funcionarios = Import-Csv "funcionarios.csv" -Encoding UTF8 -Delimiter ";"
$funcionarios | Format-Table -AutoSize

# Filtrar e ordenar
$funcionarios |
    Where-Object { [decimal]$_.Salario -gt 5000 } |
    Sort-Object Departamento, Nome |
    Select-Object Nome, Cargo, Departamento, Salario

# Exportar para CSV
Get-Process | Select-Object Name, Id, CPU, WorkingSet |
    Export-Csv "processos.csv" -NoTypeInformation -Encoding UTF8

# Append em CSV existente
[PSCustomObject]@{
    Data   = Get-Date -Format "yyyy-MM-dd HH:mm"
    Evento = "Backup concluído"
    Status = "OK"
} | Export-Csv "log.csv" -Append -NoTypeInformation -Encoding UTF8
`} />

      <h2>Transformando Dados CSV</h2>
      <CodeBlock title="ETL simples com CSV" code={`# Converter tipos ao importar (CSV é tudo string)
$vendas = Import-Csv "vendas.csv" | ForEach-Object {
    [PSCustomObject]@{
        Data       = [datetime]::ParseExact($_.Data, "dd/MM/yyyy", $null)
        Produto    = $_.Produto.Trim()
        Quantidade = [int]$_.Quantidade
        Preco      = [decimal]($_.Preco -replace ',','.')
        Total      = [int]$_.Quantidade * [decimal]($_.Preco -replace ',','.')
    }
}

# Sumarizar por produto
$vendas |
    Group-Object Produto |
    Select-Object Name,
        @{N="Qtd Total";   E={ ($_.Group | Measure-Object Quantidade -Sum).Sum }},
        @{N="Receita";     E={ "R$ {0:N2}" -f ($_.Group | Measure-Object Total -Sum).Sum }} |
    Sort-Object Receita -Descending |
    Format-Table -AutoSize
`} />

      <h2>CSV sem Cabeçalho e Delimitadores Especiais</h2>
      <CodeBlock title="Formatos não padrão" code={`# CSV sem cabeçalho — definir manualmente
$dados = Import-Csv "sem-cabecalho.csv" -Header "ID","Nome","Email","Cidade"

# TSV (tab-separated)
$tsv = Import-Csv "dados.tsv" -Delimiter "\`t"

# Pipe-separated
$psv = Import-Csv "dados.psv" -Delimiter "|"

# Converter log para CSV estruturado
$logs = Get-Content "app.log" | ForEach-Object {
    if ($_ -match '(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) \[(\w+)\] (.+)') {
        [PSCustomObject]@{
            Data     = $Matches[1]
            Nivel    = $Matches[2]
            Mensagem = $Matches[3]
        }
    }
}
$logs | Export-Csv "logs-estruturados.csv" -NoTypeInformation -Encoding UTF8
`} />

      <h2>Comparando Arquivos CSV</h2>
      <CodeBlock title="Diff entre dois CSVs" code={`$atual    = Import-Csv "usuarios-atual.csv"
$anterior = Import-Csv "usuarios-anterior.csv"

# Novos usuários
$novos = Compare-Object $atual $anterior -Property Email -PassThru |
    Where-Object SideIndicator -eq "<="

# Usuários removidos
$removidos = Compare-Object $atual $anterior -Property Email -PassThru |
    Where-Object SideIndicator -eq "=>"

Write-Host "Novos: $($novos.Count) | Removidos: $($removidos.Count)"
`} />

      <h2>Lendo CSV Grande com Stream</h2>
      <CodeBlock title="Processamento eficiente de arquivos enormes" code={`# Para CSVs com milhões de linhas — linha por linha na memória
$reader = [System.IO.StreamReader]::new("enorme.csv")
$cabecalho = $reader.ReadLine() -split ","
$contador  = 0

while (-not $reader.EndOfStream) {
    $campos = $reader.ReadLine() -split ","
    if ($campos[3] -eq "ERRO") { $contador++ }
}
$reader.Close()
"Total de erros: $contador"
`} />

      <AlertBox type="info" title="Performance">
        Para arquivos CSV com centenas de milhares de linhas, use <code>[System.IO.StreamReader]</code>
        em vez de <code>Import-Csv</code>. Isso processa linha por linha, economizando memória.
      </AlertBox>
    </PageContainer>
  );
}
