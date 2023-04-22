# Makefile for compiling pillar
# Author: 2023 (Hokanosekai)
# Usage: make [help|all|clean|install|uninstall|build-windows|build-linux|build-macos]

PROG_NAME=pillar
PROG_VERSION=0.1.2
OUTPUT_DIR=bin
FLAGS=-A --unstable --reload

OS := $(shell uname)

OUTPUT_FILE=$(OUTPUT_DIR)/$(PROG_NAME)-${PROG_VERSION}-${OS}

EXTENSION=
ifeq ($(OS),Windows_NT)
	EXTENSION=.exe
endif

TARGET=
ifeq ($(OS),Darwin)
	TARGET=x86_64-apple-darwin
endif

ifeq ($(OS),Linux)
	TARGET=x86_64-unknown-linux-gnu
endif

ifeq ($(OS),Windows_NT)
	TARGET=x86_64-pc-windows-msvc
endif

all: clean build

clean:
	rm -rf $(OUTPUT_DIR)
	@echo "Cleaned."

build:
	@mkdir -p $(OUTPUT_DIR)
	deno compile $(FLAGS) --output $(OUTPUT_FILE)$(EXTENSION) src/main.ts --target $(TARGET)
	@echo ""
	@echo "Done."

build-all: build-windows build-linux build-macos

build-windows:
	@mkdir -p $(OUTPUT_DIR)
	deno compile $(FLAGS) --output $(OUTPUT_DIR)/$(PROG_NAME)-${PROG_VERSION}-Windows.exe src/main.ts --target x86_64-pc-windows-msvc
	@echo ""
	@echo "Done."

build-linux:
	@mkdir -p $(OUTPUT_DIR)
	deno compile $(FLAGS) --output $(OUTPUT_DIR)/$(PROG_NAME)-${PROG_VERSION}-Linux src/main.ts --target x86_64-unknown-linux-gnu
	@echo ""
	@echo "Done."

build-macos:
	@mkdir -p $(OUTPUT_DIR)
	deno compile $(FLAGS) --output $(OUTPUT_DIR)/$(PROG_NAME)-${PROG_VERSION}-Darwin src/main.ts --target x86_64-apple-darwin
	@echo ""
	@echo "Done."

install:
	@mkdir -p /usr/local/bin
	@cp $(OUTPUT_FILE)$(EXTENSION) /usr/local/bin/$(PROG_NAME)
	@echo "Installed $(PROG_NAME) $(PROG_VERSION)"

uninstall:
	@rm -rf /usr/local/bin/$(PROG_NAME)
	@echo "Uninstalled $(PROG_NAME) $(PROG_VERSION)"

help:
	@echo "Usage: make [all|clean|install|uninstall|build-windows|build-linux|build-macos (default: build)]"
# End of file