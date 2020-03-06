import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import builtins from 'builtin-modules';

const getPlugins = env => {
  const plugins = [nodeResolve({ preferBuiltins: true })];

  if (env) {
    plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    );
  }

  plugins.push(
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [['@babel/env', { loose: true, modules: false }]]
    }),
    commonjs({
      include: /node_modules/
    }),
    json({
      exclude: ['node_modules/**'],
      indent: '  ',

      compact: true,

      namedExports: true
    })
  );

  if (env === 'production') {
    plugins.push(terser());
  }

  return plugins;
};

const config = {
  input: 'src/index.js',
  output: {
    globals: { log4js: 'log4js', chalk: 'chalk', fs: 'fs', path: 'path' }
  },
  external: ['log4js', 'chalk', ...builtins],
  plugins: getPlugins(process.env.BUILD_ENV)
};

module.exports = config;
