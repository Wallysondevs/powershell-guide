import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function CSV() {
    return (
      <PageContainer
        title="Manipulação de CSV e Dados Tabulares"
        subtitle="Importe, exporte, transforme, valide e mescle dados CSV para automação e relatórios."
        difficulty="iniciante"
        timeToRead="28 min"
      >
        <p>
          CSV (Comma-Separated Values) é o formato universal para troca de dados tabulares.
          O PowerShell trata cada linha do CSV como um objeto com propriedades correspondentes
          aos cabeçalhos — o que permite usar todo o poder do pipeline para filtrar, transformar
          e agregar dados de forma expressiva.
        </p>

        <h2>Import-Csv e Export-Csv</h2>
        <CodeBlock title="Operações básicas com CSV" code={`# Importar CSV (cabeçalho na primeira linha)
  $funcionarios = Import-Csv "funcionarios.csv" -Encoding UTF8 -Delimiter ";"
  $funcionarios | Format-Table -AutoSize

  # Acessar propriedades como objeto
  $funcionarios[0].Nome       # Primeira linha, coluna Nome
  $funcionarios.Count         # Total de registros

  # Filtrar e ordenar
  $funcionarios |
      Where-Object { [decimal]$_.Salario -gt 5000 } |
      Sort-Object Departamento, Nome |
      Select-Object Nome, Cargo, Departamento, Salario

  # Exportar saída de cmdlet para CSV
  Get-Process | Select-Object Name, Id, CPU,
      @{N="RAM_MB"; E={[math]::Round($_.WorkingSet64/1MB, 1)}} |
      Export-Csv "processos.csv" -NoTypeInformation -Encoding UTF8

  # Adicionar linha ao CSV existente sem apagar o conteúdo
  [PSCustomObject]@{
      Data   = Get-Date -Format "yyyy-MM-dd HH:mm"
      Evento = "Backup concluído"
      Status = "OK"
      Tamanho_GB = 12.5
  } | Export-Csv "log.csv" -Append -NoTypeInformation -Encoding UTF8
  `} />

        <h2>Transformando e Convertendo Dados (ETL)</h2>
        <CodeBlock title="Converter tipos e calcular colunas derivadas" code={`# CSV retorna tudo como string — converta os tipos ao importar!
  $vendas = Import-Csv "vendas.csv" | ForEach-Object {
      [PSCustomObject]@{
          Data       = [datetime]::ParseExact($_.Data, "dd/MM/yyyy", $null)
          Produto    = $_.Produto.Trim().ToUpper()
          Quantidade = [int]$_.Quantidade
          Preco      = [decimal]($_.Preco -replace ',', '.')
          Total      = [int]$_.Quantidade * [decimal]($_.Preco -replace ',', '.')
          Regiao     = if ($_.Estado -in @("SP","RJ","MG")) { "Sudeste" } else { "Outros" }
      }
  }

  # Sumarizar por produto — tabela pivot
  $vendas |
      Group-Object Produto |
      Select-Object Name,
          @{N="Qtd Total";    E={ ($_.Group | Measure-Object Quantidade -Sum).Sum }},
          @{N="Receita (R$)"; E={ [math]::Round(($_.Group | Measure-Object Total -Sum).Sum, 2) }},
          @{N="Ticket Médio"; E={ [math]::Round(($_.Group | Measure-Object Total -Average).Average, 2) }} |
      Sort-Object "Receita (R$)" -Descending |
      Format-Table -AutoSize

  # Filtrar por intervalo de data e exportar
  $inicio = [datetime]"2024-01-01"
  $fim    = [datetime]"2024-03-31"
  $vendas |
      Where-Object { $_.Data -ge $inicio -and $_.Data -le $fim } |
      Export-Csv "vendas-Q1-2024.csv" -NoTypeInformation -Encoding UTF8
  `} />

        <h2>Formatos Não Padrão e Conversão de Logs</h2>
        <CodeBlock title="TSV, PSV, sem cabeçalho e logs estruturados" code={`# CSV sem cabeçalho — definir cabeçalhos manualmente
  $dados = Import-Csv "sem-cabecalho.csv" -Header "ID","Nome","Email","Cidade"

  # TSV (tab-separated values)
  $tsv = Import-Csv "dados.tsv" -Delimiter "`t"  # tab = crase t

  # PSV (pipe-separated)
  $psv = Import-Csv "dados.psv" -Delimiter "|"

  # Converter log de texto não estruturado para CSV
  $logs = Get-Content "app.log" | ForEach-Object {
      if ($_ -match '(d{4}-d{2}-d{2} d{2}:d{2}:d{2}) \[(\w+)\] (.+)') {
          [PSCustomObject]@{
              Data     = [datetime]$Matches[1]
              Nivel    = $Matches[2]
              Mensagem = $Matches[3]
          }
      }
  }
  $logs | Export-Csv "logs-estruturados.csv" -NoTypeInformation -Encoding UTF8

  # Converter CSV para JSON para uso em API
  Import-Csv "produtos.csv" |
      Select-Object id, nome, preco, @{N="ativo"; E={ $_.ativo -eq "1" }} |
      ConvertTo-Json -Depth 3 |
      Set-Content "produtos.json" -Encoding UTF8
  `} />

        <h2>Comparando e Mesclando CSVs</h2>
        <CodeBlock title="Diff, Join e enriquecimento de dados entre arquivos" code={`# Comparar dois CSVs — encontrar novos e removidos
  $atual    = Import-Csv "usuarios-atual.csv"
  $anterior = Import-Csv "usuarios-anterior.csv"

  $diff = Compare-Object $atual $anterior -Property Email -PassThru
  $novos     = $diff | Where-Object SideIndicator -eq "<="
  $removidos = $diff | Where-Object SideIndicator -eq "=>"
  Write-Host "Novos: $($novos.Count) | Removidos: $($removidos.Count)"

  # Mesclar dois CSVs (JOIN por coluna-chave)
  $clientes   = Import-Csv "clientes.csv"     # Tem: ClienteId, Nome
  $pedidos    = Import-Csv "pedidos.csv"      # Tem: ClienteId, Total, Data

  # Criar hashtable para lookup rápido (O(1) em vez de O(n²))
  $clienteMap = @{}
  $clientes | ForEach-Object { $clienteMap[$_.ClienteId] = $_ }

  $resultado = $pedidos | ForEach-Object {
      $cliente = $clienteMap[$_.ClienteId]
      [PSCustomObject]@{
          ClienteId  = $_.ClienteId
          Cliente    = $cliente.Nome
          Total      = [decimal]$_.Total
          Data       = $_.Data
      }
  }
  $resultado | Export-Csv "pedidos-enriquecidos.csv" -NoTypeInformation

  # Concatenar múltiplos CSVs do mesmo formato
  $csvs = Get-ChildItem "C:\\Dados\\Mensais\\*.csv"
  $todos = $csvs | ForEach-Object { Import-Csv $_ }
  $todos | Export-Csv "dados-consolidados.csv" -NoTypeInformation -Encoding UTF8
  `} />

        <h2>Validação de Dados CSV</h2>
        <CodeBlock title="Verificar qualidade e integridade dos dados importados" code={`# Validar CSV antes de processar (essential para ETL robusto)
  function Test-CsvValido {
      param(
          [string]$Arquivo,
          [string[]]$ColunasObrigatorias,
          [int]$MaxLinhasComErro = 0
      )

      $dados = Import-Csv $Arquivo -Encoding UTF8
      if ($dados.Count -eq 0) {
          Write-Warning "Arquivo vazio: $Arquivo"
          return $false
      }

      # Verificar se colunas obrigatórias existem
      $colunas = $dados[0].PSObject.Properties.Name
      $faltando = $ColunasObrigatorias | Where-Object { $_ -notin $colunas }
      if ($faltando) {
          Write-Error "Colunas ausentes: $($faltando -join ', ')"
          return $false
      }

      # Encontrar linhas com campos vazios
      $erros = 0
      $dados | ForEach-Object {
          $linha = $_
          foreach ($col in $ColunasObrigatorias) {
              if ([string]::IsNullOrWhiteSpace($linha.$col)) {
                  Write-Warning "Campo vazio '$col' na linha: $($linha | Out-String)"
                  $erros++
              }
          }
      }

      if ($erros -gt $MaxLinhasComErro) {
          Write-Error "$erros erros encontrados (máximo permitido: $MaxLinhasComErro)"
          return $false
      }
      Write-Host "CSV válido: $($dados.Count) linhas, $erros erros" -ForegroundColor Green
      return $true
  }

  # Uso
  if (Test-CsvValido "funcionarios.csv" @("Nome","Email","CPF","Departamento")) {
      $dados = Import-Csv "funcionarios.csv"
      # Processar dados...
  }
  `} />

        <h2>Exportar para Excel sem Office</h2>
        <CodeBlock title="Usando ImportExcel para planilhas formatadas" code={`# Instalar o módulo ImportExcel (sem precisar do Excel instalado!)
  Install-Module ImportExcel -Scope CurrentUser

  # Exportar com formatação automática
  Get-Process | Select-Object -First 20 Name, Id,
      @{N="CPU (s)"; E={[math]::Round($_.CPU,2)}},
      @{N="RAM (MB)"; E={[math]::Round($_.WorkingSet64/1MB,1)}} |
      Export-Excel "processos.xlsx" `
        -WorksheetName "Processos" `
        -AutoSize `
        -AutoFilter `
        -FreezeTopRow `
        -BoldTopRow `
        -TableName "TabelaProcessos" `
        -TableStyle "Medium9"

  # Múltiplas planilhas no mesmo arquivo
  $excel = Open-ExcelPackage "relatorio.xlsx"
  Get-Service | Export-Excel -ExcelPackage $excel -WorksheetName "Serviços" -AutoSize
  Get-EventLog System -Newest 100 | Export-Excel -ExcelPackage $excel -WorksheetName "Eventos" -AutoSize
  Close-ExcelPackage $excel -Show  # -Show abre o Excel automaticamente

  # Importar planilha Excel de volta para PowerShell
  $planilha = Import-Excel "dados.xlsx" -WorksheetName "Dados"
  $planilha | Where-Object Status -eq "Pendente" | Format-Table
  `} />

        <h2>Processamento de Arquivos Grandes</h2>
        <CodeBlock title="Streaming para CSVs com milhões de linhas" code={`# Para CSVs ENORMES (GBs) — processamento linha por linha sem carregar tudo
  $reader    = [System.IO.StreamReader]::new("enorme.csv")
  $cabecalho = $reader.ReadLine() -split ","
  $contador  = 0; $erros = 0

  while (-not $reader.EndOfStream) {
      $linha  = $reader.ReadLine()
      $campos = $linha -split ","
      $contador++
      if ($campos.Count -ne $cabecalho.Count) { $erros++ }
      if ($campos[3] -eq "ERRO") { Add-Content "erros.txt" $linha }
      if ($contador % 10000 -eq 0) { Write-Progress -Activity "Processando" -Status "$contador linhas" }
  }
  $reader.Close()
  Write-Progress -Activity "Processando" -Completed
  "Total: $contador linhas | Erros: $erros"

  # Dividir CSV grande em pedaços menores (chunking)
  $i = 0; $chunk = 10000; $pagina = 1
  Import-Csv "enorme.csv" | ForEach-Object {
      $_ | Export-Csv "pedaco-$pagina.csv" -NoTypeInformation -Append -Encoding UTF8
      if (++$i % $chunk -eq 0) { $pagina++; Write-Host "Arquivo $pagina iniciado..." }
  }
  `} />

        <AlertBox type="info" title="Todo campo CSV é uma string">
          Ao importar CSV, <strong>todas as propriedades são strings</strong> — inclusive números
          e datas. Sempre converta explicitamente: <code>[int]$_.Valor</code>,
          <code>[decimal]$_.Preco</code>, <code>[datetime]$_.Data</code>. Ignorar isso causa
          ordenação errada (lexicográfica) e operações matemáticas com resultados incorretos.
        </AlertBox>

        <AlertBox type="warning" title="Encoding em CSVs">
          Arquivos CSV gerados no Excel geralmente usam <strong>Windows-1252 (ANSI)</strong>, não UTF-8.
          Se acentos aparecerem incorretos, use <code>-Encoding Default</code> (PS5.1) ou
          <code>-Encoding Latin1</code> ao importar. Para garantir compatibilidade, sempre
          salve com <code>-Encoding UTF8</code>.
        </AlertBox>
      </PageContainer>
    );
  }
  