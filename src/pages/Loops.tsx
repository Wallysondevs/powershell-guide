import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Loops() {
  return (
    <PageContainer
      title="Loops Avançados e Iteração"
      subtitle="For, ForEach, While, Do-While, ForEach-Object e técnicas de controle de fluxo em loops."
      difficulty="intermediário"
      timeToRead="20 min"
    >
      <p>
        PowerShell oferece múltiplos mecanismos de iteração, cada um com suas características
        de performance e legibilidade. Conhecer quando usar cada um é essencial para escrever
        scripts eficientes.
      </p>

      <h2>Tipos de Loop e Performance</h2>
      <CodeBlock title="For, ForEach, While e suas diferenças" code={`# For clássico — ideal para índices
for ($i = 0; $i -lt 10; $i++) {
    "Iteração $i"
}

# ForEach — mais legível para coleções
foreach ($item in @("maçã","banana","laranja")) {
    "Fruta: $item"
}

# ForEach-Object no pipeline — processa item por item (streaming)
Get-ChildItem "C:\\Logs" -Filter "*.log" | ForEach-Object {
    "Arquivo: $($_.Name) | Tamanho: $($_.Length/1KB)KB"
}

# While — condição no início
$tentativas = 0
while ($tentativas -lt 5) {
    $ok = Test-Connection "servidor01" -Count 1 -Quiet
    if ($ok) { break }
    $tentativas++
    Start-Sleep -Seconds 2
}

# Do-While — garante pelo menos uma execução
$i = 0
do {
    $i++
    "Tentativa $i"
} while ($i -lt 3)

# Do-Until — executa até a condição ser verdadeira
do {
    $status = (Get-Service "MinhaApp").Status
    Start-Sleep -Seconds 1
} until ($status -eq "Running")
`} />

      <h2>break, continue e labels</h2>
      <CodeBlock title="Controle de fluxo dentro de loops" code={`# break — sair do loop atual
foreach ($n in 1..100) {
    if ($n -eq 10) { break }  # Para em 10
    Write-Host $n
}

# continue — pular para próxima iteração
foreach ($n in 1..20) {
    if ($n % 2 -eq 0) { continue }  # Pula pares
    Write-Host $n  # Só imprime ímpares
}

# Labels para loops aninhados
:outerLoop foreach ($i in 1..5) {
    foreach ($j in 1..5) {
        if ($i -eq 3 -and $j -eq 3) {
            break outerLoop  # Sai de AMBOS os loops
        }
        "$i,$j"
    }
}

# Pular iteração do loop externo
:outerLoop for ($i = 1; $i -le 5; $i++) {
    for ($j = 1; $j -le 5; $j++) {
        if ($j -eq 3) { continue outerLoop }  # Próxima iteração do loop externo
        "$i.$j"
    }
}
`} />

      <h2>ForEach-Object Avançado</h2>
      <CodeBlock title="Blocos Begin, Process e End no pipeline" code={`# ForEach-Object com Begin/Process/End
Get-Content "C:\\Logs\\app.log" | ForEach-Object  -Begin   { $total = 0; $erros = 0; Write-Host "Iniciando análise..." }  -Process {
        $total++
        if ($_ -match "ERROR") { $erros++ }
    }  -End     {
        Write-Host "Total de linhas: $total"
        Write-Host "Total de erros: $erros"
        if ($total -gt 0) {
            "Taxa de erros: $([math]::Round($erros/$total*100, 2))%"
        }
    }

# Alias % é equivalente a ForEach-Object
1..10 | % { $_ * 2 }

# Encadear múltiplos ForEach-Object
Get-ChildItem "C:\\Logs" -Recurse -Filter "*.log" |
    Where-Object Length -gt 1MB |
    ForEach-Object {
        $linhas = (Get-Content $_.FullName | Measure-Object).Count
        [PSCustomObject]@{
            Arquivo  = $_.Name
            TamanhoMB = [math]::Round($_.Length/1MB, 2)
            Linhas   = $linhas
        }
    } |
    Sort-Object Linhas -Descending
`} />

      <h2>Loops Infinitos Controlados</h2>
      <CodeBlock title="Polling e monitoramento contínuo" code={`# Loop infinito com condição de saída
$maxTentativas = 10
$tentativa = 0

while ($true) {
    $tentativa++
    if ($tentativa -gt $maxTentativas) {
        Write-Warning "Limite de tentativas atingido"
        break
    }

    try {
        $resp = Invoke-WebRequest "https://meuservico.com/health" -TimeoutSec 5
        if ($resp.StatusCode -eq 200) {
            Write-Host "Serviço online!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "Tentativa $tentativa: serviço offline. Aguardando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
}

# Monitor de saúde a cada 60 segundos (até Ctrl+C)
Write-Host "Monitorando... Pressione Ctrl+C para parar"
try {
    while ($true) {
        $cpu  = (Get-CimInstance Win32_Processor).LoadPercentage
        $ram  = [math]::Round((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1MB, 2)
        Write-Host "$(Get-Date -Format 'HH:mm:ss') | CPU: $cpu% | RAM Livre: ${ram}GB"
        Start-Sleep -Seconds 60
    }
} finally {
    Write-Host "\`nMonitoramento encerrado"
}
`} />

      <AlertBox type="info" title="Performance de Loops">
        <code>foreach</code> (statement) é mais rápido que <code>ForEach-Object</code> (cmdlet)
        para coleções em memória. Use <code>ForEach-Object</code> para streaming no pipeline
        (processamento linha por linha de arquivos grandes).
      </AlertBox>
    </PageContainer>
  );
}
