import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PlansModule } from './plans/plans.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExpensesModule } from './expenses/expenses.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [PrismaModule, PlansModule, ExpensesModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
