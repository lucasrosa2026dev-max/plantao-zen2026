# Plantão Zen Health — Segurança e LGPD

## Recursos adicionados nesta entrega

- Aviso de privacidade acessível em `/privacidade`, inclusive sem login, com campos de governança explicitamente pendentes.
- Exportação dos dados da conta em JSON na seção **Meu perfil**, mediante nova confirmação da senha. Não exporta hashes de senha, cookies, tokens de sessão ou tokens de notificações push. Somente mensagens enviadas pelo próprio usuário entram no arquivo.
- Exclusão autenticada com senha, frase de confirmação e aviso de irreversibilidade; apaga também registros da gestão de plantões e revoga as sessões do usuário no banco de dados. A rota antiga que permitia exclusão sem confirmação de senha foi bloqueada. A exclusão preserva as mensagens que outros participantes enviaram, remove as mensagens do titular, desativa a comunicação e mantém apenas registro técnico não autenticável para integridade referencial; não elimina backups.
- Cabeçalhos de resposta HTTP contra clickjacking, MIME sniffing e exposição excessiva de referenciador; em produção: HSTS e política CSP inicial.
- Limitação de tentativas por IP nas rotas de confirmação de senha da área LGPD, além do limite já existente no login/cadastro.
- Controles existentes preservados: senhas usando scrypt, sessão com cookie HttpOnly/SameSite, tokens aleatórios com hash SHA-256 no banco, checagem de origem, autenticação de rotas e limitação no login.

## Itens obrigatórios para concluir a LGPD antes de lançamento público

1. Identificar controlador, operador(es), canal de titular e encarregado (se exigido) no aviso.
2. Elaborar mapeamento de dados, finalidades, bases legais distintas para dados comuns e sensíveis, registros de operação e política de retenção/backup.
3. Confirmar os fornecedores de hospedagem, notificações, e-mail, analytics e transferências internacionais de dados; publicar a descrição pertinente.
4. Implementar política e rotina comprovável de expurgo em backups e retenção legal. Exclusão da base ativa não remove backups, arquivos já baixados nem mensagens entregues a terceiros.
5. Criar processo para pedidos de correção, acesso, oposição e revogação quando aplicável, com registro e atendimento.
6. Elaborar avaliação de risco de dados de saúde, gestão de vulnerabilidades, plano de resposta a incidentes, auditoria de acesso e testes com banco real.

## Recomendado para segurança de produção

- Configurar `APP_URL` exclusivamente HTTPS; revisar `TRUST_PROXY_HOPS`, WAF/limites distribuídos e TLS obrigatório no banco de dados.
- Encriptar dados sensíveis em repouso e backups (com gestão de chaves externa); não incluir segredo no código-fonte.
- Considerar MFA, verificação de e-mail e recuperação de senha segura; não há recuperação por e-mail implementada nesta entrega.
- Conduzir revisão de autorização por entidade/endpoint, SAST/DAST, análise de dependências e teste de penetração autorizado.
- Revisar a CSP inicial conforme recursos externos efetivamente usados para não quebrar funcionalidades no deploy.
- Notificações e históricos devem ser classificados e ter retenção específica, conforme exigência operacional.

## Limites de validação

As alterações foram feitas em código-fonte. Não foram executados build, testes automatizados com dependências instaladas, migrações nem testes em ambiente de produção neste ambiente. Não há certificação ou garantia de conformidade legal ou de ausência de vulnerabilidades.

## Correção de integridade do chat (novembro de 2026)

- As conversas não são apagadas por cascata durante a exclusão de conta.
- Mensagens do titular são eliminadas; mensagens enviadas por terceiros permanecem acessíveis ao outro participante.
- O registro mínimo do titular passa a `loginMethod=deleted`, sem senha, sessão, e-mail, nome identificável ou vínculo OpenID; o ID numérico permanece para chaves estrangeiras.
- Conversas pendentes são encerradas; envio e aceitação de pedidos envolvendo uma conta excluída são recusados pelo servidor.
- Atenção: mensagens escritas por terceiros podem conter referências ao titular e exigir tratamento jurídico independente; retenção de relatórios de moderação e outros vínculos deve ser definida em política específica.
- Executar teste de integração contra uma base MySQL de homologação com duas contas, antes de publicar.
