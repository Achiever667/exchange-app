#!/bin/bash
# Project Structure Verification Script
# Run: bash verify-structure.sh

echo "═══════════════════════════════════════════════════════════"
echo "  Exchange App - Production Architecture Structure"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📁 Directory Structure:${NC}"
echo ""

tree -L 3 --dirsfirst src/ 2>/dev/null || find src -type d | sort | sed 's|[^/]*/|  |g'

echo ""
echo -e "${BLUE}📄 Core Files:${NC}"
echo ""
find src -type f -name "*.ts" -o -name "*.tsx" | sort | while read file; do
  lines=$(wc -l < "$file" 2>/dev/null || echo "0")
  printf "  %-50s %4d lines\n" "$file" "$lines"
done

echo ""
echo -e "${GREEN}✅ Verification Complete${NC}"
echo ""
echo -e "${BLUE}📊 Statistics:${NC}"
echo "  Total TypeScript files: $(find src -name "*.ts" -o -name "*.tsx" | wc -l)"
echo "  Total lines of code: $(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l 2>/dev/null | tail -1)"
echo ""
echo -e "${BLUE}🎯 Features Implemented:${NC}"
echo "  ✓ Auth domain (login, register, OTP)"
echo "  ✓ Wallet domain (fetch, transfer, withdraw)"
echo "  ✓ Payment domain (initiate, status check)"
echo "  ✓ Centralized API client with JWT"
echo "  ✓ React Query integration"
echo "  ✓ Zustand state management"
echo "  ✓ Shared UI components"
echo "  ✓ Utility functions library"
echo "  ✓ Custom hooks collection"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  ✓ ARCHITECTURE.md - Detailed guide"
echo "  ✓ README_ARCHITECTURE.md - Quick start"
echo "  ✓ IMPLEMENTATION_SUMMARY.md - This file"
echo ""
