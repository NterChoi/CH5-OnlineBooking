import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/types/userRole.type';

@Controller('show')
@UseGuards(RolesGuard)
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Roles(Role.Admin)
  @Post('register')
  create(@Body() createShowDto: CreateShowDto) {
    return this.showService.create(createShowDto);
  }

  @Get()
  findAll() {
    return this.showService.findAll();
  }

  @Get('category')
  findByCategory(@Param() category : string){
    return this.showService.findByCategory(category);
  }

  @Get()
  findByName(@Param('name') name : string){
    return this.showService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showService.findOne(+id);
  }
}
