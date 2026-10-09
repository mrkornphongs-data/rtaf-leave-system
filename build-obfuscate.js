/**
 * ==========================================================================
 * BUILD SCRIPT: JAVASCRIPT CODE OBFUSCATION
 * เข้ารหัสและบิดเบือนโครงสร้างโค้ด JavaScript เพื่อป้องกันการอ่านและคัดลอกโค้ด
 * ==========================================================================
 */
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const SRC_DIR = path.join(__dirname, 'src', 'js');
const DIST_DIR = path.join(__dirname, 'js');

// Configuration for Obfuscator
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.5,
  numbersToExpressions: true,
  simplify: true,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  splitStrings: true,
  splitStringsChunkLength: 10,
  renameGlobals: false, // รักษารายชื่อฟังก์ชันหลักระดับ Window เพื่อให้ HTML onclick ทำงานได้ปกติ
  identifierNamesGenerator: 'hexadecimal',
  transformObjectKeys: true,
  unicodeEscapeSequence: false
};

const filesToObfuscate = [
  'security.js',
  'supabase-client.js',
  'app.js'
];

console.log('🚀 Starting JavaScript Code Obfuscation...');
console.log('--------------------------------------------------');

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

let totalOriginalSize = 0;
let totalObfuscatedSize = 0;

filesToObfuscate.forEach(file => {
  const srcPath = path.join(SRC_DIR, file);
  const distPath = path.join(DIST_DIR, file);

  if (!fs.existsSync(srcPath)) {
    console.warn(`⚠️ Source file not found: ${srcPath}`);
    return;
  }

  const code = fs.readFileSync(srcPath, 'utf8');
  const originalSize = Buffer.byteLength(code, 'utf8');
  totalOriginalSize += originalSize;

  console.log(`🔒 Obfuscating ${file} (${(originalSize / 1024).toFixed(1)} KB)...`);
  const startTime = Date.now();

  const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, obfuscationOptions);
  const obfuscatedCode = obfuscatedResult.getObfuscatedCode();

  fs.writeFileSync(distPath, obfuscatedCode, 'utf8');
  const obfuscatedSize = Buffer.byteLength(obfuscatedCode, 'utf8');
  totalObfuscatedSize += obfuscatedSize;

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`   ✅ Done in ${duration}s -> Output: ${(obfuscatedSize / 1024).toFixed(1)} KB`);
});

console.log('--------------------------------------------------');
console.log(`🎉 Obfuscation complete!`);
console.log(`   Total original: ${(totalOriginalSize / 1024).toFixed(1)} KB`);
console.log(`   Total obfuscated: ${(totalObfuscatedSize / 1024).toFixed(1)} KB`);
console.log(`📁 Source files safely preserved in: src/js/`);
console.log(`📁 Obfuscated web files ready in: js/`);
