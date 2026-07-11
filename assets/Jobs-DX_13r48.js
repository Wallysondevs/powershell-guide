import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Jobs e Execução Paralela`,subtitle:`Execute tarefas em background com jobs, runspaces e paralelismo com ForEach-Object -Parallel.`,difficulty:`intermediário`,timeToRead:`30 min`,children:[(0,i.jsxs)(`p`,{children:[`PowerShell oferece várias formas de executar código de forma assíncrona e paralela: Jobs de background clássicos, Runspaces de baixo nível e — a partir do PowerShell 7 — o parâmetro `,(0,i.jsx)(`code`,{children:`-Parallel`}),` no ForEach-Object. Cada abordagem tem seus trade-offs.`]}),(0,i.jsx)(`h2`,{children:`Background Jobs Clássicos`}),(0,i.jsx)(t,{title:`Start-Job e Wait-Job`,code:`# Iniciar job em background
$job1 = Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
}

$job2 = Start-Job -ScriptBlock {
    Invoke-WebRequest "https://api.github.com/repos/PowerShell/PowerShell" |
        ConvertFrom-Json |
        Select-Object name, stargazers_count, open_issues
}

# Verificar status
Get-Job | Format-Table Id, Name, State, HasMoreData

# Aguardar todos os jobs terminarem
Wait-Job -Job $job1, $job2 | Out-Null

# Receber resultados
$resultado1 = Receive-Job -Job $job1
$resultado2 = Receive-Job -Job $job2

$resultado1 | Format-Table -AutoSize
$resultado2

# Limpar jobs
Remove-Job -Job $job1, $job2
# ou limpar todos
Get-Job | Remove-Job -Force
`}),(0,i.jsx)(`h2`,{children:`Jobs com Parâmetros`}),(0,i.jsx)(t,{title:`Passando argumentos para jobs`,code:`$pasta   = "C:Logs"
$padrao  = "ERROR"
$dias    = 7

$job = Start-Job -ScriptBlock {
    param($p, $pat, $d)
    $limite = (Get-Date).AddDays(-$d)
    Get-ChildItem $p -Filter "*.log" |
        Where-Object LastWriteTime -gt $limite |
        Select-String -Pattern $pat |
        Group-Object -Property Filename |
        Select-Object Name, Count
} -ArgumentList $pasta, $padrao, $dias

$job | Wait-Job | Receive-Job
`}),(0,i.jsx)(`h2`,{children:`ForEach-Object -Parallel (PowerShell 7+)`}),(0,i.jsxs)(n,{type:`success`,title:`Melhor Abordagem para Paralelismo Simples`,children:[`O parâmetro `,(0,i.jsx)(`code`,{children:`-Parallel`}),` é mais eficiente que Start-Job para processar listas de itens, pois usa Runspaces em vez de processos separados.`]}),(0,i.jsx)(t,{title:`Processamento paralelo de lista`,code:`# Verificar conectividade de múltiplos servidores em paralelo
$servidores = 1..20 | ForEach-Object { "192.168.1.$_" }

$resultados = $servidores | ForEach-Object -Parallel {
    $ip = $_
    $online = Test-Connection -ComputerName $ip -Count 1 -Quiet
    [PSCustomObject]@{
        IP     = $ip
        Online = $online
        Tempo  = (Get-Date).ToString("HH:mm:ss")
    }
} -ThrottleLimit 10  # Máximo 10 threads simultâneas

$resultados | Where-Object Online | Format-Table -AutoSize

# Processamento de arquivos em paralelo
Get-ChildItem "C:Logs" -Filter "*.log" | ForEach-Object -Parallel {
    $conteudo = Get-Content $_.FullName
    $erros    = $conteudo | Select-String "ERROR" | Measure-Object
    [PSCustomObject]@{
        Arquivo = $_.Name
        Tamanho = "{0:N0} KB" -f ($_.Length / 1KB)
        Erros   = $erros.Count
    }
} -ThrottleLimit 8 | Sort-Object Erros -Descending
`}),(0,i.jsx)(`h2`,{children:`Usando $Using: no Parallel`}),(0,i.jsx)(t,{title:`Variáveis no contexto paralelo`,code:`$apiUrl  = "https://jsonplaceholder.typicode.com/posts"
$timeout = 30
$cabecalhos = @{ "Accept" = "application/json" }

