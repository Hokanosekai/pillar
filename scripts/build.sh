#!/bin/bash

# Compile for the current platform
echo "Compiling for $(uname -s)..."
echo ""

deno compile -A --unstable --reload --output ./bin/pillar-$(uname -s) ./src/main.ts --target x86_64-pc-windows-msvc

echo ""
echo "Done."