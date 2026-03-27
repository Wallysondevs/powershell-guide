import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Pipeline() {
  return (
    <PageContainer
      title="O Pipeline no PowerShell"
      subtitle="A verdadeira força do PowerShell: passando objetos, não apenas texto."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        O pipeline (representado pelo caractere <code>|</code>) é o conceito mais fundamental e poderoso do PowerShell.
        Diferente de shells tradicionais como Bash ou CMD, onde o pipeline passa fluxos de texto, o PowerShell passa
        <strong>objetos completos</strong> entre os comandos. Isso elimina a necessidade de parsing complexo de texto
        com ferramentas como <code>grep</code>, <code>sed</code> ou <code>awk</code>.
      </p>

      <h2>Como funciona o Pipeline de Objetos</h2>
      <p>
        Quando você executa um comando e passa o resultado para outro, o PowerShell mantém a estrutura do objeto.
        Por exemplo, ao listar processos, você não recebe apenas o nome do processo como uma string, mas um objeto
        do tipo <code>System.Diagnostics.Process</code> que contém propriedades como CPU, Memória, ID e muito mais.
      </p>

      <CodeBlock
        title="Exemplo básico de Pipeline"
        code={`# Obtém todos os processos
# Filtra apenas os que estão usando mais de 100MB de memória (WorkingSet)
# Ordena pelo uso de CPU de forma decrescente
# Seleciona apenas os 5 primeiros
Get-Process | Where-Object { $_.WorkingSet -gt 100MB } | Sort-Object CPU -Descending | Select-Object -First 5
`}
      />

      <AlertBox type="info" title="O Objeto Atual: $_ e $PSItem">
        Dentro de um bloco de script no pipeline (como no <code>Where-Object</code>), a variável automática <code>$_</code> 
        (ou <code>$PSItem</code> no PowerShell 3.0+) representa o objeto que está passando pelo pipeline naquele momento.
      </AlertBox>

      <h2>Encadeamento de Comandos</h2>
      <p>
        Você pode encadear quantos comandos desejar. Cada comando no pipeline processa os objetos um por um conforme 
        eles chegam, o que é muito eficiente em termos de memória, pois o PowerShell não precisa carregar toda a 
        coleção antes de começar o processamento.
      </p>

      <CodeBlock
        title="Pipeline com múltiplos estágios"
        code={`# Lista arquivos .log no diretório do Windows
# Filtra arquivos modificados nos últimos 7 dias
# Seleciona o nome e o tamanho
# Exporta para um arquivo CSV
Get-ChildItem -Path C:\\Windows\\*.log -Recurse | 
    Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-7) } | 
    Select-Object Name, @{Name="SizeKB"; Expression={$_.Length / 1KB}} | 
    Export-Csv -Path "./LogReport.csv" -NoTypeInformation
`}
      />

      <h2>Pipeline Input: ValueFromPipeline e ByPropertyName</h2>
      <p>
        O PowerShell decide como conectar os comandos baseando-se no tipo do objeto (<code>ValueFromPipeline</code>) 
        ou no nome da propriedade (<code>ValueFromPipelineByPropertyName</code>).
      </p>

      <CodeBlock
        title="Entrada por Nome de Propriedade"
        code={`# Criamos um objeto com uma propriedade 'Name'
$myProcess = [PSCustomObject]@{ Name = "explorer" }

# Passamos para o Stop-Process. Como Stop-Process aceita 'Name' do pipeline, ele funciona!
$myProcess | Stop-Process -WhatIf
`}
      />

      <h2>ForEach-Object e blocos de processamento</h2>
      <p>
        O comando <code>ForEach-Object</code> (alias <code>%</code>) permite executar um bloco de código para cada 
        objeto no pipeline. Ele possui três blocos opcionais: <code>begin</code>, <code>process</code> e <code>end</code>.
      </p>

      <CodeBlock
        title="Uso avançado do ForEach-Object"
        code={`# Usando blocos begin, process e end para somar tamanhos de arquivos
Get-ChildItem -File | ForEach-Object -Begin {
    $totalSize = 0
    Write-Host "Iniciando contagem..." -ForegroundColor Cyan
} -Process {
    $totalSize += $_.Length
    Write-Host "Processando: $($_.Name)"
} -End {
    Write-Host "Tamanho Total: $($totalSize / 1MB) MB" -ForegroundColor Green
}
`}
      />

      <AlertBox type="warning" title="foreach vs ForEach-Object">
        A palavra-chave <code>foreach ($item in $colecao)</code> carrega toda a coleção na memória antes de processar. 
        Já o <code>ForEach-Object</code> no pipeline processa um item por vez. Use o primeiro para performance com 
        coleções pequenas e o segundo para fluxos de dados grandes ou quando o consumo de memória for crítico.
      </AlertBox>

      <h2>Tee-Object: Dividindo o Pipeline</h2>
      <p>
        Às vezes você quer ver o resultado na tela E salvar em um arquivo simultaneamente. O <code>Tee-Object</code> 
        serve exatamente para isso.
      </p>

      <CodeBlock
        title="Usando Tee-Object"
        code={`# Lista serviços parados, mostra na tela e salva no arquivo ao mesmo tempo
Get-Service | Where-Object Status -eq "Stopped" | Tee-Object -FilePath "./servicos_parados.txt" | Select-Object -First 5
`}
      />

      <h2>Operadores de Encadeamento no PS7+ (&& e ||)</h2>
      <p>
        Inspirado em shells Unix, o PowerShell 7 introduziu operadores de encadeamento condicional baseados no sucesso 
        do comando anterior.
      </p>

      <CodeBlock
        title="Encadeamento Condicional"
        code={`# Executa o segundo comando apenas se o primeiro for bem-sucedido (&&)
mkdir "NovoProjeto" && cd "NovoProjeto"

# Executa o segundo comando apenas se o primeiro falhar (||)
Test-Path "./config.json" || Write-Error "Arquivo de configuração não encontrado!"
`}
      />

      <h2>Dicas de Performance no Pipeline</h2>
      <p>
        Filtre o mais cedo possível ("Filter left, format right"). É muito mais eficiente pedir ao comando inicial 
        para filtrar do que filtrar depois no pipeline.
      </p>

      <CodeBlock
        title="Bom vs Ruim (Performance)"
        code={`# INEFICIENTE: Obtém tudo e depois filtra
Get-Service | Where-Object Name -eq "bits"

# EFICIENTE: O comando já busca apenas o necessário
Get-Service -Name "bits"

# INEFICIENTE: Lê o arquivo todo e depois filtra
Get-Content "./grande.log" | Where-Object { $_ -match "Error" }

# EFICIENTE: Usa o Select-String para ler de forma otimizada
Select-String -Path "./grande.log" -Pattern "Error"
`}
      />

      <AlertBox type="danger" title="Pipeline Nulo">
        Se um comando no meio do pipeline não retornar nada, o restante do pipeline não será executado para aquele 
        objeto específico. Certifique-se de que seus filtros não estão sendo restritivos demais por acidente.
      </AlertBox>
    </PageContainer>
  );
}
