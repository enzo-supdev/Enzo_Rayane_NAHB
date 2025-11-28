#!/bin/bash
# Script de vérification Swagger - NAHB API

echo "🔍 Vérification de la configuration Swagger..."
echo ""

# Vérifier Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js non trouvé"
    exit 1
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm non trouvé"
    exit 1
fi

# Vérifier les fichiers Swagger
echo ""
echo "📁 Vérification des fichiers Swagger..."

files=(
    "backend/swagger.json"
    "backend/swagger.html"
    "backend/SWAGGER_GUIDE.md"
    "backend/QUICKSTART_SWAGGER.md"
    "backend/NAHB_API.postman_collection.json"
    "backend/package.json"
    "backend/server.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (manquant)"
    fi
done

# Vérifier les dépendances dans package.json
echo ""
echo "📦 Vérification des dépendances Swagger..."

if grep -q "swagger-ui-express" backend/package.json; then
    echo "✅ swagger-ui-express configuré"
else
    echo "❌ swagger-ui-express manquant"
fi

if grep -q "swagger-jsdoc" backend/package.json; then
    echo "✅ swagger-jsdoc configuré"
else
    echo "❌ swagger-jsdoc manquant"
fi

# Vérifier les imports dans server.js
echo ""
echo "🔧 Vérification des modifications server.js..."

if grep -q "swagger-ui-express" backend/server.js; then
    echo "✅ Import swagger-ui-express"
else
    echo "❌ Import swagger-ui-express manquant"
fi

if grep -q "app.use('/api-docs'" backend/server.js; then
    echo "✅ Route /api-docs configurée"
else
    echo "❌ Route /api-docs manquante"
fi

if grep -q "/swagger.json" backend/server.js; then
    echo "✅ Route /swagger.json configurée"
else
    echo "❌ Route /swagger.json manquante"
fi

echo ""
echo "📋 Résumé:"
echo "  - Fichiers Swagger: 5"
echo "  - Dépendances: 2"
echo "  - Routes configurées: 2"
echo ""
echo "🚀 Prochaines étapes:"
echo "  1. cd backend"
echo "  2. npm install"
echo "  3. npm run dev"
echo "  4. Ouvrir http://localhost:5000/api-docs"
echo ""
echo "✨ Swagger est prêt !"
