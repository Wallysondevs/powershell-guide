import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Operadores() {
  return (
    <PageContainer
      title="Operadores no PowerShell"
      subtitle="Domine os operadores aritméticos, de comparação, lógicos e de manipulação de strings."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <p>
        Operadores são símbolos ou palavras-chave que permitem realizar ações sobre dados. 
        O PowerShell possui uma sintaxe de operadores única (como <code>-eq</code> em vez de <code>==</code>), 
        que facilita o uso em linhas de comando e scripts.
      </p>

      <h2>Operadores Aritméticos</h2>
      <p>
        Usados para realizar cálculos matemáticos padrão. O PowerShell segue a ordem de precedência matemática.
      </p>

      <CodeBlock
        title="Matemática básica"
        code={`# Soma, Subtração, Multiplicação, Divisão e Módulo
5 + 5          # 10
10 - 2         # 8
4 * 3          # 12
20 / 4         # 5
10 % 3         # 1 (resto da divisão)

# Operações com strings e arrays
"Power" + "Shell"  # Concatenação: "PowerShell"
"abc " * 3         # Repetição: "abc abc abc "
@(1,2) + @(3,4)    # Junção de arrays: 1, 2, 3, 4
`}
      />

      <h2>Operadores de Comparação</h2>
      <p>
        Estes são fundamentais para lógica de decisão. Por padrão, eles <b>não</b> diferenciam 
        maiúsculas de minúsculas.
      </p>

      <CodeBlock
        title="Comparando valores"
        code={`# Igualdade e Diferença
"teste" -eq "TESTE"  # True (Case-insensitive)
5 -ne 10             # True

# Maior e Menor
10 -gt 5             # True (Greater Than)
10 -ge 10            # True (Greater or Equal)
3 -lt 7              # True (Less Than)
5 -le 5              # True (Less or Equal)

# Diferenciando maiúsculas/minúsculas (prefixo 'c')
"A" -ceq "a"         # False (Case-sensitive equal)
"A" -ieq "a"         # True (Explicitly case-insensitive)
`}
      />

      <AlertBox type="info" title="Operadores de Coleção">
        Quando usados com uma coleção (como um array) à esquerda, os operadores de comparação 
        filtram os elementos em vez de retornar apenas True/False.
        <code>1,2,3,4 -gt 2</code> retornará <code>3, 4</code>.
      </AlertBox>

      <h2>Operadores de Texto e Correspondência</h2>
      <p>
        O PowerShell oferece ferramentas poderosas para buscar e manipular padrões de texto.
      </p>

      <CodeBlock
        title="Wildcards e Regex"
        code={`# -like: Usa curingas (* e ?)
"Log_2023.txt" -like "Log_*.txt"  # True
"abc" -like "a??"                # True

# -match: Usa Expressões Regulares (Regex)
"123-456" -match "\\d{3}-\\d{3}"    # True
$Matches[0]                        # Contém o valor capturado

# -replace: Substituição de texto
"Olá Mundo" -replace "Mundo", "PowerShell"
"123-456" -replace "\\d", "*"       # "***-***"
`}
      />

      <h2>Operadores Lógicos</h2>
      <p>
        Usados para combinar múltiplas condições booleanas.
      </p>

      <CodeBlock
        title="E, Ou, Não"
        code={`# AND: Verdadeiro se ambos forem verdadeiros
(5 -lt 10) -and (2 -gt 1)

# OR: Verdadeiro se pelo menos um for verdadeiro
$true -or $false

# NOT: Inverte o valor booleano
-not $true    # False
! $true       # False (Abreviação)

# XOR: Verdadeiro se apenas um for verdadeiro
$true -xor $true  # False
`}
      />

      <h2>Operadores de Tipo</h2>
      <p>
        Verificam ou alteram o tipo de um objeto.
      </p>

      <CodeBlock
        title="Checando tipos"
        code={`# -is: Verifica se é de um tipo
$valor = 10
$valor -is [int]     # True
$valor -is [string]  # False

# -as: Tenta converter (retorna $null se falhar em vez de erro)
"123" -as [int]      # 123
"texto" -as [int]    # $null
`}
      />

      <h2>Operadores Modernos (PowerShell 7+)</h2>
      <p>
        Versões recentes do PowerShell adicionaram operadores comuns em linguagens como C# e JavaScript.
      </p>

      <CodeBlock
        title="Ternário e Coalescência"
        code={`# Ternário: condicao ? valor_se_true : valor_se_false
$status = (2 -gt 1) ? "Maior" : "Menor"

# Coalescência de Nulo (??): Retorna o primeiro valor se não for nulo
$config = $null ?? "Padrao"  # "Padrao"

# Atribuição de Coalescência (??=)
$x ??= 10  # Atribui 10 apenas se $x for nulo
`}
      />

      <AlertBox type="warning" title="Compatibilidade">
        Os operadores Ternário (<code>?:</code>) e Coalescência Nula (<code>??</code>) só funcionam 
        no PowerShell Core 7.0 ou superior. Eles causarão erro no Windows PowerShell 5.1.
      </AlertBox>

      <h2>Operadores de Atribuição</h2>
      <p>
        Modificam o valor de uma variável de forma abreviada.
      </p>

      <CodeBlock
        title="Atribuição composta"
        code={`$n = 10
$n += 5   # $n agora é 15
$n -= 2   # $n agora é 13
$n *= 2   # $n agora é 26
$n /= 2   # $n agora é 13

# Incremento e Decremento
$n++
$n--
`}
      />
    </PageContainer>
  );
}
