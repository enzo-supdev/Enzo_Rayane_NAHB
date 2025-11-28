/**
 * Test Swagger Configuration
 * Vérifier que la documentation Swagger est correctement configurée
 */

import fs from 'fs';
import path from 'path';

console.log('🔍 Vérification de la configuration Swagger...\n');

const checks = {
  swaggerJsonExists: false,
  swaggerJsonValid: false,
  packageJsonHasDeps: false,
  serverJsHasSwagger: false,
  swaggerHtmlExists: false,
  guidesExist: false
};

// 1. Vérifier swagger.json
try {
  const swaggerPath = './swagger.json';
  if (fs.existsSync(swaggerPath)) {
    checks.swaggerJsonExists = true;
    console.log('✅ swagger.json existe');
    
    const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));
    if (swagger.openapi === '3.0.0' && swagger.paths) {
      checks.swaggerJsonValid = true;
      console.log(`✅ swagger.json valide (${Object.keys(swagger.paths).length} endpoints)`);
    }
  } else {
    console.log('❌ swagger.json manquant');
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture de swagger.json:', error.message);
}

// 2. Vérifier package.json
try {
  const packagePath = './package.json';
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  if (pkg.dependencies['swagger-ui-express'] && pkg.dependencies['swagger-jsdoc']) {
    checks.packageJsonHasDeps = true;
    console.log('✅ Dépendances Swagger dans package.json');
  } else {
    console.log('❌ Dépendances Swagger manquantes dans package.json');
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture de package.json:', error.message);
}

// 3. Vérifier server.js
try {
  const serverPath = './server.js';
  if (fs.existsSync(serverPath)) {
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    if (serverContent.includes('swagger-ui-express') && 
        serverContent.includes('/api-docs') &&
        serverContent.includes('/swagger.json')) {
      checks.serverJsHasSwagger = true;
      console.log('✅ server.js configuré pour Swagger');
    } else {
      console.log('❌ Configuration Swagger incomplète dans server.js');
    }
  }
} catch (error) {
  console.log('❌ Erreur lors de la lecture de server.js:', error.message);
}

// 4. Vérifier swagger.html
try {
  if (fs.existsSync('./swagger.html')) {
    checks.swaggerHtmlExists = true;
    console.log('✅ swagger.html existe');
  } else {
    console.log('⚠️  swagger.html manquant (optionnel)');
  }
} catch (error) {
  console.log('❌ Erreur lors de la vérification de swagger.html:', error.message);
}

// 5. Vérifier les guides
try {
  const guides = [
    '../SWAGGER_GUIDE.md',
    '../QUICKSTART_SWAGGER.md',
    '../NAHB_API.postman_collection.json'
  ];
  
  let guidesFound = 0;
  for (const guide of guides) {
    if (fs.existsSync(guide)) {
      guidesFound++;
    }
  }
  
  if (guidesFound > 0) {
    checks.guidesExist = true;
    console.log(`✅ ${guidesFound} guides de documentation trouvés`);
  }
} catch (error) {
  console.log('⚠️  Erreur lors de la vérification des guides:', error.message);
}

// Résumé
console.log('\n📊 Résumé:\n');
console.log(`  swagger.json existe: ${checks.swaggerJsonExists ? '✅' : '❌'}`);
console.log(`  swagger.json valide: ${checks.swaggerJsonValid ? '✅' : '❌'}`);
console.log(`  Dépendances configurées: ${checks.packageJsonHasDeps ? '✅' : '❌'}`);
console.log(`  server.js configuré: ${checks.serverJsHasSwagger ? '✅' : '❌'}`);
console.log(`  Fichiers HTML: ${checks.swaggerHtmlExists ? '✅' : '⚠️'}`);
console.log(`  Guides: ${checks.guidesExist ? '✅' : '❌'}`);

const allChecked = Object.values(checks).filter(v => v).length;
console.log(`\n📈 Score: ${allChecked}/6`);

if (allChecked >= 5) {
  console.log('\n✅ Configuration Swagger: OK!');
  console.log('\n🚀 Prochaines étapes:');
  console.log('  1. npm install');
  console.log('  2. npm run dev');
  console.log('  3. Ouvrir http://localhost:5000/api-docs');
  process.exit(0);
} else {
  console.log('\n⚠️  Configuration Swagger: Vérifier les erreurs ci-dessus');
  process.exit(1);
}
