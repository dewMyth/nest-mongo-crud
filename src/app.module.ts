// Modules
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// Controllers
import { AppController } from './app.controller';

// Services
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // .env should be in the root of the project
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    UtilModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
