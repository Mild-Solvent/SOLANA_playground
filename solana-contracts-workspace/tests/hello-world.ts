import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { HelloWorld } from "../target/types/hello_world.js";
import { expect } from "chai";

describe("hello-world", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.HelloWorld as Program<HelloWorld>;
  
  // Generate a new keypair for our greeting account
  const greetingAccount = anchor.web3.Keypair.generate();

  it("Initializes the greeting account", async () => {
    const initialMessage = "Hello, Solana World!";
    
    try {
      // Call the initialize function
      const tx = await program.methods
        .initialize(initialMessage)
        .accounts({
          greetingAccount: greetingAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([greetingAccount])
        .rpc();

      console.log("✅ Initialize transaction signature:", tx);

      // Fetch the account data to verify initialization
      const account = await program.account.greetingAccount.fetch(greetingAccount.publicKey);
      
      expect(account.message).to.equal(initialMessage);
      expect(account.count.toNumber()).to.equal(0);
      
      console.log("✅ Account initialized successfully!");
      console.log("📝 Message:", account.message);
      console.log("🔢 Count:", account.count.toNumber());
      
    } catch (error) {
      console.error("❌ Error initializing:", error);
      throw error;
    }
  });

  it("Updates the greeting message", async () => {
    const newMessage = "Updated greeting from Solana!";
    
    try {
      // Call the update_greeting function
      const tx = await program.methods
        .updateGreeting(newMessage)
        .accounts({
          greetingAccount: greetingAccount.publicKey,
        })
        .rpc();

      console.log("✅ Update transaction signature:", tx);

      // Fetch the updated account data
      const account = await program.account.greetingAccount.fetch(greetingAccount.publicKey);
      
      expect(account.message).to.equal(newMessage);
      expect(account.count.toNumber()).to.equal(1);
      
      console.log("✅ Account updated successfully!");
      console.log("📝 New message:", account.message);
      console.log("🔢 New count:", account.count.toNumber());
      
    } catch (error) {
      console.error("❌ Error updating:", error);
      throw error;
    }
  });

  it("Gets the current greeting", async () => {
    try {
      // Call the get_greeting function
      const tx = await program.methods
        .getGreeting()
        .accounts({
          greetingAccount: greetingAccount.publicKey,
        })
        .rpc();

      console.log("✅ Get greeting transaction signature:", tx);
      
      // Fetch the account data to display current state
      const account = await program.account.greetingAccount.fetch(greetingAccount.publicKey);
      
      console.log("✅ Current greeting retrieved:");
      console.log("📝 Message:", account.message);
      console.log("🔢 Count:", account.count.toNumber());
      
    } catch (error) {
      console.error("❌ Error getting greeting:", error);
      throw error;
    }
  });

  it("Updates greeting multiple times to test counter", async () => {
    const messages = [
      "Second update!",
      "Third update!",
      "Final update!"
    ];
    
    for (let i = 0; i < messages.length; i++) {
      try {
        const tx = await program.methods
          .updateGreeting(messages[i])
          .accounts({
            greetingAccount: greetingAccount.publicKey,
          })
          .rpc();

        console.log(`✅ Update ${i + 2} transaction signature:`, tx);

        const account = await program.account.greetingAccount.fetch(greetingAccount.publicKey);
        
        expect(account.message).to.equal(messages[i]);
        expect(account.count.toNumber()).to.equal(i + 2);
        
        console.log(`✅ Update ${i + 2} successful - Message: "${account.message}", Count: ${account.count.toNumber()}`);
        
      } catch (error) {
        console.error(`❌ Error in update ${i + 2}:`, error);
        throw error;
      }
    }
    
    console.log("🎉 All tests completed successfully!");
  });
});
