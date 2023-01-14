# NFT Market

## Background

[Chinese zodiac](https://en.wikipedia.org/wiki/Chinese_zodiac) is represented by 12 animals: rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig.

A Chinese year starts and ends at Chinese New Year, and each Chinese year in the repeating zodiac cycle of 12 years is represented by a zodiac animal, for example, 2023 is the year of rabbit.

## Introduction

The project contains the implementation of a zodiac NFT, where each NFT represents a year and the its media file is an image of the co-responding zodiac animal.

Minting NFT will require user to provide a year within a valid range, and the contract will mint the NFT with the correct image URL.

## Project Setup

### Running NFT Marketplace

Before running the project, please make sure you have [node](https://nodejs.org) installed on your device and [Metamask](https://metamask.io/) installed on your browser.

Please follow the steps to run the project

* Start a terminal and navigate to *client*
* Run `npm install` or `yarn`
* Set up the environment variables as below, the addresses below are on Goerli testnet, please make sure you have an account on Goerli.

```
NEXT_THE_GRAPH_URL=your TheGraph URL

NEXT_ZODIAC_NFT_ADDRESS_GOERLI=0xEd0424CE925364c8823263691cEd862001201bC3
NEXT_NFT_MARKETPLACE_ADDRESS_GOERLI=0x21ab156F2398425DC4333906cEb4dF01E3F07be0
```

* Run `npm run dev` or `yarn dev`

### Minting NFT

To mint NFTs

* Start a terminal and navigate to *contracts*
* Run `npm install` or `yarn`
* Change the years (token IDs) that you want to mint in file *scripts/mint.js*

* Run `yarn hardhat run ./scripts/mint.js --network goerli`