import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Funcoes() {
  return (
    <PageContainer
      title="Funções e Scripts Avançados"
      subtitle="Criando comandos reutilizáveis, modulares e profissionais."
      difficulty="intermediario"
      timeToRead="25 min"
    >
      <p>
        Funções são os blocos fundamentais de construção no PowerShell. Elas permitem encapsular lógica complexa em comandos simples e nomeados. Quando você adiciona funcionalidades avançadas como suporte ao pipeline e validação de parâmetros, suas funções passam a se comportar exatamente como os cmdlets nativos do sistema.
      </p>

      <h2>Anatomia de uma Função Básica</h2>
      <p>
        Uma função simples consiste na palavra-chave <code>function</code>, um nome (preferencialmente no formato Verbo-Substantivo) e um bloco de código.
      </p>

      <CodeBlock
        title="Função simples"
        code={`function Get-Saudacao {
    param($Nome)
    return "Olá, $Nome! Bem-vindo ao PowerShell."
}

# Chamando a função
Get-Saudacao -Nome "Usuário"
`}
      />

      <h2>O Bloco Param e Tipagem</h2>
      <p>
        Para scripts profissionais, você deve sempre usar o bloco <code>param()</code>. Isso permite definir tipos, valores padrão e metadados para seus parâmetros.
      </p>

      <CodeBlock
        title="Parâmetros tipados e obrigatórios"
        code={`function New-UserFolder {
    param(
        [Parameter(Mandatory=$true)]
        [string]$UserName,

        [int]$QuotaGB = 5, # Valor padrão

        [ValidateSet("Projetos", "Documentos", "Backup")]
        [string]$FolderType = "Documentos"
    )

    $path = "C:\\Users\\$UserName\\$FolderType"
    Write-Host "Criando pasta em $path com limite de $QuotaGB GB"
}
`}
      />

      <h2>Advanced Functions (CmdletBinding)</h2>
      <p>
        Ao adicionar o atributo <code>[CmdletBinding()]</code>, sua função ganha superpoderes: suporte a <code>-Verbose</code>, <code>-Debug</code>, <code>-WhatIf</code> e <code>-Confirm</code> automaticamente.
      </p>

      <CodeBlock
        title="Função avançada com suporte a Verbose"
        code={`function Remove-OldLogs {
    [CmdletBinding(SupportsShouldProcess=$true)]
    param(
        [int]$Days = 30
    )

    Write-Verbose "Iniciando busca por logs mais antigos que $Days dias..."
    
    # O SupportsShouldProcess habilita o -WhatIf
    if ($PSCmdlet.ShouldProcess("C:\\Logs", "Remover arquivos antigos")) {
        # Lógica de remoção aqui
        Write-Host "Arquivos removidos com sucesso."
    }
}

# Executando com Verbose para ver as mensagens ocultas
# Remove-OldLogs -Days 10 -Verbose

# Executando com WhatIf para testar sem deletar nada
# Remove-OldLogs -Days 10 -WhatIf
`}
      />

      <h2>Aceitando Entrada do Pipeline</h2>
      <p>
        Para que sua função aceite objetos vindos de outros comandos via <code>|</code>, você precisa configurar o parâmetro para aceitar entrada do pipeline e usar os blocos <code>begin</code>, <code>process</code> e <code>end</code>.
      </p>

      <CodeBlock
        title="Função que processa o Pipeline"
        code={`function ConvertTo-Uppercase {
    [CmdletBinding()]
    param(
        [Parameter(ValueFromPipeline=$true)]
        [string[]]$InputString
    )

    begin {
        Write-Verbose "Iniciando conversão..."
    }
    process {
        # O bloco process executa uma vez para CADA item no pipeline
        foreach ($line in $InputString) {
            $line.ToUpper()
        }
    }
    end {
        Write-Verbose "Conversão finalizada."
    }
}

# Uso:
"oi", "mundo" | ConvertTo-Uppercase
`}
      />

      <AlertBox type="info" title="A Importância do Process">
        Sem o bloco <code>process</code>, sua função só processará o último item enviado pelo pipeline. Sempre use <code>process {'{ ... }'}</code> quando sua função for projetada para receber dados via pipe.
      </AlertBox>

      <h2>Atributos de Validação</h2>
      <p>
        Evite erros no meio da execução validando os dados assim que eles entram na função.
      </p>

      <CodeBlock
        title="Exemplos de validação de parâmetros"
        code={`param(
    # Garante que o número está entre 1 e 100
    [ValidateRange(1, 100)]
    [int]$Percentual,

    # Garante que a string segue um padrão (Regex)
    [ValidatePattern('^\\d{5}-\\d{3}$')]
    [string]$CEP,

    # Garante que a string não é vazia ou nula
    [ValidateNotNullOrEmpty()]
    [string]$Servidor,

    # Validação via script customizado (deve retornar true/false)
    [ValidateScript({ Test-Path $_ })]
    [string]$CaminhoArquivo
)
`}
      />

      <h2>Escopo de Variáveis</h2>
      <p>
        Por padrão, variáveis criadas dentro de uma função são locais a ela. Para alterar variáveis fora, você deve entender os escopos: <code>Global:</code>, <code>Script:</code> e <code>Local:</code>.
      </p>

      <CodeBlock
        title="Entendendo escopos"
        code={`$GlobalVar = "Original"

function Test-Scope {
    $LocalVar = "Interna" # Só existe aqui
    $Global:GlobalVar = "Alterada Globalmente" # Altera a variável lá fora
}

Test-Scope
Write-Host $GlobalVar # Resultado: Alterada Globalmente
`}
      />

      <h2>Retornando Valores vs Write-Output</h2>
      <p>
        No PowerShell, qualquer dado "solto" no código da função é enviado para o pipeline de saída. A palavra-chave <code>return</code> envia o dado e sai da função imediatamente.
      </p>

      <CodeBlock
        title="Saída de dados"
        code={`function Get-Numbers {
    # Ambas as linhas abaixo enviam dados para quem chamou
    Write-Output 10
    20
    
    return 30 # Envia 30 e PARA a execução da função aqui
    40 # Isso nunca será executado
}

$resultado = Get-Numbers # $resultado será um array [10, 20, 30]
`}
      />

      <AlertBox type="warning" title="Cuidado com Lixo na Saída">
        Evite usar <code>Write-Host</code> dentro de funções que devem retornar dados, pois o <code>Write-Host</code> escreve direto no console e não pode ser capturado por variáveis ou passado pelo pipeline. Use <code>Write-Output</code> ou apenas deixe o objeto solto.
      </AlertBox>

      <h2>Documentando com Comment-Based Help</h2>
      <p>
        Adicione ajuda nativa às suas funções para que outros usuários (ou você no futuro) possam usar <code>Get-Help Sua-Funcao</code>.
      </p>

      <CodeBlock
        title="Ajuda baseada em comentários"
        code={`function Test-NetworkPort {
    <#
    .SYNOPSIS
        Testa se uma porta TCP está aberta em um host remoto.
    .DESCRIPTION
        Uma versão simplificada do Test-NetConnection focada apenas em portas TCP.
    .PARAMETER ComputerName
        O nome ou IP do computador remoto.
    .PARAMETER Port
        O número da porta TCP.
    .EXAMPLE
        Test-NetworkPort -ComputerName "google.com" -Port 80
    #>
    param($ComputerName, $Port)
    # Lógica...
}
`}
      />

    </PageContainer>
  );
}
