import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConteudoArquivos() {
  return (
    <PageContainer
      title="Manipulação de Conteúdo de Arquivos"
      subtitle="Lendo, escrevendo e editando dados dentro de arquivos de texto e binários."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        Ler e escrever conteúdo em arquivos é uma tarefa diária para qualquer administrador de sistemas. O PowerShell oferece cmdlets poderosos que tratam o conteúdo de arquivos como objetos ou arrays de strings, facilitando o processamento linha por linha.
      </p>

      <h2>Lendo Conteúdo: Get-Content</h2>
      <p>
        O <code>Get-Content</code> (aliases <code>cat</code>, <code>type</code>, <code>gc</code>) é o comando principal para ler arquivos. Por padrão, ele retorna um array de strings, onde cada elemento é uma linha do arquivo.
      </p>

      <CodeBlock
        title="Diferentes formas de ler arquivos"
        code={`# Lê o arquivo inteiro e exibe no console
Get-Content -Path ".\\servidores.txt"

# Lê apenas as primeiras 10 linhas
Get-Content -Path ".\\logs.txt" -TotalCount 10

# Lê as últimas 5 linhas (equivalente ao 'tail' do Linux)
Get-Content -Path ".\\logs.txt" -Tail 5

# Lê o arquivo como uma única string gigante (útil para Regex multilinhas)
$conteudoCompleto = Get-Content -Path ".\\config.json" -Raw

# Monitora um arquivo de log em tempo real (equivalente ao 'tail -f')
Get-Content -Path ".\\app.log" -Wait
`}
      />

      <AlertBox type="info" title="Performance com Arquivos Grandes">
        Para arquivos extremamente grandes (GBs), <code>Get-Content</code> pode ser lento pois ele processa objetos. Nesses casos, usar a classe .NET <code>[System.IO.File]::ReadLines($path)</code> é muito mais eficiente em memória.
      </AlertBox>

      <h2>Escrevendo Conteúdo: Set-Content e Add-Content</h2>
      <p>
        Temos dois cmdlets principais para escrita: <code>Set-Content</code> (sobrescreve) e <code>Add-Content</code> (adiciona ao final).
      </p>

      <CodeBlock
        title="Escrita e anexação de dados"
        code={`# Sobrescreve o conteúdo do arquivo (ou cria se não existir)
Set-Content -Path ".\\notas.txt" -Value "Esta é a primeira linha."

# Adiciona uma nova linha ao final do arquivo existente
Add-Content -Path ".\\notas.txt" -Value "Esta é uma linha adicional."

# Escrevendo múltiplas linhas de uma vez
$linhas = "Linha 1", "Linha 2", "Linha 3"
Set-Content -Path ".\\lista.txt" -Value $linhas

# Limpando o conteúdo de um arquivo sem deletá-lo
Clear-Content -Path ".\\temporario.log"
`}
      />

      <h2>Codificação de Caracteres (Encodings)</h2>
      <p>
        Problemas com acentuação são comuns ao lidar com arquivos. O parâmetro <code>-Encoding</code> permite especificar como o PowerShell deve interpretar ou gravar os bytes.
      </p>

      <CodeBlock
        title="Trabalhando com diferentes encodings"
        code={`# Salvando em UTF-8 (Recomendado para modernidade e Linux)
Set-Content -Path "script.ps1" -Value "# Comentário com acentuação" -Encoding UTF8

# Lendo um arquivo em formato Unicode (UTF-16)
Get-Content -Path "arquivo_antigo.txt" -Encoding Unicode

# Opções comuns: ASCII, UTF8, Unicode, BigEndianUnicode, UTF32
`}
      />

      <AlertBox type="warning" title="UTF-8 vs UTF8NoBOM">
        No Windows PowerShell 5.1, o padrão é <code>UTF-16</code>. No PowerShell 7+, o padrão é <code>UTF-8</code> sem BOM. Ao criar scripts que devem rodar em múltiplos sistemas, especifique explicitamente o encoding.
      </AlertBox>

      <h2>Processamento de Conteúdo via Pipeline</h2>
      <p>
        A verdadeira força surge ao combinar <code>Get-Content</code> com filtros como <code>Where-Object</code> ou <code>Select-String</code>.
      </p>

      <CodeBlock
        title="Filtragem de conteúdo avançada"
        code={`# Busca por uma palavra específica dentro de um arquivo (tipo grep)
Get-Content ".\\logs.txt" | Select-String "Error"

# Conta quantas vezes a palavra "Sucesso" aparece
(Get-Content ".\\resultado.txt" | Select-String "Sucesso").Count

# Substituindo texto dentro de um arquivo e salvando o resultado
(Get-Content ".\\config.ini") -replace 'localhost', '10.0.0.5' | Set-Content ".\\config.ini"
`}
      />

      <h2>Trabalhando com Formatos Estruturados (JSON, CSV, XML)</h2>
      <p>
        Muitas vezes o conteúdo não é apenas texto simples, mas dados estruturados.
      </p>

      <CodeBlock
        title="Lendo arquivos JSON e CSV"
        code={`# Lendo um JSON e convertendo para um objeto manipulável
$config = Get-Content ".\\settings.json" | ConvertFrom-Json
$config.Database.Server = "NovoServidor"
$config | ConvertTo-Json | Set-Content ".\\settings.json"

# Lendo um CSV como se fosse um banco de dados
$usuarios = Import-Csv -Path ".\\usuarios.csv" -Delimiter ";"
foreach ($u in $usuarios) {
    Write-Host "Processando usuário: $($u.Nome)"
}
`}
      />

      <h2>Diferença: Out-File vs Set-Content</h2>
      <p>
        Embora pareçam iguais, <code>Out-File</code> (e o operador <code>&gt;</code>) e <code>Set-Content</code> funcionam de forma diferente:
      </p>
      <ul>
        <li><strong>Set-Content:</strong> Projetado especificamente para strings. É mais rápido para texto simples.</li>
        <li><strong>Out-File:</strong> Tenta renderizar o objeto como ele aparece no console. É melhor para capturar a saída formatada de outros comandos.</li>
      </ul>

      <CodeBlock
        title="Exemplo comparativo"
        code={`# Out-File captura a formatação de tabela (não recomendado para processamento posterior)
Get-Process | Out-File ".\\processos.txt"

# Set-Content é usado para dados puros
$dados = "Valor 1", "Valor 2"
$dados | Set-Content ".\\dados.txt"
`}
      />
    </PageContainer>
  );
}
