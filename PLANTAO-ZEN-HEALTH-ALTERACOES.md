# Plantão Zen Health — atualização incremental

## Implementado neste pacote
- Identidade hospitalar verde-petróleo, azul clínico e verde suave aplicada às variáveis globais.
- Tela de gestão de plantões sem campos, cartões, cálculos ou exportações financeiras.
- API de cadastro de plantões não recebe mais valor por hora; grava zero somente para compatibilidade com esquema existente.
- CSV de escalas agora exporta presença (check-in/check-out) em vez de valores.
- Mantidas as rotas e os módulos originais de segurança, SOS, chat, perfil e smartwatch.

## Atenção ao banco
O campo legado `hourlyCents` permanece no esquema do banco para evitar migração destrutiva. Dados financeiros anteriores não são apagados automaticamente; revise retenção e exclusão antes de publicar.

## Próximas integrações (não implementadas neste pacote)
Assistente Zen AI, notificações push reais, relógio nativo, central de operações em tempo real, mapa de segurança ampliado, relatórios PDF/XLSX e políticas avançadas de auditoria. Exigem integração, testes, permissões e serviços externos.

## Validação
Executar `pnpm install`, `pnpm check`, `pnpm test` e `pnpm build`, com variáveis de ambiente e banco configurados. Não publicar sem verificar os fluxos de SOS, autenticação e privacidade.
