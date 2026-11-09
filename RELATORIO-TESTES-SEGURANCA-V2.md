# Relatório técnico: Segurança v2 — 06/11/2026

## Verificações executadas
- Parsing de TODOS os arquivos TS e TSX do projeto com TypeScript global: **sem erros de sintaxe**.
- Testes isolados de TOTP (vetor RFC 6238, janela válida e bloqueio de replay), Base32, geração de segredo, criptografia AES-GCM e rejeição de ciphertext adulterado: **8 asserções passaram**.
- Migração SQL 0010 escrita e novo snapshot gerado para compatibilidade com migrações subsequentes. **Não executada no MySQL**.
- Validação do ZIP: verificação de integridade em arquivo compactado ao finalizar pacote.

## Pendentes / não realizados
- `npm run check`: **bloqueado**, faltam tipos `node` e `vite/client` (node_modules não instalado).
- Instalação npm: **bloqueada**, registro npm indisponível (EAI_AGAIN).
- Vitest, build Vite, migração com banco, e-mails reais, carga e testes de invasão: **não executados**.
- A auditoria de permissões de todos os endpoints e a criptografia dos campos médicos **não foram concluídas**.

## Segurança operacional
A recuperação envia link por e-mail somente com RESEND_API_KEY e PASSWORD_RESET_FROM, não código numérico. TOTP requer TOTP_ENCRYPTION_KEY de 32 bytes. Não publicar antes de aplicar a migração, testar os fluxos e documentar procedimento de recuperação de conta com TOTP perdido.

**Resultado:** implementação preparada para homologação, **não validada para produção**.
