import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Scripts() {
  return (
    <PageContainer
      title="Scripts e Automação"
      subtitle="Transforme comandos isolados em ferramentas poderosas e seguras."
      difficulty="intermediario"
      timeToRead="20 min"
    >
      <p>
        Scripts do PowerShell são arquivos de texto com a extensão <code>.ps1</code> que contêm uma sequência de comandos. Eles permitem automatizar tarefas repetitivas, desde backups simples até orquestração complexa de infraestrutura.
      </p>

      <h2>Criando e Executando Scripts</h2>
      <p>
        Diferente de arquivos .bat, você não pode simplesmente dar um duplo clique em um .ps1 para executá-lo (por motivos de segurança). Você deve chamá-lo de dentro do PowerShell ou configurar uma política de execução.
      </p>

      <CodeBlock
        title="Como executar um script"
        code={`# 1. Navegue até a pasta
cd C:\\Scripts

# 2. Execute usando o caminho relativo (obrigatório o .\\)
.\\MeuScript.ps1

# 3. Ou use o operador de chamada (&) para caminhos com espaços
& "C:\\Meus Scripts\\Backup.ps1"`}
      />

      <h2>Políticas de Execução (Execution Policy)</h2>
      <p>
        O PowerShell possui uma trava de segurança para evitar que scripts maliciosos rodem sem permissão. Você precisa configurar o nível de segurança adequado.
      </p>

      <CodeBlock
        title="Gerenciando permissões de execução"
        code={`# Verificar a política atual
Get-ExecutionPolicy -List

# Alterar a política para permitir scripts locais sem assinatura
# RemoteSigned: Scripts locais rodam, baixados da internet precisam de assinatura.
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Bypass: Ignora todas as travas (útil para automações temporárias)
powershell.exe -ExecutionPolicy Bypass -File .\\script.ps1`}
      />

      <AlertBox type="danger" title="Segurança">
        Nunca use <code>Set-ExecutionPolicy Unrestricted</code> em máquinas de produção. Prefira <code>RemoteSigned</code> ou assine seus scripts digitalmente.
      </AlertBox>

      <h2>Parâmetros e Argumentos</h2>
      <p>
        Para tornar um script reutilizável, você deve usar parâmetros em vez de valores fixos (hardcoded).
      </p>

      <CodeBlock
        title="Script com parâmetros (Relatorio.ps1)"
        code={`param(
    [Parameter(Mandatory=$true)]
    [string]$CaminhoSaida,

    [ValidateSet("CSV", "HTML", "JSON")]
    [string]$Formato = "CSV",

    [switch]$EnviarEmail
)

Write-Host "Gerando relatório em $Formato para $CaminhoSaida..."

if ($EnviarEmail) {
    Write-Host "Enviando por e-mail..."
}`}
      />

      <h2>Documentação (Comment-Based Help)</h2>
      <p>
        O PowerShell permite que você crie ajuda nativa para seus scripts usando um bloco de comentários especial. Isso faz com que o comando <code>Get-Help .\\seu-script.ps1</code> funcione.
      </p>

      <CodeBlock
        title="Adicionando ajuda ao script"
        code={`<#
.SYNOPSIS
    Gera um relatório de espaço em disco.

.DESCRIPTION
    Este script analisa todos os volumes locais e exporta os dados para um arquivo.

.PARAMETER Path
    O caminho onde o arquivo será salvo.

.EXAMPLE
    .\\Get-DiskReport.ps1 -Path "C:\\Temp"
#>
param($Path)`}
      />

      <h2>Variáveis de Escopo de Script</h2>
      <p>
        Ao rodar scripts, é importante conhecer algumas variáveis automáticas que ajudam a localizar arquivos relacionados.
      </p>

      <CodeBlock
        title="Variáveis úteis de ambiente"
        code={`# Pasta onde o script atual está localizado
$PSScriptRoot

# Caminho completo do arquivo do script
$PSCommandPath

# Exemplo de uso: Importar um arquivo CSV na mesma pasta do script
$dados = Import-Csv -Path "$PSScriptRoot\\config.csv"`}
      />

      <h2>Dot Sourcing (. ./script.ps1)</h2>
      <p>
        Normalmente, quando um script termina, todas as suas variáveis e funções desaparecem. O <strong>Dot Sourcing</strong> executa o script no escopo atual, mantendo tudo carregado na memória.
      </p>

      <CodeBlock
        title="Exemplo de Dot Sourcing"
        code={`# Execução normal (limpa variáveis depois)
.\\FuncoesUteis.ps1

# Dot Sourcing (mantém funções e variáveis disponíveis no console)
. .\\FuncoesUteis.ps1

# Agora você pode chamar as funções definidas no arquivo diretamente!`}
      />

      <AlertBox type="info" title="Dica: Unblock-File">
        Se você baixar um script da internet, ele virá "bloqueado". Use <code>Unblock-File -Path .\\script.ps1</code> antes de tentar executá-lo.
      </AlertBox>
    </PageContainer>
  );
}
