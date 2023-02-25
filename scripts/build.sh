#!/bin/bash

echo "Compiling..."
echo ""

deno compile -A --unstable --reload --output ./bin/pillar ./src/main.ts

echo ""
echo "Done."