# Plantão Zen Health — Dashboard v3

## Entregue
- Nova interface do módulo `/workforce`, inspirada na referência enviada, com identidade própria em azul hospitalar e verde clínico.
- Indicadores circulares de presença e plantões concluídos calculados de registros reais.
- Alertas de conflitos por sobreposição de horários.
- Linha do tempo de escalas por profissional, com busca e seleção de data.
- Lista de profissionais escalados e ações de check-in/check-out.
- Cadastro de plantões, exportação CSV e histórico de auditoria preservados.
- Rotas originais de emergência, contatos, análises, chat, smartwatch e configurações mantidas.
- Nenhum módulo financeiro incluído.

## Limitações
- A linha do tempo mostra a faixa de 07h a 19h; turnos noturnos continuam disponíveis nos dados e na lista, mas exigem uma visualização específica.
- Alertas verificam sobreposição de horários; regras trabalhistas, descanso e disponibilidade exigem configurações adicionais.
- Não há dados fictícios nos indicadores. Sem plantões, o painel apresenta estado vazio.
- Esta entrega não implementa IA generativa, smartwatch nativo nem chat novo.
- Antes de publicar, executar `pnpm install`, `pnpm check`, `pnpm test` e validar com banco configurado.
