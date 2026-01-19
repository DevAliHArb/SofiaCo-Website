const fs = require('fs');
const path = require('path');

/**
 * Reads version from .env file
 * @returns {string|null} Version string or null if not found
 */
function getVersionFromEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const versionMatch = envContent.match(/^VITE_APP_VERSION=(.*)$/m);
    return versionMatch ? versionMatch[1].trim() : null;
  } catch (error) {
    console.error('Error reading .env file:', error.message);
    return null;
  }
}

/**
 * Reads version from package.json
 * @returns {string|null} Version string or null if not found
 */
function getVersionFromPackageJson() {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version || null;
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    return null;
  }
}

/**
 * Updates package.json version
 * @param {string} newVersion - The new version to set
 */
function updatePackageJsonVersion(newVersion) {
  try {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const oldVersion = packageJson.version;
    
    packageJson.version = newVersion;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    
    console.log(`✅ Updated package.json version: ${oldVersion} → ${newVersion}`);
    return true;
  } catch (error) {
    console.error('Error updating package.json:', error.message);
    return false;
  }
}

/**
 * Updates .env version
 * @param {string} newVersion - The new version to set
 */
function updateEnvVersion(newVersion) {
  try {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    const versionPattern = /^VITE_APP_VERSION=.*$/m;
    const newVersionLine = `VITE_APP_VERSION=${newVersion}`;
    
    if (versionPattern.test(envContent)) {
      envContent = envContent.replace(versionPattern, newVersionLine);
    } else {
      envContent += `\n${newVersionLine}`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated .env VITE_APP_VERSION to ${newVersion}`);
    return true;
  } catch (error) {
    console.error('Error updating .env:', error.message);
    return false;
  }
}

/**
 * Syncs version from .env to package.json
 */
function syncFromEnvToPackageJson() {
  const envVersion = getVersionFromEnv();
  const packageVersion = getVersionFromPackageJson();
  
  if (!envVersion) {
    console.error('❌ VITE_APP_VERSION not found in .env file');
    return false;
  }
  
  if (envVersion === packageVersion) {
    console.log(`✅ Versions are already in sync (${envVersion})`);
    return true;
  }
  
  console.log(`🔄 Syncing version from .env (${envVersion}) to package.json (${packageVersion})`);
  return updatePackageJsonVersion(envVersion);
}

/**
 * Syncs version from package.json to .env
 */
function syncFromPackageJsonToEnv() {
  const packageVersion = getVersionFromPackageJson();
  const envVersion = getVersionFromEnv();
  
  if (!packageVersion) {
    console.error('❌ Version not found in package.json');
    return false;
  }
  
  if (packageVersion === envVersion) {
    console.log(`✅ Versions are already in sync (${packageVersion})`);
    return true;
  }
  
  console.log(`🔄 Syncing version from package.json (${packageVersion}) to .env (${envVersion})`);
  return updateEnvVersion(packageVersion);
}

// Command line interface
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'env-to-package':
    syncFromEnvToPackageJson();
    break;
  case 'package-to-env':
    syncFromPackageJsonToEnv();
    break;
  case 'check':
    const envVer = getVersionFromEnv();
    const pkgVer = getVersionFromPackageJson();
    console.log(`📦 package.json version: ${pkgVer}`);
    console.log(`🌍 .env version: ${envVer}`);
    console.log(`🔄 In sync: ${envVer === pkgVer ? '✅ Yes' : '❌ No'}`);
    break;
  case 'watch':
    console.log('👀 Watching .env file for changes...');
    fs.watchFile('.env', (curr, prev) => {
      console.log('\n📝 .env file changed, checking for version updates...');
      syncFromEnvToPackageJson();
    });
    break;
  default:
    console.log(`
🔧 Version Sync Tool

Usage:
  node version-sync.js <command>

Commands:
  env-to-package    Sync version from .env to package.json
  package-to-env    Sync version from package.json to .env  
  check             Check current versions in both files
  watch             Watch .env for changes and auto-sync to package.json

Examples:
  node version-sync.js env-to-package
  node version-sync.js check
  node version-sync.js watch
`);
}

module.exports = {
  getVersionFromEnv,
  getVersionFromPackageJson,
  updatePackageJsonVersion,
  updateEnvVersion,
  syncFromEnvToPackageJson,
  syncFromPackageJsonToEnv
};
