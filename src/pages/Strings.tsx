import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Strings() {
  return (
    <PageContainer
      title="Manipulação de Strings"
      subtitle="Aprenda a trabalhar com textos, interpolação, métodos de objeto e formatação avançada."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        No PowerShell, strings são objetos do tipo <code>System.String</code>. Isso significa que 
        cada texto que você cria possui uma vasta biblioteca de métodos embutidos para transformação 
        e análise, além das facilidades de interpolação da linguagem.
      </p>

      <h2>Aspas Simples vs. Aspas Duplas</h2>
      <p>
        A principal diferença entre os tipos de aspas é como o PowerShell trata o conteúdo interno.
      </p>

      <CodeBlock
        title="Interpolação vs Texto Literal"
        code={`$nome = "Mundo"

# Aspas Duplas (Expandable Strings): Processam variáveis e caracteres de escape
"Olá $nome"        # Resultado: Olá Mundo
"Valor: $(5 * 2)"  # Subexpressão: Valor: 10

# Aspas Simples (Verbatim Strings): Tratam tudo como texto literal
'Olá $nome'        # Resultado: Olá $nome
'C:\\Temp'         # Útil para caminhos de arquivos
`}
      />

      <h2>Here-Strings</h2>
      <p>
        Para blocos de texto grandes ou com múltiplas linhas, usamos as Here-Strings. 
        Elas preservam a formatação exata, incluindo quebras de linha e aspas internas.
      </p>

      <CodeBlock
        title="Trabalhando com blocos de texto"
        code={`$query = @"
SELECT * 
FROM Usuarios 
WHERE Nome = 'Admin'
ORDER BY DataCriacao DESC
"@

# Também existe a versão literal com aspas simples
$textoFixo = @'
Este texto não processará variáveis como $esta
'@
`}
      />

      <AlertBox type="warning" title="Sintaxe Obrigatória">
        O fechamento de uma Here-String (<code>"@</code> ou <code>'@</code>) deve estar 
        obrigatoriamente no início da linha, sem espaços antes dele.
      </AlertBox>

      <h2>Caracteres de Escape</h2>
      <p>
        O caractere de escape no PowerShell é a crase (<code>`</code>), também conhecida como backtick.
      </p>

      <CodeBlock
        title="Caracteres especiais"
        code={`"Linha 1 \`nLinha 2"      # Nova linha
"Coluna 1 \`tColuna 2"    # Tabulação
"O preço é \`$100"        # Escapa o símbolo de variável
"Ele disse \`"Oi\`""       # Escapa aspas duplas dentro de aspas duplas
`}
      />

      <h2>Métodos de Objeto String</h2>
      <p>
        Como strings são objetos .NET, você pode chamar métodos diretamente nelas usando o ponto (<code>.</code>).
      </p>

      <CodeBlock
        title="Transformando textos"
        code={`$texto = "  PowerShell é Incrível  "

$texto.ToUpper()           # "  POWERSHELL É INCRÍVEL  "
$texto.ToLower().Trim()    # "powershell é incrível" (Encadeado)
$texto.Contains("Shell")   # True
$texto.Replace("Incrível", "Poderoso")
$texto.Substring(2, 10)    # "PowerShell"
$texto.Split(" ")          # Divide em um array de palavras
$texto.Length              # Propriedade com o tamanho da string
`}
      />

      <h2>O Operador de Formatação (-f)</h2>
      <p>
        Uma forma limpa e poderosa de construir strings complexas, similar ao <code>string.Format</code> do C# 
        ou <code>printf</code> do C.
      </p>

      <CodeBlock
        title="Usando o operador -f"
        code={`# Formato: "Template" -f item0, item1...
"{0} tem {1} anos de idade" -f "João", 25

# Formatação numérica e de data
"Preço: {0:C2}" -f 49.9                # R$ 49,90 (depende da cultura local)
"Progresso: {0:P0}" -f 0.75            # 75%
"Data: {0:dd/MM/yyyy}" -f (Get-Date)   # 15/10/2023
`}
      />

      <h2>Busca Avançada com Select-String</h2>
      <p>
        O cmdlet <code>Select-String</code> é o equivalente ao <code>grep</code> do Linux, 
        permitindo buscar padrões em textos ou arquivos.
      </p>

      <CodeBlock
        title="Buscando padrões"
        code={`$lista = "apple", "banana", "cherry", "date"

# Buscar texto simples
$lista | Select-String "a"

# Buscar usando Regex (Inicia com 'c')
$lista | Select-String "^c"

# No conteúdo de arquivos
Select-String -Path "./logs/*.log" -Pattern "Error"
`}
      />

      <AlertBox type="info" title="Regex Integrado">
        Muitos operadores do PowerShell, como <code>-match</code> e <code>-replace</code>, 
        já utilizam Regex por padrão, tornando a manipulação de strings extremamente ágil.
      </AlertBox>
    </PageContainer>
  );
}
