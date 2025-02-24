const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const buildPath = path.join(__dirname, '../build/static/js');

const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: false,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  splitStrings: true,
  splitStringsChunkLength: 5,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: false,
  renameGlobals: false,
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
  reservedNames: [
    '^(React|Component|PropTypes|useState|useEffect|useCallback|useMemo)',
    'className',
    'style'
  ]
};

// Build klasöründeki js dosyalarını optimize et
fs.readdirSync(buildPath).forEach(file => {
  if (file.endsWith('.js') && !file.includes('runtime')) {
    const filePath = path.join(buildPath, file);
    const code = fs.readFileSync(filePath, 'utf8');
    
    try {
      const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscatorOptions);
      fs.writeFileSync(filePath, obfuscatedCode.getObfuscatedCode());
      console.log(`Optimized: ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
});