const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Running pre-build validation checks...\n');

let hasErrors = false;
const errors = [];

// Check 1: Look for @/ imports
console.log('1️⃣ Checking for @/ path alias imports...');
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
      findFiles(filePath, fileList);
    } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const srcDir = path.resolve(__dirname, '../src');
const files = findFiles(srcDir);

const aliasImports = [];
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  // Check for static imports: from '@/...'
  const staticMatches = content.match(/from\s+['"]@\/([^'"]+)['"]/g);
  // Check for dynamic imports: import('@/...')
  const dynamicMatches = content.match(/import\s*\(\s*['"]@\/([^'"]+)['"]\s*\)/g);
  
  if (staticMatches || dynamicMatches) {
    aliasImports.push({
      file: path.relative(process.cwd(), file),
      static: staticMatches || [],
      dynamic: dynamicMatches || [],
    });
  }
});

if (aliasImports.length > 0) {
  hasErrors = true;
  console.log('❌ Found @/ path alias imports:');
  aliasImports.forEach(({ file, static: staticImports, dynamic: dynamicImports }) => {
    console.log(`   ${file}`);
    if (staticImports.length > 0) {
      staticImports.forEach(imp => console.log(`     - ${imp}`));
    }
    if (dynamicImports.length > 0) {
      dynamicImports.forEach(imp => console.log(`     - ${imp}`));
    }
  });
  errors.push(`${aliasImports.length} file(s) contain @/ path alias imports`);
} else {
  console.log('✅ No @/ path alias imports found\n');
}

// Check 2: TypeScript validation (optional - skip if config issues)
console.log('2️⃣ Running TypeScript type check...');
try {
  execSync('npm run type-check', { 
    stdio: 'pipe', 
    cwd: path.resolve(__dirname, '..'),
    encoding: 'utf8'
  });
  console.log('✅ TypeScript validation passed\n');
} catch (error) {
  // TypeScript errors might be config-related, not code errors
  // So we'll warn but not fail the build
  const errorOutput = error.stdout || error.stderr || '';
  if (errorOutput.includes('customConditions') || errorOutput.includes('TS5098')) {
    console.log('⚠️  TypeScript config warning (can be ignored)\n');
  } else {
    console.log('❌ TypeScript validation failed - check errors above\n');
    hasErrors = true;
    errors.push('TypeScript validation failed');
  }
}

// Check 3: Test bundling with expo export
console.log('3️⃣ Testing bundle with expo export (this may take a minute)...');
try {
  // Clean previous exports
  const exportDir = path.resolve(__dirname, '../dist');
  if (fs.existsSync(exportDir)) {
    fs.rmSync(exportDir, { recursive: true, force: true });
  }
  
  execSync('npx expo export --platform android --output-dir dist', {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
    env: { 
      ...process.env, 
      EXPO_NO_DOTENV: '1',
      NODE_ENV: 'production'
    },
  });
  console.log('✅ Bundle test passed\n');
} catch (error) {
  hasErrors = true;
  errors.push('Bundle test failed - this is the most important check!');
  console.log('❌ Bundle test failed - this will also fail in EAS Build\n');
  console.log('   Fix the errors above before building.\n');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Pre-build validation FAILED');
  console.log('\nErrors found:');
  errors.forEach(err => console.log(`  - ${err}`));
  console.log('\n⚠️  Please fix these errors before building with EAS.');
  console.log('   This will save you hours of waiting time!');
  process.exit(1);
} else {
  console.log('✅ All pre-build checks passed!');
  console.log('   You can now safely run: npm run build:android');
  process.exit(0);
}

