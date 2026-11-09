# Plantão Zen — entregas locais do chat e do design

## Chat interno persistente
- [x] **Opt-in e diretório:** preferência para o usuário ativar/desativar participação; apenas usuários aderentes são pesquisáveis. Exibir nome de perfil e código aleatório `publicChatId`; não retornar e-mail, telefone, `openId` nem ID sequencial. Busca com pelo menos 2 caracteres e limite de resultados.
- [x] **Solicitações e conversas privadas:** iniciar conversas 1:1 com participantes do diretório; criar pedido pendente que pode ser aceito/recusado; só enviar mensagens contínuas após aceite. Guardar no banco do site, remetente ligado à sessão autenticada e texto limitado a 2.000 caracteres. Sem grupos nem anexos.
- [x] **Caixa de entrada e histórico:** listar pedidos recebidos/enviados e conversas, carregar até 100 mensagens recentes por consulta sob autorização, marcar leitura e preservar as “Mensagens rápidas” para contatos vinculados.
- [x] **Controles de segurança:** bloquear/desbloquear e denunciar mensagens/conversas; bloquear envio, aceite e leitura; revisão de denúncias apenas por admin. Revalidar autorização, preferências e bloqueios com locks transacionais determinísticos.
- [x] **Exclusão e integridade:** excluir registros de chat e dados de conta numa transação única; chaves estrangeiras com cascata/`SET NULL`; confirmar os dados apagados. Migrações aditivas `0005` e `0006` geradas e validadas sem aplicação a banco.
- [x] **Rotas e experiência:** integrar chat ao portal protegido, navegação móvel, manifesto e interface acessível em português.

## Refinamento visual das telas principais
- [x] **Sistema visual:** identidade compartilhada com azul `#1769aa` como primário, laranja como acento e vermelho para emergência/risco/ações destrutivas; harmonizar superfícies, cartões, botões e campos.
- [x] **Navegação responsiva:** cinco atalhos móveis — Início, Emergência, Contatos, Check-in e Mensagens — mais menu “Mais” para destinos secundários; manter navegação desktop.
- [x] **Estados e acessibilidade:** alinhar foco, rótulos, estados vazios, envio e erro; respeitar tema escuro e movimento reduzido; não declarar sistema online sem verificação real.

## Verificação e entrega
- [x] `pnpm check`, `pnpm test` (15 testes), `pnpm build`, formatação dos módulos de chat e `drizzle-kit check` passaram. O build conclui com um aviso não fatal de chunk JavaScript acima de 500 kB.
- [x] Pacote-fonte atualizado preparado sem `dist`, `node_modules`, credenciais ou vídeos; nenhuma publicação, conexão/aplicação de migração, nem acesso ao banco vazio do starter Mobile.
- [x] Integração pendente no projeto web original: o wrapper WebView e o site ao vivo só exibirão chat/design atualizados depois que este código for integrado e o site publicado.
