import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function ConteudoArquivos() {
    return (
      <PageContainer
        title="Manipulação de Conteúdo de Arquivos"
        subtitle="Lendo, escrevendo, filtrando e processando dados em arquivos de texto e binários."
        difficulty="intermediario"
        timeToRead="28 min"
      >
        <p>
          Ler e escrever conteúdo em arquivos é uma tarefa diária. O PowerShell trata
          conteúdo de arquivo como arrays de objetos, tornando filtragem, substituição
          e processamento em lote muito mais elegantes que ferramentas de texto simples.
        </p>

        <h2>Lendo Conteúdo com Get-Content</h2>
        <CodeBlock title="Diferentes formas de ler arquivos" code={`# Ler arquivo inteiro (retorna array de strings — uma por linha)
  $linhas = Get-Content "C:\\Logs\\app.log"
  $linhas.Count        # Número de linhas
  $linhas[0]          # Primeira linha
  $linhas[-1]         # Última linha

  # Apenas as primeiras / últimas N linhas
  Get-Content "app.log" -TotalCount 10   # Primeiras 10 (como head)
  Get-Content "app.log" -Tail 50         # Últimas 50 (como tail)

  # Leitura como string única (para regex multilinhas)
  $conteudo = Get-Content "config.json" -Raw
  $conteudo -match '"porta":\s*(\d+)'  # True
  $Matches[1]  # Porta encontrada

  # Monitorar arquivo em tempo real (tail -f)
  Get-Content "app.log" -Wait -Tail 0  # Aguarda e mostra novos conteúdos

  # Alta performance com arquivo grande (streaming .NET — não carrega tudo em memória)
  $reader = [System.IO.File]::OpenText("C:\\Logs\\enorme.log")
  while (-not $reader.EndOfStream) {
      $linha = $reader.ReadLine()
      if ($linha -match "ERROR") { Write-Host $linha }
  }
  $reader.Close()
  `} />

        <h2>Escrevendo Conteúdo</h2>
        <CodeBlock title="Set-Content, Add-Content e Out-File" code={`# Set-Content — sobrescreve o arquivo (ou cria se não existir)
  Set-Content -Path "saida.txt" -Value "Linha inicial"
  Set-Content -Path "saida.txt" -Value @("Linha 1","Linha 2","Linha 3")

  # Add-Content — adiciona ao final
  Add-Content -Path "log.txt" -Value "$(Get-Date) — Backup concluído"
  Add-Content -Path "log.txt" -Value "" # Linha em branco

  # Limpar conteúdo sem apagar o arquivo
  Clear-Content "temporario.log"

  # Out-File — redireciona saída de comandos para arquivo
  Get-Process | Format-Table | Out-File "processos.txt"
  Get-Process | Format-Table | Out-File "processos.txt" -Append  # Adicionar sem apagar

  # Set-Content vs Out-File:
  # Set-Content converte para string preservando propriedades
  # Out-File formata como seria exibido no console
  # Para dados estruturados (CSV, JSON) prefira Export-Csv / ConvertTo-Json | Set-Content

  # Redirecionamento de saída (operadores)
  Get-Process > "processos.txt"     # Sobrescrever
  Get-Process >> "processos.txt"    # Acrescentar
  Get-Error  2> "erros.txt"        # Redirecionar erros
  `} />

        <h2>Codificação de Caracteres</h2>
        <CodeBlock title="Trabalhando com diferentes encodings" code={`# Especificar encoding ao ler
  Get-Content "arquivo.csv" -Encoding UTF8
  Get-Content "arquivo_windows.txt" -Encoding Latin1  # ANSI/Windows-1252

  # Especificar encoding ao escrever
  Set-Content "script.ps1" -Value "# Comentário com acentuação" -Encoding UTF8
  Set-Content "legado.txt"  -Value "Texto"               -Encoding Default  # ANSI no PS5.1

  # Detectar encoding de um arquivo
  $bytes = [System.IO.File]::ReadAllBytes("arquivo.txt")
  if ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xFE) { "UTF-16 LE" }
  elseif ($bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) { "UTF-8 BOM" }
  else { "Sem BOM (provavelmente UTF-8 ou ANSI)" }

  # Converter encoding de arquivo
  $conteudo = Get-Content "arquivo-ansi.txt" -Encoding Default
  Set-Content "arquivo-utf8.txt" -Value $conteudo -Encoding UTF8

  # PS7: encoding padrão é UTF-8 sem BOM — mais compatível com Linux
  # PS5.1: encoding padrão é UTF-16 para Set-Content e ANSI para Out-File
  `} />

        <AlertBox type="warning" title="UTF-8 com e sem BOM">
          No Windows PowerShell 5.1 o padrão é UTF-16. No PowerShell 7+ é UTF-8 sem BOM.
          Scripts e arquivos de config criados no PS5.1 com acentos podem ter problemas ao
          serem abertos no PS7. Sempre especifique <code>-Encoding UTF8</code> explicitamente.
        </AlertBox>

        <h2>Processamento via Pipeline</h2>
        <CodeBlock title="Filtragem, substituição e transformação de linhas" code={`# Filtrar linhas que contêm uma palavra
  Get-Content "app.log" | Where-Object { $_ -match "ERROR|FATAL" }

  # Select-String — busca como grep (retorna objetos MatchInfo)
  Get-Content "app.log" | Select-String "Exception"

  # Com contexto (linhas antes/depois)
  Get-Content "app.log" | Select-String "OutOfMemory" -Context 3,5

  # Substituição em arquivo inteiro
  (Get-Content "config.ini") -replace 'localhost', '10.0.0.5' |
      Set-Content "config.ini"

  # Substituição múltipla
  $conteudo = Get-Content "template.html" -Raw
  $conteudo = $conteudo `
      -replace "{{EMPRESA}}",  "Minha Empresa Ltda" `
      -replace "{{TELEFONE}}", "(11) 9999-8888" `
      -replace "{{DATA}}",     (Get-Date -Format "dd/MM/yyyy")
  Set-Content "pagina.html" -Value $conteudo -Encoding UTF8

  # Processar arquivo de log grande linha por linha
  $erros = 0; $avisos = 0
  Get-Content "server.log" | ForEach-Object {
      if ($_ -match "ERROR") { $erros++ }
      if ($_ -match "WARN")  { $avisos++ }
  }
  "Erros: $erros | Avisos: $avisos"
  `} />

        <h2>Formatos Estruturados: JSON, CSV e XML</h2>
        <CodeBlock title="Ler e escrever dados estruturados" code={`# JSON — ler, modificar e salvar
  $config = Get-Content "appsettings.json" -Raw | ConvertFrom-Json
  $config.ConnectionStrings.Default = "Server=SRV01;Database=Prod;Trusted_Connection=True"
  $config | ConvertTo-Json -Depth 10 | Set-Content "appsettings.json" -Encoding UTF8

  # CSV — pipeline completo
  $usuarios = Import-Csv "usuarios.csv" -Delimiter ";" -Encoding UTF8
  $usuarios |
      Where-Object { $_.Departamento -eq "TI" } |
      Select-Object Nome, Email, @{N="Ativo"; E={ $_.Status -eq "1" ? "Sim" : "Não" }} |
      Export-Csv "ti-usuarios.csv" -NoTypeInformation -Encoding UTF8 -Delimiter ";"

  # Adicionar coluna calculada ao CSV
  Import-Csv "funcionarios.csv" |
      Select-Object *, @{N="NomeCompleto"; E={ "$($_.Primeiro) $($_.Sobrenome)" }} |
      Export-Csv "funcionarios-atualizado.csv" -NoTypeInformation

  # XML — leitura de arquivo de configuração
  [xml]$xml = Get-Content "config.xml"
  $xml.Configuration.Database.Server  # Navegar pelo XML como objeto
  $xml.Configuration.Database.Server = "NovoServidor"
  $xml.Save("C:\\config.xml")   # Save() requer caminho absoluto

  # Arquivo INI simples — leitura manual
  $ini = @{}
  Get-Content "config.ini" | ForEach-Object {
      if ($_ -match "^(\w+)=(.+)$") {
          $ini[$Matches[1]] = $Matches[2].Trim()
      }
  }
  $ini.Servidor  # Valor da chave "Servidor" no INI
  `} />

        <h2>Manipulação de Arquivos Binários</h2>
        <CodeBlock title="Lendo e escrevendo dados binários" code={`# Ler arquivo binário como bytes
  $bytes = [System.IO.File]::ReadAllBytes("C:\\arquivo.bin")
  $bytes.Length   # Tamanho em bytes

  # Verificar magic bytes (identificar tipo de arquivo)
  $header = $bytes[0..3]
  $hex = $header | ForEach-Object { $_.ToString("X2") }
  switch ($hex -join "") {
      "25504446" { "PDF" }
      "504B0304" { "ZIP / Office (xlsx, docx)" }
      "FFD8FFE0" { "JPEG" }
      "89504E47" { "PNG" }
      default     { "Desconhecido: $($hex -join ' ')" }
  }

  # Escrever bytes em arquivo
  $dados = [byte[]](0x48, 0x65, 0x6C, 0x6C, 0x6F)  # "Hello" em ASCII
  [System.IO.File]::WriteAllBytes("C:\\saida.bin", $dados)

  # Copiar parte de arquivo (fatia de bytes)
  $parteBytes = $bytes[100..199]  # Bytes 100 a 199
  [System.IO.File]::WriteAllBytes("C:\\parte.bin", $parteBytes)

  # Base64 encode/decode (útil para transferência de binários)
  $base64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes("imagem.png"))
  $decoded = [Convert]::FromBase64String($base64)
  [IO.File]::WriteAllBytes("imagem-restaurada.png", $decoded)
  `} />

        <AlertBox type="info" title="Performance: Get-Content vs System.IO.File">
          <code>Get-Content</code> é conveniente mas carrega o arquivo inteiro em memória como array.
          Para arquivos grandes use <code>[System.IO.File]::ReadLines()</code> que faz streaming
          linha por linha sem consumir toda a RAM. Para binários, sempre use
          <code>[System.IO.File]::ReadAllBytes()</code>.
        </AlertBox>
      </PageContainer>
    );
  }
  