$posts = 1..10 | ForEach-Object -Parallel {
    $url  = $Using:apiUrl
    $tout = $Using:timeout
    $hdrs = $Using:cabecalhos

    try {
        $resp = Invoke-RestMethod -Uri "$url/$_"                                   -Headers $hdrs                                   -TimeoutSec $tout
        [PSCustomObject]@{
            Id     = $_
            Titulo = $resp.title
            Status = "OK"
        }
    } catch {
        [PSCustomObject]@{
            Id     = $_
            Titulo = $null
            Status = "ERRO: $_"
        }
    }
} -ThrottleLimit 5
$posts | Format-Table -AutoSize
`}),(0,i.jsx)(`h2`,{children:`Runspaces de Baixo Nível`}),(0,i.jsx)(t,{title:`Máximo controle com RunspacePool`,code:`# Runspaces oferecem o menor overhead possível
$pool = [RunspaceFactory]::CreateRunspacePool(1, 10)
$pool.Open()

$jobs = @()
$servidores = "srv01","srv02","srv03","srv04","srv05"

foreach ($srv in $servidores) {
    $ps = [PowerShell]::Create()
    $ps.RunspacePool = $pool
    $ps.AddScript({
        param($s)
        [PSCustomObject]@{
            Servidor = $s
            CPU      = (Get-Random -Min 10 -Max 95)  # Simulação
            Hora     = Get-Date
        }
    }).AddArgument($srv) | Out-Null

    $jobs += [PSCustomObject]@{
        Servidor  = $srv
        PowerShell = $ps
        Handle     = $ps.BeginInvoke()
    }
}

# Coletar resultados
$resultados = $jobs | ForEach-Object {
    $_.PowerShell.EndInvoke($_.Handle)
    $_.PowerShell.Dispose()
}

$pool.Close()
$pool.Dispose()

$resultados | Format-Table -AutoSize
`}),(0,i.jsx)(`h2`,{children:`Monitorando e Gerenciando Jobs`}),(0,i.jsx)(t,{title:`Gestão completa do ciclo de vida de jobs`,code:`# Iniciar múltiplos jobs com nomes
1..5 | ForEach-Object {
    $i = $_
    Start-Job -Name "Tarefa-$i" -ScriptBlock {
        param($n)
        Start-Sleep -Seconds (Get-Random -Min 1 -Max 8)
        "Tarefa $n concluída: $(Get-Date -Format 'HH:mm:ss')"
    } -ArgumentList $i
}

# Monitorar progresso em tempo real
do {
    $pendentes = Get-Job | Where-Object State -eq 'Running'
    Clear-Host
    Write-Host "Jobs em execução: $($pendentes.Count)" -ForegroundColor Cyan
    Get-Job | Format-Table Id, Name, State, HasMoreData -AutoSize
    Start-Sleep -Seconds 1
} while ($pendentes.Count -gt 0)

# Receber todos os resultados
Get-Job | ForEach-Object {
    Write-Host "=== $($_.Name) ===" -ForegroundColor Green
    Receive-Job -Job $_
}

Get-Job | Remove-Job
`}),(0,i.jsxs)(n,{type:`info`,title:`Quando Usar Cada Abordagem`,children:[`Use `,(0,i.jsx)(`strong`,{children:`ForEach-Object -Parallel`}),` para processar listas (mais simples, PS7+). Use `,(0,i.jsx)(`strong`,{children:`Start-Job`}),` para tarefas longas de background (qualquer PS versão). Use `,(0,i.jsx)(`strong`,{children:`Runspaces`}),` quando precisar de máxima performance e controle total.`]})]})}export{a as default};