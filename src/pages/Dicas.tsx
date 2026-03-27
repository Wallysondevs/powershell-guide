import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Dicas() {
  return (
    <PageContainer
      title="Dicas e Truques"
      subtitle="Aumente sua produtividade com atalhos, aliases e configurações avançadas de console."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Dominar o PowerShell não é apenas conhecer os cmdlets, mas também saber como interagir com o shell de forma eficiente. Aqui estão as dicas que separam os iniciantes dos especialistas.
      </p>

      <h2>Atalhos de Teclado Essenciais</h2>
      <p>O PowerShell (especialmente com o módulo PSReadLine) oferece atalhos poderosos para edição de linha de comando.</p>
      <ul>
        <li><strong>Tab / Shift+Tab:</strong> Completa comandos, arquivos e parâmetros. Continue apertando para ciclar entre as opções.</li>
        <li><strong>Ctrl + R:</strong> Pesquisa reversa no histórico de comandos. Comece a digitar e ele encontrará o último comando correspondente.</li>
        <li><strong>F7:</strong> Exibe um menu pop-up com o histórico de comandos (apenas no console clássico).</li>
        <li><strong>Ctrl + L:</strong> Limpa a tela (equivalente ao <code>cls</code> ou <code>Clear-Host</code>).</li>
        <li><strong>Alt + . (ponto):</strong> Insere o último argumento do comando anterior. Extremamente útil!</li>
        <li><strong>Ctrl + Espaço:</strong> (PS 5+) Abre o menu de sugestões do IntelliSense no terminal.</li>
      </ul>

      <h2>Aliases: Os Atalhos de Comandos</h2>
      <p>Aliases são nomes curtos para comandos longos. O PowerShell já vem com muitos inspirados no CMD e no Bash.</p>

      <CodeBlock
        title="Trabalhando com Aliases"
        code={`# Listar todos os aliases
Get-Alias

# Descobrir o comando real por trás de um alias
Get-Alias ls
Get-Alias dir

# Criar seu próprio alias (apenas para a sessão atual)
Set-Alias -Name "server" -Value "python -m http.server"

# Exportar seus aliases para um arquivo
Export-Alias -Path "meus_aliases.txt"`}
      />

      <AlertBox type="warning" title="Regra de Ouro para Scripts">
        <strong>Nunca use aliases em scripts!</strong> Use nomes completos (ex: <code>Where-Object</code> em vez de <code>?</code>). Isso torna seu script legível para outras pessoas e evita problemas se um alias for alterado.
      </AlertBox>

      <h2>Splatting: Limpando Comandos Longos</h2>
      <p>Splatting é uma técnica para passar parâmetros para um comando usando uma Hashtable. Isso evita que você tenha linhas de código quilométricas.</p>

      <CodeBlock
        title="Exemplo de Splatting"
        code={`# SEM Splatting (difícil de ler)
Send-MailMessage -To "chefe@empresa.com" -From "eu@empresa.com" -Subject "Relatório" -Body "Segue anexo" -SmtpServer "smtp.empresa.com" -Attachment "C:\\doc.pdf"

# COM Splatting (organizado)
$params = @{
    To         = "chefe@empresa.com"
    From       = "eu@empresa.com"
    Subject    = "Relatório"
    Body       = "Segue anexo"
    SmtpServer = "smtp.empresa.com"
    Attachment = "C:\\doc.pdf"
}

# Use o @ em vez do $ para fazer o splatting
Send-MailMessage @params`}
      />

      <h2>$PSDefaultParameterValues</h2>
      <p>Se você se pega repetindo sempre o mesmo parâmetro para um comando, você pode defini-lo como padrão para toda a sua sessão.</p>

      <CodeBlock
        title="Definindo padrões globais"
        code={`# Sempre usar -AutoSize no Format-Table
$PSDefaultParameterValues["Format-Table:AutoSize"] = $true

# Sempre usar UTF8 como codificação no Out-File e Set-Content
$PSDefaultParameterValues["Out-File:Encoding"] = "utf8"
$PSDefaultParameterValues["Set-Content:Encoding"] = "utf8"`}
      />

      <h2>One-Liners Poderosos</h2>
      <p>Algumas tarefas complexas podem ser resolvidas com apenas uma linha de código.</p>

      <CodeBlock
        title="Exemplos de uma linha"
        code={`# Encontrar os 5 processos que mais usam memória
Get-Process | Sort-Object WS -Descending | Select-Object -First 5

# Listar arquivos modificados hoje
Get-ChildItem -Recurse | Where-Object { $_.LastWriteTime -gt (Get-Date).Date }

# Gerar uma senha aleatória de 15 caracteres
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 15 | % {[char]$_})

# Abrir o diretório atual no Windows Explorer
ii .`}
      />

      <AlertBox type="info" title="Você sabia?">
        O comando <code>ii</code> é um alias para <code>Invoke-Item</code>. Ele "executa" o arquivo ou pasta usando o programa padrão do Windows. <code>ii .</code> abre a pasta atual no Explorer, e <code>ii arquivo.pdf</code> abre o leitor de PDF.
      </AlertBox>

      <h2>Calculated Properties (Propriedades Calculadas)</h2>
      <p>Você pode criar colunas "na hora" ao selecionar objetos, transformando os dados originais.</p>

      <CodeBlock
        title="Criando propriedades personalizadas"
        code={`# Mostrar o tamanho dos arquivos em MB em vez de Bytes
ls | Select-Object Name, @{Name="Tamanho(MB)"; Expression={$_.Length / 1MB -as [int]}}

# Mostrar quanto tempo faz que o computador ligou
Get-CimInstance Win32_OperatingSystem | Select-Object @{N="DiasLigado"; E={(Get-Date) - $_.LastBootUpTime}}`}
      />

      <AlertBox type="success" title="Dica de Visual">
        Instale o módulo <strong>Terminal-Icons</strong> para ter ícones coloridos de pastas e arquivos ao usar o comando <code>ls</code>. Combina perfeitamente com o <strong>Oh My Posh</strong>.
      </AlertBox>
    </PageContainer>
  );
}
