# Plantão Zen — módulo profissional integrado

O código original de segurança pessoal foi preservado. Nova rota `/workforce` acessível no menu do Portal.

## Entregue
- Banco MySQL/Drizzle: `work_shifts` e `work_audit`, com isolamento por proprietário autenticado.
- tRPC: listagem, criação com validação de sobreposição e descanso mínimo de 11h (parâmetro técnico, não parecer jurídico), check-in/out e auditoria.
- Tela responsiva com indicadores, cadastro, check-in/out, auditoria e exportação CSV para Excel.
- Integração à navegação existente, mantendo emergências, contatos, chat e smartwatch.

## Instalação
1. Configure o `.env` conforme o README original e providencie MySQL.
2. `pnpm install`
3. `pnpm db:push` (faça backup e revise a migração gerada antes de aplicar em produção).
4. `pnpm dev`
5. Abra `/workforce` com usuário autenticado.

## Limitações e próximas etapas
- O módulo é uma primeira integração funcional, não uma suíte de RH pronta para produção.
- Profissionais são identificados por nome dentro da conta do gestor; falta cadastro vinculado a usuários, organizações e RBAC de gestor/colaborador.
- Check-in/out é administrativo e ainda não valida janela de horário, localização, identidade do profissional ou fraudes; não usar como ponto trabalhista oficial.
- Pagamentos são **estimativas** por duração prevista; não são folha salarial, não calculam horas extras, impostos ou adicionais.
- CSV abre no Excel; geração nativa XLSX/PDF ainda não foi implementada.
- Notificações em tempo real de plantões, chat específico de equipes e IA generativa ainda não estão implementados; chat de segurança original foi preservado.
- Recomenda-se testes de integração com MySQL, migração em staging, revisão de segurança e testes mobile antes da publicação.
