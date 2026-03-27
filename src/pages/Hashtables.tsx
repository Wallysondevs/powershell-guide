import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Hashtables() {
  return (
    <PageContainer
      title="Hashtables (Dicionários)"
      subtitle="Aprenda a organizar dados usando pares de Chave-Valor e objetos personalizados."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        Uma Hashtable (ou tabela de hash) é uma estrutura de dados que armazena pares de 
        <b>Chave</b> e <b>Valor</b>. No PowerShell, elas são extremamente versáteis, 
        sendo usadas para tudo, desde configurações simples até a passagem de parâmetros complexos 
        para cmdlets (Splatting).
      </p>

      <h2>Criação de Hashtables</h2>
      <p>
        Diferente de arrays que usam <code>@()</code>, hashtables usam <code>@&#123;&#125;</code>.
      </p>

      <CodeBlock
        title="Declarando chaves e valores"
        code={`# Hashtable simples
$usuario = @{
    ID = 1
    Nome = "Cassiano"
    Ativo = $true
}

# Hashtable em uma única linha
$config = @{ Cor = "Azul"; Fonte = "Consolas" }

# Hashtable Ordenada (Mantém a ordem em que os itens foram criados)
$ordenada = [ordered]@{
    Primeiro = 1
    Segundo = 2
    Terceiro = 3
}
`}
      />

      <AlertBox type="info" title="Hashtables vs [ordered]">
        Por padrão, Hashtables normais não garantem a ordem dos elementos. Se a ordem de exibição 
        ou iteração for importante, use sempre o acelerador de tipo <code>[ordered]</code>.
      </AlertBox>

      <h2>Acessando e Modificando Valores</h2>
      <p>
        Você pode acessar os dados usando a notação de ponto ou colchetes.
      </p>

      <CodeBlock
        title="Manipulação de dados"
        code={`$carro = @{ Marca = "Ford"; Modelo = "Focus" }

# Leitura
$carro.Marca          # "Ford"
$carro["Modelo"]      # "Focus"

# Adição e Alteração
$carro.Ano = 2019     # Adiciona nova chave
$carro.Modelo = "Ka"  # Altera valor existente
$carro.Add("Cor", "Prata") # Método formal

# Remoção
$carro.Remove("Ano")
`}
      />

      <h2>Iteração (Loops)</h2>
      <p>
        Para percorrer uma hashtable, você precisa iterar sobre suas chaves ou usar o enumerador.
      </p>

      <CodeBlock
        title="Percorrendo o dicionário"
        code={`$precos = @{ Arroz = 20; Feijao = 10; Macarrao = 5 }

# Iterando pelas Chaves
foreach ($item in $precos.Keys) {
    "O preço de $item é $($precos[$item])"
}

# Usando GetEnumerator (mais performático para objetos grandes)
$precos.GetEnumerator() | ForEach-Object {
    $_.Key
    $_.Value
}
`}
      />

      <h2>Splatting: O Superpoder das Hashtables</h2>
      <p>
        Splatting é uma técnica para passar um conjunto de parâmetros para um comando usando 
        uma única variável. Isso torna os scripts muito mais legíveis.
      </p>

      <CodeBlock
        title="Melhorando a legibilidade com Splatting"
        code={`# Sem Splatting (Linha muito longa e difícil de ler)
Copy-Item -Path "C:\\Fonte\\file.txt" -Destination "D:\\Backup" -Force -Recurse -Verbose

# Com Splatting
$copiaParams = @{
    Path        = "C:\\Fonte\\file.txt"
    Destination = "D:\\Backup"
    Force       = $true
    Recurse     = $true
    Verbose     = $true
}

# Note o uso do '@' em vez de '$' ao chamar o comando
Copy-Item @copiaParams
`}
      />

      <h2>PSCustomObject</h2>
      <p>
        Muitas vezes você quer uma hashtable que se comporte mais como um objeto real (com colunas em uma tabela). 
        Para isso, convertemos a hashtable em um <code>PSCustomObject</code>.
      </p>

      <CodeBlock
        title="Criando objetos personalizados"
        code={`$obj = [PSCustomObject]@{
    Servidor = "Srv-01"
    IP       = "192.168.1.10"
    Status   = "Online"
}

# Agora ele se comporta como um objeto do PowerShell
$obj | Select-Object Servidor, Status
$obj | Format-Table
`}
      />

      <AlertBox type="success" title="Dica: JSON">
        Hashtables e PSCustomObjects podem ser facilmente convertidos para JSON e vice-versa, 
        o que é excelente para APIs e arquivos de configuração.
        <br/>
        <code>$obj | ConvertTo-Json</code>
      </AlertBox>

      <h2>Propriedades e Métodos Úteis</h2>
      <CodeBlock
        title="Exploração"
        code={`$ht = @{ A = 1; B = 2 }

$ht.Count            # Quantidade de pares
$ht.ContainsKey("A") # True
$ht.ContainsValue(2) # True
$ht.Values           # Retorna apenas os valores
$ht.Clear()          # Remove todos os itens
`}
      />
    </PageContainer>
  );
}
