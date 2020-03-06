const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const prettyBytes = require('pretty-bytes');
const { pascalCase } = require('pascal-case');
const gzipSize = require('gzip-size');

process.chdir(path.resolve(__dirname, '..'));

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: 'inherit',
    env: Object.assign({}, process.env, extraEnv)
  });

const packageName = 'index';

console.log('\nBuilding ES modules...');

exec(`rollup -c build/config.js -f es -o es/${packageName}.js`);

console.log('\nBuilding CommonJS modules...');

exec(`rollup -c build/config.js -f cjs -o lib/${packageName}.js`);

console.log('\nBuilding UMD modules...');

const varName = pascalCase(packageName);

exec(
  `rollup -c build/config.js -f umd -n ${varName} -o dist/${packageName}.js`,
  {
    BUILD_ENV: 'development'
  }
);

exec(
  `rollup -c build/config.js -f umd -n ${varName} -o dist/${packageName}.min.js`,
  {
    BUILD_ENV: 'production'
  }
);

console.log(
  '\nThe minified, gzipped UMD build is %s',
  prettyBytes(gzipSize.sync(fs.readFileSync(`dist/${packageName}.min.js`)))
);
