import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { CardsService } from './cards.service';
import type { Response } from 'express';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get(':id/vcard')
  async downloadVCard(@Param('id') id: string, @Res() res: Response) {
    try {
      const vcardStr = await this.cardsService.generateVCard(id);
      
      res.set({
        'Content-Type': 'text/vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="contact.vcf"`,
      });
      
      res.send(vcardStr);
    } catch (error) {
      if (error.message === 'Employee not found') {
        throw new NotFoundException('Employee not found');
      }
      throw error;
    }
  }
}
