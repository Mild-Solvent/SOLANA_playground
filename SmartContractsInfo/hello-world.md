# Hello World Solana Smart Contract

This guide explains how to deploy and test the `hello-world` Solana smart contract using Anchor, and how to interact with it in your browser using the Phantom wallet extension.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [How the Contract Works](#how-the-contract-works)
- [Deployment to Devnet](#deployment-to-devnet)
- [Testing with Phantom Wallet](#testing-with-phantom-wallet)
- [Troubleshooting](#troubleshooting)
- [Resources](#resources)

---

## Overview

This is a simple Solana smart contract (program) written in Rust using the Anchor framework. It allows you to:

- Initialize a greeting message on-chain
- Update the greeting message and increment a counter
- Read the current greeting and how many times it has been updated

---

## Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools)
- [Anchor CLI](https://book.anchor-lang.com/getting_started/installation.html)
- [Phantom Wallet](https://phantom.app/) browser extension

---

## Project Structure

```
solana-contracts-workspace/
  programs/
    hello-world/
      src/
        lib.rs         # The main smart contract code
      Cargo.toml       # Rust dependencies
  migrations/
    deploy.ts          # Anchor deployment script
  tests/
    hello-world.ts     # Anchor test script (TypeScript)
  Anchor.toml          # Anchor project config
```

---

## How the Contract Works

### Main Functions

- **initialize**: Creates a new on-chain account with a greeting message and a counter set to 0.
- **update_greeting**: Updates the greeting message and increments the counter.
- **get_greeting**: Logs the current greeting and counter (for demonstration).

### On-chain Account

- **GreetingAccount**: Stores the greeting message (`String`) and update count (`u64`).

---

## Deployment to Devnet

### 1. Set Up Your Wallet

- Create a new wallet or use an existing one with the [Phantom](https://phantom.app/) extension.
- Fund your wallet with devnet SOL: [Solana Faucet](https://solfaucet.com/)

### 2. Configure Solana CLI

```sh
solana config set --url devnet
solana config set --keypair <PATH_TO_YOUR_PHANTOM_WALLET_KEYPAIR>
```

_Tip: Export your Phantom wallet keypair as a JSON file for CLI use. [Guide](https://docs.phantom.app/integrating/phantom-developer-docs/phantom-and-solana-cli)_

### 3. Build the Program

```sh
cd solana-contracts-workspace
anchor build
```

### 4. Deploy to Devnet

```sh
anchor deploy
```

- Note the program ID printed after deployment. Update it in `lib.rs` if needed.

### 5. Verify Deployment

```sh
solana program show <PROGRAM_ID>
```

---

## Testing with Phantom Wallet in the Browser

### 1. Connect Phantom to Devnet

- Open Phantom, go to settings, and select **Devnet** as the network.

### 2. Interact with the Program

- You can use a custom frontend (React/Next.js) or tools like [Solana Playground](https://beta.solpg.io/) or [Solana Explorer](https://explorer.solana.com/?cluster=devnet) to interact with your program.
- To build your own UI, use the [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/) and [@project-serum/anchor](https://project-serum.github.io/anchor/) libraries to connect to Phantom and call your program's methods.

#### Example: Connecting to Phantom in JavaScript

```js
const provider = window.solana;
await provider.connect();
console.log("Connected to wallet:", provider.publicKey.toString());
```

#### Example: Sending a Transaction

- Use Anchor's generated IDL and client to call `initialize`, `update_greeting`, and `get_greeting`.
- See `tests/hello-world.ts` for example scripts.

---

## Troubleshooting

- **Program ID mismatch**: Make sure the program ID in `lib.rs` matches the one deployed.
- **Insufficient funds**: Use the faucet to top up your devnet wallet.
- **Phantom not connecting**: Ensure you are on Devnet and have allowed the site to connect.

---

## Resources

- [Solana Docs](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Phantom Docs](https://docs.phantom.app/)
- [Solana Faucet](https://solfaucet.com/)
- [Solana Explorer](https://explorer.solana.com/?cluster=devnet)
- [Solana Playground](https://beta.solpg.io/)

---

Happy building on Solana! 🚀
