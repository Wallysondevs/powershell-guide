import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Performance() {
  return (
    <PageContainer
      title="Otimização de Performance"
      subtitle="Técnicas para acelerar scripts: listas genéricas, pipeline eficiente, paralelismo e compilação."
      difficulty="avançado"
      timeToRead="25 min"
    >
      <p>
        PowerShell pode ser significativamente mais lento do que linguagens compiladas,
        mas com as técnicas certas é possível obter ganhos de 10x a 100x em operações
        comuns. Entender o que é lento e por quê é o primeiro passo.
      </p>

      <h2>O Inimigo: Acumulação com +=</h2>
      <AlertBox type="danger" title="Nunca use += para Arrays em loops">
        Arrays em PowerShell são imutáveis. Cada <code>$array += $item</code> cria um novo
        array na memória e copia todos os elementos. Com 10.000 itens, isso se torna
        catastroficamente lento — use listas genéricas.
      </AlertBox>
      <CodeBlock title="ArrayList vs += — diferença gritante" code={`# LENTO: cria novo array a cada iteração
$tempo = Measure-Command {
    $arr = @()
    for ($i = 0; $i -lt 10000; $i++) { $arr += $i }
}
"Array +=: $($tempo.TotalMilliseconds)ms"

# RÁPIDO: Lista genérica com Add()
$tempo = Measure-Command {
    $lista = [System.Collections.Generic.List[int]]::new()
    for ($i = 0; $i -lt 10000; $i++) { $lista.Add($i) }
}
"Generic List: $($tempo.TotalMilliseconds)ms"  # ~100x mais rápido

# StringBuilder para concatenação de strings
$sb = [System.Text.StringBuilder]::new()
for ($i = 0; $i -lt 10000; $i++) {
    [void]$sb.Append("Item $i, ")
}
$resultado = $sb.ToString()
`} />

      <h2>Pipeline vs Foreach vs LINQ</h2>
      <CodeBlock title="Comparando abordagens de processamento" code={`# Pipeline — elegante, overhead por item
$t1 = (Measure-Command {
    $r = 1..100000 | ForEach-Object { $_ * 2 } | Where-Object { $_ -gt 50000 }
}).TotalMilliseconds

# Foreach loop — mais rápido para operações simples
$t2 = (Measure-Command {
    $lista = [System.Collections.Generic.List[int]]::new()
    foreach ($i in 1..100000) {
        $v = $i * 2
        if ($v -gt 50000) { $lista.Add($v) }
    }
}).TotalMilliseconds

# Where/Select com métodos de array — mais rápido ainda
$t3 = (Measure-Command {
    $arr = [int[]](1..100000)
    $r   = $arr | Where-Object { $_ * 2 -gt 50000 }
}).TotalMilliseconds

"Pipeline: ${t1}ms | Foreach: ${t2}ms | Array: ${t3}ms"
`} />

      <h2>Filtrar na Fonte, não no Final</h2>
      <CodeBlock title="Filtragem antecipada economiza tempo e memória" code={`# RUIM: carrega tudo na memória, depois filtra
Get-ChildItem "C:\\Windows" -Recurse | Where-Object Extension -eq ".dll"

# BOM: filtra durante a busca (parâmetro nativo)
Get-ChildItem "C:\\Windows" -Recurse -Filter "*.dll"

# RUIM: carrega todos os usuários AD, depois filtra
Get-ADUser -Filter * | Where-Object Department -eq "TI"

# BOM: filtra no servidor AD
Get-ADUser -Filter "Department -eq 'TI'"

# Para Select-Object, use -First para parar cedo
Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
`} />

      <h2>Cache e Memoização</h2>
      <CodeBlock title="Evitar recalcular resultados caros" code={`$cache = @{}

function Get-DadosServidor {
    param([string]$Servidor)

    if ($cache.ContainsKey($Servidor)) {
        Write-Debug "Cache hit: $Servidor"
        return $cache[$Servidor]
    }

    $dados = Invoke-Command -ComputerName $Servidor -ScriptBlock {
        [PSCustomObject]@{
            CPU  = (Get-CimInstance Win32_Processor).LoadPercentage
            RAM  = [math]::Round((gcim Win32_OperatingSystem).FreePhysicalMemory/1MB, 2)
        }
    }

    $cache[$Servidor] = $dados
    return $dados
}

# Calcular variáveis uma vez e reutilizar
$processos = Get-Process  # Uma chamada
$maiores   = $processos | Sort-Object WS -Descending | Select-Object -First 10
$total     = ($processos | Measure-Object WS -Sum).Sum
$media     = ($processos | Measure-Object WS -Average).Average
`} />

      <h2>Compilação com Add-Type (C# Inline)</h2>
      <CodeBlock title="C# para operações críticas de performance" code={`# Operações muito repetitivas ganham com C# compilado
Add-Type -TypeDefinition @'
using System;
using System.IO;
using System.Collections.Generic;
using System.Text.RegularExpressions;

public static class LogAnalyzer {
    private static readonly Regex _pattern = new Regex(
        @"(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) \[(\w+)\] (.+)",
        RegexOptions.Compiled
    );

    public static int CountErrors(string filePath) {
        int count = 0;
        foreach (var line in File.ReadLines(filePath)) {
            var m = _pattern.Match(line);
            if (m.Success && m.Groups[3].Value == "ERROR") count++;
        }
        return count;
    }
}
'@ -Language CSharp

# LogAnalyzer.CountErrors é compilado — muito mais rápido que Select-String
$total = [LogAnalyzer]::CountErrors("C:\\Logs\\app.log")
"Total de erros: $total"
`} />

      <AlertBox type="info" title="Regra 80/20 da Otimização">
        Meça antes de otimizar. Use <code>Measure-Command</code> para identificar onde está o
        gargalo real. Geralmente 80% do tempo é gasto em 20% do código. Otimize apenas o que
        realmente importa.
      </AlertBox>
    </PageContainer>
  );
}
