/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CustomLoggerService } from 'src/util/custom-logger.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private _logger = new CustomLoggerService(AuthService.name);
  constructor(
    private usersService: UserService,
    private jwtTokenService: JwtService,
  ) {}

  async signIn(userCredentials: any) {
    const { email, password } = userCredentials;

    this._logger.log(`Started checking if user exists...`);
    const isUserExist = await this.usersService
      .findOneByEmail(email)
      .catch((err) => {
        this._logger.error(`Error checking if user exists: ${err.message}`);
        throw new NotFoundException();
      });

    if (isUserExist?.status === 404) {
      throw new NotFoundException();
    }

    this._logger.log(`Started checking if password is correct...`);
    const isPasswordCorrect = await bcrypt.compare(
      password,
      isUserExist.data.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    } else {
      this._logger.log(`Started generating token...`);

      const tokenPayload = {
        email: isUserExist.data.email,
        id: isUserExist.data.id,
        username: isUserExist.data.name,
      };

      const token = await this.jwtTokenService
        .signAsync(tokenPayload)
        .catch((err) => {
          this._logger.error(`Error generating token: ${err.message}`);
          throw new UnauthorizedException();
        });

      return {
        status: 200,
        message: 'User logged in successfully',
        data: isUserExist.data,
        access_token: token,
      };
    }
  }
}
