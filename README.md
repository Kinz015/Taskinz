# Taskinz

📌 Descrição Geral

O Taskinz é uma aplicação web de gerenciamento de tarefas desenvolvida para organizar atividades de forma simples, segura e eficiente. O sistema permite que usuários criem, acompanhem e gerenciem tarefas com controle de status, prazos, autor e responsável, garantindo que apenas usuários autorizados possam editar ou excluir informações sensíveis.

O projeto foi desenvolvido com foco em boas práticas full stack, segurança, controle de acesso e organização de código.

✅ Funcionalidades

A aplicação atende aos principais requisitos de um sistema completo de gestão de tarefas:

Autenticação de usuários (registro, login e logout)

Criação, listagem, edição e exclusão de tarefas (CRUD completo)

Tarefas vinculadas a:

Autor (quem criou)

Responsável (quem executa)

Controle de status das tarefas:

Atrasadas

Iniciadas

Concluída

Controle de permissão:

Apenas o autor pode editar ou excluir a tarefa

Ordenação e filtragem por:

Data de criação

Prazo

Última atualização

🔗 Backend / API

O backend segue o padrão REST, com rotas bem definidas, validação de dados e uso de middlewares.

Exemplos de endpoints:

GET /api/tasks – Listagem de tarefas com filtros e ordenação

POST /api/tasks – Criação de nova tarefa

PUT /api/tasks/{id} – Edição de tarefa (restrita ao autor)

DELETE /api/tasks/{id} – Exclusão de tarefa (restrita ao autor)

POST /api/auth/register – Registro de usuário

POST /api/auth/login – Autenticação

POST /api/auth/logout – Encerramento de sessão

As rotas são protegidas por middlewares de autenticação e autorização, garantindo acesso seguro.

🔐 Segurança

A segurança da aplicação foi implementada desde a base do projeto.

Método de autenticação: JWT (JSON Web Token)

Middlewares:

Middleware de autenticação para rotas protegidas

Middleware de autorização para validar o autor da tarefa

Proteção de dados sensíveis:

Senhas armazenadas com hash

Uso de variáveis de ambiente (.env)

Tokens protegidos via cookies HTTP

🧪 Testes

O projeto foi estruturado para permitir testes automatizados e validação das regras de negócio.

Tipos de testes: unitários e de integração

Validação de:

Autenticação

Regras de permissão

CRUD de tarefas

(A cobertura pode ser expandida para testes end-to-end futuramente.)

🗄️ Banco de Dados

O sistema utiliza um banco de dados relacional com modelagem clara e normalizada.

Tipo de banco: Relacional

Banco utilizado: MySQL

ORM: Prisma

Principais entidades:

User

Dados de autenticação

Relacionamento como autor e responsável

Task

Autor (quem criou)

Responsável (quem executa)

Status

Datas de criação, atualização e prazo

Relacionamentos garantem integridade e controle correto de permissões.

🧹 Qualidade do Código

O código foi organizado visando manutenção e escalabilidade:

Separação clara entre:

Frontend

Backend

Lógica de autenticação

Uso consistente de TypeScript

Componentização no frontend

Padronização de nomes e estrutura de pastas

Regras de negócio centralizadas e reutilizáveis

🎨 Frontend / UX

O frontend foi desenvolvido com foco em clareza e usabilidade.

Interface simples e objetiva

Design responsivo (desktop, tablet e mobile)

Sidebar adaptativa conforme o tamanho da tela

Feedback visual para ações permitidas ou bloqueadas

Uso de Tailwind CSS para consistência visual

📚 Documentação

A documentação foi pensada para facilitar o entendimento do projeto:

README claro e completo

Estrutura de código organizada

Tipagem explícita para facilitar manutenção e evolução

✨ Diferenciais

Além do básico, o projeto apresenta:

Middleware de autenticação e autorização

Controle rígido de permissões por autor

Interface responsiva sem dependência de JS extra

Separação clara entre páginas públicas e protegidas

Tratamento de rotas inexistentes e acessos não autorizados

⚙️ Como Executar o Projeto
Pré-requisitos:

Node.js

npm ou yarn

MySQL

Passos para execução:

Clone o repositório

Instale as dependências

Configure o arquivo .env

Execute as migrações do banco de dados

Inicie a aplicação

Comandos:
npm install
npx prisma migrate dev
npm run dev

👤 Autor:
Guilherme Lins Bezerra
GitHub: (https://github.com/Kinz015)
LinkedIn: (https://www.linkedin.com/in/guilherme-lins-ab2ab3255/)
HospedagemVercel: