/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomLoggerService } from 'src/util/custom-logger.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private _logger = new CustomLoggerService(UserService.name);

  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(user: User) {
    this._logger.log(`User to be created => ${user.email}`);
    this._logger.log('Started checking if user exists...');

    // Check by email
    if (user?.email) {
      const userExists = await this.userModel.findOne({ email: user.email });
      if (userExists) {
        this._logger.log(
          `User email already exists : ${JSON.stringify(user?.email)}`,
        );
        return {
          status: 400,
          message: 'User already exists, Check email',
        };
      }
    }

    // Check by Id
    if (user?.id) {
      const userExists = await this.userModel.findOne({ id: user.id });
      if (userExists) {
        this._logger.log(
          `User id already exists : ${JSON.stringify(user?.id)}`,
        );
        return {
          status: 400,
          message: 'User already exists, Check ID',
        };
      }
    }

    this._logger.log('Started Creating user...');

    // Hash password
    this._logger.log('Started hashing password...');
    if (!user.password) {
      this._logger.log(`Password not provided`);
      return {
        status: 400,
        message: 'Password not provided',
      };
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const createdUser = new this.userModel({
      ...user,
      password: hashedPassword,
    });

    const result = await createdUser.save();
    if (result) {
      this._logger.log(`User created successfully : ${JSON.stringify(result)}`);
      return {
        status: 201,
        message: 'User created successfully',
        data: result,
      };
    } else {
      throw new Error(`User not created, server error`);
    }
  }

  async findAll() {
    this._logger.debug('Started fetching all users...');
    const result = await this.userModel.find().exec();
    if (result.length > 0) {
      this._logger.log(`${result.length} - Users fetched successfully`);
      return {
        status: 200,
        message: 'Users fetched successfully',
        data: result,
      };
    } else if (result.length === 0) {
      this._logger.log(`No users found`);
      return {
        status: 404,
        message: 'No users found',
        data: result,
      };
    } else {
      throw new Error(`Users not found, server error`);
    }
  }

  async findOne(id: number) {
    this._logger.log(`Started fetching user with id : ${id}`);

    const result = await this.userModel.findOne({ id: id });

    if (result) {
      this._logger.log(`User found : ${JSON.stringify(result)}`);
      return {
        status: 200,
        message: 'User found',
        data: result,
      };
    } else {
      this._logger.log(`User not found`);
      return {
        status: 404,
        message: 'User not found',
        data: result,
      };
    }
  }

  async findOneByEmail(email) {
    this._logger.log(
      `Started fetching user with email : ${JSON.stringify(email)}`,
    );

    const result = await this.userModel.findOne({ email: email });

    if (result) {
      this._logger.log(`User found : ${JSON.stringify(result)}`);
      return {
        status: 200,
        message: 'User found',
        data: result,
      };
    } else {
      this._logger.log(`User not found`);
      return {
        status: 404,
        message: 'User not found',
        data: result,
      };
    }
  }

  async update(id: number, updatedUser) {
    this._logger.log(`Started updating user with id : ${id}`);
    const result = await this.userModel.updateOne({ id: id }, updatedUser);
    if (result?.modifiedCount === 1 && result?.acknowledged === true) {
      this._logger.log(`User updated successfully`);
      return {
        status: 200,
        message: 'User updated successfully',
        data: result,
      };
    } else if (result?.modifiedCount === 0 && result?.acknowledged === true) {
      this._logger.log(`Already updated`);
      return {
        status: 400,
        message: 'Already updated to with same data',
        data: result,
      };
    } else {
      this._logger.log(`User not found`);
      return {
        status: 404,
        message: 'User not found',
        data: result,
      };
    }
  }

  async remove(id: number) {
    this._logger.log(`Started deleting user with id : ${id}`);
    const result = await this.userModel.deleteOne({ id: id }).exec();
    if (result?.deletedCount === 1 && result?.acknowledged === true) {
      this._logger.log(`User deleted successfully`);
      return {
        status: 200,
        message: 'User deleted successfully',
        data: result,
      };
    } else {
      this._logger.log(`User not found`);
      return {
        status: 404,
        message: 'User not found',
        data: result,
      };
    }
  }
}
