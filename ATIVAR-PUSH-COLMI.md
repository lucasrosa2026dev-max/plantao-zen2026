# Plantão Zen — push Android e COLMI Fit

**Configuração Android recebida:** `google-services.json` do projeto `plantao-zen` já foi incluído em `android/app/` e validado para `care.plantaozen.app`. Ainda faltam as credenciais do servidor, a migração e a publicação.

## O que foi implementado

- Cadastro autenticado do token FCM do Android; limite de dez dispositivos por conta.
- Ativação, atualização, desativação e teste na página Smartwatch.
- Notificações de novas mensagens de contato e emergências que já são gravadas na caixa de entrada. Registros já marcados como lidos (como o recibo do remetente) não geram push. Não foram criados lembretes de escalas nem push para o módulo separado de chat.
- Caixa de entrada e fila de push gravadas na mesma transação. Falha do Firebase não desfaz o aviso salvo.
- Worker no processo Node: verifica a fila a cada dez segundos, dez itens por lote, com até cinco tentativas e expiração de cinco minutos. Requer servidor continuamente ativo; não é apropriado depender desse intervalo em hospedagem serverless que suspende o processo.
- Preferência notificationsEnabled respeitada no envio automático. O teste manual é explícito e independe dessa preferência.
- Tokens inválidos removidos, registros sem renovação removidos após trinta dias, histórico da fila removido após sete dias. Abra Smartwatch periodicamente para renovar; o registro também é renovado ao abrir o app com o mesmo usuário.
- Logout revoga o token desse celular antes de encerrar a sessão, e solicita sua remoção no Firebase. Exclusão de conta elimina dispositivos e fila. Itens de conta antiga não são enviados a um dispositivo que mudou de usuário.
- Conteúdo remoto genérico, sem nomes, mensagens privadas ou dados de saúde. Tokens e credenciais não são registrados nos logs. Firebase recebe o token do dispositivo e o texto genérico para entregar o aviso.

O status `accepted` significa que o Firebase aceitou o envio, não que o usuário ou relógio o recebeu. Falhas de rede após a aceitação podem gerar uma repetição; o mesmo ID/tag reduz duplicação visual, mas a entrega não é exatamente uma vez. Um envio já em trânsito pode chegar após logout/desativação. Push não oferece garantia de entrega de emergências.

## 1. Configuração Firebase

1. Crie ou selecione um projeto no Firebase Console.
2. Cadastre nele um aplicativo Android com o identificador **care.plantaozen.app**.
3. Baixe `google-services.json` e coloque em **android/app/google-services.json**. Esse arquivo configura o aplicativo; ele NÃO é a chave privada do servidor.
4. Habilite a Firebase Cloud Messaging API HTTP v1 no projeto.
5. Configure uma conta de serviço autorizada a enviar mensagens FCM, com os privilégios necessários ao projeto. No gerenciador de segredos/variáveis da hospedagem, defina:

```dotenv
FCM_PROJECT_ID=identificador-do-projeto
FCM_CLIENT_EMAIL=email-da-conta-de-servico
FCM_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Não coloque a chave no código, aplicativo, GitHub nem em variáveis `VITE_*`. Configure-a diretamente na hospedagem. Os três valores precisam pertencer à configuração autorizada para o projeto do arquivo Android.

## 2. Banco e publicação

Faça backup do banco e valide a migração em homologação antes de aplicar em produção.

```bash
pnpm install --frozen-lockfile
pnpm db:migrate
pnpm check
pnpm test
pnpm build
pnpm start
```

A migração **0008_android_push.sql** cria somente `pushDevices` e `pushQueue` e índices. Foi gerada pelo Drizzle com snapshot e journal atualizados; não foi aplicada ao banco real nesta entrega. Verifique se a numeração 0008 ainda não foi utilizada por outra alteração no seu ambiente. Não use `db:push` para regenerar migrações já entregues.


Para reverter o código, mantenha as tabelas adicionais até avaliar os dados; não é necessário apagá-las para voltar à versão anterior. Pause o worker removendo as variáveis FCM se precisar interromper novos envios.

## 3. Gerar o Android

Use o projeto **android/** (Capacitor). Defina APP_URL com a origem HTTPS publicada antes de sincronizar.

```bash
pnpm build
pnpm exec cap sync android
pnpm exec cap open android
```

Abra no Android Studio com JDK 21 e SDK Android 36, conforme os arquivos do projeto. Compile o APK no Android Studio. O projeto está em versão **1.3.0, versionCode 4**. Use a mesma chave de assinatura do APK instalado se quiser atualizá-lo sem desinstalação. O backup da chave de teste anterior deve permanecer privado; ele não está neste ZIP.

Não foi gerado um novo APK nesta entrega: a compilação nativa com JDK 21/SDK 36 e a validação em aparelho ainda estão pendentes. Os APKs antigos existentes no ZIP recebido foram omitidos do pacote atualizado para não serem confundidos com esta versão.

## 4. Teste no celular e relógio

1. Instale a nova compilação e faça login.
2. Abra Smartwatch e toque em **Ativar / atualizar registro**. Aceite a permissão Android.
3. Mantenha o relógio conectado ao COLMI Fit. Autorize o COLMI Fit a acessar notificações do Android e habilite Plantão Zen ou Outros aplicativos, caso exista essa opção no modelo.
4. Toque em **Testar envio pelo servidor**. O teste não cria emergência e só enfileira para o token pertencente ao usuário conectado. Há intervalo mínimo de um minuto por dispositivo.
5. Confira primeiro o celular, depois o relógio. Repita com o app em segundo plano e tela bloqueada. Forçar parada do aplicativo e restrições de bateria podem impedir a entrega.
6. Confirme logout e troca de conta: avisos futuros da conta anterior não devem continuar chegando. Não acione emergências reais apenas para testar.

Se chegar apenas ao celular, confira permissões, modo Não Perturbe, bateria e seleção de aplicativos no COLMI Fit. Não há detecção automática de conexão com o relógio. A compatibilidade depende do modelo. O relógio não recebe um app Plantão Zen e não oferece SOS nativo nesta implementação.

## iPhone e navegador

Esta entrega implementa push remoto **somente para Android/FCM**. O Capacitor retorna um token APNs no iOS; ele não pode ser enviado como se fosse token FCM. O servidor e a interface não registram tokens de iPhone. O projeto iOS foi preservado, mas ainda requer implementação APNs, assinatura e testes próprios. As notificações locais do navegador foram preservadas e não equivalem a Web Push com o app fechado.

## Validação

Consulte README.md para a validação desta versão. Push real e testes em aparelho continuam pendentes.

## Referências oficiais

- https://capacitorjs.com/docs/apis/push-notifications
- https://firebase.google.com/docs/cloud-messaging/send/v1-api
- https://firebase.google.com/docs/cloud-messaging/error-codes
