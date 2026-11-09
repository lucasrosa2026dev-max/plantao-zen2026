# Plantão Zen Health — Integração Wear OS (primeira versão)

## Escopo

Foi criada uma integração **real de código**, não um APK compilado: o servidor REST usa token independente revogável; a interface web gera código temporário de pareamento e permite revogar relógios; o protótipo Android Wear OS permite consultar plantões, visualizar alertas, conferir e enviar mensagens e registrar entrada/saída, reutilizando as mesmas regras do backend.

**Não cobre todos os relógios.** Exige Wear OS com Android API 30+, acesso à rede e SDK compatível; modelos proprietários, Garmin, Amazfit, Huawei não Wear OS e Apple Watch precisarão de clientes próprios. Para Wear OS, a comunicação direta por HTTPS é apropriada (https://developer.android.com/training/wearables/data/network-communication).

## Estrutura

- `server/watch.ts` — rotas REST `/api/watch/pair`, `/api/watch/v1/*` e procedimentos tRPC `watch.*`.
- `client/src/components/WatchPairing.tsx` — pareamento e revogação dentro da página `/smartwatch`.
- `drizzle/schema.ts` + `drizzle/0011_watch_integration.sql` — registros temporários e tokens associados aos dispositivos.
- `wear-os/` — **projeto Android Studio separado**. Não misturar com o aplicativo Android Capacitor em `android/`.

## Rotas

| Endpoint | Autorização | Função |
|---|---|---|
| `watch.beginPairing` (tRPC) | sessão web | obtém código de 8 dígitos válido por 5 minutos |
| `watch.devices` (tRPC) | sessão web | lista dispositivos vinculados (sem credenciais) |
| `watch.revoke` (tRPC) | sessão web | revoga dispositivo do titular |
| `POST /api/watch/pair` | código temporário + limite por IP | troca código por token de 30 dias, sem cookies |
| `GET /api/watch/v1/shifts` | Bearer | escalas do titular, sem dados financeiros |
| `POST /api/watch/v1/attendance` | Bearer | check-in/check-out do plantão do titular; horário do servidor |
| `GET /api/watch/v1/conversations` | Bearer | lista de conversas permitidas |
| `GET /api/watch/v1/messages/:id` | Bearer | conversa apenas se for participante permitido |
| `POST /api/watch/v1/messages` | Bearer | enviar mensagem com as regras do chat existente |
| `GET /api/watch/v1/alerts` | Bearer | títulos de alertas, sem corpo/observações médicas |
| `POST /api/watch/v1/unpair` | Bearer | revoga o próprio token |

O hash SHA-256 do token, não o valor em claro, é armazenado em MySQL. Cada token está associado ao usuário e à revogação/expiração, e o relógio salva o token criptografado no Android Keystore (AES-GCM). A autorização de escalas e chat é feita pelos procedimentos tRPC originais. Excluindo a conta, são excluídos os dispositivos e códigos de pareamento.

## Migração

1. Faça **backup testado** do banco de homologação.
2. Configure `DATABASE_URL` para **homologação** e execute `pnpm db:migrate` depois de instalar as dependências com `pnpm install --frozen-lockfile`.
3. Confirme as tabelas `watch_pairings` e `watch_devices`. Não execute SQL manualmente em produção sem verificar o histórico de migrações aplicado no banco.
4. Execute `pnpm check`, `pnpm test`, `pnpm build` e testes com dois usuários em MySQL.
5. Configure `APP_URL` para a origem HTTPS pública do Plantão Zen; utilize HTTPS válido e habilite proteção de taxa distribuída no proxy/API Gateway.
6. Abra a página Smartwatch autenticado, gere código e digite no app do relógio juntamente com a URL HTTPS.
7. Cadastre plantão, registre entrada, saída, envie mensagem entre dois usuários, verifique negação de acesso a conversa e plantão de terceiros, revogue o relógio e confirme que o token passa a receber HTTP 401.

## Segurança e restrições

- API do relógio não utiliza cookies; exceção da checagem de `Origin` vale **somente** para `/api/watch`, exigindo Bearer ou pareamento por código. Nunca use essa exceção para rotas com cookie de sessão.
- O controle de tentativas de pareamento em memória é **por instância/IP**. Em hospedagem distribuída deve ser substituído/composto por rate limit em Redis/edge, limite de tentativas global e monitoramento de fraude.
- A presença é atribuída ao titular e usa horário do **servidor**. Ainda não verifica proximidade física, biometria, GPS, geofencing nem NFC. Não deve servir como ponto legal ou certificação de presença sem controles adicionais.
- A versão nativa atual consulta alertas enquanto a tela está **aberta**, a cada 60s. **Não entrega push confiável em segundo plano**, nem confirma recebimento/vibração de alerta de emergência. Para a próxima etapa integrar Firebase Cloud Messaging (FCM), registro e limpeza de token, roteamento das notificações, preferências e testes em aparelho, com plano de contingência. O Wear OS recomenda FCM em vez de polling frequente para alertas (Android Developers).
- Não há app watchOS/Apple Watch neste pacote.
- A interface é propositalmente minimalista, feita com Views Android nativas. Para uma UX de produção, migrar para Compose for Wear OS com layouts adaptados a telas circulares.
- O primeiro pareamento exige a sessão web no navegador, mas depois o relógio acessa o servidor diretamente, mesmo sem um app de celular dedicado, desde que a rede funcione.
- Nenhum dado foi migrado ou aplicado a servidores de produção neste ambiente.

## Aceite mínimo para publicação

**Pendente:** instalar dependências, compilar projeto web/backend, compilar Wear OS com Android SDK/Gradle, aplicar migration em MySQL de homologação, rodar testes integrados de autorização, rede offline/reconexão, acessibilidade e bateria; validar LGPD quanto a exposição de notificações na tela bloqueada. Não publicar antes disso.
