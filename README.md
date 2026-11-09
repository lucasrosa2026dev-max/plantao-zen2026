# Plantão Zen — interface profissional

Aplicação React/TypeScript com servidor Express/tRPC, MySQL e login próprio por e-mail e senha. Inclui contatos, análises cadastradas, plantões, check-ins, plano de segurança, chat e recursos de emergência. A demonstração continua separada dos dados reais.

Comece por `COMECE-AQUI.md` para subir o código no GitHub e preparar a hospedagem.

## Prévia do novo visual

Abra `PREVIA-COMPLETA.html` para navegar pelas 18 telas, com dados fictícios e gravação desativada. Gere novamente com `pnpm build:preview:full`. Esta prévia é isolada; a aplicação normal continua usando o servidor real.

Abra `PREVIA-PLANTAO-ZEN.html` no navegador para explorar a página inicial com dados fictícios, agenda semanal, tema claro/escuro e simulações locais. Não exige instalação, servidor ou Firebase. A prévia não autentica, não envia mensagens e não aciona emergências.

A versão completa redesenha as telas internas e mantém o backend, o login, o segundo fator e os módulos nativos da base recebida. Consulte `REDESIGN-PROFISSIONAL.md` para mudanças, validação e limites. Para atualizar a prévia após editar o projeto: `pnpm build:preview`.

## Verificação mais recente

Consulte `VALIDACAO-FLUXOS.md`: 96 testes aprovados e correções no aceite de convites bloqueados, recuperação de acesso e erros do chat. A homologação com MySQL e navegador reais continua pendente.

## Executar localmente

Requisitos: Node.js 22, pnpm 10.18 e MySQL compatível com as migrações Drizzle.

```bash
corepack enable
corepack prepare pnpm@10.18.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env
# Edite DATABASE_URL para um banco criado e autorizado.
pnpm db:migrate
pnpm dev
```

Abra http://localhost:3000 e escolha **Criar uma conta**. A aplicação completa exige banco e servidor. `dev:static` e `build:static` servem apenas para visualizar a interface; não substituem o backend.

## Hospedar

1. Faça backup do banco, incluindo o histórico de migrações. Valide primeiro em uma cópia de homologação.
2. Configure DATABASE_URL e APP_URL=https://seu-dominio na hospedagem. APP_URL deve apontar para a origem pública exata, sem caminho. Não use prefixo VITE_ para segredos.
3. Execute `pnpm db:migrate`, `pnpm check`, `pnpm test` e `pnpm build`.
4. Execute `pnpm start` com HTTPS no proxy e encaminhe todas as rotas ao mesmo servidor. `/api/health` retorna 503 se o banco falhar.
5. Se houver proxy, configure TRUST_PROXY_HOPS com o número exato de saltos confiáveis e bloqueie acesso direto ao servidor. Sem isso, o limite de login poderá agrupar todos os clientes pelo IP do proxy.

O Dockerfile empacota a aplicação. Banco, TLS, backup e migrações precisam ser configurados separadamente. O worker de push opcional precisa de processo continuamente ativo. O limite de login é local ao processo: em múltiplas réplicas, aplique também um limite compartilhado no proxy ou gateway.

## Contas, segurança e migração

- Senhas de 12 a 128 caracteres, protegidas com scrypt e salt aleatório.
- Sessões opacas de sete dias; apenas o hash do token fica no banco. Cookie HttpOnly, SameSite=Lax e Secure em produção. Logout revoga a sessão no servidor.
- Operações HTTP de escrita exigem Origin igual à origem pública; não há CORS aberto nem login por token em sessionStorage.
- Novos cadastros não recebem perfil administrador. Não há verificação de e-mail nem login social. A recuperação por link de e-mail exige configurar RESEND_API_KEY, PASSWORD_RESET_FROM e APP_URL.
- A migração **0009_standalone_auth.sql** acrescenta credenciais e sessões; não remove contas nem seus registros. Nunca regenere migrações já aplicadas com `db:push`.
- Contas existentes mantêm seus IDs e dados, mas precisam receber uma senha própria. Não crie outra conta para substituir a antiga e não associe identidades apenas pelo e-mail informado pelo visitante.

### Recuperar ou habilitar uma conta existente

