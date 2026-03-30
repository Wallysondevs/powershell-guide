import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Agendamento() {
  return (
    <PageContainer
      title="Agendamento de Tarefas"
      subtitle="Automatize a execução de seus scripts e programas usando o Agendador de Tarefas do Windows."
      difficulty="avancado"
      timeToRead="22 min"
    >
      <p>
        O Agendamento de Tarefas (Task Scheduler) permite que você execute scripts do PowerShell automaticamente em horários específicos, quando o sistema inicia ou quando certos eventos ocorrem. O módulo <code>ScheduledTasks</code> fornece uma interface poderosa para criar e gerenciar essas tarefas programadas sem precisar abrir a interface gráfica.
      </p>

      <h2>1. Visualizando Tarefas Existentes</h2>
      <p>
        Podemos listar as tarefas agendadas no sistema para verificar seu status e última execução.
      </p>

      <CodeBlock
        title="Consultando tarefas"
        code={`# Listar todas as tarefas (pode demorar devido à quantidade)
Get-ScheduledTask

# Buscar tarefas em uma pasta específica
Get-ScheduledTask -TaskPath "\\Microsoft\\Windows\\UpdateOrchestrator\\"

# Ver o estado e o resultado da última execução de uma tarefa
Get-ScheduledTask -TaskName "MinhaTarefa" | Get-ScheduledTaskInfo
`}
      />

      <h2>2. O Processo de Criação de uma Tarefa</h2>
      <p>
        Para criar uma tarefa via PowerShell, seguimos um padrão de 4 passos, definindo separadamente: a <b>Ação</b>, o <b>Gatilho</b>, as <b>Configurações</b> e a <b>Identidade</b>.
      </p>

      <CodeBlock
        title="Criando uma tarefa passo a passo"
        code={`# 1. Definir a Ação (O que a tarefa vai fazer)
# Nota: Sempre chame o powershell.exe com -File ou -Command
$action = New-ScheduledTaskAction -Execute "powershell.exe"  -Argument "-NoProfile -WindowStyle Hidden -File C:\\Scripts\\Backup.ps1"

# 2. Definir o Gatilho (Quando a tarefa vai rodar - ex: diariamente às 3 da manhã)
$trigger = New-ScheduledTaskTrigger -Daily -At 3am

# 3. Definir as Configurações (Opcional - ex: permitir execução em bateria)
$settings = New-ScheduledTaskSettings -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

# 4. Registrar a Tarefa no sistema
Register-ScheduledTask -TaskName "MeuBackupDiario"  -Action $action  -Trigger $trigger  -Settings $settings  -User "SYSTEM"  -RunLevel Highest
`}
      />

      <AlertBox type="info" title="Por que o SYSTEM?">
        Usar o usuário <code>SYSTEM</code> permite que a tarefa rode mesmo que nenhum usuário esteja logado. O <code>-RunLevel Highest</code> garante privilégios de administrador.
      </AlertBox>

      <h2>3. Tipos de Gatilhos (Triggers)</h2>
      <p>
        Existem vários tipos de eventos que podem disparar uma tarefa.
      </p>

      <CodeBlock
        title="Exemplos de gatilhos"
        code={`# Gatilho de Inicialização (Boot)
$triggerBoot = New-ScheduledTaskTrigger -AtStartup

# Gatilho de Logon de Usuário
$triggerLogon = New-ScheduledTaskTrigger -AtLogOn

# Gatilho Semanal (Segundas e Sextas às 18:00)
$triggerWeekly = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Monday, Friday -At 6pm

# Gatilho Único (Executar uma vez no futuro)
$triggerOnce = New-ScheduledTaskTrigger -Once -At "2023-12-31 23:59:59"
`}
      />

      <h2>4. Gerenciando o Estado da Tarefa</h2>
      <p>
        Após criada, você pode habilitar, desabilitar, iniciar ou parar a tarefa manualmente.
      </p>

      <CodeBlock
        title="Comandos de controle"
        code={`# Iniciar a tarefa agora mesmo para testar
Start-ScheduledTask -TaskName "MeuBackupDiario"

# Desabilitar a tarefa temporariamente
Disable-ScheduledTask -TaskName "MeuBackupDiario"

# Reabilitar a tarefa
Enable-ScheduledTask -TaskName "MeuBackupDiario"

# Excluir a tarefa permanentemente
Unregister-ScheduledTask -TaskName "MeuBackupDiario" -Confirm:$false
`}
      />

      <h2>5. Exportando e Importando Tarefas</h2>
      <p>
        Você pode salvar a definição de uma tarefa em XML para migrar entre servidores ou fazer backup.
      </p>

      <CodeBlock
        title="Backup de tarefas"
        code={`# Exportar para XML
Export-ScheduledTask -TaskName "MinhaTarefa" | Out-File "C:\\Backups\\Tarefa.xml"

# Importar de um XML (usando Register-ScheduledTask com o parâmetro -Xml)
$taskXml = Get-Content "C:\\Backups\\Tarefa.xml" -Raw
Register-ScheduledTask -TaskName "TarefaImportada" -Xml $taskXml
`}
      />

      <AlertBox type="warning" title="Dica de Troubleshooting">
        Se sua tarefa "roda" mas nada acontece, verifique o caminho do script e se o usuário que executa a tarefa tem permissões na pasta. Use <code>Out-File</code> dentro do seu script para criar logs e ver o que está falhando durante a execução agendada.
      </AlertBox>

      <h2>6. Comparação com schtasks.exe</h2>
      <p>
        Embora o <code>schtasks.exe</code> ainda funcione, os cmdlets do PowerShell são preferíveis por retornarem objetos que podem ser manipulados e integrados a outros scripts.
      </p>
      
      <CodeBlock
        title="Exemplo de integração"
        code={`# Parar todas as tarefas que falharam na última execução
Get-ScheduledTask | Get-ScheduledTaskInfo | Where-Object { $_.LastTaskResult -ne 0 } | ForEach-Object {
    Write-Warning "Tarefa falhou: $($_.TaskName)"
}
`}
      />

    </PageContainer>
  );
}
