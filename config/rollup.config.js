import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import babel from 'rollup-plugin-babel';

import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

import cleaner from 'rollup-plugin-delete';

export default (opts) => {
  const options = {
    css: true,
    ...opts,
  };

  const tdsExternals = options.dependencies
    ? Object.keys(options.dependencies).filter((dependency) => dependency.startsWith('@deepx-inc'))
    : [];

  return {
    input: options.input,
    output: [
      { format: 'cjs', file: './dist/index.cjs.js', sourcemap: false },
      { format: 'es', file: './dist/index.es.js', sourcemap: false },
    ],

    external: ['react', 'react-dom', 'prop-types'].concat(
      tdsExternals,
    ),

    plugins: [
      cleaner({
        targets: ['./dist/*'],
      }),
      nodeResolve({
        extensions: ['.js', '.jsx'],
        browser: true,
      }),
      commonjs({
        include: '../../node_modules/**',
      }),
      options.css
        && postcss({
          sourceMap: false,
          plugins: [autoprefixer()],
        }),
      babel({
        runtimeHelpers: true,
        exclude: '../../node_modules/**',
        configFile: '../../babel.config.js',
      }),
    ],
  };
};