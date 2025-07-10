#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment to GitHub Pages...${NC}"

# Step 1: Build the project
echo -e "${GREEN}Building the project...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "Build failed! No dist directory found."
    exit 1
fi

# Step 2: Initialize git in dist directory
cd dist

# Initialize a new git repository
git init

# Add all files
git add -A

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Step 3: Force push to gh-pages branch
echo -e "${GREEN}Pushing to gh-pages branch...${NC}"
git push -f git@github.com:hiros0921/sanity-blog-react-netlify.git main:gh-pages

# Go back to the parent directory
cd ..

echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${YELLOW}Your site should be available at: https://hiros0921.github.io/sanity-blog-react-netlify/${NC}"
echo -e "${YELLOW}Note: It may take a few minutes for changes to appear on GitHub Pages.${NC}"