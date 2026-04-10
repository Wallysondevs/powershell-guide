import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function PS7() {
    return (
      <PageContainer
        title="PowerShell 7 — Novidades e Diferenças"
        subtitle="Tudo o que há de novo no PowerShell 7+: operadores, paralelismo, erros, REST e mais."
        difficulty="intermediário"
        timeToRead="30 min"
      >
        <p>
          O PowerShell 7 é uma reescrita cross-platform baseada no .NET 6+,
          enquanto o Windows PowerShell 5.1 usa o .NET Framework e é exclusivo do Windows.
          Ambos coexistem no sistema. O PS7 traz dezenas de novos recursos, melhor performance
          e compatibilidade com Linux e macOS.
        </p>

        <AlertBox type="info" title="Dois PowerShells">
          <strong>Windows PowerShell 5.1</strong> — <code>powershell.exe</code>: já incluso no Windows,
          sem novas features, mas ainda suportado até 2028.
          <strong>PowerShell 7+</strong> — <code>pwsh.exe</code>: cross-platform, novas features,
          instalação separada (winget install Microsoft.PowerShell).
        </AlertBox>

        <h2>Instalação e Identificação</h2>
        <CodeBlock title="Instalando e identificando o PS7" code={`# Via Winget (recomendado)
  winget install Microsoft.PowerShell

  # Via script automático
  iex "& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI"

  # Verificar versão
  pwsh --version          # PowerShell 7.4.1
  $PSVersionTable         # Tabela completa de versão e plataforma

  # Detectar versão no código (para scripts compatíveis com PS5 e PS7)
  if ($PSVersionTable.PSVersion.Major -ge 7) {
      Write-Host "Rodando PS7+ — recursos avançados disponíveis"
  } else {
      Write-Host "Rodando PS5.1 — compatibilidade limitada"
  }

  # Verificar plataforma (cross-platform)
  $IsWindows  # True ou False
  $IsLinux    # True ou False
  $IsMacOS    # True ou False
  [System.Runtime.InteropServices.RuntimeInformation]::FrameworkDescription
  # .NET 8.0.x (PS7) vs .NET Framework 4.x (PS5.1)
  `} />

        <h2>Operadores Null-Coalescing e Null-Conditional</h2>
        <CodeBlock title="Tratamento elegante de valores nulos" code={`# ?? — null coalescing (valor padrão quando null)
  $config   = $null
  $ambiente = $config ?? "producao"       # "producao"
  $porta    = $env:PORT ?? 8080           # 8080 se PORT não estiver definida
  $timeout  = $config?.Timeout ?? 30     # 30

  # ??= — atribuição com null coalescing
  $cache = $null
  $cache ??= @{}   # Só atribui se $cache for null (inicialização lazy)
  $cache.Chave = "Valor"

  # ?. — null-conditional (evita NullReferenceException em cadeia)
  $usuario = $null
  $nome    = $usuario?.Nome         # null (sem erro de "property of null")
  $email   = $usuario?.Contato?.Email?.ToLower()  # null encadeado

  # Comparação: PS5.1 era muito mais verboso
  # PS5.1:
  $valor = if ($null -ne $config) { $config.Porta } else { 8080 }
  # PS7:
  $valor = $config?.Porta ?? 8080
  `} />

        <h2>Operador Ternário</h2>
        <CodeBlock title="Condicionais inline compactas" code={`# condição ? valorVerdadeiro : valorFalso
  $idade     = 20
  $categoria = $idade -ge 18 ? "adulto" : "menor"   # "adulto"

  $env:NODE_ENV = "development"
  $modo = $env:NODE_ENV -eq "production" ? "PROD" : "DEV"  # "DEV"

  # Em formatação de strings
  $status = (Get-Service "W3SVC").Status
  "W3SVC está $($status -eq "Running" ? "RODANDO" : "PARADO")"

  # Aninhado (use com moderação)
  $nota = 85
  $conceito = $nota -ge 90 ? "A" : ($nota -ge 80 ? "B" : ($nota -ge 70 ? "C" : "F"))

  # PS5.1 equivalente:
  $categoria = if ($idade -ge 18) { "adulto" } else { "menor" }
  `} />

        <h2>ForEach-Object -Parallel</h2>
        <CodeBlock title="Processamento paralelo nativo (apenas PS7)" code={`# Processar em paralelo — velocidade x N threads
  $servidores = "srv01","srv02","srv03","srv04","srv05","srv06"

  $resultados = $servidores | ForEach-Object -Parallel {
      $servidor = $_
      [PSCustomObject]@{
          Servidor  = $servidor
          Online    = Test-Connection $servidor -Count 1 -Quiet -TimeoutSeconds 1
          PingMS    = (Test-Connection $servidor -Count 1 -ErrorAction SilentlyContinue).Latency
          DNSResolv = [bool](Resolve-DnsName $servidor -ErrorAction SilentlyContinue)
      }
  } -ThrottleLimit 6  # 6 threads paralelas

  $resultados | Sort-Object Servidor | Format-Table -AutoSize

  # Usar variáveis do escopo pai com $using:
  $caminho = "C:\\Scripts\\Backup.ps1"
  1..5 | ForEach-Object -Parallel {
      $script = $using:caminho  # Importar variável externa
      & $script -Id $_
  }

  # Medir ganho de velocidade
  $inicio = Get-Date
  1..20 | ForEach-Object { Start-Sleep -Milliseconds 500 }  # ~10 segundos
  Write-Host "Sequencial: $((Get-Date) - $inicio)"

  $inicio = Get-Date
  1..20 | ForEach-Object -Parallel { Start-Sleep -Milliseconds 500 } -ThrottleLimit 10  # ~1 segundo
  Write-Host "Paralelo: $((Get-Date) - $inicio)"
  `} />

        <h2>Pipeline Chain Operators</h2>
        <CodeBlock title="&& e || para encadear comandos por resultado" code={`# && — executa o próximo SOMENTE se o anterior teve sucesso ($LASTEXITCODE = 0)
  npm install && npm run build && npm test
  git add . && git commit -m "feat: nova função" && git push

  # || — executa o próximo SOMENTE se o anterior FALHOU
  npm install || Write-Warning "npm falhou, tentando yarn..."
  Connect-AzAccount || throw "Falha na autenticação Azure"

  # Combinando:
  Test-Path "C:\\Backup" || New-Item "C:\\Backup" -ItemType Directory
  Copy-Item "dados.db" "C:\\Backup\\" && Write-Host "Backup OK" -ForegroundColor Green

  # PS5.1 equivalente verboso:
  npm install
  if ($LASTEXITCODE -eq 0) {
      npm run build
      if ($LASTEXITCODE -eq 0) { npm test }
  }
  `} />

        <h2>Melhorias de Tratamento de Erros</h2>
        <CodeBlock title="ErrorView, erros detalhados e Get-Error" code={`# PS7 tem ErrorView conciso por padrão (não mais a pilha enorme)
  $ErrorView = "ConciseView"   # Padrão no PS7 — mostra apenas o essencial
  $ErrorView = "DetailedView"  # Mostra mais detalhes
  $ErrorView = "NormalView"    # Comportamento do PS5.1

  # Get-Error — inspecionar o último erro com detalhes completos
  try {
      Get-Item "C:\\arquivo-inexistente.txt" -ErrorAction Stop
  } catch {
      Get-Error  # Mostra pilha completa, categoria, exceção interna etc.
  }

  # Erros de pipeline agora são mais informativos
  Get-ChildItem "C:\\pastas\\*" | ForEach-Object -ThrottleLimit 4 -Parallel {
      try {
          # Código que pode falhar
          Get-Item $_.FullName -ErrorAction Stop
      } catch {
          Write-Error "Falha em $($_): $_"
      }
  }

  # Invoke-Command com tratamento de erro aprimorado
  Invoke-Command -ComputerName "srv01","srv02" -ScriptBlock {
      Get-Service W3SVC
  } -ErrorAction SilentlyContinue |
      ForEach-Object {
          if ($_ -is [System.Management.Automation.ErrorRecord]) {
              "Erro em $($_.TargetObject): $($_.Exception.Message)"
          } else { $_ }
      }
  `} />

        <h2>Web Cmdlets Melhorados</h2>
        <CodeBlock title="Invoke-RestMethod e Invoke-WebRequest no PS7" code={`# Invoke-RestMethod agora suporta autenticação OAuth, seguir redirects e mais
  $resposta = Invoke-RestMethod -Uri "https://api.github.com/repos/microsoft/PowerShell" `
    -Headers @{ Accept = "application/vnd.github.v3+json" } `
    -Method GET
  $resposta.name
  $resposta.stargazers_count

  # Paginação automática com -FollowRelLink (PS7)
  $issues = Invoke-RestMethod `
    -Uri "https://api.github.com/repos/PowerShell/PowerShell/issues?per_page=100" `
    -FollowRelLink `
    -MaximumFollowRelLink 3   # Seguir até 3 páginas

  # POST com JSON body (PS7 serializa automaticamente)
  $body = @{ nome = "Teste"; valor = 42 } | ConvertTo-Json
  Invoke-RestMethod -Uri "https://httpbin.org/post" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

  # Download de arquivo com progresso
  Invoke-WebRequest -Uri "https://example.com/arquivo.zip" `
    -OutFile "C:\\Downloads\\arquivo.zip" `
    -Resume   # Retomar download interrompido (PS7)

  # Skip verificação SSL (apenas para dev/test interno)
  Invoke-RestMethod -Uri "https://servidor-interno/" -SkipCertificateCheck
  `} />

        <AlertBox type="success" title="Migração PS5.1 → PS7">
          A maioria dos scripts PS5.1 roda sem modificação no PS7. Os pontos de atenção são:
          módulos de administração do Windows que usam COM/DCOM (use compat layer com
          <code>Import-Module -UseWindowsPowerShell</code>), <code>-Encoding Default</code>
          que muda de ANSI para UTF-8, e <code>$null -eq @()</code> que agora é <code>False</code>.
        </AlertBox>
      </PageContainer>
    );
  }
  