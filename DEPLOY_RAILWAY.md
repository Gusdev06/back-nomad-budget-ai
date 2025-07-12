# Deploy no Railway

Este guia explica como fazer deploy do projeto no Railway.

## Problema Resolvido

O projeto estava falhando no deploy porque:
- ❌ Railway estava usando Node.js 18
- ❌ Dependência `file-type` desnecessária estava causando conflitos
- ❌ Não tinha configuração específica para Node.js 20

## Soluções Implementadas

### 1. Dependência Removida
```bash
yarn remove file-type
```

### 2. Arquivos de Configuração Criados

#### `.nvmrc`
```
20
```

#### `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ["nodejs_20", "yarn"]

[phases.install]
cmds = ["yarn install --frozen-lockfile"]

[phases.build]
cmds = ["yarn run build"]

[start]
cmd = "yarn run start:prod"
```

#### `package.json` (engines adicionado)
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=8.0.0"
  }
}
```

#### `Dockerfile` (alternativa)
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN yarn run build
EXPOSE 3000
CMD ["yarn", "run", "start:prod"]
```

## Configuração no Railway

### 1. Variáveis de Ambiente

No Railway, configure as seguintes variáveis:

```env
DATABASE_URL=postgresql://username:password@hostname:port/database
DIRECT_URL=postgresql://username:password@hostname:port/database
NODE_ENV=production
PORT=3000
```

### 2. Configuração do Banco de Dados

1. **Adicionar PostgreSQL Plugin** no Railway
2. **Copiar a URL do banco** para `DATABASE_URL`
3. **Usar a mesma URL** para `DIRECT_URL`

### 3. Deploy

1. **Conectar repositório GitHub** ao Railway
2. **Configurar variáveis de ambiente**
3. **Deploy automático** será executado

## Comandos de Build

O Railway executará automaticamente:

```bash
yarn install --frozen-lockfile
yarn run build
yarn run start:prod
```

## Verificação

Após o deploy, verifique:

- ✅ Aplicação rodando na porta 3000
- ✅ Rotas da API funcionando
- ✅ Conexão com banco de dados
- ✅ Migrações do Prisma aplicadas

## Troubleshooting

### Erro de Node.js
Se ainda houver erro de versão do Node.js:
- Verifique se o `nixpacks.toml` está no root do projeto
- Confirme que não há `.node-version` conflitante

### Erro de Prisma
Se houver erro no Prisma:
```bash
npx prisma db push
```

### Erro de Dependências
Se houver erro de dependências:
```bash
yarn install --frozen-lockfile
```

## Monitoramento

Acesse os logs do Railway para monitorar:
- Processo de build
- Início da aplicação
- Logs de runtime
- Erros de conexão

## Endpoints da API

Após deploy, teste os endpoints:

```
GET    /users
POST   /users
GET    /users/:id
GET    /users?email=email@example.com
PATCH  /users/:id
DELETE /users/:id
PUT    /users/:id/plan/:planId
DELETE /users/:id/plan

GET    /plans
POST   /plans
GET    /plans/:id
GET    /plans/available
PATCH  /plans/:id
DELETE /plans/:id
``` 