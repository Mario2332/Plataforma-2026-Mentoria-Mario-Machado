#!/bin/bash

# Script de verificação pré-deploy para Vercel
# Execute este script antes de fazer deploy para garantir que tudo está correto

echo "🔍 Verificando configuração do projeto..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de erros
ERRORS=0

# 1. Verificar se package.json existe
echo "📦 Verificando package.json..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json encontrado"
else
    echo -e "${RED}✗${NC} package.json não encontrado"
    ERRORS=$((ERRORS+1))
fi

# 2. Verificar se pnpm-lock.yaml existe
echo "🔒 Verificando pnpm-lock.yaml..."
if [ -f "pnpm-lock.yaml" ]; then
    echo -e "${GREEN}✓${NC} pnpm-lock.yaml encontrado"
else
    echo -e "${YELLOW}⚠${NC} pnpm-lock.yaml não encontrado (execute 'pnpm install')"
fi

# 3. Verificar se vite.config.ts existe
echo "⚙️  Verificando vite.config.ts..."
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✓${NC} vite.config.ts encontrado"
else
    echo -e "${RED}✗${NC} vite.config.ts não encontrado"
    ERRORS=$((ERRORS+1))
fi

# 4. Verificar se vercel.json existe
echo "🚀 Verificando vercel.json..."
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json encontrado"
else
    echo -e "${YELLOW}⚠${NC} vercel.json não encontrado (opcional, mas recomendado)"
fi

# 5. Verificar variáveis de ambiente necessárias
echo ""
echo "🔐 Variáveis de ambiente necessárias no Vercel:"
echo "   - DATABASE_URL (obrigatória)"
echo "   - JWT_SECRET (obrigatória)"
echo "   - COOKIE_NAME (obrigatória)"
echo "   - NODE_ENV=production (obrigatória)"
echo "   - VITE_APP_TITLE (opcional)"
echo "   - VITE_APP_LOGO (opcional)"

# 6. Testar build local
echo ""
echo "🏗️  Testando build local..."
echo "   Executando: pnpm build"
echo ""

if pnpm build; then
    echo ""
    echo -e "${GREEN}✓${NC} Build local bem-sucedido!"
else
    echo ""
    echo -e "${RED}✗${NC} Build local falhou!"
    echo "   Corrija os erros antes de fazer deploy no Vercel"
    ERRORS=$((ERRORS+1))
fi

# 7. Verificar se dist foi criado
echo ""
echo "📁 Verificando diretório dist..."
if [ -d "dist" ]; then
    echo -e "${GREEN}✓${NC} Diretório dist criado com sucesso"
    echo "   Arquivos gerados:"
    ls -lh dist/ | head -10
else
    echo -e "${RED}✗${NC} Diretório dist não foi criado"
    ERRORS=$((ERRORS+1))
fi

# Resumo final
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Projeto pronto para deploy no Vercel!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Faça commit das alterações: git add . && git commit -m 'Preparar para deploy'"
    echo "2. Faça push para GitHub: git push origin main"
    echo "3. Conecte o repositório no Vercel"
    echo "4. Configure as variáveis de ambiente"
    echo "5. Faça deploy!"
else
    echo -e "${RED}✗ Encontrados $ERRORS erro(s). Corrija antes de fazer deploy.${NC}"
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
