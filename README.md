# 🏥 Microservicio de Autenticación - Veterinaria

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="80" alt="Nest Logo" /></a>
  <a href="https://graphql.org/" target="blank"><img src="https://graphql.org/img/logo.svg" width="80" alt="GraphQL Logo" /></a>
</p>

## 📋 Descripción

Microservicio de autenticación y autorización para el sistema de gestión veterinaria. Construido con **NestJS**, **GraphQL Federation**, **TypeORM** y **SQL Server**.

### 🔥 Características principales:
- 🔐 **Autenticación JWT** completa (signup, login, revalidate)
- 👥 **Gestión de usuarios** con roles (admin, user)
- 🏗️ **Apollo Federation** ready para microservicios
- 🗄️ **SQL Server** como base de datos
- 🔒 **Guards y decoradores** personalizados
- 📊 **GraphQL** con Apollo Server
- 🐳 **Docker** para desarrollo y producción

## 🛠️ Stack Tecnológico

- **Framework:** NestJS 11.x
- **Base de datos:** SQL Server 2022
- **ORM:** TypeORM
- **API:** GraphQL con Apollo Federation
- **Autenticación:** JWT + Passport
- **Validación:** Class Validator
- **Contenedores:** Docker & Docker Compose

## 🚀 Setup del Proyecto

### Prerrequisitos
- Node.js 20+
- Docker y Docker Compose
- Git

### 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd microservicio_autentificacion

# Instalar dependencias
yarn install
```

## 🔧 Configuración de Ambiente

### Desarrollo Local

1. **Configurar variables de entorno:**
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus configuraciones
```

2. **Levantar SQL Server:**
```bash
docker compose up -d
```

3. **Crear la base de datos:**
```bash
docker exec -it sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "YourStrong@Passw0rd" -C -Q "CREATE DATABASE veterinaria_auth"
```

4. **Ejecutar la aplicación:**
```bash
# Modo desarrollo
yarn start:dev

# Modo debug
yarn start:debug
```

5. **Acceder a GraphQL Playground:**
- URL: http://localhost:3001/graphql

## 🐳 Deploy con Docker

### Desarrollo
```bash
# Solo base de datos
docker compose up -d

# Ver logs
docker compose logs -f
```

### Producción

1. **Configurar ambiente de producción:**
```bash
# Copiar plantilla
cp .env.prod.example .env.prod

# Editar .env.prod con valores de producción
# IMPORTANTE: Cambiar passwords y JWT_SECRET
```

2. **Deploy completo:**
```bash
# Build y deploy
yarn docker:prod:build

# Solo deploy (si ya está buildeado)
yarn docker:prod

# Ver logs
yarn docker:prod:logs

# Detener
yarn docker:prod:down
```

### 🔍 Comandos Docker útiles

```bash
# Build manual de la imagen
yarn docker:build

# Ver contenedores corriendo
docker ps

# Acceder al contenedor de la app
docker exec -it veterinaria-auth-app-prod sh

# Acceder a SQL Server
docker exec -it veterinaria-auth-db-prod /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C

# Limpiar recursos Docker
docker system prune -f
docker volume prune -f

# Ver uso de espacio
docker system df
```

### 📋 Optimizaciones incluidas

**✅ .dockerignore creado:**
- Excluye `node_modules`, archivos de test, documentación
- Reduce tamaño de build context significativamente
- Mejora velocidad de build

**✅ .gitignore actualizado:**
- Archivos de ambiente de producción (.env.prod)
- Archivos específicos de Docker
- Directorios de upload/storage

**✅ Multi-stage build:**
- Imagen de build separada de producción
- Solo dependencias de producción en imagen final
- Tamaño de imagen optimizado

## 🎯 API GraphQL

### 🔐 Autenticación

