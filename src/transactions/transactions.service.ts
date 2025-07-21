import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { getCurrentDate } from '../utils/date';
import { GetTransactionsSummaryDto } from './dto/get-transactions-summary.dto';
import { ExpenseType } from '@prisma/client';

@Injectable()
export class TransactionsService {
  private readonly fxApiBaseUrl = 'https://economia.awesomeapi.com.br/json/last/';

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private formatAmount(amount: number | string): number {
    // Convert string to number if needed
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Validate if it's a valid number
    if (isNaN(numericAmount) || numericAmount <= 0) {
      throw new BadRequestException('Amount must be a valid positive number');
    }
    
    // Format to 2 decimal places and convert back to number
    return parseFloat(numericAmount.toFixed(2));
  }

  private formatPhoneNumber(phone: string): string {
    // Remove "+" symbol and any spaces
    const cleanPhone = phone.replace(/^\+/, '').replace(/\s+/g, '');
    
    // Validate if it contains only numbers
    if (!/^\d+$/.test(cleanPhone)) {
      throw new BadRequestException('Phone number must contain only digits');
    }
    
    return cleanPhone;
  }

  async create(createTransactionDto: CreateTransactionDto) {
    const { description, categoryId, type } = createTransactionDto;
    let currency = createTransactionDto.currency;
    const expenseDate = new Date(getCurrentDate(createTransactionDto.expenseDate));
    
    // Format phone number to remove "+" and ensure clean format
    const phone = this.formatPhoneNumber(createTransactionDto.phone);
    
    // Format amount to ensure it's a valid number
    const amount = this.formatAmount(createTransactionDto.amount);

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
            amountBase = parseFloat((amount / rate).toFixed(2)); // Format converted amount
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
            amountBase = parseFloat((amount * rate).toFixed(2)); // Format converted amount
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

    return this.prisma.transaction.create({
      data: {
        userId: user.id,
        description: description,
        amountLocal: amount,
        currencyLocal: currency,
        amountBase: amountBase,
        currencyBase: defaultCurrency,
        categoryId: categoryId,
        type: type as ExpenseType,
        expenseDate: expenseDate,
      },
    });
  }

  async getSummary(getTransactionsSummaryDto: GetTransactionsSummaryDto) {
    const { phone, startDate, endDate, categoryId, currency } = getTransactionsSummaryDto;

    const formattedPhone = this.formatPhoneNumber(phone);
    const user = await this.prisma.user.findFirst({
      where: { phone: formattedPhone },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const where: any = {
      userId: user.id,
    };

    if (startDate) {
      where.expenseDate = { ...where.expenseDate, gte: new Date(getCurrentDate(startDate)) };
    }

    if (endDate) {
      where.expenseDate = { ...where.expenseDate, lte: new Date(getCurrentDate(endDate)) };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (currency) {
      where.currencyLocal = currency;
    }

    const totalAmountBaseResult = await this.prisma.transaction.aggregate({
        where,
        _sum: {
            amountBase: true,
        },
    });
    
    const totalAmountBase = totalAmountBaseResult._sum.amountBase || 0;

    if (currency) {
        const totalAmountLocalResult = await this.prisma.transaction.aggregate({
            where,
            _sum: {
                amountLocal: true
            }
        });
        const totalAmountLocal = totalAmountLocalResult._sum.amountLocal || 0;
        return {
            totalAmountLocal,
            currencyLocal: currency,
            totalAmountBase,
            currencyBase: user.defaultCurrency
        }
    } 

    const summaryByCurrency = await this.prisma.transaction.groupBy({
        by: ['currencyLocal'],
        where,
        _sum: {
            amountLocal: true,
        },
    });

    return {
        summaryLocal: summaryByCurrency.map(item => ({
            totalAmountLocal: item._sum.amountLocal || 0,
            currencyLocal: item.currencyLocal,
        })),
        totalAmountBase,
        currencyBase: user.defaultCurrency,
    };
  }
}
