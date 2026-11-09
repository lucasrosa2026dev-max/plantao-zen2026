# Plantão Zen Watch — avanço de homologação (V2)

## Alterações entregues
- Implementado cache offline **somente para visualização de escalas**, cifrado por AES-GCM com chave no Android Keystore.
- Cache válido por 24 horas desde sincronização bem-sucedida; não guarda mensagens nem dados médicos adicionais.
- Em falha de conexão (`IOException`), escala anteriormente sincronizada aparece com aviso explícito de dados potencialmente desatualizados.
- **Check-in e check-out ficam desabilitados offline**; o servidor permanece a autoridade para registro de presença.
- Respostas HTTP 401/403 não ativam modo offline e removem o cache. Desconectar ou parear nova conta também apaga o cache.

## Verificações executadas
- `node scripts/security-smoke-test.mjs`: 15 verificações aprovadas.
- `node scripts/watch-integration-smoke.mjs`: 18 verificações estruturais aprovadas.
- Integridade ZIP verificada.

## Bloqueios e pendências
- Build React/TypeScript: não concluído; npm indisponível para instalação de dependências.
- Build Wear OS: não concluído; sem Android SDK/Gradle wrapper disponível neste ambiente.
- Integração MySQL e testes com relógio/emulador: não executados.
- **Notificações push em segundo plano ainda não foram implementadas**. Polling existente funciona só com app em primeiro plano. Para notificações confiáveis, definir infraestrutura de envio (FCM e/ou integração com telefone), inscrição segura por dispositivo, tratamento de tokens, canais de notificação, deduplicação e restrição de conteúdo sensível.
- Requer revisão de operação: revogação ocorrida enquanto relógio estiver offline só é percebida na próxima conexão ou expiração do cache; avaliar reduzir TTL e limpeza por política corporativa.

## Próxima validação
1. Importar `wear-os/` no Android Studio com SDK 35, compilar e instalar no emulador Wear OS.
2. Parear com banco de homologação e API HTTPS.
3. Sincronizar escala; desconectar Wi-Fi; verificar leitura offline e proibição de check-in.
4. Reconectar, desparear/revogar dispositivo e confirmar que credenciais/cache não dão acesso.
5. Rodar `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm build` com rede e dependências.
