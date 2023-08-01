import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CustomLoggerService } from 'src/util/custom-logger.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  private _logger = new CustomLoggerService(UserController.name);

  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() user: User) {
    this._logger.log('Creating user...');
    return this.userService.create(user);
  }

  @UseGuards(AuthGuard)
  @Get('get-all')
  findAll() {
    this._logger.log('Fetching all users...');
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('get-user-by-id/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Get('get-user-by-email')
  findOneByEmail(@Body() emailCredentials) {
    const { email } = emailCredentials;
    return this.userService.findOneByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Patch('update-user-by-id/:id')
  update(@Param('id') id: string, @Body() updateUser) {
    return this.userService.update(+id, updateUser);
  }

  @UseGuards(AuthGuard)
  @Delete('delete-user-by-id/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
