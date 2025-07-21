import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { GetExpensesSummaryDto } from './dto/get-expenses-summary.dto';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @Get('summary')
  getSummary(@Query() getExpensesSummaryDto: GetExpensesSummaryDto) {
    return this.expensesService.getSummary(getExpensesSummaryDto);
  }
}
