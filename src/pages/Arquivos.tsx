import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Arquivos() {
  return (
    <PageContainer
      title="Gerenciamento de Arquivos e Pastas"
      subtitle="Criando, copiando, movendo e manipulando itens no sistema de arquivos."
      difficulty="iniciante"
      timeToRead="25 min"
    >
      <p>
        Manipular arquivos e diretórios é o coração da automação de sistemas. O PowerShell utiliza o conceito de <strong>Item</strong> para unificar o tratamento de arquivos, pastas e até chaves de registro, facilitando o aprendizado com um conjunto consistente de cmdlets.
      </p>

      <h2>Criando Novos Itens: New-Item</h2>
      <p>
        O cmdlet <code>New-Item</code> (alias <code>ni</code>) é usado para criar tanto pastas quanto arquivos. O parâmetro <code>-ItemType</code> define o que será criado.
      </p>

      <CodeBlock
        title="Criando pastas e arquivos"
        code={`# Criando um novo diretório (pasta)
New-Item -Path "C:\\Scripts" -ItemType Directory

# Criando um arquivo de texto vazio
New-Item -Path "C:\\Scripts\\config.txt" -ItemType File

# Criando um arquivo já com conteúdo inicial
New-Item -Path ".\\nota.txt" -ItemType File -Value "Conteúdo inicial do arquivo"

# Criando uma estrutura de pastas e arquivo de uma vez (usando -Force)
New-Item -Path ".\\projeto\\src\\index.js" -ItemType File -Force
`}
      />

      <AlertBox type="info" title="O parâmetro -Force">
        Ao usar <code>-Force</code> com <code>New-Item</code>, o PowerShell criará todos os diretórios pai necessários se eles não existirem. Se o arquivo já existir, ele será sobrescrito.
      </AlertBox>

      <h2>Copiando e Movendo Itens</h2>
      <p>
        Os cmdlets <code>Copy-Item</code> (<code>cp</code>, <code>copy</code>) e <code>Move-Item</code> (<code>mv</code>, <code>move</code>) permitem organizar seus dados.
      </p>

      <CodeBlock
        title="Copiando e movendo arquivos"
        code={`# Copiando um arquivo para outro diretório
Copy-Item -Path ".\\config.txt" -Destination "D:\\Backup\\"

# Copiando uma pasta inteira recursivamente
Copy-Item -Path "C:\\Scripts" -Destination "D:\\Backup\\Scripts" -Recurse

# Movendo (e renomeando) um arquivo
Move-Item -Path ".\\nota.txt" -Destination ".\\documentos\\nota_final.txt"

# Usando -WhatIf para testar antes de executar (Simulação)
Move-Item -Path "*.log" -Destination ".\\OldLogs" -WhatIf
`}
      />

      <AlertBox type="warning" title="Segurança com -WhatIf">
        Sempre que for realizar operações em massa (como mover centenas de arquivos), use o parâmetro <code>-WhatIf</code> primeiro. Ele mostrará o que o comando <em>faria</em> sem realmente executar nada.
      </AlertBox>

      <h2>Removendo Itens: Remove-Item</h2>
      <p>
        O <code>Remove-Item</code> (<code>rm</code>, <code>del</code>, <code>erase</code>) exclui arquivos e pastas.
      </p>

      <CodeBlock
        title="Excluindo arquivos de forma segura"
        code={`# Deleta um arquivo específico
Remove-Item -Path ".\\temp.txt"

# Deleta todos os arquivos .log na pasta atual
Remove-Item -Path "*.log"

# Deleta uma pasta e todo o seu conteúdo (Recursivo)
Remove-Item -Path ".\\PastaAntiga" -Recurse

# Solicita confirmação antes de deletar cada arquivo
Remove-Item -Path "*.exe" -Confirm
`}
      />

      <h2>Renomeando Itens: Rename-Item</h2>
      <p>
        Para mudar apenas o nome sem mover o arquivo de lugar, usamos <code>Rename-Item</code> (alias <code>ren</code>).
      </p>

      <CodeBlock
        title="Renomeando arquivos"
        code={`# Renomeando um arquivo simples
Rename-Item -Path ".\\readme.txt" -NewName "LEIAME.txt"

# Renomeando múltiplas extensões (usando o pipeline)
Get-ChildItem -Filter "*.jpeg" | Rename-Item -NewName { $_.Name -replace '.jpeg','.jpg' }
`}
      />

      <h2>Trabalhando com Propriedades de Arquivos</h2>
      <p>
        Arquivos não são apenas nomes; eles têm datas de criação, tamanhos e atributos. O <code>Get-Item</code> retorna o objeto do arquivo com todas essas informações.
      </p>

      <CodeBlock
        title="Acessando metadados de arquivos"
        code={`# Obtém o objeto do arquivo
$file = Get-Item ".\\config.txt"

# Exibe propriedades específicas
$file.Length           # Tamanho em bytes
$file.LastWriteTime    # Data da última modificação
$file.Extension        # Extensão (.txt)
$file.FullName         # Caminho completo

# Filtrando arquivos por tamanho (maiores que 100MB)
Get-ChildItem -Recurse | Where-Object { $_.Length -gt 100MB }

# Mudando atributos (ex: tornar somente leitura)
$file.Attributes = "ReadOnly"
`}
      />

      <h2>Links Simbólicos e Junções</h2>
      <p>
        No PowerShell moderno, é fácil criar atalhos do sistema de arquivos conhecidos como Symbolic Links (Symlinks).
      </p>

      <CodeBlock
        title="Criando Links Simbólicos"
        code={`# Cria um link simbólico para um arquivo (requer privilégios de admin)
New-Item -Path "C:\\LinkParaArquivo.txt" -ItemType SymbolicLink -Value "C:\\Destino\\Original.txt"

# Cria uma junção de diretório (Directory Junction)
New-Item -Path "C:\\MeusDados" -ItemType Junction -Value "D:\\DadosReais"
`}
      />

      <h2>Verificando a Integridade: Get-FileHash</h2>
      <p>
        Para garantir que um arquivo não foi corrompido ou alterado, podemos calcular seu hash (assinatura digital).
      </p>

      <CodeBlock
        title="Calculando Hash de Arquivos"
        code={`# Gera o hash SHA256 (padrão)
Get-FileHash -Path ".\\instalador.exe"

# Usa o algoritmo MD5 (útil para verificações legadas)
Get-FileHash -Path ".\\arquivo.zip" -Algorithm MD5
`}
      />

      <AlertBox type="success" title="Dica de Produtividade">
        Use o preenchimento automático com a tecla <strong>Tab</strong> para completar caminhos de arquivos e nomes de parâmetros. Isso evita erros de digitação e economiza muito tempo!
      </AlertBox>
    </PageContainer>
  );
}
