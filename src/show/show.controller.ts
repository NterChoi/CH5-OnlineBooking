import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ShowService } from './show.service';
import { CreateShowDto } from './dto/create-show.dto';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/types/userRole.type';

@Controller('shows')
export class ShowController {
  constructor(private readonly showService: ShowService) {
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @Post('register')
  create(@Body() createShowDto: CreateShowDto) {
    return this.showService.create(createShowDto);
  }

  @Get()
  findShow(
    @Query('category') category: string,
    @Query('name') name: string,
  ) {
    if (category) {
      return this.showService.findByCategory(category);
    } else if (name) {
      return this.showService.findByName(name);
    } else
      return this.showService.findAll();
  }

  // @Get()
  // findByCategory(@Query('category') category : string){
  //   return this.showService.findByCategory(category);
  // }
  //
  // @Get()
  // findByName(@Query('name') name : string){
  //   return this.showService.findByName(name);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showService.findOne(+id);
  }
}
