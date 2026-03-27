import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Historia() {
  return (
    <PageContainer
      title="História e Evolução"
      subtitle="Do Monad ao PowerShell 7: a jornada da shell mais poderosa da Microsoft."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        O PowerShell não surgiu do nada. Ele foi o resultado de anos de frustração com as limitações do CMD e a necessidade de uma ferramenta de automação que pudesse competir com os shells do Unix, mas mantendo a filosofia de objetos do ecossistema Windows.
      </p>

      <h2>O Nascimento: Projeto Monad</h2>
      <p>
        Em 2002, Jeffrey Snover publicou o "Monad Manifesto". Nele, ele descrevia uma nova abordagem para automação: em vez de passar texto de um comando para outro (e ter que usar regex para extrair informações), os comandos passariam <strong>objetos .NET</strong> reais.
      </p>
      <p>
        O Monad foi renomeado para Windows PowerShell em 2006, quando a versão 1.0 foi lançada. Foi uma revolução para administradores de sistemas Windows, trazendo consistência através do padrão <code>Verbo-Substantivo</code>.
      </p>

      <AlertBox type="info" title="Fato Curioso">
        Jeffrey Snover, o pai do PowerShell, foi inicialmente rebaixado na Microsoft por sua ideia revolucionária. Anos depois, ele se tornou um dos engenheiros mais respeitados da empresa.
      </AlertBox>

      <h2>Linha do Tempo de Versões</h2>
      <ul>
        <li><strong>PS 1.0 (2006):</strong> Lançamento inicial para Windows XP e Server 2003.</li>
        <li><strong>PS 2.0 (2009):</strong> Integrado ao Windows 7. Trouxe o PowerShell Remoting (WinRM).</li>
        <li><strong>PS 3.0 (2012):</strong> Parte do Windows 8. Introduziu o Workflow e melhorias no CIM.</li>
        <li><strong>PS 4.0 (2013):</strong> Introduziu o Desired State Configuration (DSC).</li>
        <li><strong>PS 5.1 (2016):</strong> A versão final do "Windows PowerShell". É a versão que vem pré-instalada em quase todos os computadores Windows hoje.</li>
      </ul>

      <h2>A Grande Mudança: PowerShell Core (6+)</h2>
      <p>
        Em 2016, a Microsoft fez algo impensável: tornou o PowerShell <strong>open-source</strong> e multiplataforma. O PowerShell Core 6.0 foi reconstruído sobre o .NET Core, permitindo que ele rodasse nativamente no Linux e macOS.
      </p>
      <p>
        Isso marcou o fim do desenvolvimento de novas funcionalidades para o Windows PowerShell 5.1. A partir daí, todo o foco da Microsoft mudou para o que hoje chamamos simplesmente de <strong>PowerShell 7+</strong>.
      </p>

      <CodeBlock
        title="Verificando qual edição você está usando"
        code={`# O objeto $PSVersionTable contém todos os detalhes da versão atual
$PSVersionTable

# Observe a propriedade 'PSEdition'
# 'Desktop' significa que você está no Windows PowerShell 5.1 (antigo)
# 'Core' significa que você está no PowerShell 6 ou 7 (moderno/multiplataforma)
`}
      />

      <h2>Windows PowerShell vs PowerShell 7</h2>
      <p>
        É crucial entender a diferença entre os dois, pois você provavelmente encontrará ambos no seu dia a dia profissional.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="p-4 border border-border rounded-xl bg-primary/5">
          <h4 className="font-bold text-primary mb-2">Windows PowerShell (5.1)</h4>
          <ul className="text-sm space-y-1 opacity-80">
            <li>• Exclusivo para Windows</li>
            <li>• Baseado no .NET Framework</li>
            <li>• Não recebe mais novas funções</li>
            <li>• Focado em compatibilidade legado</li>
          </ul>
        </div>
        <div className="p-4 border border-border rounded-xl bg-accent/5">
          <h4 className="font-bold text-accent mb-2">PowerShell (7.x)</h4>
          <ul className="text-sm space-y-1 opacity-80">
            <li>• Windows, Linux e macOS</li>
            <li>• Baseado no .NET moderno</li>
            <li>• Evolução constante e alta performance</li>
            <li>• Novas sintaxes (ternário, pipeline paralelo)</li>
          </ul>
        </div>
      </div>

      <h2>Por que PowerShell em vez de Bash ou CMD?</h2>
      <p>
        O CMD é extremamente limitado. O Bash é poderoso, mas exige que você seja um mestre em manipular strings com <code>awk</code>, <code>sed</code> e <code>grep</code>.
      </p>
      <p>
        No PowerShell, se você quiser a data de criação de um arquivo, você simplesmente acessa a propriedade <code>CreationTime</code> do objeto arquivo. Não há necessidade de "cortar" colunas de um texto retornado pelo sistema.
      </p>

      <CodeBlock
        title="Comparação Prática: Listar arquivos grandes"
        code={`# No Bash (texto):
# ls -l | awk '$5 > 1048576 {print $9}'

# No PowerShell (objetos):
Get-ChildItem | Where-Object { $_.Length -gt 1MB } | Select-Object Name

# Note como a sintaxe do PS é muito mais legível para quem está lendo
# $_ representa o objeto atual passando pelo pipeline
`}
      />

      <AlertBox type="warning" title="Compatibilidade">
        Embora o PowerShell 7 seja o futuro, alguns módulos antigos do Active Directory ou Exchange podem ainda exigir o Windows PowerShell 5.1. Felizmente, o PS7 tem uma camada de compatibilidade para rodar esses comandos legados.
      </AlertBox>

      <h2>Conclusão</h2>
      <p>
        Entender essa história é o primeiro passo para não se perder. Sempre que puder, use o <strong>PowerShell 7</strong>. Ele é mais rápido, tem mais recursos e é o padrão da indústria para automação moderna.
      </p>

      <CodeBlock
        title="Um comando nostálgico"
        code={`# No Windows PowerShell, você pode ver os detalhes do host assim
Get-Host

# Isso mostra a interface que está hospedando o motor do PowerShell
`}
      />
    </PageContainer>
  );
}
