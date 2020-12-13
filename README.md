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
> npm i -g @master-chief/alpaca-terminal
```

## Usage

Launch the terminal with the `alpaca` or `alpaca-terminal` command.

```terminal
alpaca-terminal 1.3.0
type "help" or "h" to view commands
> help
help          [command]
authenticate  <key> <secret>
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

## Contributing

Pull requests are encouraged. 🥳
