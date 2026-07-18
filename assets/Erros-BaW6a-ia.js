import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Tratamento de Erros e Exceções`,subtitle:`Aprenda a lidar com falhas de forma profissional usando Try/Catch, Trap e variáveis automáticas.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`No PowerShell, erros são inevitáveis, mas como você os gerencia define a robustez dos seus scripts. Existem dois tipos principais de erros: `,(0,i.jsx)(`strong`,{children:`erros terminativos`}),` (que interrompem a execução imediatamente) e `,(0,i.jsx)(`strong`,{children:`erros não-terminativos`}),` (que exibem uma mensagem mas permitem que o script continue).`]}),(0,i.jsx)(`h2`,{children:`O Bloco Try/Catch/Finally`}),(0,i.jsxs)(`p`,{children:[`Esta é a estrutura fundamental para capturar exceções. O bloco `,(0,i.jsx)(`code`,{children:`try`}),` contém o código que pode falhar, o `,(0,i.jsx)(`code`,{children:`catch`}),` lida com a falha e o `,(0,i.jsx)(`code`,{children:`finally`}),` executa sempre, independentemente de erro.`]}),(0,i.jsx)(t,{title:`Estrutura básica de Try/Catch`,code:`try {
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
}`}),(0,i.jsxs)(n,{type:`warning`,title:`Importante: Erros Não-Terminativos`,children:[`Muitos cmdlets do PowerShell geram erros "não-terminativos" por padrão. Para que o bloco `,(0,i.jsx)(`code`,{children:`catch`}),` funcione com eles, você DEVE usar o parâmetro `,(0,i.jsx)(`code`,{children:`-ErrorAction Stop`}),`.`]}),(0,i.jsx)(`h2`,{children:`A Variável Automática $Error`}),(0,i.jsxs)(`p`,{children:[`O PowerShell mantém um histórico de todos os erros ocorridos na sessão atual na variável global `,(0,i.jsx)(`code`,{children:`$Error`}),`. Ela é um array (ArrayList) onde o índice 0 é sempre o erro mais recente.`]}),(0,i.jsx)(t,{title:`Explorando a variável $Error`,code:`# Provoca um erro propositalmente
Get-Item "C:\\Caminho\\Inexistente"

# Acessa o último erro ocorrido
$ultimoErro = $Error[0]

# Detalhes técnicos do erro
Write-Host "Mensagem: $($ultimoErro.Exception.Message)"
Write-Host "Local da Falha: $($ultimoErro.InvocationInfo.ScriptName) na linha $($ultimoErro.InvocationInfo.ScriptLineNumber)"

# Limpa o histórico de erros
$Error.Clear()`}),(0,i.jsx)(`h2`,{children:`$ErrorActionPreference`}),(0,i.jsx)(`p`,{children:`Esta variável de preferência controla como o PowerShell reage a erros não-terminativos globalmente ou no escopo do script.`}),(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Continue:`}),` (Padrão) Exibe o erro e continua.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`SilentlyContinue:`}),` Não exibe o erro e continua.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Stop:`}),` Interrompe a execução (permite captura por Try/Catch).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Inquire:`}),` Pergunta ao usuário o que fazer.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Ignore:`}),` Não exibe e não adiciona ao array $Error.`]})]}),(0,i.jsx)(t,{title:`Configurando preferências de erro`,code:`# Configura o script para parar em qualquer erro
$ErrorActionPreference = "Stop"

try {
    # Agora não precisamos de -ErrorAction Stop individualmente
    Remove-Item "C:\\Temp\\PastaProtegida"
}
catch {
    Write-Host "A remoção falhou conforme esperado."
}`}),(0,i.jsx)(`h2`,{children:`Lançando Erros com Throw`}),(0,i.jsxs)(`p`,{children:[`Você pode gerar seus próprios erros terminativos usando a palavra-chave `,(0,i.jsx)(`code`,{children:`throw`}),`.`]}),(0,i.jsx)(t,{title:`Usando throw para validação`,code:`function Set-Idade {
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
}`}),(0,i.jsx)(`h2`,{children:`$LASTEXITCODE e Aplicações Nativas`}),(0,i.jsxs)(`p`,{children:[`Ao executar comandos externos (como `,(0,i.jsx)(`code`,{children:`git`}),`, `,(0,i.jsx)(`code`,{children:`ping`}),` ou `,(0,i.jsx)(`code`,{children:`ipconfig`}),`), o PowerShell não usa o sistema de exceções tradicional. Em vez disso, você deve verificar o `,(0,i.jsx)(`code`,{children:`$LASTEXITCODE`}),`.`]}),(0,i.jsx)(t,{title:`Verificando saída de programas externos`,code:`ping.exe -n 1 8.8.8.8 > $null

if ($LASTEXITCODE -eq 0) {
    Write-Host "Conectividade confirmada."
}
else {
    Write-Error "Falha na comunicação externa. Código: $LASTEXITCODE"
}`}),(0,i.jsx)(`h2`,{children:`O Comando Trap`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Trap`}),` é um método mais antigo de tratamento de erros, mas ainda útil. Ele define um bloco de código que será executado sempre que um erro terminativo ocorrer dentro daquele escopo.`]}),(0,i.jsx)(t,{title:`Exemplo de Trap`,code:`function Teste-Trap {
    trap {
        Write-Host "Capturado pelo Trap: $($_.Exception.Message)"
        continue # Continua a execução na próxima linha após o erro
    }

    Write-Host "Iniciando processo..."
    1 / 0 # Divisão por zero causa erro terminativo
    Write-Host "Processo finalizado (após o trap)."
}

Teste-Trap`}),(0,i.jsxs)(n,{type:`info`,title:`Dica de Performance`,children:[`Embora `,(0,i.jsx)(`code`,{children:`Try/Catch`}),` seja poderoso, ele tem um custo de performance. Use-o para erros excepcionais e não para lógica de fluxo comum (como verificar se um arquivo existe antes de abri-lo).`]})]})}export{a as default};