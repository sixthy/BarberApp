# Barbershop App

Sistema fullstack para uma barbearia, com frontend em Next.js e backend em NestJS.

O projeto permite que clientes criem conta, façam login, escolham serviços, consultem horários disponíveis e realizem agendamentos. Também possui um painel administrativo para o dono da barbearia gerenciar agendamentos, serviços, bloqueios de horários/dias e blacklist de clientes.

---

## Tecnologias utilizadas

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Next Image

### Backend

- NestJS
- Node.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Bcrypt
- Helmet
- ValidationPipe

---

## Funcionalidades

### Cliente

- Cadastro de cliente
- Login com JWT
- Visualização dos serviços ativos
- Escolha de serviço
- Consulta de horários disponíveis
- Criação de agendamento
- Bloqueio automático de horários já ocupados
- Bloqueio automático de horários fechados pelo admin
- Impedimento de agendamento para cliente bloqueado na blacklist

### Admin

- Login como administrador
- Redirecionamento automático para o dashboard admin
- Visualização do nome e email do admin logado
- Listagem de todos os agendamentos
- Edição de agendamentos
- Cancelamento de agendamentos
- Cancelamento libera o horário novamente
- Marcação de falta
- Cliente com falta entra na blacklist
- Remoção real do cliente da blacklist
- Bloqueio de horário específico
- Bloqueio de dia inteiro
- Reabertura de horário ou dia bloqueado
- Gerenciamento dos serviços

---

## Estrutura principal do projeto

```txt
barbearia/
├── app/ ou src/app/              # Frontend Next.js
│   ├── components/
│   ├── agendar/
│   ├── login/
│   ├── register/
│   └── admin/
│
├── appback/                      # Backend NestJS
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── services/
│   │   ├── bookings/
│   │   ├── schedules/
│   │   ├── schedule-blocks/
│   │   ├── blacklist/
│   │   └── main.ts
│   │
│   └── test/
│       └── app.e2e-spec.ts
```

## Pré-requisitos

Antes de rodar o projeto, instale:

- Node.js
- npm
- MongoDB
- Git

Verifique se o MongoDB está instalado:

```bash
mongod --version
```

No Windows, também pode verificar se o serviço do MongoDB está rodando:

```powershell
Get-Service MongoDB
```

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/sixthy/barberapp.git
```

Entre na pasta do projeto:

```bash
cd barbearia
```

Instale as dependências do frontend:

```bash
npm install
```

Entre na pasta do backend:

```bash
cd appback
```

Instale as dependências do backend:

```bash
npm install
```

---

## Variáveis de ambiente

### Backend

Crie um arquivo `.env` dentro da pasta `appback`.

Exemplo:

```env
PORT=3333

MONGODB_URI=mongodb://127.0.0.1:27017/barbearia

JWT_SECRET=coloque_um_segredo_forte_aqui

FRONTEND_URLS=http://localhost:3000
```

Em produção, nunca use um `JWT_SECRET` fraco ou padrão.

### Frontend

Na raiz do frontend, crie um arquivo `.env.local`.

Exemplo:

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

---

## Rodando o projeto

### Backend

Dentro da pasta `appback`, execute:

```bash
npm run start:dev
```

O backend ficará disponível em:

```txt
http://localhost:3333
```

### Frontend

Na pasta principal do frontend, execute:

```bash
npm run dev
```

O frontend ficará disponível em:

```txt
http://localhost:3000
```

---

## Rotas principais da API

### Auth

```txt
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Users

```txt
GET /users
```

A rota de usuários deve ser protegida para admin.

### Services

```txt
GET    /services/active
GET    /services
POST   /services
PATCH  /services/:id
DELETE /services/:id
```

### Schedules

```txt
GET /schedules/available?date=YYYY-MM-DD&serviceIds=ID_DO_SERVICO
```

Essa rota retorna os horários disponíveis com base nos serviços escolhidos, duração total, expediente da barbearia, agendamentos confirmados e bloqueios feitos pelo admin.

### Bookings

```txt
POST  /bookings
GET   /bookings
GET   /bookings/by-date?date=YYYY-MM-DD
PATCH /bookings/:id
PATCH /bookings/:id/cancel
PATCH /bookings/:id/no-show
```

### Schedule Blocks

```txt
POST  /schedule-blocks
GET   /schedule-blocks
PATCH /schedule-blocks/:id/reopen
```

Essa parte permite que o admin bloqueie um horário específico, bloqueie um dia inteiro ou reabra horários/dias bloqueados.

### Blacklist

```txt
GET    /blacklist
PATCH  /blacklist/:id/unblock
DELETE /blacklist/:id
```

A blacklist é usada para controlar clientes com faltas e bloqueios.

---

## Segurança implementada

O projeto possui proteções básicas de segurança no backend, como:

- Autenticação com JWT
- Senhas criptografadas com bcrypt
- Rotas administrativas protegidas por token
- Controle de acesso por cargo, separando `client` e `admin`
- ValidationPipe global
- Helmet para headers HTTP de segurança
- CORS restrito ao frontend
- Validação de ObjectId antes de operações no MongoDB
- JWT_SECRET obrigatório
- Agendamentos cancelados não bloqueiam horários
- Apenas agendamentos confirmados ocupam horários

---

## Testes E2E

O projeto possui testes E2E no backend usando Jest e Supertest.

Para rodar os testes:

```bash
cd appback
npm run test:e2e
```

Os testes cobrem:

- Cliente cadastra
- Cliente faz login
- Cliente vê horários disponíveis
- Cliente agenda serviço
- Mesmo horário some da lista
- Admin faz login
- Admin vê próprio nome no dashboard
- Admin lista agendamentos
- Admin edita agendamento
- Admin cancela agendamento
- Horário cancelado volta a aparecer
- Admin bloqueia um horário
- Horário bloqueado some da agenda
- Admin reabre horário
- Horário reaberto volta a aparecer
- Admin marca falta
- Cliente entra na blacklist
- Admin remove cliente da blacklist
- Cliente não consegue acessar rotas de admin
- Rotas protegidas não aceitam acesso sem token

Resultado esperado:

```txt
Test Suites: 1 passed
Tests:       26 passed
```

---

## Comandos úteis

### Frontend

```bash
npm run dev
npm run build
npm run start
```

### Backend

```bash
cd appback
npm run start:dev
npm run build
npm run start
npm run test:e2e
```

---

## Status do projeto

Projeto em fase final de validação.

Já foram implementados:

- Frontend principal
- Backend principal
- Autenticação
- Admin dashboard
- Agendamentos
- Serviços
- Bloqueios
- Blacklist
- Testes E2E principais
- Proteções de segurança básicas

---

## Próximos passos possíveis

- Melhorar responsividade mobile
- Criar deploy do frontend
- Criar deploy do backend
- Configurar MongoDB Atlas
- Criar documentação visual da API
- Melhorar layout do painel admin
- Adicionar testes E2E do frontend com Playwright

---


Um abraço,
Gabriel Ferreira.
