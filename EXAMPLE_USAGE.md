# Exemplo de Uso da API

## Fluxo Completo: Criar Usuário e Plano

### 1. Criar um Plano
```bash
curl -X POST http://localhost:3000/plans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plano Premium",
    "description": "Plano com recursos avançados",
    "price": 99.99,
    "isActive": true
  }'
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Plano Premium",
  "description": "Plano com recursos avançados",
  "price": 99.99,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "users": []
}
```

### 2. Criar Primeiro Usuário com Plano
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "name": "João Silva",
    "phone": "+5511999999999",
    "planId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "email": "joao@example.com",
  "name": "João Silva",
  "phone": "+5511999999999",
  "password": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "planId": "550e8400-e29b-41d4-a716-446655440000",
  "plan": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Plano Premium",
    "description": "Plano com recursos avançados",
    "price": 99.99,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Criar Segundo Usuário com o MESMO Plano
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "name": "Maria Santos",
    "phone": "+5511888888888",
    "planId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "email": "maria@example.com",
  "name": "Maria Santos",
  "phone": "+5511888888888",
  "password": null,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "planId": "550e8400-e29b-41d4-a716-446655440000",
  "plan": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Plano Premium",
    "description": "Plano com recursos avançados",
    "price": 99.99,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Buscar Usuário por Email
```bash
curl -X GET "http://localhost:3000/users?email=joao@example.com"
```

**Resposta quando encontra:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "joao@example.com",
    "name": "João Silva",
    "phone": "+5511999999999",
    "password": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "plan": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Plano Premium",
      "description": "Plano com recursos avançados",
      "price": 99.99,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

### 5. Ver Plano com Todos os Usuários
```bash
curl -X GET http://localhost:3000/plans/550e8400-e29b-41d4-a716-446655440000
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Plano Premium",
  "description": "Plano com recursos avançados",
  "price": 99.99,
  "isActive": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "email": "joao@example.com",
      "name": "João Silva",
      "phone": "+5511999999999",
      "password": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "planId": "550e8400-e29b-41d4-a716-446655440000"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "email": "maria@example.com",
      "name": "Maria Santos",
      "phone": "+5511888888888",
      "password": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "planId": "550e8400-e29b-41d4-a716-446655440000"
    }
  ]
}
```

### 6. Listar Todos os Usuários
```bash
curl -X GET http://localhost:3000/users
```

**Resposta:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "joao@example.com",
    "name": "João Silva",
    "phone": "+5511999999999",
    "password": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "plan": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Plano Premium",
      "description": "Plano com recursos avançados",
      "price": 99.99,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "email": "maria@example.com",
    "name": "Maria Santos",
    "phone": "+5511888888888",
    "password": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "planId": "550e8400-e29b-41d4-a716-446655440000",
    "plan": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Plano Premium",
      "description": "Plano com recursos avançados",
      "price": 99.99,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
]
```

### 7. Alterar Plano de um Usuário
```bash
curl -X PUT http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440001/plan/outro-plano-id
```

### 8. Remover Plano de um Usuário
```bash
curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440001/plan
```

## Cenários de Erro

### Buscar usuário por email inexistente
```bash
curl -X GET "http://localhost:3000/users?email=inexistente@example.com"
```

**Resposta:** Status 404 (Not Found)
```json
{
  "message": "User with email inexistente@example.com not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### Tentar criar usuário com plano inexistente
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@example.com",
    "name": "Teste",
    "planId": "plano-inexistente"
  }'
```

**Resposta:** Status 404 (Not Found)
```json
{
  "message": "Plan with ID plano-inexistente not found",
  "error": "Not Found",
  "statusCode": 404
}
```

## Estrutura de Relacionamento

- **Many-to-One**: Múltiplos usuários podem ter o mesmo plano
- **planId**: Campo opcional no usuário que referencia o plano
- **Flexibilidade**: Vários usuários podem compartilhar o mesmo plano
- **Planos Disponíveis**: Todos os planos ativos são considerados disponíveis

## Endpoints Disponíveis

### Users
- `GET /users` - Lista todos os usuários
- `GET /users?email=usuario@example.com` - **Busca usuário por email (retorna 404 se não encontrar)**
- `GET /users/:id` - Busca usuário por ID
- `POST /users` - Cria novo usuário (pode incluir planId)
- `PATCH /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Remove usuário
- `PUT /users/:id/plan/:planId` - Atribui plano ao usuário
- `DELETE /users/:id/plan` - Remove plano do usuário

### Plans
- `GET /plans` - Lista todos os planos (com lista de usuários)
- `GET /plans/available` - Lista planos disponíveis (ativos)
- `GET /plans/:id` - Busca plano por ID (com lista de usuários)
- `POST /plans` - Cria novo plano
- `PATCH /plans/:id` - Atualiza plano
- `DELETE /plans/:id` - Remove plano 