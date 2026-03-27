import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Filtros() {
  return (
    <PageContainer
      title="Filtros e Seleção de Dados"
      subtitle="Refinando seus resultados com Where-Object, Select-Object e Sort-Object."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <p>
        Uma das tarefas mais comuns no PowerShell é filtrar grandes quantidades de dados para encontrar exatamente 
        o que você precisa. Graças à natureza orientada a objetos do PowerShell, podemos filtrar por propriedades 
        específicas de forma intuitiva.
      </p>

      <h2>Where-Object: O Filtro Principal</h2>
      <p>
        O cmdlet <code>Where-Object</code> (alias <code>?</code>) seleciona objetos de uma coleção com base em seus 
        valores de propriedade. Ele suporta duas sintaxes: a clássica (com bloco de script) e a simplificada.
      </p>

      <CodeBlock
        title="Sintaxe de Bloco de Script (Clássica)"
        code={`# Filtra processos que usam mais de 500MB de RAM
# $_ representa o objeto atual
Get-Process | Where-Object { $_.WorkingSet -gt 500MB }

# Múltiplas condições com operadores lógicos (-and, -or, -not)
Get-Service | Where-Object { $_.Status -eq 'Running' -and $_.StartType -eq 'Automatic' }
`}
      />

      <CodeBlock
        title="Sintaxe Simplificada (PS 3.0+)"
        code={`# Mais legível para filtros simples de uma única propriedade
Get-Process | Where-Object WorkingSet -gt 500MB

# Funciona muito bem para verificar booleanos ou existência
Get-Service | Where-Object CanStop
`}
      />

      <AlertBox type="info" title="Operadores de Comparação">
        Lembre-se que no PowerShell usamos <code>-eq</code> (equal), <code>-ne</code> (not equal), <code>-gt</code> (greater than), 
        <code>-lt</code> (less than), <code>-like</code> (wildcards) e <code>-match</code> (regex).
      </AlertBox>

      <h2>Select-Object: Escolhendo Propriedades</h2>
      <p>
        O <code>Select-Object</code> permite escolher quais propriedades de um objeto você deseja manter, ou até 
        criar novas propriedades.
      </p>

      <CodeBlock
        title="Selecionando Propriedades Específicas"
        code={`# Mantém apenas Nome e ID do processo
Get-Process | Select-Object -Property Name, Id

# Seleciona os primeiros ou últimos itens
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10

# Selecionar apenas valores únicos
"A", "B", "A", "C" | Select-Object -Unique
`}
      />

      <h2>Propriedades Calculadas</h2>
      <p>
        Você pode criar propriedades "on-the-fly" usando uma Hashtable dentro do <code>Select-Object</code>. 
        Isso é extremamente útil para converter unidades ou renomear campos.
      </p>

      <CodeBlock
        title="Criando Propriedades Calculadas"
        code={`# Converte bytes para MB e formata o nome da coluna
Get-ChildItem -File | Select-Object Name, @{
    Name = "TamanhoMB"
    Expression = { "{0:N2}" -f ($_.Length / 1MB) }
}
`}
      />

      <h2>Sort-Object: Ordenando Resultados</h2>
      <p>
        O <code>Sort-Object</code> ordena os objetos com base em uma ou mais propriedades.
      </p>

      <CodeBlock
        title="Ordenação Simples e Composta"
        code={`# Ordena por nome (padrão é ascendente)
Get-Service | Sort-Object Name

# Ordena por Status e depois por Nome (descendente)
Get-Service | Sort-Object Status, Name -Descending

# Remove duplicatas durante a ordenação
Get-Process | Sort-Object Name -Unique
`}
      />

      <h2>Group-Object: Agrupando Dados</h2>
      <p>
        O <code>Group-Object</code> agrupa objetos que contêm o mesmo valor em propriedades especificadas.
      </p>

      <CodeBlock
        title="Agrupando Processos por Empresa"
        code={`# Agrupa e conta quantos processos cada empresa tem rodando
Get-Process | Group-Object Company | Select-Object Count, Name | Sort-Object Count -Descending

# Agrupando arquivos por extensão
Get-ChildItem -Path C:\\Windows -File | Group-Object Extension -NoElement
`}
      />

      <h2>Measure-Object: Estatísticas e Contagens</h2>
      <p>
        O <code>Measure-Object</code> calcula propriedades numéricas de objetos, como soma, média, mínimo e máximo.
      </p>

      <CodeBlock
        title="Calculando Estatísticas de Arquivos"
        code={`# Calcula estatísticas de tamanho para arquivos na pasta atual
Get-ChildItem -File | Measure-Object -Property Length -Sum -Average -Max -Min

# Contando linhas em um arquivo de texto
Get-Content "./log.txt" | Measure-Object -Line -Word -Character
`}
      />

      <AlertBox type="success" title="Dica de Ouro: ExpandProperty">
        Se você precisa apenas do valor de uma propriedade (como uma string) e não de um objeto com essa propriedade, 
        use <code>Select-Object -ExpandProperty NomeDaPropriedade</code>.
      </AlertBox>

      <CodeBlock
        title="ExpandProperty vs Property"
        code={`# Retorna um objeto PSCustomObject com a propriedade 'Name'
$obj = Get-Service -Name bits | Select-Object Name
$obj.GetType().Name # Retorna 'PSCustomObject'

# Retorna diretamente a string do nome
$str = Get-Service -Name bits | Select-Object -ExpandProperty Name
$str.GetType().Name # Retorna 'String'
`}
      />

      <h2>Filtros com Wildcards e Regex</h2>
      <p>
        Muitas vezes você não sabe o nome exato. O PowerShell oferece suporte nativo a padrões.
      </p>

      <CodeBlock
        title="Usando -like e -match"
        code={`# -like usa wildcards (* e ?)
Get-Service | Where-Object Name -like "win*"

# -match usa Expressões Regulares (Regex)
Get-Process | Where-Object Name -match "^s[a-z]h"
`}
      />

      <AlertBox type="danger" title="Cuidado com Filtros Ineficientes">
        Evite fazer <code>Get-ChildItem -Recurse | Where-Object Name -eq "alvo.txt"</code> em discos grandes. 
        Muitos cmdlets têm parâmetros de filtro nativos (<code>-Filter</code>, <code>-Include</code>, <code>-Name</code>) 
        que são processados pelo provedor (sistema de arquivos, AD, etc) de forma MUITO mais rápida que o pipeline.
      </AlertBox>
    </PageContainer>
  );
}
