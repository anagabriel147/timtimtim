# CONTEXT.md - Ecossistema TimTim (Gestão de Eventos)

## 1. Visão Geral do Sistema
O TimTim é um ecossistema completo para planejamento, gestão e automação de eventos. O projeto está estruturado como um monorepo, contendo o frontend em Next.js (`apps/web`) e o backend em Python com FastAPI e SQLAlchemy (`apps/api`).

---

## 2. Matriz de Perfis e Funcionalidades do Backend

O sistema deve isolar regras de negócio e endpoints específicos baseados no perfil do usuário conectado:

### 👤 1. Cliente (Noivos, Formandos, Anfitriões)
* **Painel do Evento:** Visualização do checklist de tarefas, contagem regressiva e controle do orçamento (Budget).
* **Gestão de Convidados:** RSVP online, controle de presença, mapa de mesas e restrições alimentares.
* **Lista de Presentes / Cotas:** Integração com gateway de pagamento para recebimento de presentes convertidos em dinheiro.

### 💼 2. Fornecedor (Buffet, Fotografia, Decoração, Bandas)
* **Painel do Fornecedor:** Gestão de múltiplos contratos e datas de eventos em que foi contratado.
* **Orçamentos e Leads:** Recebimento de solicitações de orçamento enviadas por Clientes ou Assessores.
* **Cronograma Técnico:** Acesso aos horários de montagem, desmontagem e especificações técnicas de cada evento alinhado com o Assessor.

### 📋 3. Assessor / Cerimonialista (O Maestro do Evento)
* **Multi-Eventos:** Painel centralizado para gerenciar múltiplos casamentos/eventos simultaneamente.
* **Ferramentas de Organização:** Criação e atribuição de tarefas para os Clientes, cronograma minuto a minuto do dia do evento (Line-up).
* **Homologação de Fornecedores:** Indicação e validação de contratos e pagamentos pendentes dos clientes com os fornecedores.

### 👑 4. Administrador (Admin da Plataforma TimTim)
* **Gestão de Assinaturas (SaaS):** Controle de planos e faturamento de Assessores e Fornecedores (SaaS).
* **Métricas da Plataforma:** Relatórios de volume de eventos ativos, transações financeiras nas listas de presentes e novos usuários.
* **Moderação:** Aprovação de perfis de fornecedores no catálogo e suporte geral.

---

## 3. Diretrizes de Banco de Dados (SQLAlchemy & FastAPI)
* **Modelo de Usuário Único:** Uma tabela central de `User` com uma coluna `role` (enum: CLIENT, PROVIDER, ASSESSOR, ADMIN).
* **Multi-Tenancy por Evento:** A maioria das tabelas (convidados, tarefas, pagamentos) deve se relacionar com uma tabela central chamada `Event`, garantindo o isolamento correto dos dados.
* **Segurança e CORS:** Autenticação via JWT diferenciando escopos de rota por papel de usuário, com CORS liberado para o frontend local (`http://localhost:3000`).
