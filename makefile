# Makefile for compiling pillar
# Author: 2023 (Hokanosekai)
# Usage: make [help|all|clean|build|install|uninstall]

PROG_NAME=pillar
PROG_VERSION=0.1.0
OUTPUT_DIR=bin

# Check the OS
ifeq ($(OS),Windows_NT)
	OS_NAME=windows
else
	UNAME_S := $(shell uname -s)
	ifeq ($(UNAME_S),Linux)
		OS_NAME=linux
	endif
	ifeq ($(UNAME_S),Darwin)
		OS_NAME=macos
	endif
endif

# File extensions
ifeq ($(OS_NAME),windows)
	EXT=.exe
else
	EXT=
endif

OUTPUT_FILE=$(OUTPUT_DIR)/$(PROG_NAME)$(EXT)

all: clean build

clean:
	rm -rf $(OUTPUT_DIR)
	@echo "Cleaned."

build:
	@mkdir -p $(OUTPUT_DIR)
	deno compile -A --unstable --reload --output $(OUTPUT_FILE) src/main.ts
	@echo ""
	@echo "Done."

install:
	@cp $(OUTPUT_FILE) /usr/local/bin/$(PROG_NAME)
	@echo "Installed $(PROG_NAME) $(PROG_VERSION)"

uninstall:
	@rm -rf /usr/local/bin/$(PROG_NAME)
	@echo "Uninstalled $(PROG_NAME) $(PROG_VERSION)"

help:
	@echo "Usage: make [all|clean|build|install|uninstall]"
# End of file