```graphql
# Registro de usuario
mutation {
  signup(signupInput: {
    fullname: "Juan Pérez"
    email: "juan@example.com"
    password: "123456"
  }) {
    token
    user {
      id
      fullname
      email
      roles
    }
  }
}

# Login
mutation {
  login(loginInput: {
    email: "juan@example.com"
    password: "123456"
  }) {
    token
    user {
      id
      fullname
      email
    }
  }
}

# Revalidar token
query {
  revalidate {
    token
    user {
      id
      fullname
      email
      roles
    }
  }
}
```

### 👥 Gestión de Usuarios (Solo Admins)

```graphql
# Listar usuarios
query {
  users {
    id
    fullname
    email
    roles
    isActive
  }
}

# Obtener usuario específico
query {
  user(id: 1) {
    id
    fullname
    email
    roles
  }
}

# Actualizar usuario
mutation {
  updateUser(updateUserInput: {
    id: 1
    fullname: "Juan Carlos Pérez"
  }) {
    id
    fullname
    email
  }
}
```

### 🔑 Headers de Autenticación

Para queries/mutations protegidas, incluir:
```json
{
  "Authorization": "Bearer <jwt_token>"
}
```

## 🏗️ Estructura del Proyecto

```
src/
├── auth/                   # Módulo de autenticación
│   ├── decorators/        # @CurrentUser decorator
│   ├── dto/               # DTOs (LoginInput, SignupInput)
│   ├── enums/             # ValidRoles enum
│   ├── guards/            # JwtAuthGuard
│   ├── interfaces/        # JWT interfaces
│   ├── strategies/        # JWT Strategy
│   └── types/             # AuthResponse type
├── users/                 # Módulo de usuarios
│   ├── dto/               # User DTOs
│   ├── entities/          # User entity
│   └── ...
├── app.module.ts          # Módulo principal
├── main.ts               # Bootstrap
└── schema.gql            # Schema GraphQL generado
```

## 📊 Monitoreo y Logs

### Health Checks
- **Endpoint:** Incluido en Docker health check
- **Verificación:** GraphQL schema query

### Logs de Producción
```bash
# Ver logs en tiempo real
yarn docker:prod:logs

# Logs específicos del contenedor
docker logs veterinaria-auth-app-prod -f

# Logs de la base de datos
docker logs veterinaria-auth-db-prod -f
```

## 🔒 Seguridad

### Configuraciones de Producción
- ✅ Usuario no-root en contenedor
- ✅ JWT con secrets seguros
- ✅ Rate limiting configurado
- ✅ CORS configurado
- ✅ Validación de entrada con class-validator
- ✅ Passwords hasheados con bcrypt

### Variables Sensibles
Asegúrate de cambiar en producción:
- `JWT_SECRET`: Usar `openssl rand -base64 64`
- `DB_PASSWORD`: Password fuerte para SQL Server
- `DB_DATABASE`: Nombre específico para producción

## 🌐 Federation

Este microservicio está preparado para **Apollo Federation v2**:

```typescript
// User entity como referencia federada
@Directive('@key(fields: "id")')
@ObjectType()
export class User {
  // ...
}

// Resolver para federation
@ResolveReference()
resolveReference(ref: { __typename: 'User'; id: string | number }) {
  return this.usersService.findOneById(id);
}
```

## 🚨 Troubleshooting

### Problemas Comunes

**Error de conexión a base de datos:**
```bash
# Verificar que SQL Server esté corriendo
docker ps | grep sqlserver

# Recrear volumen si hay corrupción
docker compose down -v
docker compose up -d
```

**Error de JWT:**
```bash
# Verificar JWT_SECRET en variables de entorno
echo $JWT_SECRET
```

**Puerto ocupado:**
```bash
# Cambiar puerto en .env
PORT=3002
```

### Logs de Debug
```bash
# Habilitar logs detallados
LOG_LEVEL=debug
```

## 📞 Soporte

Para issues y preguntas:
- **Repository Issues:** [GitHub Issues](https://github.com/keremyalex/veterinaria_auth/issues)
- **Documentation:** [NestJS Docs](https://docs.nestjs.com)
- **GraphQL:** [Apollo Federation Docs](https://www.apollographql.com/docs/federation/)

## 📝 License

Este proyecto es privado y propietario.
