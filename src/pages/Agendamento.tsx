import { PageContainer } from "@/components/layout/PageContainer";
  import { CodeBlock } from "@/components/ui/CodeBlock";
  import { AlertBox } from "@/components/ui/AlertBox";

  export default function Agendamento() {
    return (
      <PageContainer
        title="Agendamento de Tarefas"
        subtitle="Automatize a execução de scripts e programas com o Agendador de Tarefas do Windows."
        difficulty="avancado"
        timeToRead="30 min"
      >
        <p>
          O Agendamento de Tarefas (Task Scheduler) permite que scripts do PowerShell sejam
          executados automaticamente em horários específicos, na inicialização do sistema,
          em eventos ou quando certas condições são atendidas — tudo via PowerShell,
          sem precisar abrir a interface gráfica.
        </p>

        <h2>Visualizando Tarefas Existentes</h2>
        <CodeBlock title="Consultando tarefas agendadas" code={`# Listar todas as tarefas
  Get-ScheduledTask | Format-Table TaskName, TaskPath, State -AutoSize

  # Tarefas em um caminho específico
  Get-ScheduledTask -TaskPath "\\Microsoft\\Windows\\UpdateOrchestrator\"

  # Detalhes e última execução
  Get-ScheduledTask -TaskName "MinhaTarefa" | Get-ScheduledTaskInfo

  # Tarefas prontas mas nunca executadas
  Get-ScheduledTask | Get-ScheduledTaskInfo |
      Where-Object { $_.LastRunTime -lt "01/01/2000" } |
      Select-Object TaskName, LastRunTime, NextRunTime

  # Exportar todas as tarefas para relatório
  Get-ScheduledTask | ForEach-Object {
      $info = $_ | Get-ScheduledTaskInfo
      [PSCustomObject]@{
          Nome         = $_.TaskName
          Caminho      = $_.TaskPath
          Estado       = $_.State
          ÚltimaExec   = $info.LastRunTime
          ResultadoÚlt = $info.LastTaskResult
          PróxExec     = $info.NextRunTime
      }
  } | Export-Csv "tarefas-agendadas.csv" -NoTypeInformation -Encoding UTF8
  `} />

        <h2>Criando Tarefas Agendadas</h2>
        <CodeBlock title="Anatomia de uma tarefa: Ação, Gatilho, Configurações, Registro" code={`# 1. AÇÃO — O que a tarefa vai executar
  $action = New-ScheduledTaskAction `
    -Execute    "pwsh.exe" `
    -Argument   "-NoProfile -NonInteractive -WindowStyle Hidden -File C:\\Scripts\\Backup.ps1" `
    -WorkingDirectory "C:\\Scripts"

  # 2. GATILHO — Quando vai executar
  $trigger = New-ScheduledTaskTrigger -Daily -At "03:00AM"

  # 3. CONFIGURAÇÕES — Comportamento
  $settings = New-ScheduledTaskSettings `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2) `  # Máximo 2 horas de execução
    -RestartCount 3 `                              # Reintentar 3x em caso de falha
    -RestartInterval (New-TimeSpan -Minutes 5) `  # A cada 5 min
    -MultipleInstances IgnoreNew                   # Não iniciar outra se já está rodando

  # 4. PRINCIPAL — Contexto de execução
  $principal = New-ScheduledTaskPrincipal `
    -UserId    "SYSTEM" `
    -LogonType ServiceAccount `
    -RunLevel  Highest

  # 5. REGISTRO
  Register-ScheduledTask `
    -TaskName "BackupDiario" `
    -TaskPath "\\MinhsEmpresa" `
    -Action   $action `
    -Trigger  $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description "Backup diário dos dados críticos"

  Write-Host "Tarefa BackupDiario criada com sucesso!" -ForegroundColor Green
  `} />

        <h2>Tipos de Gatilhos</h2>
        <CodeBlock title="Gatilhos para diferentes situações" code={`# Diário — todo dia às 3h
  $triggerDiario = New-ScheduledTaskTrigger -Daily -At "03:00AM"

  # Semanal — segundas e sextas às 18h
  $triggerSemanal = New-ScheduledTaskTrigger -Weekly `
    -DaysOfWeek Monday, Friday `
    -At "06:00PM"

  # Mensal — todo dia 1 do mês às 8h
  $triggerMensal = New-ScheduledTaskTrigger -Monthly `
    -DaysOfMonth 1 `
    -At "08:00AM"

  # Na inicialização do Windows
  $triggerBoot = New-ScheduledTaskTrigger -AtStartup

  # No logon de qualquer usuário
  $triggerLogon = New-ScheduledTaskTrigger -AtLogOn

  # Uma vez — data/hora específica
  $triggerUnico = New-ScheduledTaskTrigger -Once -At "2025-12-31 23:00:00"

  # Repetição — a cada 15 minutos (útil para polling)
  $triggerRepetido = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 15) `
    -RepetitionDuration (New-TimeSpan -Hours 8) `  # Por 8 horas
    -Once -At (Get-Date)

  # Baseado em evento do Event Log (ex: quando um serviço para)
  $triggerEvento = New-ScheduledTaskTrigger -AtStartup  # Placeholder
  # Para eventos, use a interface gráfica ou XML:
  $xml = @'
  <QueryList>
    <Query Id="0" Path="System">
      <Select Path="System">*[System[Provider[@Name='Service Control Manager'] and EventID=7036]]</Select>
    </Query>
  </QueryList>
  '@
  `} />

        <h2>Gerenciando o Estado da Tarefa</h2>
        <CodeBlock title="Controlar e monitorar tarefas" code={`# Iniciar tarefa imediatamente (para teste)
  Start-ScheduledTask -TaskName "BackupDiario" -TaskPath "\\MinhsEmpresa"

  # Verificar se está rodando
  (Get-ScheduledTask -TaskName "BackupDiario").State  # Running, Ready, Disabled

  # Aguardar conclusão
  do {
      Start-Sleep -Seconds 5
      $estado = (Get-ScheduledTask -TaskName "BackupDiario").State
  } while ($estado -eq "Running")
  $info = Get-ScheduledTask -TaskName "BackupDiario" | Get-ScheduledTaskInfo
  "Concluído com código: $($info.LastTaskResult)"  # 0 = sucesso

  # Parar tarefa em execução
  Stop-ScheduledTask -TaskName "BackupDiario"

  # Habilitar e desabilitar
  Enable-ScheduledTask  -TaskName "BackupDiario"
  Disable-ScheduledTask -TaskName "BackupDiario"

  # Remover tarefa
  Unregister-ScheduledTask -TaskName "BackupDiario" -Confirm:$false
  `} />

        <h2>Múltiplas Ações e Tarefas Avançadas</h2>
        <CodeBlock title="Tarefas com múltiplas ações e monitoramento" code={`# Tarefa com MÚLTIPLAS ações (executadas em sequência)
  $acoes = @(
      New-ScheduledTaskAction -Execute "pwsh.exe" `
          -Argument "-File C:\\Scripts\\Pre-Backup.ps1",
      New-ScheduledTaskAction -Execute "pwsh.exe" `
          -Argument "-File C:\\Scripts\\Backup.ps1",
      New-ScheduledTaskAction -Execute "pwsh.exe" `
          -Argument "-File C:\\Scripts\\Pos-Backup.ps1"
  )

  $trigger = New-ScheduledTaskTrigger -Daily -At "02:00AM"
  Register-ScheduledTask -TaskName "BackupCompleto" `
    -Action $acoes -Trigger $trigger -User "SYSTEM" -RunLevel Highest

  # Relatório de tarefas com falha recente
  Get-ScheduledTask |
      Get-ScheduledTaskInfo |
      Where-Object { $_.LastTaskResult -ne 0 -and $_.LastRunTime -gt (Get-Date).AddDays(-7) } |
      Select-Object TaskName, LastRunTime, LastTaskResult |
      Format-Table -AutoSize

  # Migrar tarefas de um servidor para outro
  $tarefas = Get-ScheduledTask -TaskPath "\\MinhsEmpresa"
  foreach ($tarefa in $tarefas) {
      $xml = Export-ScheduledTask -TaskName $tarefa.TaskName -TaskPath $tarefa.TaskPath
      # No servidor destino:
      Register-ScheduledTask -Xml $xml -TaskName $tarefa.TaskName -TaskPath $tarefa.TaskPath -Force
  }
  `} />

        <AlertBox type="info" title="SYSTEM vs usuário específico">
          Use <code>-User "SYSTEM"</code> para tarefas que rodam sem usuário logado.
          Use <code>-User "EMPRESA\\svc-backup" -Password "senha"</code> quando a tarefa
          precisa de permissões de rede ou acesso a recursos compartilhados. Nunca use
          credenciais de usuário real em tarefas agendadas — prefira contas de serviço (service accounts).
        </AlertBox>

        <AlertBox type="warning" title="Execution Policy">
          Para que scripts PS1 rodem em tarefas agendadas, passe explicitamente:
          <code>pwsh.exe -ExecutionPolicy Bypass -File script.ps1</code>
          ou assine o script com um certificado de código.
        </AlertBox>
      </PageContainer>
    );
  }
  