# MyCash+ Dashboard

Sistema de gestão financeira familiar moderno e responsivo, desenvolvido com React, TypeScript e Tailwind CSS.

## 🎯 Objetivo

O MyCash+ é uma aplicação web completa para gerenciamento de finanças pessoais e familiares, oferecendo:

- **Dashboard Interativo**: Visão geral completa das finanças com gráficos e métricas
- **Gestão de Transações**: Cadastro, edição e categorização de receitas e despesas
- **Controle de Cartões**: Monitoramento de limites, faturas e gastos por cartão
- **Análise Familiar**: Suporte a múltiplos membros da família com filtros personalizados
- **Relatórios Avançados**: Filtros por período, categoria, membro e muito mais
- **Interface Responsiva**: Experiência otimizada para desktop, tablet e mobile

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18.2.0**: Framework principal para construção da interface
- **TypeScript 5.2.2**: Tipagem estática para maior segurança e produtividade
- **Vite 5.0.8**: Build tool moderno e rápido

### UI/UX
- **Tailwind CSS 3.4.0**: Framework CSS utilitário para estilização
- **Recharts 3.6.0**: Biblioteca de gráficos responsivos
- **Framer Motion**: Animações e transições suaves

### Utilitários
- **date-fns**: Manipulação de datas e formatação
- **crypto/randomUUID**: Geração de IDs únicos

## 🚀 Como Instalar e Executar

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd dashboard-mycash

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### Build para Produção
```bash
# Build otimizado
npm run build

# Preview do build
npm run preview
```

### Lint e TypeScript
```bash
# Verificar código
npm run lint

# Build TypeScript
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (botões, modais, etc.)
│   ├── layout/          # Layout (sidebar, header, main)
│   ├── dashboard/       # Componentes específicos do dashboard
│   └── modals/          # Modais da aplicação
├── contexts/            # Context API para estado global
├── data/               # Dados mock e configurações
├── hooks/              # Hooks customizados
├── pages/              # Páginas/rotas da aplicação
├── types/              # Definições TypeScript
└── utils/              # Utilitários e helpers
```

## 🏗️ Arquitetura e Componentes

### Context API
- **FinancialContext**: Gerenciamento de transações, contas e cartões
- **FilterContext**: Filtros globais (data, tipo, membro, busca)
- **SidebarContext**: Controle da sidebar (expandida/colapsada)

### Componentes Principais

#### Layout
- **MainLayout**: Layout raiz com sidebar e header condicionais
- **Sidebar**: Navegação lateral (desktop only)
- **Header**: Navegação mobile com menu drawer

#### Dashboard
- **BalanceCard**: Saldo total com animação
- **IncomeSummaryCard**: Totais de receitas
- **ExpenseSummaryCard**: Totais de despesas
- **ExpenseCard**: Gráfico de donuts por categoria
- **FinancialFlowChart**: Gráfico de área receitas/despesas
- **TransactionsTable**: Tabela paginada de transações

#### Modais
- **NewTransactionModal**: Cadastro de transações
- **AddAccountModal**: Cadastro de contas/cartões
- **CardDetailsModal**: Detalhes e transações do cartão
- **AddMemberModal**: Cadastro de membros da família
- **FiltersMobileModal**: Filtros avançados mobile

#### Widgets
- **CreditCardsWidget**: Lista de cartões com ações
- **UpcomingExpensesWidget**: Próximas despesas pendentes
- **FamilyMembersWidget**: Seletor de membros da família

### Páginas
- **Dashboard**: Visão geral principal
- **Transactions**: Tabela completa com filtros avançados
- **Cards**: Gerenciamento de cartões
- **Profile**: Perfil do usuário e configurações

## 🎨 Design System

### Cores
- **Primary**: `#D7FF00` (Amarelo-limão vibrante)
- **Secondary**: `#060A11` (Texto principal, botões escuros)
- **Surface**: `#FFFFFF` (Cards, backgrounds)
- **Background**: `#F5F6F8` (Fundo da aplicação)

