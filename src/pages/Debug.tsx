import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Debug() {
  return (
    <PageContainer
      title="Depuração Avançada"
      subtitle="Use breakpoints, o depurador integrado, Write-Debug e técnicas avançadas de diagnóstico."
      difficulty="avançado"
      timeToRead="25 min"
    >
      <p>
        PowerShell tem um sistema de depuração robusto com breakpoints condicionais,
        stepping pelo código, inspeção de variáveis e integração com VS Code para
        uma experiência visual completa.
      </p>

      <h2>Write-Debug, -Verbose e -WhatIf</h2>
      <CodeBlock title="Saída de diagnóstico controlável" code={`function Processar-Arquivo {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string]$Caminho,
        [switch]$Forcar
    )

    Write-Verbose "Iniciando processamento de: $Caminho"
    Write-Debug "Parâmetros: Caminho=$Caminho, Forcar=$Forcar"

    if (-not (Test-Path $Caminho)) {
        Write-Error "Arquivo não encontrado: $Caminho"
        return
    }

    $tamanho = (Get-Item $Caminho).Length
    Write-Debug "Tamanho do arquivo: $tamanho bytes"

    if ($PSCmdlet.ShouldProcess($Caminho, "Processar arquivo")) {
        Write-Verbose "Executando operação principal..."
        # ... código de processamento ...
        Write-Verbose "Processamento concluído"
    }
}

# Executar com diferentes níveis de verbosidade
Processar-Arquivo -Caminho "C:\\dados.csv" -Verbose   # Mostra Write-Verbose
Processar-Arquivo -Caminho "C:\\dados.csv" -Debug     # Mostra Write-Debug
Processar-Arquivo -Caminho "C:\\dados.csv" -WhatIf    # Simula sem executar

# Habilitar globalmente na sessão
$VerbosePreference = "Continue"
$DebugPreference   = "Continue"
`} />

      <h2>Breakpoints</h2>
      <CodeBlock title="Definindo e gerenciando breakpoints" code={`# Breakpoint em linha específica
Set-PSBreakpoint -Script "C:\\Scripts\\meuScript.ps1" -Line 42

# Breakpoint em variável (quando ela é modificada)
Set-PSBreakpoint -Variable "resultado" -Mode ReadWrite

# Breakpoint condicional
Set-PSBreakpoint -Script "script.ps1" -Line 50  -Action { if ($contador -gt 100) { break } }

# Breakpoint em função
Set-PSBreakpoint -Command "Invoke-ApiCall"

# Listar, desabilitar e remover breakpoints
Get-PSBreakpoint
Disable-PSBreakpoint -Breakpoint (Get-PSBreakpoint -Id 1)
Enable-PSBreakpoint  -Breakpoint (Get-PSBreakpoint -Id 1)
Remove-PSBreakpoint  -Breakpoint (Get-PSBreakpoint)

# Comandos do depurador interativo (quando parado):
# h  — help
# s  — step into (próxima linha, entra em funções)
# v  — step over (pula funções)
# o  — step out (sai da função)
# c  — continue (até próximo breakpoint)
# q  — quit
# l  — list (mostrar código)
`} />

      <h2>Medindo Performance com Measure-Command</h2>
      <CodeBlock title="Profiling de scripts" code={`# Medir tempo de execução
$tempo = Measure-Command {
    Get-ChildItem "C:\\Windows\\System32" -Recurse -Filter "*.dll"
}
"Tempo: $($tempo.TotalSeconds) segundos"

# Comparar abordagens diferentes
$t1 = (Measure-Command {
    $r = 1..10000 | ForEach-Object { $_ * 2 } | Where-Object { $_ -gt 5000 }
}).TotalMilliseconds

$t2 = (Measure-Command {
    $lista = [System.Collections.Generic.List[int]]::new()
    foreach ($i in 1..10000) {
        $v = $i * 2
        if ($v -gt 5000) { $lista.Add($v) }
    }
}).TotalMilliseconds

"Pipeline: ${t1}ms | Foreach: ${t2}ms"
`} />

      <h2>Transcript e Logs de Sessão</h2>
      <CodeBlock title="Gravando sessões para análise" code={`# Gravar toda a sessão em arquivo
Start-Transcript -Path "C:\\Logs\\debug-$(Get-Date -Format 'yyyyMMdd_HHmmss').log"  -Append -IncludeInvocationHeader

# ... Execute seus comandos ...

# Parar gravação
Stop-Transcript
`} />

      <h2>Analisando ErrorRecord</h2>
      <CodeBlock title="Inspecionando erros em detalhe" code={`try {
    Get-Item "arquivo-inexistente.txt" -ErrorAction Stop
} catch {
    $err = $_
    $err.Exception.GetType().FullName       # Tipo da exceção
    $err.Exception.Message                  # Mensagem
    $err.InvocationInfo.MyCommand           # Comando que falhou
    $err.InvocationInfo.ScriptLineNumber    # Linha
    $err.ScriptStackTrace                   # Stack trace

    # Get-Error (PS7+) — informações ainda mais detalhadas
    Get-Error
}

# Ver todos os erros da sessão atual
$Error | Select-Object -First 5 | ForEach-Object {
    [PSCustomObject]@{
        Mensagem = $_.Exception.Message
        Linha    = $_.InvocationInfo?.ScriptLineNumber
        Comando  = $_.InvocationInfo?.MyCommand
    }
}

# Limpar variável de erros
$Error.Clear()
`} />

      <AlertBox type="info" title="Depuração no VS Code">
        Instale a extensão "PowerShell" no VS Code para ter breakpoints visuais,
        painel de variáveis, call stack e console de depuração interativo — muito mais
        produtivo que o depurador de linha de comando.
      </AlertBox>
    </PageContainer>
  );
}
