import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cliente } from '../clientes/clientes.model';
import { config } from 'dotenv';
config(); // Load environment variables from .env file

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [Cliente],
      autoLoadModels: true,
      synchronize: true
    }),
  ],
})
export class DatabaseModule {}
