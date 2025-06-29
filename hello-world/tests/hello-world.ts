import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorld } from "../target/types/hello_world"; // Import the program's types from the IDL
import { Keypair, SystemProgram, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("hello-world", () => {
  // Configure the client to use the devnet cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  // Get the program from the workspace.
  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;

  // This is the keypair for the account that will hold the message.
  // We will create it on the client side.
  const messageAccount = Keypair.generate();

  // The user's wallet is the payer and signer for the transactions.
  const user = anchor.AnchorProvider.env().wallet;

  it("Is initialized!", async () => {
    // Call the `initialize` instruction.
    // This is a simple instruction that just logs a message.
    const tx = await program.methods
      .initialize()
      .rpc();

    console.log("Your initialize transaction signature", tx);
  });

  it("Sends a message!", async () => {
    const message = "Hello, Solana! This is a test message from my contract.";

    // Call the `send_message` instruction.
    // We need to provide the necessary accounts.
    const tx = await program.methods
      .sendMessage(message)
      .accounts({
        // The new account we are creating to store the message.
        messageAccount: messageAccount.publicKey,
        // The signer and payer for the transaction (your wallet).
        user: user.publicKey,
        // The system program is needed for account creation.
        systemProgram: SystemProgram.programId,
      })
      // We need to sign this transaction with the `messageAccount` keypair because it's being initialized.
      .signers([messageAccount])
      .rpc();

    console.log("Your send_message transaction signature", tx);

    // Now, let's fetch the account from the blockchain to verify the data.
    // We will use the `messageAccount.publicKey` to fetch the account.
    const fetchedAccount = await program.account.messageAccount.fetch(
      messageAccount.publicKey
    );

    // Assert that the data in the account matches what we sent.
    assert.equal(fetchedAccount.message, message);
    assert.equal(fetchedAccount.sender.toBase58(), user.publicKey.toBase58());

    console.log("Fetched message from the account:", fetchedAccount.message);
    console.log("Sender of the message:", fetchedAccount.sender.toBase58());
  });
});