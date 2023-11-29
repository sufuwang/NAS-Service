import { Module } from '@nestjs/common';
import { DDnsService } from './ddns.service';
import { DDnsController } from './ddns.controller';
import { createClient } from 'redis';
import config from './.config';

@Module({
  controllers: [DDnsController],
  providers: [
    DDnsService,
    {
      provide: 'RedisClient',
      async useFactory() {
        const client = createClient({
          socket: {
            host: config.LAN_IP,
            port: 6379,
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class DDnsModule {}
