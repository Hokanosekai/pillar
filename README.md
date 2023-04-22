<div align="center">

<img src="./imgs/pillar.svg" width="200" height="200">

Pillar
====

![GitHub](https://img.shields.io/github/license/hokanosekai/pillar)
![GitHub release (release name instead of tag name)](https://img.shields.io/github/v/release/hokanosekai/pillar?include_prereleases)
![GitHub issues](https://img.shields.io/github/issues/hokanosekai/pillar)
![GitHub pull requests](https://img.shields.io/github/issues-pr/hokanosekai/pillar)
![GitHub package.json version](https://img.shields.io/github/package-json/v/hokanosekai/pillar?color=blue)

</div>

Pillar is a modern and easy to use language for writting Rubber Ducky scripts.

## Getting Started

### Prerequisites

* [Deno](https://deno.land/)
* [A Flipper zero](https://shop.hak5.org/products/flipper-zero)

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
make build
```

And to install it on your system, run:

```
make install
```

> Note: You may need to run `sudo make install` if you want to install it system-wide.

To uninstall it, run:

```
make uninstall
```

#### Windows

You can build the sources for Windows using the following command:

```
make build-windows
```

Or you can just download the latest release [here]().

### Finish

You can now run the program by typing `pillar` in your terminal.

## Usage

### Command line

```
pillar -i <file> -o <file>
```

#### Options

```
-h, --help
    Display this help message
-v, --version
    Display the version of the program
-o, --output <file>
    Specify the output file
-i, --input <file>
    Specify the input file
```

## Documentation

To create a script, you need to import the `Process` and `Keyboard` modules.

```rust
import Process
import Keyboard

fn main() {
  // Your code here
}

main()
```

There is no vscode extension for Pillar yet, but you can use the Rust extension.

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

### Windows

There is a module called `Windows` that allows you to interact with the Windows API.

```rust
/**
  * A simple script that opens notepad and types "Hello world!"
  */
import Process
import Windows

fn main() {
  Windows.open("notepad.exe")
  Process.write("Hello world!")
}

main()
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the GPL v3 License - see the [LICENSE](./LICENSE) file for more details.

## Authors

* **[Hokanosekai](https://github.com/Hokanosekai)** - *Initial work*
* **[Zyksa](https://github.com/Zyksa)** - *Initial idea*

