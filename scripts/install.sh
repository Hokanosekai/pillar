#!/bin/bash
# This script is used to install the project in your system.

echo "Installing Pillar..."
echo ""

# Check if there is a previous installation
if [ -d "/usr/local/bin/pillar" ]; then
    echo "Removing previous installation..."
    sudo rm -rf /usr/local/bin/pillar
    echo ""
fi

# Check if there is the build for the current platform in the bin folder
if [ -f "./bin/pillar-$(uname -s)" ]; then
    echo "Copying the build for $(uname -s)..."
    sudo cp ./bin/pillar-$(uname -s) /usr/local/bin/pillar
    echo ""
else
    echo "There is no build for $(uname -s)."
    echo "Please run the build script before installing."
    echo ""
    exit 1
fi

echo "Making the build executable..."
sudo chmod +x /usr/local/bin/pillar

echo ""
echo "Done."
echo ""