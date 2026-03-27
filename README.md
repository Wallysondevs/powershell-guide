# 💻 Guia Completo do PowerShell

> Documentação abrangente do PowerShell em Português Brasileiro — do básico ao avançado, com 34 páginas detalhadas e exemplos práticos.

![PowerShell](https://img.shields.io/badge/PowerShell-7%2B-blue?logo=powershell)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/Licença-MIT-green)

## 📚 Conteúdo

O guia cobre 34 tópicos organizados em categorias:

| Categoria | Páginas |
|-----------|---------|
| **Introdução** | História, Instalação, Primeiros Passos |
| **Fundamentos** | Parâmetros e Flags, Sistema de Ajuda, Variáveis, Operadores, Strings |
| **Coleções** | Arrays e Listas, Hashtables e Objetos |
| **Pipeline** | Pipeline, Filtros e Seleção, Formatação e Exportação |
| **Sistema de Arquivos** | Navegação, Arquivos, Conteúdo, Permissões e ACLs |
| **Administração** | Processos, Serviços, Usuários e Grupos, Agendamento |
| **Rede e Internet** | Rede e Conectividade, Web e APIs REST |
| **Scripting Avançado** | Controle de Fluxo, Funções, Tratamento de Erros, Módulos, Scripts |
| **Windows Avançado** | Registro do Windows, WMI e CIM |
| **Extras** | Gerenciadores de Pacotes, Dicas e Truques, Referências |

## 🚀 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/) ou npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Wallysondevs/powershell-guide.git
cd powershell-guide

# Instale as dependências
npm install
# ou
pnpm install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```

Acesse em: **http://localhost:5173**

### Build para Produção

```bash
npm run build
npm run preview
```

## 🎨 Tecnologias

- **[React 18](https://react.dev/)** — Interface do usuário
- **[Vite 6](https://vitejs.dev/)** — Build tool
- **[TypeScript 5](https://www.typescriptlang.org/)** — Tipagem estática
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Estilização
- **[Wouter](https://github.com/molefrog/wouter)** — Roteamento (hash-based)
- **[Framer Motion](https://www.framer.com/motion/)** — Animações
- **[Lucide React](https://lucide.dev/)** — Ícones
- **[React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)** — Highlight de código

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # Cabeçalho com toggle de tema
│   │   ├── Sidebar.tsx        # Navegação lateral
│   │   └── PageContainer.tsx  # Wrapper de página com barra de progresso
│   └── ui/
│       ├── AlertBox.tsx       # Caixas de alerta (info/warning/danger/success)
│       ├── CodeBlock.tsx      # Bloco de código com syntax highlight
│       └── DifficultyBadge.tsx# Badge de dificuldade
├── hooks/
│   └── use-theme.ts           # Hook de gerenciamento de tema
├── pages/                     # 34 páginas de conteúdo
│   ├── Home.tsx
│   ├── Historia.tsx
│   ├── Instalacao.tsx
│   └── ...
├── App.tsx                    # Roteamento principal
├── main.tsx                   # Ponto de entrada
└── index.css                  # Tema PowerShell (azul/roxo dark mode)
```

## 🌙 Tema

O guia usa um tema escuro inspirado nas cores do PowerShell:
- **Primário:** Azul (#4A9EFF)
- **Secundário:** Roxo (#A78BFA)
- **Background:** Azul marinho escuro (#0D1117)

## 📝 Licença

MIT © [Wallyson Lopes da Silva](https://github.com/Wallysondevs)
