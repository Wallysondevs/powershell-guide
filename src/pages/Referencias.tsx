import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Referencias() {
  return (
    <PageContainer
      title="Referências e Ecossistema"
      subtitle="Onde continuar sua jornada e como se manter atualizado no mundo PowerShell."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        O PowerShell é mais do que apenas uma linguagem; é um ecossistema vibrante com suporte da Microsoft e de uma comunidade global apaixonada. Esta página reúne os principais recursos para consulta e aprendizado contínuo.
      </p>

      <h2>Documentação Oficial</h2>
      <p>A fonte primária de verdade para qualquer comando ou conceito do PowerShell.</p>
      <ul>
        <li><strong>Microsoft Learn:</strong> <a href="https://learn.microsoft.com/powershell/" target="_blank" className="text-primary hover:underline">docs.microsoft.com/powershell</a></li>
        <li><strong>Repositório GitHub:</strong> <a href="https://github.com/PowerShell/PowerShell" target="_blank" className="text-primary hover:underline">github.com/PowerShell/PowerShell</a> (Onde o desenvolvimento do PS Core acontece)</li>
        <li><strong>Blog da Equipe PowerShell:</strong> Fique por dentro de novas versões e recursos experimentais.</li>
      </ul>

      <h2>Convenções de Nomenclatura (Verbo-Substantivo)</h2>
      <p>O PowerShell segue uma estrutura rígida de nomes que facilita a descoberta de comandos. Sempre use <strong>Verbos Aprovados</strong>.</p>

      <CodeBlock
        title="Descobrindo verbos válidos"
        code={`# Listar todos os verbos aprovados pela Microsoft
Get-Verb

# Filtrar por categoria (ex: verbos de dados)
Get-Verb | Where-Object Group -eq "Data"`}
      />

      <h2>Módulos da Comunidade Indispensáveis</h2>
      <p>Esses módulos estendem o PowerShell para quase qualquer tarefa imaginável:</p>

      <CodeBlock
        title="Módulos que você deve conhecer"
        code={`# 1. PSReadLine: Melhora drástica na edição da linha de comando (já vem no Win10+)
# 2. Posh-Git: Informações de status do Git no seu prompt
# 3. ImportExcel: Leia e escreva arquivos Excel (.xlsx) sem precisar do Office instalado
# 4. Pester: O framework padrão para testes unitários no PowerShell
# 5. DBatools: O "canivete suíço" para administradores de SQL Server
# 6. PSScriptAnalyzer: Verifica erros de sintaxe e melhores práticas no seu código`}
      />

      <h2>PowerShell Remoting</h2>
      <p>Uma das características mais poderosas do PowerShell é a capacidade de executar comandos em milhares de máquinas simultaneamente de forma segura.</p>

      <CodeBlock
        title="Exemplos de Remoting"
        code={`# Abrir uma sessão interativa com um servidor remoto
Enter-PSSession -ComputerName "Servidor01"

# Executar um comando em múltiplos servidores ao mesmo tempo
Invoke-Command -ComputerName "SRV01", "SRV02", "SRV03" -ScriptBlock { Get-Service "WinRM" }

# Copiar um arquivo local para vários servidores
Copy-Item -Path "C:\\Update.exe" -Destination "C:\\Temp" -ToSession (New-PSSession -ComputerName "SRV01", "SRV02")`}
      />

      <h2>Aprendizado e Comunidade</h2>
      <ul>
        <li><strong>PowerShell.org:</strong> Fóruns, eventos e guias gratuitos escritos pela comunidade.</li>
        <li><strong>Reddit r/PowerShell:</strong> Um dos melhores lugares para tirar dúvidas rápidas e ver scripts criativos.</li>
        <li><strong>Eventos:</strong> Procure pelo <em>PowerShell Summit</em> e <em>PowerShell User Groups</em> locais.</li>
      </ul>

      <AlertBox type="info" title="PowerShell vs .NET">
        Como o PowerShell é construído sobre o .NET, você tem acesso a toda a biblioteca de classes do Windows. Se o PowerShell não tem um comando nativo para algo, você pode usar classes .NET diretamente: <code>[System.Math]::Sqrt(144)</code> ou <code>[System.IO.Path]::GetRandomFileName()</code>.
      </AlertBox>

      <h2>Diferenças de Edições</h2>
      <p>É importante saber qual "sabor" do PowerShell você está usando:</p>
      <ul>
        <li><strong>Windows PowerShell (5.1):</strong> Construído sobre o .NET Framework. Focado em compatibilidade com Windows antigo. Não recebe mais novos recursos.</li>
        <li><strong>PowerShell (7.x+):</strong> Construído sobre o .NET Core. Multiplataforma (Windows, Linux, macOS), muito mais rápido e moderno.</li>
      </ul>

      <CodeBlock
        title="Verificando sua versão"
        code={`$PSVersionTable`}
      />

      <AlertBox type="success" title="Conclusão">
        Parabéns por chegar ao fim deste guia! O PowerShell é uma jornada de aprendizado contínuo. Pratique diariamente, automatize as pequenas tarefas do seu dia a dia e logo você estará dominando infraestruturas inteiras com apenas algumas linhas de código.
      </AlertBox>
    </PageContainer>
  );
}
