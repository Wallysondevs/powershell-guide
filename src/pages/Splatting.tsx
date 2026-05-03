import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Splatting() {
  return (
    <PageContainer
      title="Splatting — passando parâmetros como objeto"
      subtitle="Hashtable e array para chamar cmdlets com 20 parâmetros sem perder a sanidade. O recurso mais subutilizado do PowerShell."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <p>
        <strong>Splatting</strong> é o ato de empacotar parâmetros em uma
        hashtable (ou array) e passá-los para um cmdlet usando o operador
        <code>@</code>. Em vez de uma linha de 200 caracteres com 12 backticks
        de continuação, você tem um bloco organizado, versionável e reutilizável.
      </p>

      <AlertBox type="info" title="Quando usar">
        <p>
          Sempre que um comando passar de 3 parâmetros, ou quando os parâmetros
          forem dinâmicos (vêm de config, arquivo JSON, lógica condicional). É a
          forma idiomática de PowerShell — e o que separa scripts de iniciante
          dos de profissional.
        </p>
      </AlertBox>

      <h2>Sem splatting vs. com splatting</h2>
      <CodeBlock title="Antes — ilegível e difícil de revisar" code={`Send-MailMessage -To 'admin@empresa.com.br' -From 'noreply@empresa.com.br' \`
    -Subject 'Backup concluído' -Body 'Backup OK em ' -BodyAsHtml \`
    -SmtpServer 'smtp.empresa.com.br' -Port 587 -UseSsl \`
    -Credential $cred -Attachments 'C:\\logs\\backup.log' -Priority High`} />

      <CodeBlock title="Depois — splatting com hashtable" code={`$email = @{
    To          = 'admin@empresa.com.br'
    From        = 'noreply@empresa.com.br'
    Subject     = 'Backup concluído'
    Body        = 'Backup OK em ' + (Get-Date)
    BodyAsHtml  = $true
    SmtpServer  = 'smtp.empresa.com.br'
    Port        = 587
    UseSsl      = $true
    Credential  = $cred
    Attachments = 'C:\\logs\\backup.log'
    Priority    = 'High'
}

Send-MailMessage @email`} />

      <p>
        Note o <code>@email</code> (não <code>$email</code>). O <code>@</code>
        diz ao parser: "expanda esta hashtable como parâmetros nomeados".
      </p>

      <h2>Conceito — o operador @</h2>
      <CodeBlock title="$ acessa o valor, @ faz splatting" code={`$dados = @{ Path = 'C:\\temp'; Recurse = $true }

# $dados → passa a hashtable inteira como UM argumento (errado)
Get-ChildItem $dados        # Path = System.Collections.Hashtable

# @dados → expande para -Path 'C:\\temp' -Recurse $true (correto)
Get-ChildItem @dados        # Funciona: lista C:\\temp recursivo`} />

      <h2>Splatting com array (parâmetros posicionais)</h2>
      <CodeBlock title="Hashtable é nomeado, array é posicional" code={`# Hashtable → parâmetros nomeados
$h = @{ ComputerName = 'SRV01'; Count = 4 }
Test-Connection @h

# Array → parâmetros posicionais (na ordem)
$a = @('SRV01', 4)
Test-Connection @a    # Equivale a: Test-Connection 'SRV01' 4

# Mistura: array para posicionais + hashtable para nomeados
$pos  = @('SRV01')
$nom  = @{ Count = 4; Quiet = $true }
Test-Connection @pos @nom`} />

      <h2>Switches — como passar -Force, -Recurse, -WhatIf</h2>
      <CodeBlock title="Switches são $true / $false na hashtable" code={`# ERRADO — switch sem valor não funciona em hashtable
$h = @{ Path = 'C:\\temp'; Recurse }

# CERTO — sempre $true ou $false
$h = @{
    Path    = 'C:\\temp'
    Recurse = $true
    Force   = $true
}
Remove-Item @h

# Útil: ativar -WhatIf condicionalmente
$confirm = $env:CI -eq 'true'    # Em pipeline, modo seguro
$op = @{
    Path    = '\\\\srv\\share\\old'
    Recurse = $true
    WhatIf  = $confirm
}
Remove-Item @op`} />

      <AlertBox type="tip" title="Switches dinâmicos">
        <p>
          Para "incluir o parâmetro só se condição X", construa a hashtable
          incrementalmente em vez de usar muitos <code>if</code> em volta da
          chamada:
        </p>
        <CodeBlock language="powershell" code={`$params = @{ Path = $caminho }
if ($recursivo) { $params.Recurse = $true }
if ($filtro)    { $params.Filter  = $filtro }
Get-ChildItem @params`} />
      </AlertBox>

      <h2>Splatting + repasse de parâmetros (proxy functions)</h2>
      <CodeBlock title="@PSBoundParameters — repassa tudo que recebeu" code={`function Backup-Pasta {
    [CmdletBinding()]
    param(
        [string]$Source,
        [string]$Destination,
        [switch]$Force,
        [int]$Retencao = 7
    )

    Write-Host "Iniciando backup com retenção=$Retencao"

    # Passa adiante todos os bound params para Copy-Item
    $copyParams = @{
        Path        = $Source
        Destination = $Destination
        Recurse     = $true
        Force       = $Force          # repassa switch
    }
    Copy-Item @copyParams

    # Limpa antigos
    Get-ChildItem $Destination |
        Where-Object LastWriteTime -lt (Get-Date).AddDays(-$Retencao) |
        Remove-Item -Recurse -Force
}

Backup-Pasta -Source C:\\projetos -Destination D:\\backup -Force`} />

      <h2>Caso prático 1 — Splatting vindo de JSON/config</h2>
      <CodeBlock title="Configuração externa, código limpo" code={`# config.json
# {
#   "ServerInstance": "SQL01",
#   "Database": "Vendas",
#   "Username": "etl",
#   "QueryTimeout": 300
# }

$cfg = Get-Content .\\config.json | ConvertFrom-Json -AsHashtable

# Garantir password vinda de cofre
$cfg.Password = (Get-Secret -Name SqlEtl -AsPlainText)

Invoke-Sqlcmd @cfg -Query "SELECT TOP 10 * FROM Pedidos"

# Ambiente diferente, mesma chamada
$cfg = Get-Content .\\config.prod.json | ConvertFrom-Json -AsHashtable
$cfg.Password = (Get-Secret -Name SqlEtlProd -AsPlainText)
Invoke-Sqlcmd @cfg -Query "SELECT TOP 10 * FROM Pedidos"`} />

      <h2>Caso prático 2 — Loop de chamadas com splatting</h2>
      <CodeBlock title="Provisionar 100 VMs sem repetir 12 parâmetros cada" code={`$vmsCsv = Import-Csv .\\vms.csv

foreach ($vm in $vmsCsv) {
    $params = @{
        Name             = $vm.Nome
        ResourceGroup    = $vm.RG
        Location         = $vm.Regiao
        Size             = $vm.Tamanho
        Image            = 'Win2022Datacenter'
        AdminUsername    = 'azadmin'
        AdminPassword    = (ConvertTo-SecureString $vm.Senha -AsPlainText -Force)
        OpenPorts        = @(3389, 5985, 5986)
        EnableUltraSSD   = $false
    }
    try {
        New-AzVM @params -ErrorAction Stop
        Write-Host "✔ $($vm.Nome)" -ForegroundColor Green
    } catch {
        Write-Warning "✘ $($vm.Nome): $_"
    }
}`} />

      <h2>Combinando hashtables — splatting modular</h2>
      <CodeBlock title="Defaults + override por chamada" code={`# Hashtable base com defaults da empresa
$baseSmtp = @{
    SmtpServer = 'smtp.corp.com'
    Port       = 587
    UseSsl     = $true
    From       = 'noreply@corp.com'
    Credential = $smtpCred
}

# Email de erro — adiciona/sobrescreve campos específicos
Send-MailMessage @baseSmtp -To $admins -Subject 'ERRO' -Body $log -Priority High

# Email de relatório semanal
$relatorio = $baseSmtp.Clone()
$relatorio.To         = $diretoria
$relatorio.Subject    = 'Relatório semanal'
$relatorio.Attachments = '.\\relatorio.pdf'
Send-MailMessage @relatorio -Body 'Segue em anexo'`} />

      <AlertBox type="warning" title="Cuidado com referência compartilhada">
        <p>
          Hashtable é tipo de referência. <code>$copia = $original</code>
          aponta para o MESMO objeto — alterar <code>$copia.X</code> altera
          <code>$original.X</code>. Use <code>.Clone()</code> para cópia rasa
          quando for modificar.
        </p>
      </AlertBox>

      <h2>Splatting condicional — construir hash dinamicamente</h2>
      <CodeBlock title="Inclui parâmetros só se fizer sentido" code={`function Invoke-RestApi {
    param(
        [string]$Url,
        [hashtable]$Headers,
        [object]$Body,
        [int]$TimeoutSec
    )

    $params = @{
        Uri    = $Url
        Method = 'POST'
    }
    if ($Headers)     { $params.Headers     = $Headers }
    if ($Body)        {
        $params.Body        = ($Body | ConvertTo-Json -Depth 10)
        $params.ContentType = 'application/json'
    }
    if ($TimeoutSec)  { $params.TimeoutSec  = $TimeoutSec }

    Invoke-RestMethod @params
}`} />

      <h2>Armadilhas comuns</h2>
      <AlertBox type="danger" title="Erros que todo mundo comete">
        <ul>
          <li><strong><code>$h</code> em vez de <code>@h</code></strong> — passa a hashtable como argumento único.</li>
          <li><strong>Chave com nome errado</strong> — <code>Force = $true</code> mas o cmdlet espera <code>Confirm</code>: parâmetro é silenciosamente ignorado se o cmdlet aceitar <code>-AllowExtraArguments</code>, ou erro de "parameter cannot be found" se for estrito.</li>
          <li><strong>Switch com valor errado</strong> — <code>Recurse = 'true'</code> (string!) em vez de <code>$true</code> dispara conversão e às vezes vira <code>$true</code> por acidente, mas pode falhar em strict mode.</li>
          <li><strong>Reordenar quebra splatting de array</strong> — para parâmetros posicionais a ORDEM importa.</li>
        </ul>
      </AlertBox>

      <h2>Cheat — splatting em uma página</h2>
      <CodeBlock title="O que decorar" code={`# 1. Definir
$params = @{
    Param1 = 'valor1'
    Param2 = 42
    Switch = $true
}

# 2. Chamar (note @, não $)
Cmdlet @params

# 3. Combinar com outros parâmetros explícitos
Cmdlet @params -ParamExtra 'override'

# 4. Construir condicional
if ($x) { $params.Extra = $x }

# 5. Splatting de array (posicional)
$args = @('val1', 'val2')
Cmdlet @args

# 6. Repassar tudo
function Wrapper { Cmdlet @PSBoundParameters }`} />

      <AlertBox type="success" title="Adote agora">
        <p>
          Toda vez que escrever um cmdlet com mais de 3 parâmetros, pare e
          extraia para hashtable. Em 6 meses seus scripts são revisáveis,
          versionáveis em Git com diff legível e fáceis de parametrizar por
          ambiente.
        </p>
      </AlertBox>
    </PageContainer>
  );
}
