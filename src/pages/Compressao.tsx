import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Compressao() {
    return (
      <PageContainer
        title="Compressão e Arquivos"
        subtitle="Comprima, extraia, gerencie e automatize backups com ZIP, 7-Zip, tar e outros formatos."
        difficulty="iniciante"
        timeToRead="25 min"
      >
        <p>
          O PowerShell oferece suporte nativo a arquivos ZIP através do namespace
          <code>System.IO.Compression</code> e dos cmdlets <code>Compress-Archive</code>
          e <code>Expand-Archive</code>. Para formatos avançados como 7z, tar e gz,
          use o 7-Zip ou ferramentas .NET adicionais.
        </p>

        <h2>Compress-Archive e Expand-Archive</h2>
        <CodeBlock title="Comprimindo e extraindo arquivos" code={`# Comprimir pasta inteira
  Compress-Archive -Path "C:\\MeuProjeto" `
    -DestinationPath "C:\\Backups\\projeto-$(Get-Date -Format 'yyyyMMdd').zip"

  # Comprimir múltiplos arquivos/pastas
  Compress-Archive -Path "C:\\Scripts\\*.ps1", "C:\\Config\\app.json" `
    -DestinationPath "C:\\Deploy\\pacote.zip"

  # Comprimir com nível máximo (usando -CompressionLevel)
  Compress-Archive -Path "C:\\MeuProjeto" `
    -DestinationPath "C:\\Backups\\projeto.zip" `
    -CompressionLevel Optimal  # NoCompression, Fastest, Optimal

  # Atualizar ZIP existente (adicionar/substituir arquivos)
  Compress-Archive -Path "C:\\Novo\\arquivo.txt" `
    -DestinationPath "C:\\Backups\\pacote.zip" `
    -Update

  # Extrair ZIP completo
  Expand-Archive -Path "C:\\Backups\\pacote.zip" `
    -DestinationPath "C:\\Restaurado" `
    -Force  # Sobrescrever arquivos existentes

  # Extrair para pasta com timestamp
  $destino = "C:\\Restaurado\\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
  Expand-Archive -Path "C:\\Backups\\pacote.zip" -DestinationPath $destino
  Write-Host "Extraído em: $destino"
  `} />

        <h2>Controle Granular com System.IO.Compression</h2>
        <CodeBlock title="Compressão avançada com a API .NET" code={`Add-Type -AssemblyName System.IO.Compression.FileSystem

  # Criar ZIP com nível de compressão e incluir pasta raiz (ou não)
  function New-ZipOtimizado {
      param(
          [string]$Origem,
          [string]$Destino,
          [bool]$IncluirPastaRaiz = $false
      )
      $nivel = [System.IO.Compression.CompressionLevel]::Optimal
      [System.IO.Compression.ZipFile]::CreateFromDirectory($Origem, $Destino, $nivel, $IncluirPastaRaiz)
      $tam = [math]::Round((Get-Item $Destino).Length/1MB, 2)
      Write-Host "ZIP criado: $Destino ($tam MB)" -ForegroundColor Green
  }
  New-ZipOtimizado "C:\\MeuProjeto" "C:\\Backups\\projeto.zip"

  # Listar conteúdo do ZIP sem extrair (inspeção sem descompactar)
  function Get-ZipContents {
      param([string]$ZipPath)
      $zip = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)
      $zip.Entries | Select-Object FullName,
          @{N="Tamanho KB";   E={ [math]::Round($_.Length/1KB,1) }},
          @{N="Comprimido KB";E={ [math]::Round($_.CompressedLength/1KB,1) }},
          @{N="Taxa %";        E={ if ($_.Length -gt 0) { [math]::Round((1-$_.CompressedLength/$_.Length)*100,1) } else { 0 } }},
          LastWriteTime |
          Sort-Object "Tamanho KB" -Descending |
          Format-Table -AutoSize
      $zip.Dispose()
  }
  Get-ZipContents "C:\\Backups\\projeto.zip"

  # Extrair arquivo específico do ZIP (sem extrair tudo)
  function Get-ZipEntry {
      param([string]$ZipPath, [string]$EntryName)
      $zip = [System.IO.Compression.ZipFile]::OpenRead($ZipPath)
      $entrada = $zip.Entries | Where-Object FullName -eq $EntryName
      if ($entrada) {
          $stream = $entrada.Open()
          $reader = [System.IO.StreamReader]::new($stream)
          $conteudo = $reader.ReadToEnd()
          $reader.Close(); $stream.Close()
      }
      $zip.Dispose()
      return $conteudo
  }
  $json = Get-ZipEntry "C:\\Deploy\\pacote.zip" "config/app.json"
  $json | ConvertFrom-Json
  `} />

        <h2>Backup Automatizado com Rotação</h2>
        <CodeBlock title="Script de backup com retenção configurável" code={`function New-Backup {
      param(
          [string]$Origem,
          [string]$DestinoPasta,
          [string]$Prefixo = "backup",
          [int]$ManterUltimos = 7,
          [switch]$Silencioso
      )

      if (-not (Test-Path $DestinoPasta)) {
          New-Item -ItemType Directory -Path $DestinoPasta | Out-Null
      }

      $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
      $arquivo   = Join-Path $DestinoPasta "${Prefixo}_${timestamp}.zip"

      try {
          Compress-Archive -Path $Origem -DestinationPath $arquivo -CompressionLevel Optimal
          $tamanho = [math]::Round((Get-Item $arquivo).Length/1MB, 2)
          if (-not $Silencioso) {
              Write-Host "Backup criado: $arquivo ($tamanho MB)" -ForegroundColor Green
          }
      } catch {
          Write-Warning "Falha no backup: $_"
          return $null
      }

      # Rotação: remover backups antigos mantendo apenas os N mais recentes
      $todos = Get-ChildItem $DestinoPasta -Filter "${Prefixo}_*.zip" |
          Sort-Object LastWriteTime -Descending

      if ($todos.Count -gt $ManterUltimos) {
          $todos | Select-Object -Skip $ManterUltimos | ForEach-Object {
              Remove-Item $_.FullName -Force
              if (-not $Silencioso) {
                  Write-Host "Rotação: removido $($_.Name)" -ForegroundColor DarkGray
              }
          }
      }
      return $arquivo
  }

  # Backup diário de múltiplas pastas
  $config = @(
      @{ Origem="C:\\InetPub\\wwwroot"; Pasta="D:\\Backups\\Web";    Prefixo="web";    Manter=14 },
      @{ Origem="C:\\Scripts";            Pasta="D:\\Backups\\Scripts"; Prefixo="script"; Manter=30 },
      @{ Origem="C:\\Dados";              Pasta="D:\\Backups\\Dados";   Prefixo="dados";  Manter=7  }
  )

  foreach ($c in $config) {
      New-Backup -Origem $c.Origem -DestinoPasta $c.Pasta `
          -Prefixo $c.Prefixo -ManterUltimos $c.Manter
  }
  `} />

        <h2>7-Zip via PowerShell</h2>
        <CodeBlock title="Usando 7-Zip para formatos avançados" code={`# Instalar 7-Zip
  winget install 7zip.7zip --silent

  $7z = "C:\\Program Files\\7-Zip\\7z.exe"

  # Comprimir em 7z (melhor compressão)
  & $7z a -t7z "saida.7z" "pasta\" -mx=9  # mx=9 é compressão máxima

  # Comprimir em tar.gz (compatível com Linux)
  & $7z a -ttar "temp.tar" "pasta\"
  & $7z a -tgzip "saida.tar.gz" "temp.tar"
  Remove-Item "temp.tar"

  # Extrair qualquer formato
  & $7z x "arquivo.rar" -o"destino\" -y   # -y responde "sim" para tudo

  # Listar conteúdo sem extrair
  & $7z l "arquivo.zip"

  # Criar ZIP com senha
  & $7z a -tzip "protegido.zip" "pasta\" -p"SenhaForte@123" -mhe=on

  # Compressão em múltiplos volumes (útil para e-mail/upload)
  & $7z a -v100m "backup-parte.7z" "pasta-grande\"  # Divide em volumes de 100MB

  # Verificar integridade do arquivo
  & $7z t "backup.7z"

  # Função wrapper para 7-Zip
  function Compress-7zip {
      param(
          [string]$Origem,
          [string]$Destino,
          [ValidateSet("7z","zip","tar","gzip")]
          [string]$Formato = "7z",
          [int]$Nivel = 9
      )
      & $7z a -t$Formato $Destino $Origem "-mx=$Nivel" -y
      if ($LASTEXITCODE -eq 0) {
          Write-Host "Comprimido: $Destino" -ForegroundColor Green
      } else {
          Write-Error "Falha na compressão (código $LASTEXITCODE)"
      }
  }
  `} />

        <h2>Compressão de Strings e Streams</h2>
        <CodeBlock title="Comprimindo dados em memória com GZip" code={`# Comprimir string na memória (útil para logs, JSON grande)
  function Compress-String {
      param([string]$Texto)
      $bytes  = [System.Text.Encoding]::UTF8.GetBytes($Texto)
      $output = [System.IO.MemoryStream]::new()
      $gzip   = [System.IO.Compression.GZipStream]::new($output, [System.IO.Compression.CompressionMode]::Compress)
      $gzip.Write($bytes, 0, $bytes.Length)
      $gzip.Close()
      return [Convert]::ToBase64String($output.ToArray())
  }

  function Expand-String {
      param([string]$ComprimidoBase64)
      $bytes  = [Convert]::FromBase64String($ComprimidoBase64)
      $input  = [System.IO.MemoryStream]::new($bytes)
      $gzip   = [System.IO.Compression.GZipStream]::new($input, [System.IO.Compression.CompressionMode]::Decompress)
      $reader = [System.IO.StreamReader]::new($gzip)
      return $reader.ReadToEnd()
  }

  # Uso
  $json = Get-Process | ConvertTo-Json
  $comprimido = Compress-String $json
  Write-Host "Original: $($json.Length) chars | Comprimido: $($comprimido.Length) chars"
  $restaurado = Expand-String $comprimido
  ($restaurado | ConvertFrom-Json).Count
  `} />

        <AlertBox type="info" title="7-Zip para Formatos Avançados">
          Para formatos como 7z, RAR, tar.gz, use o 7-Zip via PowerShell.
          Instale com <code>winget install 7zip.7zip</code> e chame via
          <code>& "C:\Program Files\7-Zip\7z.exe"</code>. O 7z oferece
          taxa de compressão superior ao ZIP nativo do Windows.
        </AlertBox>

        <AlertBox type="warning" title="Limite do Compress-Archive">
          O cmdlet nativo <code>Compress-Archive</code> tem um limite de 2GB por arquivo de entrada.
          Para arquivos maiores, use <code>System.IO.Compression.ZipFile</code> ou 7-Zip.
        </AlertBox>
      </PageContainer>
    );
  }
  