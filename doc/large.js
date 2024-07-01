const { existsSync, copyFileSync } = require('fs');
const { join } = require('path')
const targetDir = "assets/resources/large"
const rootDir = join(__dirname, '..', targetDir);
const count = 1000;

for (let i = 0; i < count; i++) {
  const file = join(rootDir, `${i}.png`);
  if (!existsSync(file)) {
    copyFileSync(join(__dirname, 'large.png'), file)
  }
}
console.log("ok")