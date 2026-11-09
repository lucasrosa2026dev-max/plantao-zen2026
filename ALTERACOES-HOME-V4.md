# Plantão Zen Health — Home v4

Página inicial modernizada em `client/src/pages/Portal.tsx` com estilos em `client/src/index.css`.

Mantidos: autenticação, consultas tRPC de perfil/contatos/análises/emergência/inbox, ativação de notificações, navegação, smartwatch e fluxo SOS original.

O dashboard não exibe dados fictícios nem valores financeiros. O botão SOS abre a rota existente de emergência.

## Executar
`pnpm install` e `pnpm dev` (configure as variáveis de ambiente existentes).

Valide login, permissões, notificações, chamadas telefônicas e fluxo de emergência em ambiente de testes antes da publicação.
