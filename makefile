# Makefile for compiling pillar
# Author: 2023 (Hokanosekai)
# Usage: make [help|all|clean|build|install|uninstall|build-windows|build-linux|build-macos]

PROG_NAME=pillar
PROG_VERSION=0.1.2
OUTPUT_DIR=bin

OUTPUT_FILE=$(OUTPUT_DIR)/$(PROG_NAME)

all: clean build

clean:
	rm -rf $(OUTPUT_DIR)
	@echo "Cleaned."

build: build-windows build-linux build-macos

build-windows:
	@mkdir -p $(OUTPUT_DIR)
	deno compile -A --unstable --reload --output $(OUTPUT_FILE)-${PROG_VERSION}-windows.exe src/main.ts --target x86_64-pc-windows-msvc
	@echo ""
	@echo "Done."

build-linux:
	@mkdir -p $(OUTPUT_DIR)
	deno compile -A --unstable --reload --output $(OUTPUT_FILE)-${PROG_VERSION}-linux src/main.ts --target x86_64-unknown-linux-gnu
	@echo ""
	@echo "Done."

build-macos:
	@mkdir -p $(OUTPUT_DIR)
	deno compile -A --unstable --reload --output $(OUTPUT_FILE)-${PROG_VERSION}-darwin src/main.ts --target x86_64-apple-darwin
	@echo ""
	@echo "Done."

install:
	@cp $(OUTPUT_FILE)-${PROG_VERSION}-linux /usr/local/bin/$(PROG_NAME)
	@echo "Installed $(PROG_NAME) $(PROG_VERSION)"

uninstall:
	@rm -rf /usr/local/bin/$(PROG_NAME)
	@echo "Uninstalled $(PROG_NAME) $(PROG_VERSION)"

help:
	@echo "Usage: make [all|clean|build|install|uninstall|build-windows|build-linux|build-macos (default: build)]"
# End of file