import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WebApi() {
  return (
    <PageContainer
      title="Web e APIs"
      subtitle="Interagindo com a web, consumindo APIs REST e automatizando downloads."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        O PowerShell transformou a maneira como administradores interagem com serviços web. Com os cmdlets <code>Invoke-WebRequest</code> e <code>Invoke-RestMethod</code>, o terminal se torna um cliente HTTP poderoso, capaz de baixar arquivos, enviar dados para APIs e automatizar processos baseados em nuvem sem a necessidade de ferramentas de terceiros como cURL ou Postman.
      </p>

      <h2>Invoke-WebRequest: O Cliente Web Completo</h2>
      <p>
        Este cmdlet é ideal quando você precisa interagir com páginas HTML, capturar links, imagens ou lidar com formulários. Ele retorna um objeto que representa toda a resposta HTTP, incluindo cabeçalhos e o conteúdo bruto.
      </p>

      <CodeBlock
        title="Requisições web básicas"
        code={`# Fazer uma requisição GET simples
$response = Invoke-WebRequest -Uri "https://www.google.com"

# Verificar o código de status da resposta (ex: 200, 404)
$response.StatusCode

# Obter todos os links de uma página
$response.Links | Select-Object -Property href, outerText

# Baixar um arquivo diretamente para o disco
Invoke-WebRequest -Uri "https://exemplo.com/arquivo.zip" -OutFile "C:\\Downloads\\arquivo.zip"
`}
      />

      <AlertBox type="info" title="Nota para Linux/macOS">
        No PowerShell Core (7+), o <code>Invoke-WebRequest</code> não usa o motor do Internet Explorer, tornando-o muito mais rápido e compatível entre plataformas.
      </AlertBox>

      <h2>Invoke-RestMethod: O Especialista em APIs</h2>
      <p>
        Diferente do anterior, o <code>Invoke-RestMethod</code> é otimizado para APIs REST. Ele detecta automaticamente se a resposta é JSON ou XML e a converte instantaneamente em um objeto PowerShell (PSCustomObject), facilitando muito o acesso aos dados.
      </p>

      <CodeBlock
        title="Consumindo APIs JSON"
        code={`# Consultar uma API pública (ex: GitHub)
$userData = Invoke-RestMethod -Uri "https://api.github.com/users/octocat"

# Acessar propriedades diretamente como se fosse um objeto local
Write-Host "Usuário: $($userData.name)"
Write-Host "Bio: $($userData.bio)"

# Enviar dados (POST) para uma API
$payload = @{
    title = 'Novo Post'
    body  = 'Conteúdo do post via PowerShell'
    userId = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://jsonplaceholder.typicode.com/posts" -Method Post -Body $payload -ContentType "application/json"
`}
      />

      <h2>Autenticação e Cabeçalhos</h2>
      <p>
        A maioria das APIs profissionais exige algum tipo de autenticação. O PowerShell facilita o envio de tokens Bearer, chaves de API e autenticação básica.
      </p>

      <CodeBlock
        title="Trabalhando com autenticação"
        code={`# Exemplo com Bearer Token (Comum em OAuth2)
$headers = @{
    Authorization = "Bearer SEU_TOKEN_AQUI"
    Accept        = "application/json"
}

$secureData = Invoke-RestMethod -Uri "https://api.servico.com/v1/dados" -Headers $headers

# Exemplo de Autenticação Básica (User/Pass)
$user = "admin"
$pass = "12345" | ConvertTo-SecureString -AsPlainText -Force
$cred = New-Object System.Management.Automation.PSCredential($user, $pass)

Invoke-RestMethod -Uri "https://api.interno.com" -Credential $cred
`}
      />

      <h2>Manipulação de JSON</h2>
      <p>
        Além dos cmdlets de rede, você precisará converter dados entre objetos e strings JSON com frequência.
      </p>

      <CodeBlock
        title="Convertendo de e para JSON"
        code={`# Objeto para String JSON (para enviar em um Body)
$myObject = @{ Name = "Teste"; Active = $true }
$jsonString = $myObject | ConvertTo-Json -Depth 5

# String JSON para Objeto (para processar dados lidos de um arquivo)
$rawJson = '{"id": 1, "status": "ok"}'
$parsedObject = $rawJson | ConvertFrom-Json

Write-Host "O status é: $($parsedObject.status)"
`}
      />

      <AlertBox type="warning" title="O parâmetro -Depth">
        Ao usar <code>ConvertTo-Json</code>, o padrão de profundidade é 2. Se o seu objeto for muito aninhado (muitos níveis de arrays/objetos), use o parâmetro <code>-Depth</code> para garantir que nada seja truncado.
      </AlertBox>

      <h2>Downloads em Segundo Plano (BITS)</h2>
      <p>
        Para arquivos muito grandes ou conexões instáveis, o serviço BITS (Background Intelligent Transfer Service) é a melhor escolha, pois permite pausar e retomar downloads.
      </p>

      <CodeBlock
        title="Usando BITS para downloads pesados"
        code={`# Iniciar um download em segundo plano
Start-BitsTransfer -Source "https://speed.hetzner.de/100MB.bin" -Destination "C:\\Temp\\100MB.bin"

# O comando acima aguarda a conclusão. Para rodar assíncrono:
Start-BitsTransfer -Source "https://site.com/iso.img" -Destination "C:\\iso.img" -Asynchronous

# Monitorar o progresso
Get-BitsTransfer | Select-Object JobId, JobState, BytesTransferred, BytesTotal
`}
      />

      <h2>Tratamento de Erros em Requisições Web</h2>
      <p>
        Websites falham. APIs retornam erros 500 ou 401. É crucial capturar essas exceções para que seu script não quebre.
      </p>

      <CodeBlock
        title="Capturando erros de API"
        code={`try {
    $data = Invoke-RestMethod -Uri "https://api.inexistente.com/v1" -ErrorAction Stop
}
catch {
    # Capturar a mensagem de erro detalhada retornada pelo servidor
    $errorMessage = $_.Exception.Message
    Write-Error "Falha na requisição: $errorMessage"
    
    # Se houver uma resposta do servidor mesmo no erro (ex: JSON explicativo)
    if ($_.Exception.Response) {
        $streamReader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $serverError = $streamReader.ReadToEnd() | ConvertFrom-Json
        Write-Host "Detalhe do servidor: $($serverError.message)" -ForegroundColor Red
    }
}
`}
      />

      <h2>Novidades do PowerShell 7+</h2>
      <p>
        Se você estiver usando o PowerShell 7 ou superior, terá acesso a funcionalidades que facilitam ainda mais a vida do desenvolvedor:
      </p>

      <ul>
        <li><strong>-SkipCertificateCheck:</strong> Ignora erros de SSL em ambientes de teste com certificados auto-assinados.</li>
        <li><strong>-Parallel:</strong> Combine com <code>ForEach-Object -Parallel</code> para baixar múltiplos arquivos simultaneamente.</li>
        <li><strong>Melhor performance:</strong> O motor .NET por trás do PS7 é significativamente mais rápido para processamento JSON.</li>
      </ul>

      <CodeBlock
        title="Download paralelo no PS7"
        code={`$urls = @(
    "https://site.com/file1.zip",
    "https://site.com/file2.zip",
    "https://site.com/file3.zip"
)

$urls | ForEach-Object -Parallel {
    Invoke-WebRequest -Uri $_ -OutFile "C:\\Temp\\$($_.Split('/')[-1])"
} -ThrottleLimit 3
`}
      />

    </PageContainer>
  );
}
