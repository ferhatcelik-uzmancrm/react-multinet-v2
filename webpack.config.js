// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  devtool: false, // Source map'leri tamamen devre dışı bırak
  plugins: [
    new JavaScriptObfuscator({
      compact: true,
      identifierNamesGenerator: 'mangled',
      stringArray: true,
      stringArrayEncoding: ['rc4', 'base64'],
      stringArrayThreshold: 1,
      stringArrayWrappersCount: 5,
      stringArrayWrappersType: 'function',
      stringArrayWrappersParameters: [],
      stringArrayWrappersChainedCalls: true,
      rotateStringArray: true,
      shuffleStringArray: true,
      splitStrings: true,
      splitStringsChunkLength: 5,
      transformObjectKeys: true,
      unicodeEscapeSequence: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: true,
      disableConsoleOutput: true,
      numbersToExpressions: true,
      simplify: true,
      renameProperties: true,
      renamePropertiesMode: 'safe',
      
      // Kritik fonksiyonları ve özellikleri koru
      reservedNames: [
        '^(React|Component|PropTypes|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer)',
        '^(render|componentDidMount|componentDidUpdate|componentWillUnmount)',
        'process.env.[A-Z_]+',
        '^(location|history|document|window|localStorage|sessionStorage)',
        'className',
        'children',
        'props',
        'state'
      ],
      
      // Node modules ve public dosyaları hariç tut
      exclude: [
        'node_modules/**',
        '**/public/**',
        '**/*.css',
        '**/*.scss',
        '**/*.less',
        '**/*.html'
      ],
      
      // Hassas bilgileri içeren stringleri zorla dönüştür
      forceTransformStrings: [
        'API_',
        'AUTH_',
        'KEY_',
        'SECRET_',
        'TOKEN_',
        'PASSWORD_',
        'CREDENTIAL_'
      ]
    }),
    
    // Environment değişkenlerini güvenli şekilde işle
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        // Hassas environment değişkenlerini şifrele
        ...Object.keys(process.env).reduce((acc, key) => {
          if (key.match(/(API|KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL)/i)) {
            try {
              // AES şifreleme kullan
              const crypto = require('crypto');
              const cipher = crypto.createCipher('aes-256-cbc', 'your-secret-key');
              let encrypted = cipher.update(process.env[key], 'utf8', 'hex');
              encrypted += cipher.final('hex');
              acc[key] = JSON.stringify(encrypted);
            } catch (e) {
              acc[key] = JSON.stringify(process.env[key]);
            }
          } else {
            acc[key] = JSON.stringify(process.env[key]);
          }
          return acc;
        }, {})
      }
    })
  ],
  
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: [
              'console.log',
              'console.info',
              'console.debug',
              'console.warn',
              'console.error'
            ],
            // Dead code elimination
            dead_code: true,
            // Unused variables/functions elimination
            unused: true,
            // If statements optimization
            if_return: true,
            // Conditional compilation
            pure_getters: true,
            // Remove unreachable code
            passes: 3
          },
          mangle: {
            safari10: true,
            properties: {
              regex: /^_/
            }
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};