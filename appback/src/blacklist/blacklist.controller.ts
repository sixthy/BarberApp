import { Controller, Get, Param, Patch, UseGuards, Delete } from '@nestjs/common';

import { BlacklistService } from './blacklist.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('blacklist')
export class BlacklistController {
  constructor(private readonly blacklistService: BlacklistService) { }

  @Get()
  findAll() {
    return this.blacklistService.findAll();
  }

  @Get('blocked')
  findBlocked() {
    return this.blacklistService.findBlocked();
  }

  @Patch(':id/unblock')
  unblock(@Param('id') id: string) {
    return this.blacklistService.unblock(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blacklistService.remove(id);
  }
}