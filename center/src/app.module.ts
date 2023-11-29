import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { DDnsModule } from './ddns/ddns.module';

@Module({
  imports: [ScheduleModule.forRoot(), DDnsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
