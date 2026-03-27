import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Erros() {
  return (
    <PageContainer
      title="Tratamento de Erros e Exceções"
      subtitle="Aprenda a lidar com falhas de forma profissional usando Try/Catch, Trap e variáveis automáticas."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        No PowerShell, erros são inevitáveis, mas como você os gerencia define a robustez dos seus scripts. Existem dois tipos principais de erros: <strong>erros terminativos</strong> (que interrompem a execução imediatamente) e <strong>erros não-terminativos</strong> (que exibem uma mensagem mas permitem que o script continue).
      </p>

      <h2>O Bloco Try/Catch/Finally</h2>
      <p>
        Esta é a estrutura fundamental para capturar exceções. O bloco <code>try</code> contém o código que pode falhar, o <code>catch</code> lida com a falha e o <code>finally</code> executa sempre, independentemente de erro.
      </p>

      <CodeBlock
        title="Estrutura básica de Try/Catch"
        code={`try {
    # Tenta ler um arquivo que pode não existir
    # Usamos -ErrorAction Stop para transformar um erro não-terminativo em terminativo
    $content = Get-Content -Path "C:\\arquivo_inexistente.txt" -ErrorAction Stop
    Write-Host "Conteúdo lido com sucesso!"
}
catch [System.IO.FileNotFoundException] {
    # Captura especificamente erros de arquivo não encontrado
    Write-Error "O arquivo específico não foi localizado: $($_.Exception.Message)"
}
catch {
    # Captura qualquer outro erro genérico
    Write-Error "Ocorreu um erro inesperado: $($_.Exception.Message)"
}
finally {
    # Este bloco sempre executa (útil para fechar conexões ou limpar variáveis)
    Write-Host "Limpeza de recursos finalizada."
}`}
      />

      <AlertBox type="warning" title="Importante: Erros Não-Terminativos">
        Muitos cmdlets do PowerShell geram erros "não-terminativos" por padrão. Para que o bloco <code>catch</code> funcione com eles, você DEVE usar o parâmetro <code>-ErrorAction Stop</code>.
      </AlertBox>

      <h2>A Variável Automática $Error</h2>
      <p>
        O PowerShell mantém um histórico de todos os erros ocorridos na sessão atual na variável global <code>$Error</code>. Ela é um array (ArrayList) onde o índice 0 é sempre o erro mais recente.
      </p>

      <CodeBlock
        title="Explorando a variável $Error"
        code={`# Provoca um erro propositalmente
Get-Item "C:\\Caminho\\Inexistente"

# Acessa o último erro ocorrido
$ultimoErro = $Error[0]

# Detalhes técnicos do erro
Write-Host "Mensagem: $($ultimoErro.Exception.Message)"
Write-Host "Local da Falha: $($ultimoErro.InvocationInfo.ScriptName) na linha $($ultimoErro.InvocationInfo.ScriptLineNumber)"

# Limpa o histórico de erros
$Error.Clear()`}
      />

      <h2>$ErrorActionPreference</h2>
      <p>
        Esta variável de preferência controla como o PowerShell reage a erros não-terminativos globalmente ou no escopo do script.
      </p>

      <ul>
        <li><strong>Continue:</strong> (Padrão) Exibe o erro e continua.</li>
        <li><strong>SilentlyContinue:</strong> Não exibe o erro e continua.</li>
        <li><strong>Stop:</strong> Interrompe a execução (permite captura por Try/Catch).</li>
        <li><strong>Inquire:</strong> Pergunta ao usuário o que fazer.</li>
        <li><strong>Ignore:</strong> Não exibe e não adiciona ao array $Error.</li>
      </ul>

      <CodeBlock
        title="Configurando preferências de erro"
        code={`# Configura o script para parar em qualquer erro
$ErrorActionPreference = "Stop"

try {
    # Agora não precisamos de -ErrorAction Stop individualmente
    Remove-Item "C:\\Temp\\PastaProtegida"
}
catch {
    Write-Host "A remoção falhou conforme esperado."
}`}
      />

      <h2>Lançando Erros com Throw</h2>
      <p>
        Você pode gerar seus próprios erros terminativos usando a palavra-chave <code>throw</code>.
      </p>

      <CodeBlock
        title="Usando throw para validação"
        code={`function Set-Idade {
    param([int]$Idade)

    if ($Idade -lt 0) {
        throw "A idade não pode ser negativa: $Idade"
    }
    
    Write-Host "Idade definida para $Idade"
}

try {
    Set-Idade -Idade -5
}
catch {
    Write-Warning "Erro de validação: $_"
}`}
      />

      <h2>$LASTEXITCODE e Aplicações Nativas</h2>
      <p>
        Ao executar comandos externos (como <code>git</code>, <code>ping</code> ou <code>ipconfig</code>), o PowerShell não usa o sistema de exceções tradicional. Em vez disso, você deve verificar o <code>$LASTEXITCODE</code>.
      </p>

      <CodeBlock
        title="Verificando saída de programas externos"
        code={`ping.exe -n 1 8.8.8.8 > $null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Conectividade confirmada."
}
else {
    Write-Error "Falha na comunicação externa. Código: $LASTEXITCODE"
}`}
      />

      <h2>O Comando Trap</h2>
      <p>
        O <code>Trap</code> é um método mais antigo de tratamento de erros, mas ainda útil. Ele define um bloco de código que será executado sempre que um erro terminativo ocorrer dentro daquele escopo.
      </p>

      <CodeBlock
        title="Exemplo de Trap"
        code={`function Teste-Trap {
    trap {
        Write-Host "Capturado pelo Trap: $($_.Exception.Message)"
        continue # Continua a execução na próxima linha após o erro
    }

    Write-Host "Iniciando processo..."
    1 / 0 # Divisão por zero causa erro terminativo
    Write-Host "Processo finalizado (após o trap)."
}

Teste-Trap`}
      />

      <AlertBox type="info" title="Dica de Performance">
        Embora <code>Try/Catch</code> seja poderoso, ele tem um custo de performance. Use-o para erros excepcionais e não para lógica de fluxo comum (como verificar se um arquivo existe antes de abri-lo).
      </AlertBox>
    </PageContainer>
  );
}
