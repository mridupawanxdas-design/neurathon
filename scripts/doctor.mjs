import fs from 'node:fs';
import path from 'node:path';

const pkgPath = path.resolve('package.json');
if (!fs.existsSync(pkgPath)) {
  console.error('❌ package.json not found. Run this command from the project root folder.');
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const scripts = pkg.scripts || {};
const required = ['dev:full', 'server', 'dev'];

console.log('Project:', pkg.name);
console.log('Node:', process.version);

let ok = true;
for (const key of required) {
  if (!scripts[key]) {
    console.error(`❌ Missing npm script: ${key}`);
    ok = false;
  } else {
    console.log(`✅ Found npm script: ${key}`);
  }
}

if (!ok) {
  console.error('\nYour local clone is likely old. Run:');
  console.error('  git pull');
  console.error('  npm install');
  process.exit(1);
}

console.log('\n✅ Environment looks ready. Run: npm run dev:full');
