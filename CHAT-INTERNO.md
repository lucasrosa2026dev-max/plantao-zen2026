# Chat interno do Plantão Zen

## O que foi incluído no código-fonte

O código web agora contém uma área **Mensagens** com conversas individuais e mantém o fluxo existente de mensagens rápidas para contatos vinculados. Depois de integrar a versão ao site, participantes poderão procurar pessoas pelo nome, iniciar um pedido com uma primeira mensagem e conversar depois que a outra pessoa aceitar.

A conta pode iniciar até **cinco pedidos por hora**; o destinatário pode aceitar ou recusar, e pedidos recusados não podem ser reenviados à mesma pessoa. O texto de cada mensagem é limitado a **2.000 caracteres**. Cada consulta de conversa retorna as **100 mensagens mais recentes**; mensagens anteriores continuam armazenadas, mas a primeira versão ainda não tem paginação para carregá-las. Não há grupos, anexos, áudio, localização nem notificações push.

## Privacidade e controle

A participação no diretório começa **desligada**. Cada conta precisa ativar **Participar do diretório de chat**; ao desligar, a pessoa deixa de aparecer em novas buscas, mas as conversas existentes permanecem acessíveis. A busca exige dois caracteres e revela apenas o nome público do perfil (ou, se ausente, o nome da conta) e um código aleatório de chat (`publicChatId`) exibido no resultado — não expõe e-mail, telefone, `openId` ou informações de cuidado.

Participantes podem bloquear/desbloquear pessoas ou denunciar uma conversa/mensagem. Denúncias ficam em fila acessível somente a administradores em **Mensagens → Denúncias**; a tela administrativa mostra o conteúdo denunciado, não o histórico completo da conversa. Mensagens são texto armazenado no banco já utilizado pelo site. **Não há promessa de criptografia ponta a ponta.** O chat é comunicação entre usuários, não atendimento profissional de saúde nem serviço de emergência. Não envie senhas, dados financeiros ou informações clínicas detalhadas.

Ao excluir os dados de uma conta, o fluxo também remove preferências de descoberta, conversas, mensagens, bloqueios e denúncias relacionadas. A remoção da conversa apaga seu histórico para ambas as pessoas.

## Integração e publicação

As alterações estão somente nesta cópia local do código-fonte fornecido; não houve conexão ao banco de produção nem publicação. As migrações aditivas `drizzle/0005_internal_chat.sql` e `drizzle/0006_chat_integrity_constraints.sql` foram **geradas e validadas localmente, mas não aplicadas**.

Para ativar o recurso, o código precisa ser integrado ao projeto web original, e a equipe responsável deve revisar e aplicar as migrações na ordem indicada pelo processo de implantação do site antes de publicar. O wrapper Android/iOS carrega o site por WebView; portanto, só mostrará o chat após o próprio site receber essa versão. O servidor e o banco separados do starter Mobile continuam vazios e não são usados pelo chat.
