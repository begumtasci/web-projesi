import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { RentalsService } from './rentals.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller('rentals')
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateRentalDto) {
    return this.rentalsService.create(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('me')
  mine(@Req() req: any) {
    return this.rentalsService.findMine(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.rentalsService.findAll();
  }
}
