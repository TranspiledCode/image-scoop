#!/bin/bash

# =============================================================================
# Firebase Realtime Database Rules Deployment Script
# =============================================================================
#
# This script deploys Firebase Realtime Database security rules to Firebase.
#
# Usage:
#   ./deploy-rules.sh [environment]
#
# Arguments:
#   environment  Optional. The Firebase project alias (default: "default")
#                Examples: production, staging, default
#
# Prerequisites:
#   1. Firebase CLI installed: npm install -g firebase-tools
#   2. Logged in to Firebase: firebase login
#   3. .firebaserc configured with project ID
#   4. database.rules.json exists in project root
#
# Examples:
#   ./deploy-rules.sh              # Deploy to default project
#   ./deploy-rules.sh production   # Deploy to production project
#   ./deploy-rules.sh staging      # Deploy to staging project
#
# =============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Change to project root
cd "$SCRIPT_DIR"

# Get environment argument (default: "default")
ENVIRONMENT="${1:-default}"

echo -e "${BLUE}==============================================================================${NC}"
echo -e "${BLUE}Firebase Realtime Database Rules Deployment${NC}"
echo -e "${BLUE}==============================================================================${NC}"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}Error: Firebase CLI is not installed${NC}"
    echo -e "${YELLOW}Install it with: npm install -g firebase-tools${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Firebase CLI installed"

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo -e "${RED}Error: Not logged in to Firebase${NC}"
    echo -e "${YELLOW}Run: firebase login${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Logged in to Firebase"

# Check if .firebaserc exists
if [ ! -f ".firebaserc" ]; then
    echo -e "${RED}Error: .firebaserc not found${NC}"
    echo -e "${YELLOW}Run: firebase init database${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} .firebaserc found"

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    echo -e "${RED}Error: firebase.json not found${NC}"
    echo -e "${YELLOW}Run: firebase init database${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} firebase.json found"

# Check if database.rules.json exists
if [ ! -f "database.rules.json" ]; then
    echo -e "${RED}Error: database.rules.json not found${NC}"
    echo -e "${YELLOW}Create the rules file first${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} database.rules.json found"

# Validate .firebaserc is configured
if grep -q "YOUR_FIREBASE_PROJECT_ID" .firebaserc; then
    echo -e "${RED}Error: .firebaserc not configured${NC}"
    echo -e "${YELLOW}Replace 'YOUR_FIREBASE_PROJECT_ID' with your actual Firebase project ID${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} .firebaserc configured"

# Get project ID
PROJECT_ID=$(firebase projects:list --json 2>/dev/null | grep -o '"projectId":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PROJECT_ID" ]; then
    # Fallback: read from .firebaserc
    PROJECT_ID=$(grep -A1 "\"$ENVIRONMENT\"" .firebaserc | grep -o '"[^"]*"' | tail -1 | tr -d '"')
fi

echo ""
echo -e "${BLUE}Deployment Details:${NC}"
echo -e "  Environment: ${GREEN}$ENVIRONMENT${NC}"
echo -e "  Project ID:  ${GREEN}$PROJECT_ID${NC}"
echo -e "  Rules File:  ${GREEN}database.rules.json${NC}"
echo ""

# Confirm deployment
read -p "$(echo -e ${YELLOW}Do you want to proceed with deployment? [y/N]:${NC} )" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Deploying Firebase Realtime Database rules...${NC}"
echo ""

# Deploy only database rules
firebase deploy --only database --project "$ENVIRONMENT"

DEPLOY_STATUS=$?

echo ""
if [ $DEPLOY_STATUS -eq 0 ]; then
    echo -e "${GREEN}==============================================================================${NC}"
    echo -e "${GREEN}✓ Firebase Realtime Database rules deployed successfully!${NC}"
    echo -e "${GREEN}==============================================================================${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. Test the rules in Firebase Console Rules Playground"
    echo -e "  2. Verify authentication and data access"
    echo -e "  3. Monitor for denied requests in Firebase Console"
    echo ""
    echo -e "${BLUE}Firebase Console:${NC}"
    echo -e "  https://console.firebase.google.com/project/$PROJECT_ID/database/rules"
    echo ""
else
    echo -e "${RED}==============================================================================${NC}"
    echo -e "${RED}✗ Firebase rules deployment failed${NC}"
    echo -e "${RED}==============================================================================${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  1. Check Firebase Console for error details"
    echo -e "  2. Validate rules syntax: firebase database:rules:get"
    echo -e "  3. Ensure you have permission to deploy to this project"
    echo ""
    exit 1
fi
