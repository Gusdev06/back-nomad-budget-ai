import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExpensesService {
  private readonly fxApiBaseUrl = 'https://economia.awesomeapi.com.br/json/last/';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    const { phone, description, amount, categoryId, expenseDate } = createExpenseDto;
    let currency = createExpenseDto.currency; // Get currency from DTO

    const user = await this.prisma.user.findFirst({
      where: { phone },
    });

   

    if (!user || !user.defaultCurrency || !user.countryCurrency) {
      throw new NotFoundException('User, user default currency, or country currency not found.');
    }

    if(user.active === false) {
      return {
        message: 'User is not active.',
        status: 400,
      }
    }
    
    // If no currency is provided, default to the user's country currency
    if (!currency) {
      currency = user.countryCurrency;
    }

    const { defaultCurrency } = user;
    let amountBase = amount;
    
    if (currency !== defaultCurrency) {
      let conversionSuccess = false;
      
      // Attempt 1: Direct conversion (e.g., BRL-IDR)
      const url1 = `${this.fxApiBaseUrl}${defaultCurrency}-${currency}`;
      try {
        const response = await firstValueFrom(this.httpService.get(url1));
        const fxData = response.data[`${defaultCurrency}${currency}`];
        if (fxData && fxData.bid) {
          const rate = parseFloat(fxData.bid);
          if (rate > 0) {
            amountBase = amount / rate; // Divide when using direct rate
            conversionSuccess = true;
          }
        }
      } catch (error) {
        // Suppress error and proceed to the next attempt
      }

      // Attempt 2: Inverse conversion (e.g., USD-BRL)
      if (!conversionSuccess) {
        const url2 = `${this.fxApiBaseUrl}${currency}-${defaultCurrency}`;
        try {
          const response = await firstValueFrom(this.httpService.get(url2));
          const fxData = response.data[`${currency}${defaultCurrency}`];
          if (fxData && fxData.bid) {
            const rate = parseFloat(fxData.bid);
            amountBase = amount * rate; // Multiply when using inverse rate
            conversionSuccess = true;
          }
        } catch (error) {
           console.error(`Could not fetch exchange rate for pair ${currency}-${defaultCurrency} in either direction.`);
           throw new Error('Could not fetch exchange rate.');
        }
      }
      
      if (!conversionSuccess) {
        throw new Error(`Could not fetch exchange rate for pair ${currency}-${defaultCurrency}.`);
      }
    }

    return this.prisma.expense.create({
      data: {
        userId: user.id,
        description: description,
        amountLocal: amount,
        currencyLocal: currency,
        amountBase: amountBase,
        currencyBase: defaultCurrency,
        categoryId: categoryId,
        expenseDate: expenseDate,
      },
    });
  }
}
