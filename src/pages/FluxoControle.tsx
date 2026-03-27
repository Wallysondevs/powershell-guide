import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FluxoControle() {
  return (
    <PageContainer
      title="Fluxo de Controle e Laços"
      subtitle="Tomada de decisão, repetições e lógica de programação no PowerShell."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        O controle de fluxo permite que seus scripts tomem decisões inteligentes e executem tarefas repetitivas de forma eficiente. O PowerShell compartilha muitas semelhanças sintáticas com C# e outras linguagens modernas, mas possui nuances importantes, especialmente na forma como lida com o pipeline.
      </p>

      <h2>Estruturas de Decisão: if, elseif, else</h2>
      <p>
        A estrutura básica para testar condições. Lembre-se que no PowerShell usamos operadores como <code>-eq</code>, <code>-ne</code>, <code>-gt</code> em vez de <code>==</code> ou <code>{'>'}</code>.
      </p>

      <CodeBlock
        title="Condicionais simples e compostas"
        code={`$servico = Get-Service -Name "Spooler"

if ($servico.Status -eq "Running") {
    Write-Host "O serviço de impressão está rodando." -ForegroundColor Green
}
elseif ($servico.Status -eq "Stopped") {
    Write-Host "O serviço está parado. Tentando iniciar..." -ForegroundColor Yellow
    Start-Service -Name "Spooler"
}
else {
    Write-Host "O serviço está em um estado desconhecido: $($servico.Status)" -ForegroundColor Red
}

# Usando operadores lógicos (-and, -or, -not)
$idade = 25
$temPermissao = $true

if ($idade -ge 18 -and $temPermissao) {
    Write-Host "Acesso autorizado."
}
`}
      />

      <h2>Switch: A Alternativa Poderosa</h2>
      <p>
        O <code>switch</code> no PowerShell é muito mais potente do que em outras linguagens. Ele pode lidar com wildcards, expressões regulares e até processar arquivos linha por linha.
      </p>

      <CodeBlock
        title="Switch com Wildcards e Regex"
        code={`$arquivo = "relatorio_final_2023.pdf"

switch -Wildcard ($arquivo) {
    "*.txt" { Write-Host "É um arquivo de texto" }
    "relatorio_*" { Write-Host "É um arquivo de relatório" }
    "*.pdf" { Write-Host "É um documento PDF" }
    Default { Write-Host "Extensão desconhecida" }
}

# Switch processando múltiplos itens de um array
$valores = 1, 5, 10, 15
switch ($valores) {
    { $_ -lt 5 }  { Write-Host "$_ é menor que 5" }
    { $_ -eq 10 } { Write-Host "$_ é exatamente 10" }
    { $_ -gt 10 } { Write-Host "$_ é maior que 10" }
}
`}
      />

      <h2>Laços de Repetição: foreach vs ForEach-Object</h2>
      <p>
        Existem duas formas principais de iterar sobre coleções. O <code>foreach</code> (comando da linguagem) é geralmente mais rápido, enquanto o <code>ForEach-Object</code> (cmdlet do pipeline) usa menos memória para grandes volumes de dados.
      </p>

      <CodeBlock
        title="Diferentes formas de iterar"
        code={`$computadores = "Servidor01", "Servidor02", "Servidor03"

# 1. foreach (instrução da linguagem) - Rápido, carrega tudo na RAM
foreach ($pc in $computadores) {
    Write-Host "Verificando $pc..."
}

# 2. ForEach-Object (via Pipeline) - Mais lento, mas processa item por item
$computadores | ForEach-Object {
    Write-Host "Processando $($_.ToUpper()) via pipeline"
}

# Alias comum para ForEach-Object é o símbolo '%'
1..5 | % { Write-Host "Número $_" }
`}
      />

      <AlertBox type="info" title="Qual usar?">
        Use <code>foreach ($item in $coll)</code> para scripts menores onde a performance de execução é prioridade. Use <code>$coll | ForEach-Object</code> quando estiver trabalhando diretamente no pipeline ou lidando com milhões de objetos que não cabem na memória de uma vez.
      </AlertBox>

      <h2>Laços Tradicionais: for, while, do-until</h2>
      <p>
        Úteis para quando você sabe exatamente quantas vezes repetir ou quando a repetição depende de uma condição externa que muda durante o processo.
      </p>

      <CodeBlock
        title="For e While"
        code={`# For clássico (inicialização; condição; incremento)
for ($i = 1; $i -le 5; $i++) {
    Write-Host "Contagem: $i"
}

# While: testa a condição ANTES de entrar
$count = 0
while ($count -lt 3) {
    Write-Host "Tentativa $count"
    $count++
}

# Do-Until: executa pelo menos uma vez e para quando a condição for VERDADEIRA
do {
    $processo = Get-Process -Name "notepad" -ErrorAction SilentlyContinue
    Write-Host "Aguardando o Bloco de Notas fechar..."
    Start-Sleep -Seconds 2
} until ($null -eq $processo)
`}
      />

      <h2>Interrompendo o Fluxo: break, continue e return</h2>
      <p>
        Controle fino sobre a execução de laços e funções.
      </p>

      <CodeBlock
        title="Break e Continue"
        code={`foreach ($num in 1..10) {
    # Pular números ímpares
    if ($num % 2 -ne 0) {
        continue
    }
    
    # Parar o laço se chegar no 8
    if ($num -eq 8) {
        break
    }
    
    Write-Host "Número par: $num"
}
`}
      />

      <h2>O Novo ForEach-Object -Parallel (PS 7+)</h2>
      <p>
        Uma das funcionalidades mais pedidas: a capacidade de executar tarefas no pipeline de forma simultânea, aproveitando múltiplos núcleos do processador.
      </p>

      <CodeBlock
        title="Execução paralela"
        code={`# Testar conexão com vários sites simultaneamente
$sites = "google.com", "bing.com", "github.com", "replit.com"

$sites | ForEach-Object -Parallel {
    $status = Test-Connection -ComputerName $_ -Count 1 -Quiet
    Write-Host "Site $_ : $status"
} -ThrottleLimit 4
`}
      />

      <AlertBox type="danger" title="Escopo no Paralelismo">
        Dentro de um bloco <code>-Parallel</code>, você não tem acesso direto às variáveis do script principal. Você deve usar o prefixo <code>$using:</code> para acessar variáveis externas. Ex: <code>$using:minhaVariavel</code>.
      </AlertBox>

      <h2>Operadores Ternários e Null Coalescing (PS 7+)</h2>
      <p>
        Sintaxe simplificada para atribuições condicionais, inspirada em C# e JavaScript.
      </p>

      <CodeBlock
        title="Novos operadores de fluxo"
        code={`# Operador Ternário (condicao ? verdadeiro : falso)
$mensagem = ($idade -ge 18) ? "Adulto" : "Menor"

# Operador Null Coalescing (??)
# Se o primeiro valor for nulo, usa o segundo
$config = $valorDoBanco ?? "Valor Padrao"

# Atribuição Null Coalescing (??=)
$historico ??= New-Object System.Collections.Generic.List[string]
`}
      />

    </PageContainer>
  );
}
