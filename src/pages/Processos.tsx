import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Processos() {
  return (
    <PageContainer
      title="Gerenciamento de Processos"
      subtitle="Aprenda a monitorar, iniciar e encerrar processos no Windows e Linux usando PowerShell."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        O gerenciamento de processos é uma das tarefas mais comuns e críticas para administradores de sistema. No PowerShell, temos um conjunto robusto de cmdlets que permitem interagir com processos de forma muito mais rica do que o antigo <code>tasklist</code> ou <code>taskkill</code>, pois trabalhamos com objetos .NET reais, não apenas texto.
      </p>

      <h2>1. Listando Processos com Get-Process</h2>
      <p>
        O cmdlet <code>Get-Process</code> (ou o alias <code>ps</code>) é o ponto de partida. Ele retorna objetos que representam os processos em execução no sistema.
      </p>

      <CodeBlock
        title="Listando processos básicos"
        code={`# Listar todos os processos em execução
Get-Process

# Filtrar processos por nome (ex: todos os processos do Chrome)
Get-Process -Name chrome

# Listar processos que começam com 's'
Get-Process -Name s*

# Obter um processo específico pelo seu ID (PID)
Get-Process -Id 1234
`}
      />

      <AlertBox type="info" title="Dica de Performance">
        Ao usar <code>Get-Process -Name chrome</code>, o PowerShell filtra os processos antes de retornar os objetos, o que é mais eficiente do que listar tudo e filtrar depois com <code>Where-Object</code>.
      </AlertBox>

      <h2>2. Propriedades Importantes de um Processo</h2>
      <p>
        Diferente de ferramentas de texto, o PowerShell nos dá acesso a propriedades detalhadas de cada processo.
      </p>

      <CodeBlock
        title="Explorando propriedades de processos"
        code={`# Ver processos ordenados pelo uso de CPU (decrescente) e pegar os top 10
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 -Property Name, CPU, WorkingSet, Id

# Incluir o nome do usuário que iniciou o processo (requer privilégios de administrador)
Get-Process -IncludeUserName | Select-Object Name, UserName, Id | Select-Object -First 10

# Ver o caminho do executável de um processo
Get-Process chrome | Select-Object -Property Name, Path, Description
`}
      />

      <p>
        As propriedades comuns incluem:
        <ul>
          <li><strong>CPU:</strong> Tempo de processador usado pelo processo em segundos.</li>
          <li><strong>WorkingSet (WS):</strong> Memória física (RAM) usada pelo processo.</li>
          <li><strong>Id:</strong> Identificador único do processo (PID).</li>
          <li><strong>Path:</strong> Caminho completo para o arquivo executável.</li>
        </ul>
      </p>

      <h2>3. Iniciando Novos Processos</h2>
      <p>
        Para iniciar um programa, usamos o <code>Start-Process</code>. Ele oferece controle total sobre como o processo é lançado.
      </p>

      <CodeBlock
        title="Exemplos de Start-Process"
        code={`# Iniciar o Bloco de Notas
Start-Process notepad.exe

# Iniciar um processo com argumentos (ex: abrir um site no Edge)
Start-Process msedge.exe -ArgumentList "https://github.com"

# Iniciar como Administrador (o famoso 'Executar como Admin')
Start-Process powershell.exe -Verb RunAs

# Iniciar e esperar o processo terminar antes de continuar o script
Start-Process notepad.exe -Wait

# Iniciar minimizado
Start-Process notepad.exe -WindowStyle Minimized
`}
      />

      <h2>4. Encerrando Processos</h2>
      <p>
        O <code>Stop-Process</code> (alias <code>kill</code>) é usado para finalizar processos. Podemos passar o nome ou o ID.
      </p>

      <CodeBlock
        title="Finalizando processos"
        code={`# Parar todos os processos do Notepad pelo nome
Stop-Process -Name notepad

# Parar um processo específico pelo ID e pedir confirmação
Stop-Process -Id 5678 -Confirm

# Forçar o encerramento de um processo que não responde
Stop-Process -Name "ProcessoTravado" -Force

# Usar o pipeline para parar processos que consomem muita memória
Get-Process | Where-Object { $_.WorkingSet -gt 1GB } | Stop-Process
`}
      />

      <AlertBox type="danger" title="Cuidado ao Forçar">
        O parâmetro <code>-Force</code> encerra o processo imediatamente sem salvar dados. Use com cautela, especialmente em processos de sistema.
      </AlertBox>

      <h2>5. Trabalhando com Jobs em Segundo Plano</h2>
      <p>
        Às vezes você quer rodar um comando pesado sem travar o seu console atual. Para isso usamos os <b>Jobs</b>.
      </p>

      <CodeBlock
        title="Gerenciamento de Jobs"
        code={`# Iniciar um comando em segundo plano
$job = Start-Job -ScriptBlock { Get-ChildItem C:\\Windows -Recurse }

# Listar os jobs atuais
Get-Job

# Esperar o job terminar
Wait-Job $job

# Receber os resultados do job
Receive-Job $job

# Remover o job da memória após concluir
Remove-Job $job
`}
      />

      <h2>6. Integração com .NET</h2>
      <p>
        Para tarefas avançadas, você pode acessar diretamente a classe <code>System.Diagnostics.Process</code> do .NET.
      </p>

      <CodeBlock
        title="Uso avançado com .NET"
        code={`# Obter o processo atual do PowerShell
$current = [System.Diagnostics.Process]::GetCurrentProcess()
$current.PriorityClass = "High" # Mudar prioridade para Alta

# Ver os módulos (DLLs) carregados por um processo
(Get-Process chrome)[0].Modules | Select-Object ModuleName, FileName | Select-Object -First 5
`}
      />

      <h2>7. Monitoramento em Tempo Real</h2>
      <p>
        Embora o PowerShell não tenha um "top" nativo igual ao Linux, podemos simular um facilmente.
      </p>

      <CodeBlock
        title="Simulando um monitor de processos"
        code={`# Atualizar a lista dos 10 processos que mais usam CPU a cada 2 segundos
while($true) {
    Clear-Host
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 | Format-Table Name, CPU, WorkingSet
    Start-Sleep -Seconds 2
}
`}
      />

    </PageContainer>
  );
}
