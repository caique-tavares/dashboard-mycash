# mycash+ — Documentação
## Progresso
- [x] PROMPT 0: Análise e Planejamento Inicial
- [x] PROMPT 1: Estrutura
- [ ] PROMPT 2: Layout Desktop
---
## PROMPT 0: Análise e Planejamento Inicial
Status: ✅ | Data: 18/01/2026 | Build: N/A (análise teórica)
### Análise do Figma
**Arquivo:** Workshop - Do figma MCP ao Cursor AI v.3 (Community)  
**Node ID:** 30-368 (home-dashboard)  
**Link:** https://www.figma.com/design/hrO8DbGwKlflynXPneax2S/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community-?node-id=30-368

### Tokens Identificados no Figma

#### Cores Semânticas (do Design System)
- `Colors/Background/background-400`: `#F5F6F8` (fundo da página)
- `Colors/Surface/surface-500`: `#FFFFFF` (superfície de cards, sidebar)
- `Colors/Primary/primary-500`: `#D7FF00` (cor primária - amarelo/verde vibrante)
- `Colors/Secondary/secondary-900`: `#060A11` (texto principal, botões escuros)
- `Colors/Secondary/secondary-50`: `#E7E8EA` (bordas, elementos secundários)

#### Cores Adicionais Encontradas
- `stroke_4PD1QC`: `#E5E7EB` (bordas de cards)
- `fill_AN4W7D`: `#080B12` (texto escuro)
- `fill_7BUOF2`: `#C4E703` (verde claro - gráficos)
- `fill_AWNPQ8`: `#2A89EF` (azul - saldo positivo)
- `fill_TLMKWS`: `#15BE78` (verde - receitas)
- `fill_MUDLK6`: `#E61E32` (vermelho - despesas)
- `stroke_NG5QA6`: `#9CA3AF` (bordas de inputs)
- `fill_W3RSY5`: `#D1D5DB` (cinza médio)
- `fill_BSKG3K`: `#D9D9D9` (cinza claro)

#### Tipografia (Text Styles)
- `Label/Large`: Inter, 600, 18px, 1.33em, 1.67% letter-spacing
- `Label/Medium`: Inter, 600, 16px, 1.25em, 1.88% letter-spacing
- `Label/Small`: Inter, 600, 14px, 1.14em, 2.14% letter-spacing
- `Label/X-Small`: Inter, 600, 12px, 1.33em, 2.5% letter-spacing
- `Paragraph/Small`: Inter, 400, 14px, 1.43em, 2.14% letter-spacing
- `Paragraph/Large`: Inter, 400, 18px, 1.56em, 1.67% letter-spacing
- `Paragraph/X-Small`: Inter, 400, 12px, 1.67em, 2.5% letter-spacing
- `Heading/Medium`: Inter, 700, 28px, 1.29em
- `Heading/Small`: Inter, 700, 24px, 1.33em
- `Heading/X-Small`: Inter, 700, 20px, 1.4em

#### Espaçamento (Auto Layout)
- Gap padrão: 8px, 12px, 16px, 18px, 20px, 24px, 32px, 50px, 56px, 118px
- Padding: 4px, 12px, 16px, 24px, 32px
- Sidebar: width 300px (expandida), padding 32px, gap 118px (vertical), 56px (entre seções)

#### Border Radius
- `100px`: Botões, avatares, inputs arredondados
- `20px`: Cards principais
- `8px`: Elementos pequenos

#### Shadows
- `effect_QVGP7X`: `0px 4px 4px 0px rgba(0, 0, 0, 0.25)` (sombra de cards)

### Componentes Identificados
1. **Sidebar** (30:1516) - Estados: open/closed
2. **Logo** (30:1472) - Variante: Default
3. **btn-sidebar** (30:1422) - Variantes: active/Default
4. **Members** (30:1488) - Variantes: pai, mãe, add
5. **search** (42:2926) - Variantes: navbar, table
6. **cards** (40:2539) - Variantes: nubank, inter, picpay
7. **check** (42:2857) - Property 1: Default
8. **Btn** (33:2321) - Property 1: Default

### Estrutura de Layout
- **Container principal**: 1728x1631px
- **Sidebar expandida**: 300px width, 1631px height
- **Main content**: Flex column com gap 32px, padding 12px 32px
- **Grid de cards**: Row layout com gap 18px, 20px, 24px

### Conversões Necessárias (Valores Hardcoded → Tokens)
- `#F5F6F8` → `--color-background-400` ou primitiva equivalente
- `#FFFFFF` → `--color-surface-500` ou primitiva `--white`
- `#D7FF00` → `--color-primary-500` ou primitiva `--yellow-500`
- `#060A11` → `--color-secondary-900` ou primitiva `--gray-900`
- `#E5E7EB` → Primitiva `--gray-200` (bordas)
- `#080B12` → Primitiva `--gray-900` (texto)
- `#E61E32` → Primitiva `--red-500` (erro/despesas)
- `#15BE78` → Primitiva `--green-500` (sucesso/receitas)
- `#2A89EF` → Primitiva `--blue-500` (info/saldo)

### Arquitetura Proposta
```
src/
├── components/
│   ├── common/          # Button, Input, Modal, etc.
│   ├── layout/          # Sidebar, Header, Navigation
│   ├── pages/           # Dashboard, Cards, Transactions, Profile
│   └── ui/              # UI primitives
├── styles/
│   ├── tokens.css       # Design tokens (semânticos + primitivos)
│   ├── components.css    # Estilos de componentes
│   └── themes.css       # Variantes de tema
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── types/               # TypeScript types
└── contexts/            # React contexts
```

---
## PROMPT 1: Estrutura Base
Status: ✅ | Data: DD/MM | Build: ✅ (1 tentativa)
### Implementado
- Estrutura de pastas
- Componentes base
### Tokens
Semânticas: --color-bg, --spacing-page  
Primitivas: --gray-100, --spacing-md  
Conversões:
- #FAFAFA → --gray-50
- 28px → --spacing-lg
### Build
Tentativas: 1 | Erros: 0

🧠 Checklist Mental Pré-Execução
□ Rules relidas
□ Figma consultado
□ Auto Layout entendido
□ Hierarquia de variáveis definida
□ Conversões mapeadas


✅ Fazer | ❌ Não Fazer
DEVE
Reler rules antes de cada prompt
Consultar Figma antes de cada prompt
Seguir hierarquia: semântica → primitiva → conversão
Documentar TODAS conversões
Build antes de commit
Aguardar aprovação entre prompts
NÃO DEVE
Commit sem build OK
Usar hardcoded quando existir variável
Pular hierarquia
Avançar sem aprovação
Implementar fora do escopo

▶️ Primeira Ação ao Receber Prompts
📋 [N] prompts recebidos
[ ] PROMPT 0: Análise
[ ] PROMPT 1: Estrutura
...
Iniciando execução congelada.

✅ Confirmação Obrigatória
Responda exatamente:
🤖 Modo Semi-Autônomo ATIVADO

Fonte de verdade: Figma
Hierarquia: semântica → primitiva → conversão
Build obrigatório antes de commit
Nunca usar hardcoded
Pronto para receber todos os prompts.
