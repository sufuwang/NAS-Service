import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { execSync } from 'child_process';
import { RedisClientType } from 'redis';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TencentCloud = require('tencentcloud-sdk-nodejs');
import type { Client } from 'tencentcloud-sdk-nodejs/tencentcloud/services/dnspod/v20210323/dnspod_client';
import config from './.config';

@Injectable()
export class DDnsService {
  @Inject('RedisClient')
  private redisClient: RedisClientType;

  private tencentCloud: Client;
  private domain: Record<'TopDomain' | 'SubDomain', string>;

  constructor() {
    const { Client } = TencentCloud.dnspod.v20210323;
    this.tencentCloud = new Client({
      credential: config.TencentCloud,
      region: '',
      profile: {
        httpProfile: {
          endpoint: 'dnspod.tencentcloudapi.com',
        },
      },
    });
    const [SubDomain, ...TopDomain] = config.Domain.split('.');
    this.domain = {
      SubDomain,
      TopDomain: TopDomain.join('.'),
    };
  }

  private getCurIPAddress(): string {
    return execSync('curl -s ifconfig.me', { encoding: 'utf8' });
  }

  private async updateCloudIPAddress(IP: string) {
    const { RecordList } = await this.tencentCloud.DescribeRecordList({
      Domain: this.domain.TopDomain,
    });
    const { RecordId } = RecordList.find(
      (item) => item.Name === this.domain.SubDomain,
    );
    this.tencentCloud.ModifyDynamicDNS({
      Domain: this.domain.TopDomain,
      RecordId,
      SubDomain: this.domain.SubDomain,
      RecordLine: '默认',
      Value: IP,
    });
    console.info('IP: ', IP);
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async updateIP(IP?: string) {
    if (IP) {
      this.redisClient.set('IP-Address', IP);
      this.updateCloudIPAddress(IP);
      return;
    }
    const realIP = this.getCurIPAddress();
    const historyIP = await this.redisClient.get('IP-Address');
    if (realIP === historyIP) {
      return;
    }
    this.redisClient.set('IP-Address', realIP);
    this.updateCloudIPAddress(realIP);
  }
}
