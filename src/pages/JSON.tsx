import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JSONPage() {
  return (
    <PageContainer
      title="JSON e APIs REST"
      subtitle="Trabalhe com dados JSON, consuma APIs REST e serialize/deserialize objetos com maestria."
      difficulty="intermediário"
      timeToRead="25 min"
    >
      <p>
        JSON (JavaScript Object Notation) é o formato de dados dominante na web moderna.
        O PowerShell converte JSON em objetos .NET automaticamente com <code>ConvertFrom-Json</code>
        e vice-versa com <code>ConvertTo-Json</code>, tornando o trabalho com APIs extremamente simples.
      </p>

      <h2>Convertendo JSON</h2>
      <CodeBlock title="ConvertFrom-Json e ConvertTo-Json" code={`# String JSON para objeto PowerShell
$jsonStr = '{"nome":"Ana","idade":30,"habilidades":["PowerShell","Python","Git"]}'
$obj = $jsonStr | ConvertFrom-Json
$obj.nome          # Ana
$obj.habilidades   # PowerShell, Python, Git
$obj.habilidades[0]  # PowerShell

# Objeto para JSON
$dados = [PSCustomObject]@{
    Servidor  = $env:COMPUTERNAME
    Timestamp = (Get-Date -Format "o")  # ISO 8601
    Metricas  = @{
        CPU    = 45.2
        RAM    = 78.1
        Disco  = 23.8
    }
    Alertas = @("Memória acima de 70%")
}
$dados | ConvertTo-Json -Depth 5

# -Depth controla profundidade (padrão = 2!)
$complexo = @{ n1 = @{ n2 = @{ n3 = @{ n4 = "valor" } } } }
$complexo | ConvertTo-Json -Depth 10
`} />

      <h2>Consumindo APIs REST</h2>
      <CodeBlock title="Invoke-RestMethod para APIs" code={`# GET simples
$resposta = Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/users/1"
"Nome: $($resposta.name)"
"Email: $($resposta.email)"
"Cidade: $($resposta.address.city)"

# GET com parâmetros de query
$params = @{
    Uri     = "https://api.github.com/repos/PowerShell/PowerShell/issues"
    Headers = @{ "User-Agent" = "PowerShell-Script" }
    Body    = @{ state = "open"; per_page = 10; labels = "bug" }
    Method  = "GET"
}
$issues = Invoke-RestMethod @params
$issues | Select-Object number, title, @{N="Autor";E={$_.user.login}}

# POST com corpo JSON
$novoPost = @{
    title  = "Meu Post via PowerShell"
    body   = "Conteúdo criado automaticamente"
    userId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/posts" \ -Method POST \ -Body $novoPost \ -ContentType "application/json"
`} />

      <h2>Autenticação em APIs</h2>
      <CodeBlock title="Bearer token, OAuth2 e Basic Auth" code={`# Bearer Token (JWT)
$token = "eyJhbGci..."
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type"  = "application/json"
    "X-API-Version" = "2024-01"
}
$dados = Invoke-RestMethod -Uri "https://api.exemplo.com/dados" -Headers $headers

# Basic Auth
$usuario = "admin"
$senha   = "minhaSenha123"
$bytes   = [Text.Encoding]::ASCII.GetBytes("$usuario:$senha")
$cred    = [Convert]::ToBase64String($bytes)
$headersBasic = @{ Authorization = "Basic $cred" }

# OAuth2 - Obter token
$tokenResp = Invoke-RestMethod -Uri "https://auth.exemplo.com/token" \ -Method POST \ -Body @{
        grant_type    = "client_credentials"
        client_id     = "meu-app-id"
        client_secret = $env:CLIENT_SECRET
        scope         = "read write"
    }
$bearerToken = $tokenResp.access_token

# API do GitHub com PAT
$hdrs = @{
    Authorization = "token $env:GITHUB_TOKEN"
    Accept        = "application/vnd.github+json"
}
Invoke-RestMethod -Uri "https://api.github.com/user" -Headers $hdrs
`} />

      <h2>Tratamento de Erros e Retry</h2>
      <CodeBlock title="Chamadas robustas com retry e timeout" code={`function Invoke-ApiComRetry {
    param(
        [string]$Uri,
        [hashtable]$Headers = @{},
        [string]$Method = "GET",
        [int]$MaxTentativas = 3,
        [int]$TimeoutSec = 30,
        [int]$Delay = 2
    )
    for ($i = 1; $i -le $MaxTentativas; $i++) {
        try {
            return Invoke-RestMethod -Uri $Uri \ -Headers $Headers \ -Method $Method \ -TimeoutSec $TimeoutSec \ -ErrorAction Stop
        } catch [System.Net.WebException] {
            $status = $_.Exception.Response?.StatusCode.value__
            Write-Warning "Tentativa $i/$MaxTentativas falhou (HTTP $status)"
            if ($status -eq 429) {
                $retry = $_.Exception.Response.Headers["Retry-After"]
                Start-Sleep -Seconds ([int]$retry ?? 60)
            } elseif ($i -lt $MaxTentativas) {
                Start-Sleep -Seconds ($Delay * $i)
            }
        }
    }
    throw "API falhou após $MaxTentativas tentativas: $Uri"
}
`} />

      <h2>Trabalhando com JSON Complexo</h2>
      <CodeBlock title="Manipulação de estruturas aninhadas" code={`# Ler JSON de arquivo
$config = Get-Content "appsettings.json" -Raw | ConvertFrom-Json

# Navegar estruturas aninhadas
$config.ConnectionStrings.DefaultConnection
$config.Logging.LogLevel.Default

# Atualizar valor
$config.AppSettings.MaxUsers = 500

# Salvar de volta
$config | ConvertTo-Json -Depth 10 | Set-Content "appsettings.json" -Encoding UTF8

# Array de objetos JSON
$items = Get-Content "dados.json" -Raw | ConvertFrom-Json
$items | Where-Object status -eq "ativo" | Measure-Object valor -Sum
`} />

      <AlertBox type="warning" title="Profundidade de Serialização">
        Por padrão, <code>ConvertTo-Json</code> tem profundidade máxima de 2 níveis. 
        Sempre use <code>-Depth 10</code> (ou mais) ao trabalhar com objetos aninhados, 
        ou você perderá dados silenciosamente.
      </AlertBox>
    </PageContainer>
  );
}
