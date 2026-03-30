import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SQL() {
  return (
    <PageContainer
      title="Banco de Dados com PowerShell"
      subtitle="Conecte-se a SQL Server, execute queries, gerencie backups e automatize operações de banco de dados."
      difficulty="avançado"
      timeToRead="30 min"
    >
      <p>
        PowerShell pode interagir com bancos de dados SQL Server via módulo SqlServer,
        ADO.NET direto ou ODBC. Isso permite automatizar backups, executar relatórios,
        monitorar saúde do banco e muito mais.
      </p>

      <h2>Módulo SqlServer</h2>
      <CodeBlock title="Instalando e usando o módulo SqlServer" code={`# Instalar módulo (recomendado)
Install-Module -Name SqlServer -Force
Import-Module SqlServer

# Listar servidores SQL na rede
[System.Data.Sql.SqlDataSourceEnumerator]::Instance.GetDataSources()

# Executar query e retornar resultados como objetos
Invoke-Sqlcmd -ServerInstance "SQLSERVER01"  -Database "Northwind"  -Query "SELECT TOP 10 CustomerID, CompanyName, City FROM Customers ORDER BY City"

# Com autenticação SQL
Invoke-Sqlcmd -ServerInstance "SQLSERVER01"  -Database "Northwind"  -Username "sa"  -Password $env:SQL_PASSWORD  -Query "SELECT COUNT(*) AS Total FROM Orders"

# Executar arquivo .sql
Invoke-Sqlcmd -ServerInstance "SQLSERVER01"  -Database "MinhaDB"  -InputFile "C:\\Scripts\\migrations\\v2.0.sql"
`} />

      <h2>ADO.NET Direto</h2>
      <CodeBlock title="Conexão e queries com ADO.NET" code={`function Invoke-Query {
    param(
        [string]$ConnectionString,
        [string]$Query,
        [hashtable]$Parametros = @{}
    )

    $conn    = [System.Data.SqlClient.SqlConnection]::new($ConnectionString)
    $cmd     = [System.Data.SqlClient.SqlCommand]::new($Query, $conn)
    $adapter = [System.Data.SqlClient.SqlDataAdapter]::new($cmd)
    $ds      = [System.Data.DataSet]::new()

    # Parâmetros (SEMPRE use parâmetros para evitar SQL Injection!)
    foreach ($p in $Parametros.GetEnumerator()) {
        $cmd.Parameters.AddWithValue("@$($p.Key)", $p.Value) | Out-Null
    }

    try {
        $conn.Open()
        $adapter.Fill($ds) | Out-Null
        return $ds.Tables[0]
    } finally {
        $conn.Close()
        $conn.Dispose()
    }
}

# Configurar connection string
$connStr = "Server=SQLSERVER01;Database=MinhaDB;Integrated Security=True;TrustServerCertificate=True"

# Executar com parâmetros (SEGURO contra SQL Injection)
$resultado = Invoke-Query -ConnectionString $connStr  -Query "SELECT * FROM Usuarios WHERE Departamento = @dept AND Ativo = @ativo"  -Parametros @{ dept = "TI"; ativo = 1 }

$resultado | Format-Table -AutoSize
`} />

      <h2>Backup e Restore Automatizados</h2>
      <CodeBlock title="Backup de bancos SQL Server" code={`# Backup via T-SQL com Invoke-Sqlcmd
$servidor  = "SQLSERVER01"
$database  = "MinhaDB"
$pasta     = "D:\\Backups\\SQL"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$arquivo   = "$pasta\\${database}_$timestamp.bak"

Invoke-Sqlcmd -ServerInstance $servidor -Query @"
BACKUP DATABASE [$database]
TO DISK = N'$arquivo'
WITH COMPRESSION,
     STATS = 10,
     FORMAT,
     NAME = 'Backup $database $timestamp'
"@

Write-Host "Backup concluído: $arquivo" -ForegroundColor Green

# Script de backup de todos os bancos
$bancos = Invoke-Sqlcmd -ServerInstance $servidor  -Query "SELECT name FROM sys.databases WHERE name NOT IN ('master','tempdb','model','msdb')"

foreach ($db in $bancos) {
    $nome   = $db.name
    $arq    = "$pasta\\${nome}_$(Get-Date -Format 'yyyyMMdd').bak"
    Invoke-Sqlcmd -ServerInstance $servidor -Query "BACKUP DATABASE [$nome] TO DISK = N'$arq' WITH COMPRESSION"
    Write-Host "Backup: $nome -> $arq"
}

# Limpar backups antigos (manter últimos 7 dias)
Get-ChildItem $pasta -Filter "*.bak" |
    Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
    Remove-Item -Force
`} />

      <h2>Monitoramento de SQL Server</h2>
      <CodeBlock title="Saúde e performance do banco" code={`# Tamanho dos bancos de dados
Invoke-Sqlcmd -ServerInstance "SQLSERVER01" -Query @"
SELECT
    name AS Banco,
    SUM(size * 8 / 1024) AS TamanhoMB,
    SUM(CASE WHEN type = 0 THEN size * 8 / 1024 ELSE 0 END) AS DadosMB,
    SUM(CASE WHEN type = 1 THEN size * 8 / 1024 ELSE 0 END) AS LogMB
FROM sys.master_files
GROUP BY name
ORDER BY TamanhoMB DESC
"@ | Format-Table -AutoSize

# Jobs que falharam
Invoke-Sqlcmd -ServerInstance "SQLSERVER01" -Database "msdb" -Query @"
SELECT j.name AS Job, h.run_date, h.run_status,
       h.message
FROM sysjobs j
JOIN sysjobhistory h ON j.job_id = h.job_id
WHERE h.run_status <> 1
  AND h.run_date >= CONVERT(int, CONVERT(varchar, GETDATE()-7, 112))
ORDER BY h.run_date DESC
"@ | Format-Table -AutoSize

# Top queries por CPU
Invoke-Sqlcmd -ServerInstance "SQLSERVER01" -Query @"
SELECT TOP 10
    SUBSTRING(st.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(st.text)
          ELSE qs.statement_end_offset END - qs.statement_start_offset)/2)+1) AS Query,
    qs.total_worker_time/qs.execution_count AS AvgCPU,
    qs.execution_count AS Execucoes
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY AvgCPU DESC
"@
`} />

      <AlertBox type="info" title="Segurança: SQL Injection">
        Sempre use parâmetros (<code>@parametro</code>) ao passar dados do usuário para queries SQL.
        Nunca construa queries concatenando strings — isso abre brechas de SQL Injection.
      </AlertBox>
    </PageContainer>
  );
}