### Tipografia
- **Inter**: Fonte principal
- **Escala**: xs (12px) → 2xl (24px)
- **Pesos**: Regular (400), Medium (500), Bold (700)

### Espaçamentos
- **Mobile**: px-4 (16px)
- **Tablet**: px-6 (24px)
- **Desktop**: px-8 (32px)

### Bordas e Sombras
- **Border Radius**: sm (8px), md (20px), full (100px)
- **Shadows**: card (0px 4px 4px rgba(0,0,0,0.25))

## 🔧 Utilitários

### Formatação
```typescript
import { formatCurrency, formatDate, groupByCategory } from './utils';

// Formatação monetária
formatCurrency(1234.56) // "R$ 1.234,56"

// Formatação de data
formatDate(new Date()) // "15/01/2024"

// Agrupamento por categoria
groupByCategory(transactions)
```

### Validação
```typescript
import { isValidEmail, isValidCPF, isPositiveNumber } from './utils';

// Validações
isValidEmail('user@example.com') // true
isValidCPF('12345678900') // false (exemplo)
isPositiveNumber(10.5) // true
```

### Cálculos Financeiros
```typescript
import { calculatePercentage, calculateDifference } from './utils';

// Percentuais
calculatePercentage(250, 1000) // 25.0

// Diferenças
calculateDifference(1200, 1000)
// { difference: 200, percentage: 20.0, isIncrease: true }
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: <768px (1 coluna, touch-friendly)
- **Tablet**: ≥768px (2 colunas, layouts híbridos)
- **Desktop**: ≥1280px (3-4 colunas, sidebar visível)
- **Wide**: ≥1920px (largura máxima limitada)

### Mobile-First
- Layout base sempre otimizado para mobile
- Breakpoints evoluem progressivamente
- Sidebar removida completamente em mobile/tablet
- Tabelas viram cards em mobile

## ♿ Acessibilidade

- **WCAG 2.1 AA**: Contraste mínimo 4.5:1
- **Navegação por teclado**: Tab, Enter, Escape, setas
- **Foco visível**: Anéis de foco em todos os elementos
- **ARIA labels**: Descrições para elementos sem texto
- **Semântica**: HTML semântico adequado

## ⚡ Performance

- **Lazy loading**: Componentes carregados sob demanda
- **Memoização**: useMemo para cálculos pesados
- **Virtualização**: Tabelas grandes com paginação
- **Bundle splitting**: Code splitting automático
- **CSS otimizado**: Tailwind purgado automaticamente

## 🔒 Segurança

- **Input sanitization**: Validação em todas as entradas
- **XSS prevention**: React escapa automaticamente
- **CSRF protection**: Tokens em formulários
- **Data validation**: Validações client e server-side

## 🧪 Testes

### Cobertura
- **Utilitários**: Funções críticas (formatação, validação, cálculos)
- **Componentes**: Renderização e interações principais
- **Responsividade**: Breakpoints e layouts
- **Acessibilidade**: Navegação por teclado

### Execução
```bash
# Testes unitários
npm run test

# Testes E2E (futuro)
npm run test:e2e
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build
npm run build

# Deploy do dist/
# Configurar no painel do Netlify
```

## 📈 Roadmap

### Próximas Features
- [ ] Autenticação e autorização
- [ ] Sincronização com APIs bancárias
- [ ] Relatórios avançados em PDF
- [ ] Notificações push
- [ ] Backup e restauração de dados
- [ ] Temas dark/light
- [ ] Multi-idioma (i18n)

### Melhorias Técnicas
- [ ] Testes E2E com Cypress
- [ ] PWA (Progressive Web App)
- [ ] Service Worker para offline
- [ ] Analytics e monitoramento
- [ ] CI/CD pipeline completo

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

### Padrões de Código
- **ESLint**: Configurado para TypeScript/React
- **Prettier**: Formatação automática
- **Husky**: Pre-commit hooks
- **Conventional Commits**: Padrão de mensagens

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas, sugestões ou problemas:

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: contato@mycash.com

---

**MyCash+** - Gerenciando finanças familiares com tecnologia e design modernos. 💰📊✨