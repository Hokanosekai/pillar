#!/bin/bash

# Compile for the current platform
echo "Compiling for $(uname -s)..."
echo ""

# if platform is windows, use .exe extension
if [ "$(uname -s)" = "Windows" ]; then
  deno compile -A --unstable --reload --output ./bin/pillar-$(uname -s).exe ./src/main.ts
else
  deno compile -A --unstable --reload --output ./bin/pillar-$(uname -s) ./src/main.ts
fi

echo ""
echo "Done."