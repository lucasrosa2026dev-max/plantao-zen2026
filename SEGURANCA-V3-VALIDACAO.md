# Plantão Zen Health — Revisão de segurança v2.1

## Alterações realmente efetuadas
- Em `server/privacy.ts`, operações de exportação de dados e exclusão de conta agora fazem *step-up* com TOTP quando o usuário ativou 2FA. A senha ainda é exigida; o passo TOTP é marcado como consumido via UPDATE condicional, impedindo reutilização concorrente.
- Em `client/src/pages/Portal.tsx`, a área LGPD consulta se o 2FA está ativado, solicita o código de 6 dígitos quando necessário e o envia nos pedidos de exportação/exclusão.
- Em `scripts/security-smoke-test.mjs`, testes sem dependências npm verificam vetores TOTP RFC 6238, replay, cifra AES-GCM, presença de validações nas rotas e migração existente. Execute `npm run test:security-smoke`.

## Testes executados neste ambiente
- `node scripts/security-smoke-test.mjs`: PASSOU (15 asserções).
- Verificação de sintaxe com transpileModule do TypeScript global: PASSOU para sete arquivos críticos.
- `tsc --noEmit`: NÃO CONCLUÍDO — faltam tipos/dependências (`node`, `vite/client`).
- `pnpm test`, `pnpm build`, `pnpm db:migrate`: NÃO EXECUTADOS neste ambiente. Registro npm inacessível (`EAI_AGAIN`), não existe servidor MySQL de homologação configurado e não há credenciais externas. **Não executar migração na produção sem backup e homologação.**

## Checklist para implantação após obtenção de ambiente e credenciais
1. Criar cópia do banco e ambiente MySQL de homologação, com dados fictícios.
2. `corepack pnpm install --frozen-lockfile` (ou pnpm equivalente).
3. Configurar `DATABASE_URL`, `APP_URL`, `TOTP_ENCRYPTION_KEY`, `RESEND_API_KEY`, `PASSWORD_RESET_FROM` em secret manager, nunca no Git.
4. `pnpm db:migrate`; confirmar que a migração `0010_security_v2.sql` entrou com sucesso.
5. `pnpm check && pnpm test && pnpm build` e `pnpm test:security-smoke`.
6. Testar manualmente com duas contas: login correto/incorreto; TOTP correto/reutilizado; recuperação com e-mail; exportação/exclusão com TOTP; preservação de mensagens do outro participante; restore do backup.
7. Revisar com profissional responsável bases legais, retenção, controlador, canal do titular, segurança de backups e resposta a incidentes (conformidade LGPD não é garantida somente por código).

## Pendências relevantes
- Criar recuperação segura do 2FA com códigos de recuperação e política de suporte **antes de ativá-lo para todos os usuários**.
- Rate limit compartilhado em Redis/gateway se houver várias instâncias e proteger por conta, além de IP.
- Implementar monitoramento e auditoria persistente sem segredos e dados de saúde.
- Criptografia em repouso para dados médicos, com gestão/rotação de chaves.
- Revisão integral de autorizações e testes dinâmicos de segurança (DAST) em homologação.
