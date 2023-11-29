/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const { writeFileSync } = require('fs');

const LAN_IP = execSync(`ifconfig en0 | grep "inet " | awk '{print $2}'`, {
  encoding: 'utf8',
}).replaceAll('\n', '');

writeFileSync(
  './src/ddns/.config.ts',
  `export default ${JSON.stringify(
    {
      LAN_IP,
      TencentCloud: {
        secretId: '',
        secretKey: '',
      },
      Domain: '',
    },
    null,
    2,
  )}`,
);
