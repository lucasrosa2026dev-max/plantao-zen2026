# Validação de fluxos — 9 de novembro de 2026

## Resultado

96 testes Vitest aprovados, em 15 arquivos. TypeScript e builds de frontend/servidor aprovados. Também passaram 15 verificações de segurança e 18 verificações estruturais do relógio.

Esta rodada adicionou 24 testes. Eles não representam uma homologação de ponta a ponta: as rotas HTTP de autenticação foram exercitadas com servidor Express real local, mas a persistência foi simulada; os serviços de chat e o router de plantões usaram respostas de banco controladas. Não há MySQL configurado nem navegador disponível no ambiente desta rodada.

## Correções

1. **Chat / bloqueio de convites:** o destinatário era comparado consigo mesmo na consulta de bloqueios ao aceitar ou recusar um convite. Corrigida a consulta para incluir os dois participantes. Um teste inspecionando os parâmetros SQL falhou antes da correção (`[2,2,2,2]`) e passou após ela (`[2,1,1,2]`). O envio de mensagens já tinha validação própria de bloqueio; essa proteção foi mantida.
2. **Recuperação de acesso:** agora compartilha limite de 20 segundos e bloqueio de envio duplicado com o login; falhas e respostas inválidas não são tratadas como sucesso.
3. **Segundo fator:** uma recusa quando há código TOTP informado orienta a conferir a senha e o código do autenticador, sem atribuir toda falha ao e-mail/senha.
4. **Redefinição de senha:** usa nova senha e confirmação; não exige digitar um e-mail que o endpoint não utiliza. Limpa o estado anterior de autenticação após sucesso.
5. **Mensagens:** erros de consulta aparecem com botão de nova tentativa, em vez de indicar que não existem conversas ou mensagens.

## Cenários adicionais executados

| Área | Cobertura | Dependências substituídas |
| --- | --- | --- |
| Cliente de autenticação | Sucesso explícito; desafio 2FA; resposta inválida; orientação 401; timeout de recuperação | Fetch e relógio no teste de timeout |
| Cadastro HTTP | Cadastro com hash de senha e sessão; duplicidade; indisponibilidade de persistência | Banco |
| Login HTTP | Senha válida/incorreta; ausência de sessão antes do segundo fator | Banco |
| Chat | Envio aceito; conversa pendente/recusada; bloqueio; acesso de não participante; aceite pelo destinatário e recusa do próprio solicitante | Banco |
| Plantões | Criação com auditoria; conflito; edição; filtro de proprietário; entrada/saída; entrada repetida; edição após entrada; cancelamento e recusa de presença após cancelar | Banco |

As novas verificações não comprovam execução de SQL no MySQL, eficácia de locks, rollback, concorrência entre servidores ou aplicação de migrações.

## Para homologar antes de publicar

Em um ambiente de teste com MySQL e HTTPS, usando contas exclusivamente de teste:

- Aplicar as migrações e testar cadastro, entrada, expiração, saída e novo acesso com cookies reais.
- Ativar TOTP; testar código correto, expirado e repetido, além de recuperação de senha com entrega de e-mail real.
- Criar duas contas e verificar isolamento de escalas, edição, conflitos, entrada/saída e auditoria persistente após recarregar.
- Testar convite de conversa, aceite, envio, leitura, recusa e bloqueio entre as duas contas.
- Conferir foco, teclado, menu móvel e temas em navegador desktop e celular.

Não houve publicação, envio de mensagens/e-mails reais, ativação de Firebase ou alteração de banco de produção. O visual aprovado foi preservado.