Um administrador com acesso ao servidor deve confirmar a identidade do titular por um canal confiável e consultar o ID da conta correta no banco. O utilitário abaixo mantém o ID e os dados, impede uso de e-mail já associado a outra conta e encerra todas as sessões anteriores. Ele não promove permissões.

Em Bash no servidor, com DATABASE_URL configurada:

```bash
export ACCOUNT_USER_ID=123
export ACCOUNT_EMAIL='pessoa@example.com'
read -r -s -p 'Nova senha (mínimo 12 caracteres): ' account_password
printf '\n'
printf '%s' "$account_password" | pnpm exec tsx scripts/account-access.ts
unset account_password ACCOUNT_USER_ID ACCOUNT_EMAIL
```

Os valores de ID e e-mail são exemplos: substitua pelos dados verificados. Não coloque senhas em comandos literais, arquivos versionados ou tickets. Este utilitário é uma alternativa administrativa à recuperação por e-mail e requer verificação da identidade do titular.

## Android, iOS e desktop

`capacitor.config.ts` usa APP_URL como endereço do servidor HTTPS. Não há endereço de hospedagem embutido. Defina a variável ou ajuste o .env antes de executar:

```bash
pnpm build
pnpm exec cap sync android
pnpm exec cap open android
```

Android: JDK 21 e SDK 36; configure assinatura no ambiente nativo. Para iOS, em macOS com Xcode: `pnpm exec cap sync ios` e `pnpm exec cap open ios`, configurando equipe e assinatura. O desktop também exige APP_URL HTTPS. A sincronização gera novamente os assets e a configuração nativa; arquivos gerados antigos foram retirados do pacote.

Não foi gerado novo APK/IPA nem substituído aplicativo instalado. Login exige conexão com o servidor. Os aplicativos existentes continuarão apontando para o endereço com que foram compilados até receberem uma nova versão.

## Integrações opcionais

Firebase/push foram preservados e permanecem desativados enquanto as variáveis FCM estiverem vazias. Veja ATIVAR-PUSH-COLMI.md quando for retomar essa etapa. O arquivo Android google-services.json não é uma chave privada de servidor.

Adaptadores de IA, mapas, armazenamento remoto e avisos ao proprietário que não eram usados pelos fluxos do produto foram retirados. Não há provedor de IA configurado: análises cadastradas e o assistente demonstrativo não são diagnóstico automatizado.

## Validação desta entrega

- TypeScript, testes automatizados e build web/servidor executados.
- Testes de senha, normalização, cookies, limitação de tentativas, bloqueio de origem e respostas HTTP sem banco incluídos.
- Compilação gera aviso de bundle JavaScript acima de 500 kB; divisão por rotas é uma melhoria futura.
- Sem acesso ao banco real, não foram executados migração nem ciclo completo de cadastro/login com MySQL. A migração deve ser homologada antes da publicação.
- Publicação, compilação nativa, push real e teste em aparelho não foram executados. Esta entrega altera o código-fonte, não o site já publicado.

## Nova experiência de acesso — 06/11/2026

Login e cadastro receberam layout próprio, com painel verde, formulário claro e adaptação por largura de tela. O componente fica em `client/src/pages/LoginScreen.tsx` e o estilo em `client/src/pages/login.css`.

Inclui mostrar/ocultar senha, confirmação no cadastro, aviso de Caps Lock, estados de envio, timeout de rede, mensagens por tipo de falha e foco na mensagem de erro. Os campos usam preenchimento automático e o formulário mantém os endpoints de autenticação existentes. Alternar entre login e cadastro limpa o estado da senha. A ajuda de recuperação informa o procedimento administrativo já disponível, sem simular envio de e-mail.

A agenda do painel é uma ilustração identificada como exemplo. A demonstração e a página Sobre continuam acessíveis pelos links.

Validação: TypeScript e builds aprovados. A inspeção visual e os testes de interação no navegador não puderam ser executados neste ambiente; conferir login/cadastro em desktop e celular antes de publicar. Não houve alteração no banco ou no site publicado.

## Segurança v2 e recuperação de acesso

Consulte **[SEGURANCA-V2-IMPLANTACAO.md](./SEGURANCA-V2-IMPLANTACAO.md)** para configurar 2FA, envio de recuperação de senha, migrações e testes. As novas rotas exigem a migração `0010_security_v2.sql` antes do deploy.
