import{n as e,t}from"./CodeBlock-DVOG-hPm.js";import{t as n}from"./AlertBox-q8pQIQ07.js";import{a as r}from"./index-D0tfvO9Z.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Gerenciamento de Processos`,subtitle:`Aprenda a monitorar, iniciar e encerrar processos no Windows e Linux usando PowerShell.`,difficulty:`intermediario`,timeToRead:`20 min`,children:[(0,i.jsxs)(`p`,{children:[`O gerenciamento de processos é uma das tarefas mais comuns e críticas para administradores de sistema. No PowerShell, temos um conjunto robusto de cmdlets que permitem interagir com processos de forma muito mais rica do que o antigo `,(0,i.jsx)(`code`,{children:`tasklist`}),` ou `,(0,i.jsx)(`code`,{children:`taskkill`}),`, pois trabalhamos com objetos .NET reais, não apenas texto.`]}),(0,i.jsx)(`h2`,{children:`1. Listando Processos com Get-Process`}),(0,i.jsxs)(`p`,{children:[`O cmdlet `,(0,i.jsx)(`code`,{children:`Get-Process`}),` (ou o alias `,(0,i.jsx)(`code`,{children:`ps`}),`) é o ponto de partida. Ele retorna objetos que representam os processos em execução no sistema.`]}),(0,i.jsx)(t,{title:`Listando processos básicos`,code:`# Listar todos os processos em execução
Get-Process

# Filtrar processos por nome (ex: todos os processos do Chrome)
Get-Process -Name chrome

# Listar processos que começam com 's'
Get-Process -Name s*

# Obter um processo específico pelo seu ID (PID)
Get-Process -Id 1234
`}),(0,i.jsxs)(n,{type:`info`,title:`Dica de Performance`,children:[`Ao usar `,(0,i.jsx)(`code`,{children:`Get-Process -Name chrome`}),`, o PowerShell filtra os processos antes de retornar os objetos, o que é mais eficiente do que listar tudo e filtrar depois com `,(0,i.jsx)(`code`,{children:`Where-Object`}),`.`]}),(0,i.jsx)(`h2`,{children:`2. Propriedades Importantes de um Processo`}),(0,i.jsx)(`p`,{children:`Diferente de ferramentas de texto, o PowerShell nos dá acesso a propriedades detalhadas de cada processo.`}),(0,i.jsx)(t,{title:`Explorando propriedades de processos`,code:`# Ver processos ordenados pelo uso de CPU (decrescente) e pegar os top 10
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 -Property Name, CPU, WorkingSet, Id

# Incluir o nome do usuário que iniciou o processo (requer privilégios de administrador)
Get-Process -IncludeUserName | Select-Object Name, UserName, Id | Select-Object -First 10

# Ver o caminho do executável de um processo
Get-Process chrome | Select-Object -Property Name, Path, Description
`}),(0,i.jsxs)(`p`,{children:[`As propriedades comuns incluem:`,(0,i.jsxs)(`ul`,{children:[(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`CPU:`}),` Tempo de processador usado pelo processo em segundos.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`WorkingSet (WS):`}),` Memória física (RAM) usada pelo processo.`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Id:`}),` Identificador único do processo (PID).`]}),(0,i.jsxs)(`li`,{children:[(0,i.jsx)(`strong`,{children:`Path:`}),` Caminho completo para o arquivo executável.`]})]})]}),(0,i.jsx)(`h2`,{children:`3. Iniciando Novos Processos`}),(0,i.jsxs)(`p`,{children:[`Para iniciar um programa, usamos o `,(0,i.jsx)(`code`,{children:`Start-Process`}),`. Ele oferece controle total sobre como o processo é lançado.`]}),(0,i.jsx)(t,{title:`Exemplos de Start-Process`,code:`# Iniciar o Bloco de Notas
Start-Process notepad.exe

# Iniciar um processo com argumentos (ex: abrir um site no Edge)
Start-Process msedge.exe -ArgumentList "https://github.com"

# Iniciar como Administrador (o famoso 'Executar como Admin')
Start-Process powershell.exe -Verb RunAs

# Iniciar e esperar o processo terminar antes de continuar o script
Start-Process notepad.exe -Wait

# Iniciar minimizado
Start-Process notepad.exe -WindowStyle Minimized
`}),(0,i.jsx)(`h2`,{children:`4. Encerrando Processos`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Stop-Process`}),` (alias `,(0,i.jsx)(`code`,{children:`kill`}),`) é usado para finalizar processos. Podemos passar o nome ou o ID.`]}),(0,i.jsx)(t,{title:`Finalizando processos`,code:`# Parar todos os processos do Notepad pelo nome
Stop-Process -Name notepad

# Parar um processo específico pelo ID e pedir confirmação
Stop-Process -Id 5678 -Confirm

# Forçar o encerramento de um processo que não responde
Stop-Process -Name "ProcessoTravado" -Force

# Usar o pipeline para parar processos que consomem muita memória
Get-Process | Where-Object { $_.WorkingSet -gt 1GB } | Stop-Process
`}),(0,i.jsxs)(n,{type:`danger`,title:`Cuidado ao Forçar`,children:[`O parâmetro `,(0,i.jsx)(`code`,{children:`-Force`}),` encerra o processo imediatamente sem salvar dados. Use com cautela, especialmente em processos de sistema.`]}),(0,i.jsx)(`h2`,{children:`5. Trabalhando com Jobs em Segundo Plano`}),(0,i.jsxs)(`p`,{children:[`Às vezes você quer rodar um comando pesado sem travar o seu console atual. Para isso usamos os `,(0,i.jsx)(`b`,{children:`Jobs`}),`.`]}),(0,i.jsx)(t,{title:`Gerenciamento de Jobs`,code:`# Iniciar um comando em segundo plano
$job = Start-Job -ScriptBlock { Get-ChildItem C:\\Windows -Recurse }

# Listar os jobs atuais
Get-Job

# Esperar o job terminar
Wait-Job $job

# Receber os resultados do job
Receive-Job $job

# Remover o job da memória após concluir
Remove-Job $job
`}),(0,i.jsx)(`h2`,{children:`6. Integração com .NET`}),(0,i.jsxs)(`p`,{children:[`Para tarefas avançadas, você pode acessar diretamente a classe `,(0,i.jsx)(`code`,{children:`System.Diagnostics.Process`}),` do .NET.`]}),(0,i.jsx)(t,{title:`Uso avançado com .NET`,code:`# Obter o processo atual do PowerShell
$current = [System.Diagnostics.Process]::GetCurrentProcess()
$current.PriorityClass = "High" # Mudar prioridade para Alta

# Ver os módulos (DLLs) carregados por um processo
(Get-Process chrome)[0].Modules | Select-Object ModuleName, FileName | Select-Object -First 5
`}),(0,i.jsx)(`h2`,{children:`7. Monitoramento em Tempo Real`}),(0,i.jsx)(`p`,{children:`Embora o PowerShell não tenha um "top" nativo igual ao Linux, podemos simular um facilmente.`}),(0,i.jsx)(t,{title:`Simulando um monitor de processos`,code:`# Atualizar a lista dos 10 processos que mais usam CPU a cada 2 segundos
while($true) {
    Clear-Host
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 | Format-Table Name, CPU, WorkingSet
    Start-Sleep -Seconds 2
}
`})]})}export{a as default};