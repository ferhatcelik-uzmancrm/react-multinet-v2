const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

function obfuscateFile(filePath) {
  const code = fs.readFileSync(filePath, 'utf8');
  const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
  fs.writeFileSync(filePath, obfuscatedCode.getObfuscatedCode());
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const filePath = path.join(directory, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      obfuscateFile(filePath);
    }
  });
}

// Build klasöründeki JS dosyalarını işle
processDirectory('./build/static/js'); 