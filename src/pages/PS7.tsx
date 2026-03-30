import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PS7() {
  return (
    <PageContainer
      title="PowerShell 7 — Novidades e Diferenças"
      subtitle="Tudo o que há de novo no PowerShell 7+ em comparação com o Windows PowerShell 5.1."
      difficulty="intermediário"
      timeToRead="25 min"
    >
      <p>
        O PowerShell 7 é uma reescrita cross-platform baseada no .NET 6+,
        enquanto o Windows PowerShell 5.1 é baseado no .NET Framework e é exclusivo do Windows.
        Ambos coexistem no sistema e têm características diferentes.
      </p>

      <AlertBox type="info" title="Dois PowerShells">
        <strong>Windows PowerShell (5.1):</strong> <code>powershell.exe</code> — já vem no Windows,
        não receberá novas features, mas ainda é suportado.
        <strong>PowerShell 7+:</strong> <code>pwsh.exe</code> — multiplataforma,
        novas features, instalação separada.
      </AlertBox>

      <h2>Instalação do PowerShell 7</h2>
      <CodeBlock title="Instalando PS7 no Windows" code={`# Via Winget (recomendado)
winget install Microsoft.PowerShell

# Via script direto da Microsoft
iex "& { $(irm https://aka.ms/install-powershell.ps1) } -UseMSI"

# Verificar versão instalada
pwsh --version
$PSVersionTable

# Verificar .NET em uso
[System.Runtime.InteropServices.RuntimeInformation]::FrameworkDescription
# .NET 8.0.1 (PS7) vs .NET Framework 4.x (PS5.1)
`} />

      <h2>Operadores Null-Coalescing e Null-Conditional</h2>
      <CodeBlock title="Operadores do PS7 para tratamento de null" code={`# ?? — null coalescing (valor padrão se null)
$config = $null
$ambiente = $config ?? "producao"  # producao
$porta    = $env:PORT ?? 8080

# ??= — null coalescing assignment
$cache = $null
$cache ??= @{}  # Só atribui se $cache for null

# ?. — null conditional (evita NullReferenceException)
$usuario = $null
$nome  = $usuario?.Nome      # null (sem erro!)
$email = $usuario?.Email?.ToLower()  # null encadeado

# Sem PS7 (verboso):
$nome = if ($null -ne $usuario) { $usuario.Nome } else { $null }
`} />

      <h2>Operador Ternário</h2>
      <CodeBlock title="Expressão condicional compacta" code={`# Operador ternário: condição ? valorVerdadeiro : valorFalso
$idade = 20
$categoria = $idade -ge 18 ? "adulto" : "menor"   # adulto

$env:NODE_ENV = "development"
$modo = $env:NODE_ENV -eq "production" ? "PROD" : "DEV"  # DEV

# Sem PS7 (if inline):
$categoria = if ($idade -ge 18) { "adulto" } else { "menor" }
`} />

      <h2>ForEach-Object -Parallel</h2>
      <CodeBlock title="Paralelismo nativo no PS7" code={`# Apenas no PowerShell 7+
$servidores = "srv01","srv02","srv03","srv04","srv05"

$resultados = $servidores | ForEach-Object -Parallel {
    [PSCustomObject]@{
        Servidor = $_
        Online   = Test-Connection $_ -Count 1 -Quiet
        Hora     = Get-Date
    }
} -ThrottleLimit 5

$resultados | Format-Table -AutoSize

# Pipeline chain operators (PS7)
# && executa próximo se anterior sucedeu
# || executa próximo se anterior falhou
npm run build && npm run test    # testa somente se build passou
npm install || Write-Warning "npm falhou, tentando yarn..."
`} />

      <h2>Compatibilidade com Windows PowerShell 5.1</h2>
      <CodeBlock title="Módulos de compatibilidade e diferenças" code={`# Módulos legados que só funcionam no PS5.1
# (Active Directory, Exchange antigo, etc.)

# PS7 tem camada de compatibilidade
Import-Module ActiveDirectory -UseWindowsPowerShell

# Verificar versão no script para comportamento condicional
if ($PSVersionTable.PSVersion.Major -ge 7) {
    # Código específico do PS7
    $resultado = $lista | ForEach-Object -Parallel { $_ }
} else {
    # Fallback para PS5.1
    $resultado = $lista | ForEach-Object { $_ }
}

# #Requires para garantir versão mínima
#Requires -Version 7.2
#Requires -Modules @{ ModuleName = "Az"; ModuleVersion = "10.0" }
`} />

      <h2>Tabela Comparativa</h2>
      <CodeBlock title="PS5.1 vs PS7+ — resumo de diferenças" code={`# Executar no PS7:
@"
Feature                  | PS 5.1  | PS 7+
-------------------------|---------|-------
?. Null-conditional       |   Não   |  Sim
?? Null-coalescing        |   Não   |  Sim
Ternário (? :)            |   Não   |  Sim
ForEach -Parallel         |   Não   |  Sim
Pipeline chains (&& ||)   |   Não   |  Sim
Get-Error                 |   Não   |  Sim
Cross-platform (Linux/Mac)|   Não   |  Sim
.NET Core / .NET 5+       |   Não   |  Sim
SSH Remoting nativo       |   Não   |  Sim
ErrorView = ConciseView   |   Não   |  Sim
"@
`} />

      <AlertBox type="success" title="Use PS7 para Novos Projetos">
        Para scripts novos, prefira sempre o PowerShell 7. Ele é mais rápido, mais seguro,
        tem mais features e é multiplataforma. Use Windows PowerShell 5.1 apenas para módulos
        legados que ainda não têm versão compatível com PS7.
      </AlertBox>
    </PageContainer>
  );
}
