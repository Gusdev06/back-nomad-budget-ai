import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetTransactionsSummaryDto } from './dto/get-transactions-summary.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get('summary')
  getSummary(@Query() getTransactionsSummaryDto: GetTransactionsSummaryDto) {
    return this.transactionsService.getSummary(getTransactionsSummaryDto);
  }
}
