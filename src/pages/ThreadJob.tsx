import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ThreadJob() {
  return (
    <PageContainer
      title="ThreadJob e Runspaces — Paralelismo leve"
      subtitle="Start-ThreadJob e ForEach-Object -Parallel: paralelismo real sem o custo de Start-Job (que abre processo). 10× mais rápido para I/O paralelo."
      difficulty="avancado"
      timeToRead="22 min"
    >
      <p>
        <code>Start-Job</code> tradicional cria um <strong>processo separado</strong>
        para cada job — caro, lento, com overhead de serialização (objetos viram
        XML e voltam). <code>Start-ThreadJob</code> roda em <strong>thread</strong>
        no mesmo processo, então é <strong>10–50× mais rápido</strong> para
        cargas pequenas e médias.
      </p>

      <AlertBox type="info" title="Quando usar cada um">
        <ul>
          <li><strong>ThreadJob</strong> — I/O paralelo (HTTP, ping, queries SQL), centenas de operações leves.</li>
          <li><strong>Job (processo)</strong> — isolar comandos perigosos, cargas CPU-bound longas, ou quando precisa que erro fatal não derrube a sessão principal.</li>
          <li><strong>ForEach-Object -Parallel</strong> (PS 7+) — paralelismo "fire and aggregate" estilo .ForEach() de C#.</li>
          <li><strong>Runspaces manuais</strong> — controle total, pool, throttling sofisticado.</li>
        </ul>
      </AlertBox>

      <h2>Instalação (PS 5.1) — vem nativo no PS 7</h2>
      <CodeBlock title="Apenas em PS 5.1 precisa instalar" code={`# PowerShell 5.1
Install-Module -Name ThreadJob -Scope CurrentUser

# PowerShell 7+ — já vem incluído
Get-Command Start-ThreadJob`} />

      <h2>Conceito — comparação direta</h2>
      <CodeBlock title="Mesma carga, custos diferentes" code={`# Job tradicional — abre 10 processos pwsh.exe
Measure-Command {
    1..10 | ForEach-Object {
        Start-Job { Start-Sleep -Milliseconds 100; "Job $using:_" }
    } | Wait-Job | Receive-Job | Out-Null
}    # ~5-8 segundos no Windows (overhead de spawn)

# ThreadJob — 10 threads no mesmo processo
Measure-Command {
    1..10 | ForEach-Object {
        Start-ThreadJob { Start-Sleep -Milliseconds 100; "Thread $using:_" }
    } | Wait-Job | Receive-Job | Out-Null
}    # ~0.3 segundos`} />

      <h2>Start-ThreadJob — sintaxe básica</h2>
      <CodeBlock title="Igual Start-Job mas com thread" code={`# Job único
$j = Start-ThreadJob -ScriptBlock {
    Start-Sleep -Seconds 2
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
}

# Esperar e receber
$resultado = $j | Wait-Job | Receive-Job
Remove-Job $j

# Acompanhamento
$j.State        # NotStarted, Running, Completed, Failed, Stopped
$j.HasMoreData  # $true até receber
$j.Output       # Saída acumulada`} />

      <h2>Variáveis externas — $using</h2>
      <CodeBlock title="$using:variavel injeta valor da sessão pai" code={`$pasta = 'C:\\logs'
$idade = 30

$j = Start-ThreadJob {
    # ERRADO: $pasta seria $null aqui
    Get-ChildItem $using:pasta -Recurse |
        Where-Object LastWriteTime -lt (Get-Date).AddDays(-$using:idade)
}

$arquivos = $j | Wait-Job | Receive-Job

# Para passar parâmetros sem $using
$j = Start-ThreadJob -ArgumentList $pasta, $idade -ScriptBlock {
    param($p, $i)
    Get-ChildItem $p -Recurse |
        Where-Object LastWriteTime -lt (Get-Date).AddDays(-$i)
}`} />

      <h2>Throttle — limitar threads simultâneos</h2>
      <CodeBlock title="Não destruir o sistema com 10 mil threads" code={`# Default: ilimitado (cuidado!)
$jobs = 1..200 | ForEach-Object {
    Start-ThreadJob -ThrottleLimit 10 -ScriptBlock {
        param($n)
        Test-Connection -ComputerName "10.0.0.$n" -Count 1 -Quiet
    } -ArgumentList $_
}

# Espera todos
$resultados = $jobs | Wait-Job | Receive-Job

# Limpa
$jobs | Remove-Job`} />

      <h2>ForEach-Object -Parallel (PS 7+)</h2>
      <CodeBlock title="Paralelismo no pipeline, sintaxe limpa" code={`# Verifica 254 IPs em paralelo, 32 simultâneos
1..254 | ForEach-Object -Parallel {
    $ip = "192.168.1.$_"
    if (Test-Connection -ComputerName $ip -Count 1 -Quiet -TimeoutSeconds 1) {
        [pscustomobject]@{ IP = $ip; Online = $true; Hora = Get-Date }
    }
} -ThrottleLimit 32

# Variáveis externas: também usa $using
$timeout = 2
1..100 | ForEach-Object -Parallel {
    Test-Connection "host$_" -Count 1 -TimeoutSeconds $using:timeout
} -ThrottleLimit 16

# Com ProgressBar (PS 7.4+) e timeout total
1..50 | ForEach-Object -Parallel {
    Invoke-RestMethod "https://api.exemplo.com/item/$_"
} -ThrottleLimit 8 -TimeoutSeconds 60`} />

      <AlertBox type="warning" title="Variáveis dentro de -Parallel">
        <p>
          Cada iteração roda em um runspace isolado. <code>$using:var</code>
          copia o valor (não compartilha referência). Para modificar estado
          compartilhado use <code>[hashtable]::Synchronized(@{})</code> ou
          <code>System.Collections.Concurrent.ConcurrentBag</code>.
        </p>
      </AlertBox>

      <h2>Caso prático 1 — Scan de portas paralelo</h2>
      <CodeBlock title="Verificar 1000 portas em segundos" code={`function Test-PortRange {
    param(
        [string]$ComputerName,
        [int[]]$Ports = (1..1024),
        [int]$ThrottleLimit = 100,
        [int]$TimeoutMs = 500
    )

    $Ports | ForEach-Object -Parallel {
        $tcp = [System.Net.Sockets.TcpClient]::new()
        try {
            $task = $tcp.ConnectAsync($using:ComputerName, $_)
            if ($task.Wait($using:TimeoutMs)) {
                [pscustomobject]@{ Port = $_; Open = $true }
            }
        } catch { }
        finally { $tcp.Close() }
    } -ThrottleLimit $ThrottleLimit |
        Where-Object Open |
        Sort-Object Port
}

Test-PortRange -ComputerName scanme.nmap.org -Ports 20..30,80,443,8080`} />

      <h2>Caso prático 2 — Download paralelo de arquivos</h2>
      <CodeBlock title="20 arquivos em paralelo com retry" code={`$urls = Get-Content urls.txt
$destino = 'C:\\downloads'
New-Item $destino -Type Directory -Force | Out-Null

$resultados = $urls | ForEach-Object -Parallel {
    $url  = $_
    $nome = Split-Path $url -Leaf
    $path = Join-Path $using:destino $nome

    $tentativas = 0
    while ($tentativas -lt 3) {
        try {
            Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing -ErrorAction Stop
            [pscustomobject]@{ Url = $url; Status = 'OK'; Path = $path }
            break
        } catch {
            $tentativas++
            Start-Sleep -Seconds (2 * $tentativas)
            if ($tentativas -eq 3) {
                [pscustomobject]@{ Url = $url; Status = 'FALHOU'; Erro = $_.Exception.Message }
            }
        }
    }
} -ThrottleLimit 8

$resultados | Group-Object Status | Format-Table Name, Count`} />

      <h2>Caso prático 3 — Coletar inventário de 500 servidores</h2>
      <CodeBlock title="WMI/CIM em paralelo" code={`$servidores = Get-Content servidores.txt
$cred = Get-Credential

$inventario = $servidores | ForEach-Object -Parallel {
    try {
        $cs   = Get-CimInstance Win32_ComputerSystem  -ComputerName $_ -ErrorAction Stop
        $os   = Get-CimInstance Win32_OperatingSystem -ComputerName $_ -ErrorAction Stop
        $disk = Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3' -ComputerName $_ |
                Measure-Object FreeSpace -Sum

        [pscustomobject]@{
            Servidor = $_
            CPU      = $cs.NumberOfLogicalProcessors
            RAM_GB   = [math]::Round($cs.TotalPhysicalMemory / 1GB, 1)
            OS       = $os.Caption
            Build    = $os.BuildNumber
            FreeGB   = [math]::Round($disk.Sum / 1GB, 1)
            Status   = 'OK'
        }
    } catch {
        [pscustomobject]@{
            Servidor = $_
            Status   = 'OFFLINE'
            Erro     = $_.Exception.Message
        }
    }
} -ThrottleLimit 50

$inventario | Export-Csv inventario.csv -NoTypeInformation -Encoding UTF8`} />

      <h2>Runspace pool manual — controle total</h2>
      <CodeBlock title="Quando ThreadJob não basta" code={`$pool = [runspacefactory]::CreateRunspacePool(1, 16)
$pool.Open()

$tasks = 1..50 | ForEach-Object {
    $ps = [powershell]::Create().AddScript({
        param($n)
        Start-Sleep -Milliseconds 200
        "Tarefa $n em thread $([threading.thread]::CurrentThread.ManagedThreadId)"
    }).AddArgument($_)

    $ps.RunspacePool = $pool
    [pscustomobject]@{
        PowerShell = $ps
        Async      = $ps.BeginInvoke()
    }
}

# Aguardar e coletar
$saidas = $tasks | ForEach-Object {
    $_.PowerShell.EndInvoke($_.Async)
    $_.PowerShell.Dispose()
}

$pool.Close()
$pool.Dispose()

$saidas`} />

      <h2>Coleções thread-safe</h2>
      <CodeBlock title="Acumular resultados de threads sem perder dados" code={`# Hashtable sincronizada
$shared = [hashtable]::Synchronized(@{ contador = 0; sucesso = @() })

1..100 | ForEach-Object -Parallel {
    $local = $using:shared
    [System.Threading.Monitor]::Enter($local)
    try {
        $local.contador++
        $local.sucesso += $_
    } finally {
        [System.Threading.Monitor]::Exit($local)
    }
}

$shared.contador           # 100

# ConcurrentBag — mais idiomático
$bag = [System.Collections.Concurrent.ConcurrentBag[object]]::new()
1..100 | ForEach-Object -Parallel {
    ($using:bag).Add(@{ Id = $_; Hora = [datetime]::Now })
}
$bag.Count                 # 100`} />

      <AlertBox type="danger" title="Armadilha — variáveis de referência">
        <p>
          <code>$using:array</code> envia uma cópia da REFERÊNCIA, mas o array
          em si é o mesmo objeto. Modificar um elemento dentro do thread afeta
          a sessão pai — sem mutex isso causa race condition silenciosa. Para
          dados imutáveis está ok; para mutáveis use coleções thread-safe.
        </p>
      </AlertBox>

      <h2>Diagnóstico — quanto tempo cada thread levou?</h2>
      <CodeBlock title="Profiling rápido" code={`$tempos = 1..20 | ForEach-Object -Parallel {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    Invoke-WebRequest "https://api.github.com/repos/PowerShell/PowerShell" -UseBasicParsing | Out-Null
    $sw.Stop()
    [pscustomobject]@{
        Item = $_
        Ms   = $sw.ElapsedMilliseconds
        Th   = [threading.thread]::CurrentThread.ManagedThreadId
    }
} -ThrottleLimit 5

$tempos | Sort-Object Ms -Descending | Format-Table
$tempos | Measure-Object Ms -Average -Maximum -Minimum`} />

      <h2>Cheat — qual paralelismo usar?</h2>
      <CodeBlock title="Decisão rápida" code={`# Job rápido, leve, I/O                    → Start-ThreadJob
# Pipeline com 1 transformação paralela     → ForEach-Object -Parallel
# Centenas/milhares de operações curtas     → Runspace pool
# Comando que pode CRASHAR a sessão         → Start-Job (processo isolado)
# CPU-bound longo (compressão, ML)          → Job + processador isolado
# Async HTTP nativo                         → Tasks .NET ([Threading.Tasks])`} />

      <AlertBox type="success" title="Resumão">
        <p>
          Para 95% dos casos: <code>ForEach-Object -Parallel -ThrottleLimit 8</code>
          em PS 7+, ou <code>Start-ThreadJob</code> em PS 5.1. Reserve
          <code>Start-Job</code> para cargas que precisam isolar processo.
          Evite Runspaces manuais salvo necessidade real de controle fino.
        </p>
      </AlertBox>
    </PageContainer>
  );
}
