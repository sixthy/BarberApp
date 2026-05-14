import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';

import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../auth/types/auth-user.type';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() createBookingDto: CreateBookingDto, @Req() request: any) {
        const user = request.user as AuthUser;

        return this.bookingsService.create(createBookingDto, user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    findAll() {
        return this.bookingsService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('by-date')
    findByDate(@Query('date') date: string) {
        return this.bookingsService.findByDate(date);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateBookingDto: UpdateBookingDto,
    ) {
        return this.bookingsService.update(id, updateBookingDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/cancel')
    cancel(@Param('id') id: string) {
        return this.bookingsService.cancel(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Patch(':id/no-show')
    markNoShow(@Param('id') id: string) {
        return this.bookingsService.markNoShow(id);
    }
}