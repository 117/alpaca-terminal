# alpaca terminal

![version](https://img.shields.io/github/package-json/v/117/alpaca-terminal?color=196DFF&style=flat-square)
![code](https://img.shields.io/github/languages/code-size/117/alpaca-terminal?color=F1A42E&style=flat-square)
![build](https://img.shields.io/github/workflow/status/117/alpaca-terminal/test?style=flat-square)
![prettier](https://img.shields.io/static/v1?label=code%20style&message=prettier&color=ff51bc&style=flat-square)

a command line terminal for trading with the Alpaca API

## Contents

- [Features](#features)
- [Install](#install)
- [Usage](#usage)
- [Contributing](#contributing)

## Features

- [x] View account information.
- [x] Buy and sell stocks.
- [x] Close positions with optional wildcards.
- [x] Cancel orders with optional wildcards.
- [x] View recent orders.
- [x] View positions.

## Install

From NPM:

```cmd
$ npm i -g alpaca-terminal
```

## Usage

### Contents

- [Launching](#launching)
- [Setup](#setup)
- [Buy](#buy)
- [Sell](#sell)
- [Aliases](#aliases)

### Launching

Launch the terminal with the `alpaca` or `alpaca-terminal` command.

```terminal
alpaca-terminal 1.3.0
type "help" or "h" to view commands
> help
help          [command]
account       [field]
buy           <symbol> <amount> [tif] [limit_price]
sell          <symbol> <amount> [tif] [limit_price]
close         <symbol|all|*>
cancel        <symbol|order_id|all|*>
orders        [status]
positions
quit
>
```

### Setup

Not authenticated? Don't worry!

After your first launch a configuration will be generated at
`$HOME/.alpaca-terminal/config.json`. Modify it to your liking and be sure to
set your Alpaca credentials.

### Buy

To buy a stock simply provide the `symbol` and `amount`.

```terminal
> buy SPY 1
order placed with ID 1184e1b7-2aa9-471e-8ec0-0981d1c35e4e
```

### Sell

To sell a stock simply provide the `symbol` and `amount`.

```terminal
> sell TSLA 1
order placed with ID 1184e1b7-2aa9-471e-8ec0-0981d1c35e4e
```

### Aliases

Below are the command aliases available.

| Command        | Aliases             |
| :------------- | :------------------ |
| `help`         | `h` `?`             |
| `authenticate` | `auth`              |
| `account`      | `acc` `a`           |
| `buy`          | `b`                 |
| `sell`         | `s`                 |
| `orders`       | `o`                 |
| `close`        | `c`                 |
| `cancel`       | `ca`                |
| `positions`    | `pos` `ps` `po` `p` |
| `quit`         | `exit` `e` `q`      |

## To Do

More is coming! This project is early in development.

## Contributing

Pull requests are encouraged. 🙂
