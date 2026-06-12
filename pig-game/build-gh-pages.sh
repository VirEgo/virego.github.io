#!/bin/bash
# Build script for GitHub Pages deployment
# This script builds the Angular app with the correct base href for GitHub Pages

echo "Building for GitHub Pages..."
ng build --configuration=production --base-href="/virego.github.io/"

echo "Build complete! Output is in dist/pig-game/browser/"
echo "Copy contents of dist/pig-game/browser/ to the root of your gh-pages branch"
