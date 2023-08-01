import {
  Controller,
  Post,
  Body,
  Logger,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private _logger: Logger,
  ) {}

  @Post('create')
  create(@Body() user: User) {
    this._logger.log('Creating user...');
    return this.userService.create(user);
  }

  @Get('get-all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('get-user-by-id/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('update-user-by-id/:id')
  update(@Param('id') id: string, @Body() updateUser) {
    return this.userService.update(+id, updateUser);
  }

  @Delete('delete-user-by-id/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
