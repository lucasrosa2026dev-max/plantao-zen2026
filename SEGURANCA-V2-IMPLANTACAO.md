# Plantão Zen Health — Segurança v2 (06/11/2026)

## Implementado neste código

1. Recuperação por **link de uso único**, prazo 10 minutos, 256 bits aleatórios e hash SHA-256 no banco. O fluxo não revela se um e-mail existe. A senha nova invalida todas as sessões existentes, mas **não desativa o 2FA**.
2. Envio por Resend API somente quando configurado no backend. **Não coloque chaves no frontend**. O envio não pode ser testado sem domínio/remetente e chave válidos.
3. Segundo fator opcional TOTP compatível com apps autenticadores. Segredo cifrado AES-256-GCM, chave em variável de ambiente; verificação com tolerância de ±30 s, bloqueio de replay por passo consumido. Configurações > Segurança da conta.
4. Encerramento de outras sessões autenticado por senha. Habilitar 2FA revoga outras sessões.
5. Tabelas próprias para 2FA e recuperação com migração `0010_security_v2.sql`. Exclusão de conta remove ambos os registros.
6. Limitação básica de tentativas por IP, inclusive nas rotas sensíveis, por **instância de servidor**.
7. Testes unitários para TOTP e criptografia em `server/securityV2.test.ts`.

## Configuração obrigatória antes de iniciar versão nova

1. Fazer backup do MySQL e **aplicar migrações**: `pnpm install --frozen-lockfile`, `pnpm db:migrate`.
2. Definir `APP_URL=https://dominio-do-app` e banco de produção com TLS, usuário SQL com mínimos privilégios. Configurar `TRUST_PROXY_HOPS` conforme proxy de confiança.
3. Gerar `TOTP_ENCRYPTION_KEY` com `openssl rand -hex 32`. Guardar em secret manager, não em GitHub ou `.env` enviado a terceiros. **Perda da chave impede autenticação com 2FA dos usuários já configurados.** Rotação requer recifragem planejada.
4. Para recuperação, preencher `RESEND_API_KEY` e `PASSWORD_RESET_FROM` com domínio validado no Resend. Sem configuração, o endpoint devolve resposta genérica, mas **nenhuma mensagem é enviada**.
5. Verificar se o endpoint de produção aceita HTTPS e mantém cookies HttpOnly/Secure/SameSite. Testar os fluxos com duas contas reais em MySQL de homologação.
6. Validar backup/restore, retenção e resposta a incidentes, bem como controlador e canal LGPD no aviso de privacidade.

## Limitações e pontos pendentes

- `pnpm test`, `pnpm check` e `pnpm build` dependem da instalação de `node_modules`, indisponível no ambiente de edição. O sistema **não foi aprovado para produção**.
- A recuperação usa **link seguro por e-mail**, não código numérico. Isso evita os riscos de força bruta de OTP curto. A senha exige no mínimo 12 caracteres.
- **Não há códigos de recuperação 2FA**: caso o usuário perca o autenticador, é necessário um processo de suporte para recuperação de conta com verificação adequada. Não habilitar 2FA em produção sem esse processo.
- Rate limit atual é em memória por instância; ao operar com múltiplas réplicas, substituir por Redis ou proteção no gateway, com limites por conta e IP, e monitoramento.
- Envio de e-mail assíncrono, CAPTCHA, validação de e-mail na criação de conta, inventário e revisão aprofundada das autorizações por endpoint, registros de auditoria imutáveis, criptografia por coluna dos dados de saúde, política de backup e retenção e varredura de dependências ainda **não estão implementados**.
- O sistema só pode ser declarado conforme à LGPD após processos jurídicos e operacionais, não apenas por alterações técnicas.
- Se APP_URL estiver diferente da origem usada no navegador, requisições POST serão bloqueadas pela verificação de origem existente.

## Validação na infraestrutura

```bash
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm check
pnpm test
pnpm build
```

Cenários manuais mínimos: cadastro e login; recuperação válida, reutilizada, vencida e e-mail inexistente; 2FA habilitar, login sem código, com código incorreto, reutilizado e correto; encerrar sessões de outros dispositivos; exclusão LGPD preservando mensagens de terceiros; backup/restore das novas tabelas.

## Complemento v2.1

Exportação de dados e exclusão de conta agora exigem código TOTP de uso único quando o segundo fator está habilitado. Ver `SEGURANCA-V3-VALIDACAO.md` para testes, riscos e checklist.
