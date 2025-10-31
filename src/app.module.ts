import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
            path: join(process.cwd(), 'src/schema.gql'),
            federation: 2,
      },
      // plugins: [ApolloServerPluginInlineTraceDisabled()],
      // plugins: [ApolloServerPluginLandingPageLocalDefault()],
      playground: true,

      // Configuración específica para Federation v2
      buildSchemaOptions: {
        orphanedTypes: [],
      },
      csrfPrevention: false,
    }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '1433'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      // Usar synchronize - controlado por variable de entorno
      synchronize: true,
      autoLoadEntities: true,
      // Logging solo en desarrollo
      logging: process.env.NODE_ENV === 'development' ? true : ['error'],
      // Connection pool para producción
      extra: {
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
        connectTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '30000'),
      },
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
      },
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
