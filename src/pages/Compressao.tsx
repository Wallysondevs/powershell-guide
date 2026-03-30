import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Compressao() {
  return (
    <PageContainer
      title="Compressão e Arquivos Zip"
      subtitle="Comprima, extraia e gerencie arquivos ZIP e outros formatos com PowerShell."
      difficulty="iniciante"
      timeToRead="15 min"
    >
      <p>
        O PowerShell oferece suporte nativo a arquivos ZIP através do namespace
        <code>System.IO.Compression</code> e dos cmdlets <code>Compress-Archive</code>
        e <code>Expand-Archive</code>, além de suporte a outros formatos via ferramentas externas.
      </p>

      <h2>Compress-Archive e Expand-Archive</h2>
      <CodeBlock title="Comprimindo e extraindo arquivos" code={`# Comprimir pasta inteira
Compress-Archive -Path "C:\\MeuProjeto"  -DestinationPath "C:\\Backups\\projeto-$(Get-Date -Format 'yyyyMMdd').zip"

# Comprimir múltiplos arquivos/pastas
Compress-Archive -Path "C:\\Scripts\\*.ps1", "C:\\Config\\app.json"  -DestinationPath "C:\\Deploy\\pacote.zip"

# Atualizar ZIP existente (adicionar arquivos)
Compress-Archive -Path "C:\\Novo\\arquivo.txt"  -DestinationPath "C:\\Backups\\pacote.zip"  -Update

# Extrair ZIP completo
Expand-Archive -Path "C:\\Backups\\pacote.zip"  -DestinationPath "C:\\Restaurado"  -Force  # Sobrescrever arquivos existentes

# Extrair para pasta com nome da data
$destino = "C:\\Restaurado\\$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Expand-Archive -Path "C:\\Backups\\pacote.zip" -DestinationPath $destino
`} />

      <h2>Controle Granular com System.IO.Compression</h2>
      <CodeBlock title="Compressão avançada com a API .NET" code={`Add-Type -AssemblyName System.IO.Compression.FileSystem

# Criar ZIP com nível de compressão
function New-ZipOtimizado {
    param([string]$Origem, [string]$Destino)

    $nivel = [System.IO.Compression.CompressionLevel]::Optimal
    [System.IO.Compression.ZipFile]::CreateFromDirectory($Origem, $Destino, $nivel, $false)
    Write-Host "ZIP criado: $Destino ($([math]::Round((Get-Item $Destino).Length/1MB,2))MB)"
}

New-ZipOtimizado "C:\\MeuProjeto" "C:\\Backups\\projeto.zip"

# Listar conteúdo do ZIP sem extrair
$zip = [System.IO.Compression.ZipFile]::OpenRead("C:\\pacote.zip")
$zip.Entries | Select-Object FullName, Length, CompressedLength |
    Sort-Object Length -Descending | Format-Table -AutoSize
$zip.Dispose()

# Extrair arquivo específico do ZIP
$zip = [System.IO.Compression.ZipFile]::OpenRead("C:\\pacote.zip")
$entrada = $zip.Entries | Where-Object FullName -eq "config/app.json"
if ($entrada) {
    $stream = $entrada.Open()
    $reader = [System.IO.StreamReader]::new($stream)
    $conteudo = $reader.ReadToEnd()
    $reader.Close()
    $stream.Close()
}
$zip.Dispose()
$conteudo | ConvertFrom-Json
`} />

      <h2>Backup Automatizado com ZIP</h2>
      <CodeBlock title="Script de backup com rotação de arquivos" code={`function New-Backup {
    param(
        [string]$Origem,
        [string]$DestinoPasta,
        [string]$Prefixo = "backup",
        [int]$ManterUltimos = 7
    )

    # Criar pasta de destino se não existir
    if (-not (Test-Path $DestinoPasta)) {
        New-Item -ItemType Directory -Path $DestinoPasta | Out-Null
    }

    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $arquivo   = Join-Path $DestinoPasta "${Prefixo}_${timestamp}.zip"

    try {
        Compress-Archive -Path $Origem -DestinationPath $arquivo
        $tamanho = [math]::Round((Get-Item $arquivo).Length/1MB, 2)
        Write-Host "Backup criado: $arquivo ($tamanho MB)" -ForegroundColor Green
    } catch {
        Write-Warning "Falha no backup: $_"
        return
    }

    # Rotação: remover backups antigos
    $todos = Get-ChildItem $DestinoPasta -Filter "${Prefixo}_*.zip" |
        Sort-Object LastWriteTime -Descending
    if ($todos.Count -gt $ManterUltimos) {
        $todos | Select-Object -Skip $ManterUltimos | ForEach-Object {
            Remove-Item $_.FullName -Force
            Write-Host "Removido backup antigo: $($_.Name)"
        }
    }
}

# Agendar backup
New-Backup -Origem "C:\\MeuProjeto"  -DestinoPasta "D:\\Backups\\Projetos"  -Prefixo "meu-projeto"  -ManterUltimos 10
`} />

      <AlertBox type="info" title="7-Zip para Formatos Avançados">
        Para formatos como 7z, RAR, tar.gz, use o executável 7-Zip via PowerShell:
        <code>& "C:\Program Files\7-Zip\7z.exe" a -t7z arquivo.7z pasta\ -mx=9</code>.
        Instale com <code>winget install 7zip.7zip</code>.
      </AlertBox>
    </PageContainer>
  );
}
