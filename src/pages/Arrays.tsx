import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Arrays() {
  return (
    <PageContainer
      title="Arrays e Listas"
      subtitle="Arrays são coleções ordenadas de valores. Aprenda a criar, acessar, modificar e iterar sobre arrays de forma eficiente no PowerShell."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        Um <strong>array</strong> (ou vetor) é uma variável que armazena múltiplos valores em uma única estrutura.
        No PowerShell, arrays são extremamente versáteis — podem conter qualquer tipo de objeto, incluindo strings,
        números, objetos complexos e até outros arrays. Entender arrays é fundamental para processar coleções
        de dados retornadas por cmdlets como <code>Get-Process</code>, <code>Get-ChildItem</code> e outros.
      </p>

      <h2>1. Criando Arrays</h2>
      <p>Existem várias formas de criar um array no PowerShell. As mais comuns são:</p>

      <CodeBlock
        title="Formas de criar arrays"
        code={`# Forma 1: Usando o operador vírgula (,)
$frutas = "Maçã", "Banana", "Laranja"
# O PowerShell interpreta valores separados por vírgula como um array

# Forma 2: Usando o operador de subexpressão de array @()
$numeros = @(1, 2, 3, 4, 5)
# @() é a forma explícita e recomendada de criar arrays
# Funciona mesmo com zero ou um elemento:
$vazio = @()           # Array vazio
$umElemento = @("só eu") # Array com um elemento

# Forma 3: Usando range operator (..)
$dezAVinte = 10..20
# Cria um array com os inteiros de 10 a 20 (inclusive)
# Muito útil para loops e índices

# Forma 4: Array tipado (só aceita um tipo específico)
[string[]]$nomes = "Ana", "Bruno", "Carlos"
[int[]]$notas = 7, 8, 9, 10
# Tentar adicionar um tipo diferente gera erro

# Forma 5: Array multidimensional
$matriz = @(
    @(1, 2, 3),
    @(4, 5, 6),
    @(7, 8, 9)
)
# Acessar: $matriz[0][1] = 2

# Verificar o tipo
$frutas.GetType().Name       # Retorna: Object[]
$numeros.GetType().Name      # Retorna: Object[]
[int[]]$x = 1,2,3
$x.GetType().Name            # Retorna: Int32[]`}
      />

      <h2>2. Acessando Elementos</h2>
      <CodeBlock
        title="Indexação e fatiamento de arrays"
        code={`$cores = "Vermelho", "Verde", "Azul", "Amarelo", "Roxo"

# Índice positivo (começa em 0)
$cores[0]      # "Vermelho" — primeiro elemento
$cores[1]      # "Verde"    — segundo elemento
$cores[4]      # "Roxo"     — quinto (último) elemento

# Índice negativo (conta do final)
$cores[-1]     # "Roxo"     — último elemento
$cores[-2]     # "Amarelo"  — penúltimo elemento

# Acessar múltiplos índices de uma vez
$cores[0, 2, 4]    # Retorna: Vermelho, Azul, Roxo

# Fatiamento com range (..)
$cores[1..3]       # Retorna: Verde, Azul, Amarelo (índices 1 a 3)
$cores[0..2]       # Retorna: Vermelho, Verde, Azul

# Fatiamento do final
$cores[-3..-1]     # Retorna: Azul, Amarelo, Roxo (últimos 3)

# Número de elementos
$cores.Count       # 5
$cores.Length      # 5 (equivalente a .Count)`}
      />

      <AlertBox type="info" title="Índices começam em 0">
        No PowerShell (e na maioria das linguagens de programação), o primeiro elemento de um array está
        no índice <code>0</code>, não no <code>1</code>. O último elemento está em <code>$array.Count - 1</code>,
        ou simplesmente use <code>$array[-1]</code> para acessá-lo.
      </AlertBox>

      <h2>3. Propriedades e Métodos</h2>
      <CodeBlock
        title="Métodos e propriedades de arrays"
        code={`$numeros = @(5, 3, 8, 1, 9, 2, 7, 4, 6)

# Propriedades
$numeros.Count         # Número de elementos: 9
$numeros.Length        # Mesmo que Count: 9
$numeros.Rank          # Número de dimensões: 1

# Verificar se um valor existe
$numeros -contains 8   # $true
$numeros -contains 99  # $false

# Encontrar o índice de um elemento
[Array]::IndexOf($numeros, 8)   # Retorna: 2 (índice do número 8)

# Ordenar (retorna NOVO array, não modifica o original)
$ordenado = $numeros | Sort-Object
$ordenadoDesc = $numeros | Sort-Object -Descending

# Ou usando método estático:
[Array]::Sort($numeros)    # MODIFICA o array no lugar!

# Inverter a ordem
[Array]::Reverse($numeros) # MODIFICA o array no lugar!

# Verificar tipo dos elementos
$numeros[0].GetType().Name   # "Int32"

# Copiar um array (cópia rasa)
$copia = $numeros.Clone()    # Ou: $copia = @() + $numeros`}
      />

      <h2>4. Adicionando e Removendo Elementos</h2>

      <AlertBox type="warning" title="Arrays são de tamanho fixo!">
        Arrays comuns em PowerShell (<code>Object[]</code>) têm tamanho fixo. Quando você usa <code>+=</code>
        para "adicionar" um elemento, o PowerShell na verdade cria um <strong>novo array</strong> e copia tudo.
        Isso é ineficiente para loops com muitos elementos. Para arrays mutáveis, use <code>ArrayList</code> ou <code>List&lt;T&gt;</code>.
      </AlertBox>

      <CodeBlock
        title="Adicionando elementos (e os problemas de performance)"
        code={`# Método comum com += (INEFICIENTE em loops grandes)
$lista = @(1, 2, 3)
$lista += 4      # PowerShell cria um novo array com 4 elementos
$lista += 5, 6   # Adiciona múltiplos de uma vez
# $lista agora tem: 1, 2, 3, 4, 5, 6

# Concatenar dois arrays
$a = @(1, 2, 3)
$b = @(4, 5, 6)
$c = $a + $b     # $c = 1, 2, 3, 4, 5, 6

# Filtrar elementos (cria novo array)
$pares = $numeros | Where-Object { $_ % 2 -eq 0 }
$maioresQue5 = $numeros | Where-Object { $_ -gt 5 }

# Para REMOVER elementos, filtre pelo que você QUER manter:
$semOTres = $lista | Where-Object { $_ -ne 3 }

# Verificar impacto no tempo:
Measure-Command {
    $arr = @()
    for ($i = 0; $i -lt 10000; $i++) {
        $arr += $i    # LENTO — cria 10.000 arrays
    }
} | Select-Object TotalSeconds`}
      />

      <h2>5. ArrayList — Arrays Mutáveis e Eficientes</h2>
      <CodeBlock
        title="ArrayList para adição/remoção eficiente"
        code={`# Criar um ArrayList (mutável, sem recriação)
$lista = [System.Collections.ArrayList]::new()
# Ou usando o construtor curto:
$lista = New-Object System.Collections.ArrayList

# Adicionar elementos
[void]$lista.Add("Primeiro")    # [void] suprime a saída do índice retornado
[void]$lista.Add("Segundo")
[void]$lista.Add("Terceiro")

# Adicionar múltiplos
$lista.AddRange(@("Quarto", "Quinto"))

# Acessar elementos (mesmo que array)
$lista[0]    # "Primeiro"
$lista[-1]   # "Quinto"

# Remover elementos
$lista.Remove("Terceiro")       # Remove pelo valor
$lista.RemoveAt(0)              # Remove pelo índice
$lista.RemoveRange(0, 2)        # Remove um intervalo

# Inserir em posição específica
$lista.Insert(1, "Novo")        # Insere "Novo" no índice 1

# Verificar existência
$lista.Contains("Segundo")      # $true/$false

# Número de elementos
$lista.Count

# Ordenar (modifica no lugar)
$lista.Sort()

# Reverter (modifica no lugar)
$lista.Reverse()

# Converter para array fixo
$arrayComum = $lista.ToArray()

# Teste de performance:
Measure-Command {
    $arr = [System.Collections.ArrayList]::new()
    for ($i = 0; $i -lt 10000; $i++) {
        [void]$arr.Add($i)    # RÁPIDO — sem recriação
    }
} | Select-Object TotalSeconds`}
      />

      <h2>6. List&lt;T&gt; — Listas Fortemente Tipadas (Moderno)</h2>
      <CodeBlock
        title="Generic List para máxima eficiência e segurança de tipos"
        code={`# Criar uma List<string> (apenas strings são aceitas)
$nomes = [System.Collections.Generic.List[string]]::new()

# Criar uma List<int>
$numeros = [System.Collections.Generic.List[int]]::new()

# Adicionar elementos
$nomes.Add("Alice")
$nomes.Add("Bob")
$nomes.Add("Carlos")

# Tentar adicionar tipo errado gera erro em tempo de execução
# $nomes.Add(42)   # Erro: Cannot convert "42" to "System.String"

# Todos os métodos do ArrayList funcionam aqui também
$nomes.Remove("Bob")
$nomes.Insert(0, "Amanda")
$nomes.Contains("Carlos")    # $true
$nomes.Count                 # 3
$nomes.Sort()

# Inicializar com valores usando construtor
$frutas = [System.Collections.Generic.List[string]]("Maçã", "Banana", "Laranja")

# Encontrar elemento com predicado
$primeiroComA = $nomes.Find({ param($x) $x.StartsWith("A") })

# Filtrar com FindAll
$comecamComA = $nomes.FindAll({ param($x) $x.StartsWith("A") })

# Converter para array
$array = $nomes.ToArray()`}
      />

      <h2>7. Iterando Arrays</h2>
      <CodeBlock
        title="Formas de percorrer arrays"
        code={`$frutas = "Maçã", "Banana", "Laranja", "Uva", "Melancia"

# Forma 1: foreach (mais legível, recomendada)
foreach ($fruta in $frutas) {
    Write-Output "Fruta: $fruta"
}

# Forma 2: for com índice (quando precisa do índice)
for ($i = 0; $i -lt $frutas.Count; $i++) {
    Write-Output "[$i] $frutas[$i]"
}

# Forma 3: ForEach-Object no pipeline
$frutas | ForEach-Object {
    "Processando: $_"   # $_ é o item atual no pipeline
}

# Forma 4: método .ForEach() (PS4+, mais rápido no pipeline)
$frutas.ForEach({ "Item: $_" })

# Com transformação:
$maiusculas = $frutas.ForEach({ $_.ToUpper() })

# Forma 5: Where() e ForEach() combinados
$frutas.Where({ $_.Length -gt 5 }).ForEach({ "Longa: $_" })

# Iterando com índice e elemento:
$frutas | ForEach-Object { $i = 0 } {
    "[$i] $_"
    $i++
}`}
      />

      <h2>8. Métodos Funcionais: Where() e ForEach()</h2>
      <CodeBlock
        title="Processamento funcional de arrays (PS4+)"
        code={`$processos = Get-Process

# .Where() — filtra sem sair do array (mais rápido que Where-Object para arrays em memória)
$altoConsumo = $processos.Where({ $_.CPU -gt 10 })
$chrome = $processos.Where({ $_.Name -eq "chrome" })

# Modos do .Where():
# Default — retorna todos que satisfazem a condição
$pares = (1..20).Where({ $_ % 2 -eq 0 })

# First — para na primeira correspondência (eficiente!)
$primeiro = (1..1000).Where({ $_ % 7 -eq 0 }, "First")

# Last — retorna apenas o último
$ultimo = (1..1000).Where({ $_ % 7 -eq 0 }, "Last")

# SkipUntil — pula até encontrar e retorna o resto
$doSete = (1..20).Where({ $_ -ge 7 }, "SkipUntil")

# Split — divide em dois arrays (que satisfazem e que não satisfazem)
$paresImpares = (1..10).Where({ $_ % 2 -eq 0 }, "Split")
$soParess  = $paresImpares[0]   # Array dos pares
$soImpares = $paresImpares[1]   # Array dos ímpares

# .ForEach() — transforma elementos
$nomes = "alice", "bob", "carlos"
$maiusculos = $nomes.ForEach({ $_.ToUpper() })
$comprimentos = $nomes.ForEach({ $_.Length })`}
      />

      <AlertBox type="success" title="Dica de Performance: .Where() vs Where-Object">
        Para arrays já carregados em memória, os métodos <code>.Where()</code> e <code>.ForEach()</code>
        são significativamente mais rápidos que <code>Where-Object</code> e <code>ForEach-Object</code>
        no pipeline, pois evitam a sobrecarga do pipeline. Use-os quando já tiver os dados em um array.
        Use <code>Where-Object</code> no pipeline quando estiver processando dados que chegam de cmdlets.
      </AlertBox>

      <h2>9. Arrays de Objetos</h2>
      <CodeBlock
        title="Trabalhando com arrays de objetos complexos"
        code={`# Arrays frequentemente contêm objetos, não apenas strings ou números
$processos = Get-Process   # Retorna um array de objetos Process

# Acessar propriedade de todos os elementos
$processos.Name           # Lista todos os nomes (sem pipeline!)
$processos.Id             # Lista todos os IDs
$processos.CPU            # Lista uso de CPU de todos

# Filtrar por propriedade
$chrome = $processos | Where-Object { $_.Name -eq "chrome" }

# Ordenar por propriedade
$porCpu = $processos | Sort-Object CPU -Descending
$porMemoria = $processos | Sort-Object WorkingSet -Descending

# Selecionar apenas certas propriedades
$processos | Select-Object Name, Id, CPU, WorkingSet

# Criar array de objetos customizados
$pessoas = @(
    [PSCustomObject]@{ Nome = "Ana";    Idade = 28; Cidade = "SP" },
    [PSCustomObject]@{ Nome = "Bruno";  Idade = 35; Cidade = "RJ" },
    [PSCustomObject]@{ Nome = "Carla";  Idade = 22; Cidade = "SP" }
)

# Acessar propriedades
$pessoas[0].Nome        # "Ana"
$pessoas.Nome           # Lista todos os nomes: Ana, Bruno, Carla

# Filtrar objetos
$spPessoas = $pessoas | Where-Object { $_.Cidade -eq "SP" }

# Ordenar objetos
$porIdade = $pessoas | Sort-Object Idade

# Agrupar objetos
$porCidade = $pessoas | Group-Object Cidade`}
      />

      <h2>10. Dicas e Boas Práticas</h2>
      <CodeBlock
        title="Dicas essenciais para trabalhar com arrays"
        code={`# 1. Use @() para garantir que o resultado é sempre um array
$resultado = @(Get-Process -Name "inexistente" -ErrorAction SilentlyContinue)
# Sem @(), se nada for encontrado, $resultado será $null
# Com @(), $resultado será sempre um array (possivelmente vazio)

# 2. Verificar se array está vazio
if ($resultado.Count -eq 0) { "Nenhum resultado" }
if (-not $resultado) { "Array vazio ou null" }

# 3. Null-safety: verificar antes de acessar
if ($array -and $array.Count -gt 0) {
    $primero = $array[0]
}

# 4. Convertendo entre tipos
$arrayDeStrings = "1", "2", "3"
$arrayDeInts = $arrayDeStrings | ForEach-Object { [int]$_ }

# 5. Achatar arrays aninhados
$aninhado = @(@(1,2), @(3,4), @(5,6))
$plano = $aninhado | ForEach-Object { $_ }   # 1, 2, 3, 4, 5, 6

# 6. Removendo duplicatas
$comDuplicatas = 1, 2, 2, 3, 3, 3, 4
$semDuplicatas = $comDuplicatas | Sort-Object -Unique

# 7. Comparando arrays
$a = 1, 2, 3
$b = 1, 2, 3
Compare-Object $a $b    # Sem output = arrays iguais

# 8. Juntar array em string
$palavras = "Olá", "Mundo", "PowerShell"
$frase = $palavras -join " "     # "Olá Mundo PowerShell"
$csv = $palavras -join ","       # "Olá,Mundo,PowerShell"

# 9. Dividir string em array
$linha = "Nome,Idade,Cidade"
$colunas = $linha -split ","     # @("Nome", "Idade", "Cidade")`}
      />
    </PageContainer>
  );
}
