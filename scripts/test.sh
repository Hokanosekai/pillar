#!/bin/bash

# This script is used to test the code in the project.

# Run Lexer tests
echo "Running Lexer tests..."
deno test -A --unstable ./src//tests/lexer.test.ts