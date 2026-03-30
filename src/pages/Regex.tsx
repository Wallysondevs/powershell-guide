import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Regex() {
  return (
    <PageContainer
      title="Expressões Regulares"
      subtitle="Domine o poder das regex para validação, extração e transformação de textos."
      difficulty="intermediário"
      timeToRead="25 min"
    >
      <p>
        Expressões regulares (regex) são padrões usados para encontrar, validar e manipular strings.
        No PowerShell, você pode usar regex com operadores nativos como <code>-match</code>, <code>-replace</code>, 
        <code>-split</code> e com cmdlets como <code>Select-String</code>.
      </p>

      <h2>Operadores de Regex</h2>
      <CodeBlock title="Operadores -match, -replace e -split" code={`# -match: testa se string combina com padrão
"usuario@empresa.com" -match '^[\w.]+@[\w]+\.[a-z]{2,}$'  # True
"texto-inválido"     -match '^[\w.]+@[\w]+\.[a-z]{2,}$'  # False

# Após -match, $Matches contém os grupos capturados
"João Silva, 35 anos" -match '(\w+ \w+), (\d+) anos'
$Matches[0]  # João Silva, 35 anos (match completo)
$Matches[1]  # João Silva (grupo 1)
$Matches[2]  # 35 (grupo 2)

# -replace: substituição com suporte a regex
"2024-03-15" -replace '(\d{4})-(\d{2})-(\d{2})', '$3/$2/$1'  # 15/03/2024

# Remover caracteres não numéricos
"(11) 99999-8888" -replace '\D', ''  # 11999998888

# -split com regex
"um1dois2três3quatro" -split '\d'  # Array: um, dois, três, quatro
"  item1   item2  item3  " -split '\s+' | Where-Object { $_ }  # sem vazios
`} />

      <h2>Select-String para Busca em Arquivos</h2>
      <CodeBlock title="Grep-like com Select-String" code={`# Buscar em um arquivo
Select-String -Path "C:\Logs\app.log" -Pattern "ERROR|FATAL"

# Buscar com contexto (linhas antes/depois)
Select-String -Path "*.log" -Pattern "Exception" -Context 2,3

# Retornar apenas as linhas que NÃO combinam (inverso)
Select-String -Path "access.log" -Pattern "200" -NotMatch

# Extrair apenas a parte capturada
Select-String -Path "server.log" -Pattern "IP: (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})" |
    ForEach-Object { $_.Matches.Groups[1].Value } |
    Sort-Object -Unique

# Múltiplos arquivos recursivo
Get-ChildItem "C:\Logs" -Recurse -Filter "*.log" |
    Select-String -Pattern "\bCRITICAL\b" |
    Group-Object Filename |
    Select-Object Name, Count
`} />

      <h2>Grupos Nomeados</h2>
      <CodeBlock title="Capturando com grupos nomeados" code={`# Grupos nomeados com (?<nome>padrão)
$log = "2024-01-15 14:30:22 [ERROR] Falha ao conectar ao banco de dados"

if ($log -match '(?<data>\d{4}-\d{2}-\d{2}) (?<hora>\d{2}:\d{2}:\d{2}) \[(?<nivel>\w+)\] (?<mensagem>.+)') {
    $Matches.data      # 2024-01-15
    $Matches.hora      # 14:30:22
    $Matches.nivel     # ERROR
    $Matches.mensagem  # Falha ao conectar ao banco de dados
}

# Processando múltiplas linhas de log
$logs = @"
2024-01-15 14:30:22 [ERROR] Falha no banco de dados
2024-01-15 14:30:23 [INFO]  Tentando reconexão
2024-01-15 14:30:25 [WARN]  Reconexão lenta: 2500ms
2024-01-15 14:30:26 [ERROR] Timeout após 3 tentativas
"@

$padrao = '(?<data>\S+) (?<hora>\S+) \[(?<nivel>\w+)\]\s+(?<msg>.+)'
$logs -split "\n" | Where-Object { $_ -match $padrao } | ForEach-Object {
    [PSCustomObject]@{
        Data    = $Matches.data
        Hora    = $Matches.hora
        Nivel   = $Matches.nivel
        Mensagem = $Matches.msg
    }
} | Format-Table -AutoSize
`} />

      <h2>Classe [regex] .NET</h2>
      <CodeBlock title="Usando a classe .NET diretamente" code={`# Objeto regex para reutilização e mais controle
$rx = [regex]::new('(\d{1,3}\.){3}\d{1,3}', 'IgnoreCase,Multiline')

$texto = @"
Servidor web: 192.168.1.10
Gateway: 10.0.0.1
DNS primário: 8.8.8.8
DNS secundário: 8.8.4.4
"@

# Encontrar todos os matches
$ips = $rx.Matches($texto)
$ips | ForEach-Object { "IP encontrado: $($_.Value)" }

# Substituição avançada com MatchEvaluator
$rxData = [regex]::new('\b(\d{4})-(\d{2})-(\d{2})\b')
$textoData = "Reunião: 2024-03-15. Prazo: 2024-04-01"
$resultado = $rxData.Replace($textoData, {
    param($m)
    # $m.Groups[1] = ano, [2] = mês, [3] = dia
    "$($m.Groups[3])/$($m.Groups[2])/$($m.Groups[1])"
})
$resultado  # Reunião: 15/03/2024. Prazo: 01/04/2024

# Split com limite
$rx2 = [regex]::new(',\s*')
$csv = "João, Silva, 30, São Paulo, Brasil"
$campos = $rx2.Split($csv, 3)  # Máximo 3 partes
$campos  # João | Silva | 30, São Paulo, Brasil
`} />

      <h2>Validações com Regex</h2>
      <CodeBlock title="Padrões de validação comuns" code={`function Test-Email([string]$email) {
    return $email -match '^[\w._%+\-]+@[\w.\-]+\.[a-zA-Z]{2,}$'
}

function Test-CPF([string]$cpf) {
    return ($cpf -replace '\D','') -match '^\d{11}$'
}

function Test-IPv4([string]$ip) {
    if ($ip -notmatch '^(\d{1,3}\.){3}\d{1,3}$') { return $false }
    return ($ip -split '\.') | ForEach-Object { [int]$_ } |
           Where-Object { $_ -gt 255 } | Measure-Object |
           Select-Object -ExpandProperty Count | ForEach-Object { $_ -eq 0 }
}

function Test-SenhaForte([string]$senha) {
    $criterios = @(
        $senha.Length -ge 8,
        $senha -match '[A-Z]',
        $senha -match '[a-z]',
        $senha -match '[0-9]',
        $senha -match '[!@#$%^&*(),.?":{}|<>]'
    )
    return ($criterios | Where-Object { $_ }).Count -eq 5
}

# Testes
Test-Email "usuario@empresa.com.br"  # True
Test-Email "invalido@"               # False
Test-IPv4  "192.168.1.1"             # True
Test-IPv4  "999.0.0.1"              # False
Test-SenhaForte "MinhaS3nh@!"       # True
Test-SenhaForte "senha123"          # False
`} />

      <AlertBox type="info" title="Cheat Sheet de Regex">
        <strong>Âncoras:</strong> ^ início, $ fim, \b borda de palavra.
        <strong>Quantificadores:</strong> * (0+), + (1+), ? (0/1), {"{n,m}"} (n a m vezes).
        <strong>Classes:</strong> \d dígito, \w palavra, \s espaço, \D \W \S (negações).
        <strong>Grupos:</strong> () captura, (?:) sem captura, (?{"<"}nome{">"}) nomeado, | alternativa.
      </AlertBox>
    </PageContainer>
  );
}