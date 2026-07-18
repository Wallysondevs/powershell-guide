import{n as e,t}from"./CodeBlock-BuNVzmc1.js";import{t as n}from"./AlertBox-BFckEFwP.js";import{a as r}from"./index-Cqr-t4Fn.js";var i=r();function a(){return(0,i.jsxs)(e,{title:`Gerenciamento de Arquivos e Pastas`,subtitle:`Criando, copiando, movendo e manipulando itens no sistema de arquivos.`,difficulty:`iniciante`,timeToRead:`25 min`,children:[(0,i.jsxs)(`p`,{children:[`Manipular arquivos e diretórios é o coração da automação de sistemas. O PowerShell utiliza o conceito de `,(0,i.jsx)(`strong`,{children:`Item`}),` para unificar o tratamento de arquivos, pastas e até chaves de registro, facilitando o aprendizado com um conjunto consistente de cmdlets.`]}),(0,i.jsx)(`h2`,{children:`Criando Novos Itens: New-Item`}),(0,i.jsxs)(`p`,{children:[`O cmdlet `,(0,i.jsx)(`code`,{children:`New-Item`}),` (alias `,(0,i.jsx)(`code`,{children:`ni`}),`) é usado para criar tanto pastas quanto arquivos. O parâmetro `,(0,i.jsx)(`code`,{children:`-ItemType`}),` define o que será criado.`]}),(0,i.jsx)(t,{title:`Criando pastas e arquivos`,code:`# Criando um novo diretório (pasta)
New-Item -Path "C:\\Scripts" -ItemType Directory

# Criando um arquivo de texto vazio
New-Item -Path "C:\\Scripts\\config.txt" -ItemType File

# Criando um arquivo já com conteúdo inicial
New-Item -Path ".\\nota.txt" -ItemType File -Value "Conteúdo inicial do arquivo"

# Criando uma estrutura de pastas e arquivo de uma vez (usando -Force)
New-Item -Path ".\\projeto\\src\\index.js" -ItemType File -Force
`}),(0,i.jsxs)(n,{type:`info`,title:`O parâmetro -Force`,children:[`Ao usar `,(0,i.jsx)(`code`,{children:`-Force`}),` com `,(0,i.jsx)(`code`,{children:`New-Item`}),`, o PowerShell criará todos os diretórios pai necessários se eles não existirem. Se o arquivo já existir, ele será sobrescrito.`]}),(0,i.jsx)(`h2`,{children:`Copiando e Movendo Itens`}),(0,i.jsxs)(`p`,{children:[`Os cmdlets `,(0,i.jsx)(`code`,{children:`Copy-Item`}),` (`,(0,i.jsx)(`code`,{children:`cp`}),`, `,(0,i.jsx)(`code`,{children:`copy`}),`) e `,(0,i.jsx)(`code`,{children:`Move-Item`}),` (`,(0,i.jsx)(`code`,{children:`mv`}),`, `,(0,i.jsx)(`code`,{children:`move`}),`) permitem organizar seus dados.`]}),(0,i.jsx)(t,{title:`Copiando e movendo arquivos`,code:`# Copiando um arquivo para outro diretório
Copy-Item -Path ".\\config.txt" -Destination "D:\\Backup\\"

# Copiando uma pasta inteira recursivamente
Copy-Item -Path "C:\\Scripts" -Destination "D:\\Backup\\Scripts" -Recurse

# Movendo (e renomeando) um arquivo
Move-Item -Path ".\\nota.txt" -Destination ".\\documentos\\nota_final.txt"

# Usando -WhatIf para testar antes de executar (Simulação)
Move-Item -Path "*.log" -Destination ".\\OldLogs" -WhatIf
`}),(0,i.jsxs)(n,{type:`warning`,title:`Segurança com -WhatIf`,children:[`Sempre que for realizar operações em massa (como mover centenas de arquivos), use o parâmetro `,(0,i.jsx)(`code`,{children:`-WhatIf`}),` primeiro. Ele mostrará o que o comando `,(0,i.jsx)(`em`,{children:`faria`}),` sem realmente executar nada.`]}),(0,i.jsx)(`h2`,{children:`Removendo Itens: Remove-Item`}),(0,i.jsxs)(`p`,{children:[`O `,(0,i.jsx)(`code`,{children:`Remove-Item`}),` (`,(0,i.jsx)(`code`,{children:`rm`}),`, `,(0,i.jsx)(`code`,{children:`del`}),`, `,(0,i.jsx)(`code`,{children:`erase`}),`) exclui arquivos e pastas.`]}),(0,i.jsx)(t,{title:`Excluindo arquivos de forma segura`,code:`# Deleta um arquivo específico
Remove-Item -Path ".\\temp.txt"

# Deleta todos os arquivos .log na pasta atual
Remove-Item -Path "*.log"

# Deleta uma pasta e todo o seu conteúdo (Recursivo)
Remove-Item -Path ".\\PastaAntiga" -Recurse

# Solicita confirmação antes de deletar cada arquivo
Remove-Item -Path "*.exe" -Confirm
`}),(0,i.jsx)(`h2`,{children:`Renomeando Itens: Rename-Item`}),(0,i.jsxs)(`p`,{children:[`Para mudar apenas o nome sem mover o arquivo de lugar, usamos `,(0,i.jsx)(`code`,{children:`Rename-Item`}),` (alias `,(0,i.jsx)(`code`,{children:`ren`}),`).`]}),(0,i.jsx)(t,{title:`Renomeando arquivos`,code:`# Renomeando um arquivo simples
Rename-Item -Path ".\\readme.txt" -NewName "LEIAME.txt"

# Renomeando múltiplas extensões (usando o pipeline)
Get-ChildItem -Filter "*.jpeg" | Rename-Item -NewName { $_.Name -replace '.jpeg','.jpg' }
`}),(0,i.jsx)(`h2`,{children:`Trabalhando com Propriedades de Arquivos`}),(0,i.jsxs)(`p`,{children:[`Arquivos não são apenas nomes; eles têm datas de criação, tamanhos e atributos. O `,(0,i.jsx)(`code`,{children:`Get-Item`}),` retorna o objeto do arquivo com todas essas informações.`]}),(0,i.jsx)(t,{title:`Acessando metadados de arquivos`,code:`# Obtém o objeto do arquivo
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
`}),(0,i.jsx)(`h2`,{children:`Links Simbólicos e Junções`}),(0,i.jsx)(`p`,{children:`No PowerShell moderno, é fácil criar atalhos do sistema de arquivos conhecidos como Symbolic Links (Symlinks).`}),(0,i.jsx)(t,{title:`Criando Links Simbólicos`,code:`# Cria um link simbólico para um arquivo (requer privilégios de admin)
New-Item -Path "C:\\LinkParaArquivo.txt" -ItemType SymbolicLink -Value "C:\\Destino\\Original.txt"

# Cria uma junção de diretório (Directory Junction)
New-Item -Path "C:\\MeusDados" -ItemType Junction -Value "D:\\DadosReais"
`}),(0,i.jsx)(`h2`,{children:`Verificando a Integridade: Get-FileHash`}),(0,i.jsx)(`p`,{children:`Para garantir que um arquivo não foi corrompido ou alterado, podemos calcular seu hash (assinatura digital).`}),(0,i.jsx)(t,{title:`Calculando Hash de Arquivos`,code:`# Gera o hash SHA256 (padrão)
Get-FileHash -Path ".\\instalador.exe"

# Usa o algoritmo MD5 (útil para verificações legadas)
Get-FileHash -Path ".\\arquivo.zip" -Algorithm MD5
`}),(0,i.jsxs)(n,{type:`success`,title:`Dica de Produtividade`,children:[`Use o preenchimento automático com a tecla `,(0,i.jsx)(`strong`,{children:`Tab`}),` para completar caminhos de arquivos e nomes de parâmetros. Isso evita erros de digitação e economiza muito tempo!`]})]})}export{a as default};