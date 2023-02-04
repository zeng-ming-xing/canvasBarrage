import vue from 'rollup-plugin-vue'

import { terser } from 'rollup-plugin-terser'

import postcss from 'rollup-plugin-postcss'



export default {
    input: 'index.js',
    output: [
      {
        name: 'z-canvas-barrage',
        file: './lib/index.js',
        format: 'umd',
        sourcemap: false,
        globals: {
          vue: 'vue'
        }
      },
      {
        name: 'z-canvas-barrage',
        file: './lib/index.module.js',
        format: 'es',
        sourcemap: false,
        globals: {
          vue: 'vue'
        }
      }
    ],
    plugins:[
        vue(),
        postcss({
            plugins: [require('autoprefixer')],
            // 把 css 插入到 style 中
            inject: true,
            // 把 css 放到和js同一目录
            // extract: true,
            minimize: true,
            sourceMap: false,
            extensions: ['.sass', '.scss', '.less', '.css']
          }),
          terser(),
      ],

  }
