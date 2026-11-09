# Plantão Zen — reformulação visual

Base preservada: `plantao-zen-health-watch-v2-offline`, incluindo autenticação própria, recuperação de senha, TOTP, controles de sessões, privacidade, push e Wear OS.

## O que mudou

- Identidade em verde-petróleo, superfícies claras, tipografia consistente e temas claro/escuro com cores semânticas.
- Navegação em Rotina, Cuidado e Conta. No celular, atalhos fixos e menu completo em diálogo com foco controlado pelo navegador.
- Página inicial com calendário semanal navegável, agenda por dia, próximo plantão, horas previstas, presenças concluídas, contatos, último registro de cuidado e notificações.
- Indicadores de semana calculados com limites locais e recorte dos plantões que atravessam a semana. Plantões cancelados não contam.
- Falha de consulta não aparece como zero ou como confirmação de segurança na página inicial.
- Plantões com indicadores compactos, busca identificada, auditoria em português e acesso direto à data selecionada.
- Formulários, contatos, análises, perfil, chat, segurança, relógio e configurações com identidade uniforme. Gráfico de análises proporcional ao total de registros, sem escala arbitrária.
- Check-in com escolha acessível de humor, feedback de gravação e estados de carregamento/erro. Plano de segurança não abre para edição quando a consulta falha.
- Login, cadastro, recuperação e segundo fator com visual alinhado ao produto. Não altera o mecanismo de recuperação existente por link de e-mail.
- Páginas Sobre, Privacidade e erro 404 em português, com apresentação consistente.
- Carregamento separado das rotas públicas e da aplicação principal.
- Demonstração com cache isolado, consultas desativadas e transporte que rejeita chamadas ao servidor. Plantões e SOS simulados são locais e desaparecem ao recarregar.

## Prévia

Abra `PREVIA-PLANTAO-ZEN.html`. O arquivo inclui CSS e JavaScript e funciona sem backend. Demonstra a página inicial, navegação semanal, alternância de tema, adição de plantão fictício e simulação SOS. Os links para outras páginas ficam bloqueados na prévia local; use o projeto completo autenticado para acessar essas funcionalidades.

Também existe a rota `/demo` no projeto. O aviso de demonstração permanece visível e os dados não contaminam o cache da conta real.

## Validação realizada

- TypeScript sem erros (`tsc --noEmit`).
- Build Vite de produção aprovado, com divisão de rotas.
- Bundle Express aprovado.
- 72 testes Vitest aprovados em 11 arquivos, incluindo 3 novos cenários do resumo semanal.
- 15 verificações de segurança e 18 verificações estruturais do relógio aprovadas.
- Renderização React da demonstração verificada em servidor com rota de teste; agenda e identificação dos dados fictícios presentes.
- Prévia HTML autônoma gerada com JSX automático, CSS e JavaScript incorporados.

O script de verificação de segurança passou a resolver TypeScript pelas dependências do projeto, sem exigir instalação global.

## Limites desta entrega

Não houve publicação, mudança de banco, configuração Firebase/SMTP ou envio real de notificações. Não foi gerado APK/IPA nem compilado ou homologado o módulo Wear OS. As limitações de integração da base continuam descritas nos documentos existentes.

O Chromium do ambiente recusou iniciar por restrição de sistema. Assim, a revisão visual em navegador real, acessibilidade com leitor de tela e testes de ponta a ponta em dispositivos continuam pendentes. O build e a renderização de componentes não substituem essas verificações.

O aviso de privacidade mantém os campos operacionais pendentes da base. O envio de e-mails depende da configuração real do servidor; esta entrega não ativa o Gmail citado na conversa.
