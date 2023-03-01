# Pillar

Pillar is a modern and easy to use language for writting Rubber Ducky scripts.

## Getting Started

## Installation

### Download the latest release

You can download the latest release [here]().

### Build from source

#### Linux / macOS

```
git clone
cd pillar
```

Then, you can build the sources for your platform using the following command:

```
./scripts/build.sh
```

And to install it on your system, run:

```
./scripts/install.sh
```

#### Windows

Just download the latest release [here]().

### Finish

You can now run the program by typing `pillar` in your terminal.

## Usage

### Command line

```
pillar [options] <file>
```

#### Options

```
-h, --help
    Display this help message
-v, --version
    Display the version of the program
-o, --output <file>
    Specify the output file
-i <file>, --input <file>
    Specify the input file
```

## Documentation

## Examples

### Hello world

```rust
/**
  * A simple script that prints "Hello world!"
  */

import Process

fn main() {
  Process.write("Hello world!")
}

main()
```

### Keyboard

```rust
/**
  * A simple script that opens notepad and types "Hello world!"
  */

import Keyboard

fn main() {
  Keyboard.press(Keys.Gui, Keys.R)
  Keyboard.write("notepade")
  Keyboard.press("ENTER")
  Keyboard.release("GUI")

  Keyboard.write("Hello world!")
}

main()
```

## Contributing

## License

This project is licensed under the GPL v3 License - see the [LICENSE](./LICENSE) file for more details.

## Authors

* **[Hokanosekai](https://github.com/Hokanosekai)** - *Initial work*
* **[Zyksa](https://github.com/Zyksa)** - *Initial idea*

