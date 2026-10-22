# Vibe Playground

Uma aplicação web interativa e colaborativa onde os usuários podem criar, arrastar e organizar "vibe cards" coloridos em um canvas compartilhado.

## O que é

Vibe Playground é um canvas colaborativo onde você pode expressar seus pensamentos, sentimentos e ideias através de cartões coloridos e arrastáveis. Cada vibe card contém uma mensagem, emoji e cor, podendo ser posicionado livremente na tela. A aplicação oferece atualizações em tempo real, permitindo que todos vejam os vibes aparecerem no canvas.

## Funcionalidades Principais

- **Criação de Vibe Cards**: Crie cartões personalizados com mensagens, emojis e cores variadas
- **Drag & Drop**: Arraste e posicione os vibes livremente pelo canvas
- **Galeria**: Visualize todos os vibes em um layout de grid organizado
- **Consolidação com IA**: Gere uma mensagem consolidada a partir de todos os vibes usando inteligência artificial (OpenAI)
- **Sincronização Automática**: Atualizações em tempo real via polling a cada 2 segundos
- **Design Responsivo**: Interface moderna com suporte a dispositivos móveis

## Stack Tecnológica

### Frontend
- **React 18** com TypeScript
- **Vite** como bundler e servidor de desenvolvimento
- **Tailwind CSS** para estilização
- **shadcn/ui** (Radix UI) para componentes de interface
- **Framer Motion** para animações e drag-and-drop
- **TanStack React Query** para gerenciamento de estado do servidor
- **Wouter** para roteamento client-side

### Backend
- **Node.js** com **Express 5**
- **Drizzle ORM** para acesso ao banco de dados
- **PostgreSQL** como banco de dados
- **Zod** para validação de schemas
- **OpenAI API** para consolidação de mensagens com IA

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd <nome-do-diretorio>
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (veja a seção [Variáveis de Ambiente](#variáveis-de-ambiente)).

4. Execute as migrações do banco de dados:
```bash
npm run db:push
```

## Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível na porta definida pela variável `PORT` (padrão: 5000).

### Modo Produção

1. Gere o build:
```bash
npm run build
```

2. Inicie o servidor:
```bash
npm start
```

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento com hot reload |
| `npm run build` | Gera o build de produção (client e server) |
| `npm start` | Inicia o servidor em modo produção |
| `npm run check` | Executa a verificação de tipos TypeScript |
| `npm run db:push` | Aplica as alterações do schema no banco de dados |

## Estrutura de Pastas

```
├── client/                 # Aplicação React (frontend)
│   └── src/
│       ├── components/     # Componentes React
│       │   └── ui/         # Componentes shadcn/ui
│       ├── hooks/          # Hooks personalizados
│       ├── lib/            # Utilitários e configuração do query client
│       └── pages/          # Páginas da aplicação
│           ├── Playground.tsx  # Canvas principal (/)
│           ├── Gallery.tsx     # Galeria de vibes (/gallery)
│           └── About.tsx       # Página sobre (/about)
├── server/                 # Servidor Express (backend)
│   ├── index.ts            # Ponto de entrada do servidor
│   ├── routes.ts           # Handlers das rotas da API
│   ├── storage.ts          # Camada de acesso ao banco de dados
│   └── db.ts               # Conexão com o banco de dados
├── shared/                 # Código compartilhado entre frontend e backend
│   ├── schema.ts           # Definição do schema Drizzle (tabelas)
│   └── routes.ts           # Definição das rotas da API com validação Zod
├── script/                 # Scripts de build
│   └── build.ts            # Script de build para produção
└── package.json
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão com o PostgreSQL |
| `PORT` | Porta do servidor (padrão: 5000) |
| `AI_INTEGRATIONS_OPENAI_API_KEY` | Chave da API OpenAI para consolidação de vibes |
| `AI_INTEGRATIONS_OPENAI_BASE_URL` | URL base da API OpenAI (opcional) |

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/vibes` | Lista todos os vibes |
| POST | `/api/vibes` | Cria um novo vibe |
| PUT | `/api/vibes/:id` | Atualiza um vibe existente |
| DELETE | `/api/vibes/:id` | Remove um vibe |
| POST | `/api/ai/consolidate` | Consolida vibes em uma mensagem usando IA |

## Licença

MIT
