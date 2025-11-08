# 🎓 Órbita Plataforma - Sistema de Gestão de Estudos ENEM

Plataforma completa de gestão de estudos para preparação do ENEM, com sistema multi-tenant e configuração white-label.

## 📋 Sobre o Projeto

A Órbita Plataforma é um sistema web desenvolvido para facilitar a gestão de estudos de alunos que se preparam para o ENEM. A plataforma possui três perfis de usuário distintos:

- **👨‍💼 Gestor**: Administra a plataforma, gerencia mentores e alunos, visualiza métricas gerais
- **👨‍🏫 Mentor**: Acompanha seus alunos, visualiza desempenho e oferece suporte
- **🎓 Aluno**: Registra estudos, cria cronogramas, realiza simulados e acompanha evolução

## ✨ Funcionalidades Principais

### Para Alunos
- 📊 **Dashboard Inteligente**: Métricas de desempenho, streak de estudos, análise de evolução
- ⏱️ **Cronômetro de Estudos**: Registro automático de tempo dedicado aos estudos
- 📝 **Registro Manual**: Adicione estudos realizados offline
- 📅 **Cronograma Semanal**: Grade visual com drag-and-drop, cores personalizáveis e templates salvos
- 📈 **Análise de Desempenho**: Gráficos interativos de evolução temporal e por matéria
- 📋 **Gestão de Simulados**: Registro completo com cálculos automáticos de desempenho
- ⚙️ **Configurações**: Edição de perfil e alteração de senha

### Para Mentores
- 👥 **Gestão de Alunos**: Visualização e gerenciamento dos alunos vinculados
- 📊 **Acompanhamento**: Acesso às métricas e desempenho dos alunos

### Para Gestores
- 🏢 **Dashboard Analítico**: Métricas gerais, gráficos de crescimento de alunos e mentores
- 👨‍🏫 **Gestão de Mentores**: Criar, editar e remover mentores da plataforma
- 🎨 **White-label**: Configurar nome, logo e cor principal por mentor
- 👥 **Gestão de Alunos**: Visualizar todos os alunos, vincular a mentores, editar e remover
- 🔍 **Filtros Avançados**: Busca e filtro por mentor na lista de alunos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes UI
- **Recharts** - Gráficos interativos
- **Wouter** - Roteamento
- **TanStack Query** - Gerenciamento de estado

### Backend
- **Node.js** - Runtime
- **Express 4** - Framework web
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM TypeScript-first
- **MySQL/TiDB** - Banco de dados relacional

### Autenticação
- **Firebase Authentication** - Autenticação de usuários
- **Firebase Admin SDK** - Verificação server-side

### DevOps
- **Vite** - Build tool
- **pnpm** - Gerenciador de pacotes
- **Git** - Controle de versão

## 🚀 Como Executar

### Pré-requisitos
- Node.js 22+
- pnpm
- Conta Firebase configurada
- Banco de dados MySQL/TiDB

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Mario2332/Plataforma-Orbita.git
cd Plataforma-Orbita
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
- Configure `DATABASE_URL` com a string de conexão do banco
- Configure as credenciais do Firebase
- Outras variáveis são gerenciadas automaticamente pelo sistema

4. Execute as migrações do banco de dados:
```bash
pnpm db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

6. Acesse a aplicação em `http://localhost:3000`

## 🔐 Configuração do Firebase

### Credenciais do Admin SDK

⚠️ **IMPORTANTE**: As credenciais do Firebase Admin SDK não estão incluídas no repositório por questões de segurança.

Para configurar:

1. Acesse o [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **Configurações do Projeto** → **Contas de serviço**
4. Clique em **Gerar nova chave privada**
5. Salve o arquivo JSON como `server/firebase-credentials.json`

### Configuração do Cliente

As configurações do cliente Firebase já estão incluídas em `client/src/lib/firebase.ts`.

## 📁 Estrutura do Projeto

```
orbita-plataforma/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── aluno/     # Páginas do aluno
│   │   │   ├── mentor/    # Páginas do mentor
│   │   │   ├── gestor/    # Páginas do gestor
│   │   │   └── auth/      # Páginas de autenticação
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/          # Bibliotecas e configurações
│   │   └── hooks/        # React hooks customizados
│   └── public/           # Arquivos estáticos
├── server/               # Backend Node.js
│   ├── routers/         # Routers tRPC
│   ├── db.ts            # Funções de banco de dados
│   └── _core/           # Configurações core
├── drizzle/             # Schema e migrações
│   └── schema.ts        # Definição das tabelas
└── shared/              # Código compartilhado

```

## 🎨 Sistema de Roles

A plataforma possui três roles principais:

- **`gestor`**: Acesso total à plataforma, gerencia mentores e alunos
- **`mentor`**: Gerencia seus alunos vinculados
- **`aluno`**: Acessa funcionalidades de estudo e acompanhamento

## 🔒 Segurança

- Autenticação via Firebase Authentication
- Tokens JWT verificados server-side
- Proteção de rotas baseada em roles
- Credenciais sensíveis não commitadas no repositório
- Validação de dados em todas as requisições

## 📱 Páginas de Login

A plataforma possui três páginas de login separadas para garantir segurança:

- `/login/aluno` - Login e cadastro para alunos
- `/login/mentor` - Login exclusivo para mentores (sem cadastro)
- `/login/gestor` - Login exclusivo para gestores (sem cadastro)

## 🎯 Roadmap

- [ ] Integração com Kiwify/Hotmart para gestão de assinaturas
- [ ] Sistema de notificações em tempo real
- [ ] Chat entre mentor e aluno
- [ ] Banco de questões por matéria
- [ ] Sistema de flashcards com repetição espaçada
- [ ] Upload e correção de redações
- [ ] Fórum de dúvidas
- [ ] Gamificação e sistema de conquistas

## 📄 Licença

Este projeto é privado e de propriedade da Órbita Plataforma.

## 👥 Contato

Para dúvidas ou suporte, entre em contato através do email: mentoriaenemmario@gmail.com

---

Desenvolvido com ❤️ pela equipe Órbita Plataforma
