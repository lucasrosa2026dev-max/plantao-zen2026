# Plantão Zen — pacote completo

Inclui código React/TypeScript, servidor Express/tRPC, migrações MySQL, fontes Android/iOS/Wear OS, testes e prévias HTML. O visual aprovado e as correções da rodada de 96 testes estão presentes.

## 1. Subir no GitHub

1. Extraia o ZIP. Abra a pasta `plantao-zen` no VS Code.
2. Crie um repositório vazio no GitHub; mantenha-o privado durante a preparação.
3. Envie os arquivos da pasta, incluindo `package.json`, `pnpm-lock.yaml`, `client`, `server`, `shared`, `drizzle` e as configurações da raiz.

Se usar o terminal, dentro de `plantao-zen`:

```bash
git init
git add .
git commit -m "Adiciona Plantao Zen com interface profissional"
git branch -M main
# Substitua SEU-USUARIO e SEU-REPOSITORIO pelos dados reais.
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

O `.gitignore` exclui credenciais locais, dependências e builds. Não inclua `.env`, chaves de serviço ou arquivos de assinatura. `.env.example` contém somente exemplos e campos vazios.

## 2. Executar no Windows

Instale Node.js 22 e use pnpm 10.18.0. Abra o terminal PowerShell na pasta do projeto:

```powershell
corepack enable
corepack prepare pnpm@10.18.0 --activate
pnpm install --frozen-lockfile
Copy-Item .env.example .env
```

Edite `.env`: configure `DATABASE_URL` para seu banco de teste e mantenha `APP_URL=http://localhost:3000` para acesso local. Depois:

```powershell
pnpm db:migrate
pnpm dev
```

Abra `http://localhost:3000`. Use o cadastro normal para criar sua conta de teste.

## 3. Colocar a aplicação no ar

Subir código no GitHub não hospeda automaticamente esta aplicação. Ela precisa de um serviço que execute Node.js, banco MySQL e HTTPS. GitHub Pages sozinho não executa seu servidor nem sua autenticação.

Na hospedagem, a raiz da aplicação é a pasta que contém `package.json`:

- Instalação: `pnpm install --frozen-lockfile`.
- Build: `pnpm build`.
- Inicialização: `pnpm start`.
- Porta: variável `PORT`, padrão 3000.
- Variáveis obrigatórias em produção: `DATABASE_URL` e `APP_URL=https://seu-dominio`.
- Migrações: `pnpm db:migrate`, primeiro em homologação; faça backup antes de atualizar um banco existente.
- Backend e frontend devem usar a mesma origem pública. Encaminhe as rotas para o servidor Node.
- Configure `TRUST_PROXY_HOPS` conforme o proxy real da hospedagem.

E-mail de recuperação exige as variáveis Resend do `.env.example` e remetente verificado. O endereço Gmail informado na conversa não foi ativado como remetente. TOTP exige `TOTP_ENCRYPTION_KEY` estável; não regenere essa chave em cada deploy.

Firebase/push e dispositivos permanecem opcionais e dependem de configuração. Este pacote contém os fontes nativos, não APK/IPA assinados.

## 4. Prévias e validação

- `PREVIA-COMPLETA.html`: 18 telas navegáveis, sem chamadas externas nem gravação.
- `PREVIA-PLANTAO-ZEN.html`: demonstração da página inicial com algumas simulações locais.
- `pnpm build:preview:full`: recompila a prévia completa na raiz do projeto.
- `pnpm check`, `pnpm test`, `pnpm build`: validações do código.
- `VALIDACAO-FLUXOS.md`: resultados e limites dos 96 testes aprovados.

A homologação completa com MySQL, navegador real, e-mail e dispositivos ainda é necessária. O site existente não foi alterado.
