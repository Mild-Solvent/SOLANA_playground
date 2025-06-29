# Hello World Smart Contract Information

## 📋 **Contract Overview**
- **Contract Name**: Hello World
- **Description**: A simple greeting contract that stores messages and tracks update counts
- **Network**: Solana Devnet
- **Framework**: Anchor

## 🔑 **Contract Identifiers**

### **Program ID**
```
Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr
```

### **Program Data Address**
```
BGNqtmpnzdMmJsrD1rLTksDipdwYVBZQowLR9XpS5514
```

### **Deployment Information**
- **Authority**: C9HoaxZbQjSNwWLBn52tLzcTYJ5V59cxuYykdTKeB8RF
- **Last Deployed Slot**: 390948520
- **Data Length**: 209984 bytes (0x33440)
- **Balance**: 1.46269272 SOL
- **Deployment Signature**: 3HRnqrXGo2oUXG4FVDSNpi9vcBDAa6vmVmVbzFkoVVFWaanJXwELToM5C2N3z4d12XWizHaZicmYG1e6vqHhfCVr

### **Explorer Links**
- **Program**: https://explorer.solana.com/address/Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr?cluster=devnet
- **Program Data**: https://explorer.solana.com/address/BGNqtmpnzdMmJsrD1rLTksDipdwYVBZQowLR9XpS5514?cluster=devnet

## 🎯 **Contract Functions**

### **1. Initialize**
Creates a new greeting account with an initial message.

**Function Signature:**
```rust
pub fn initialize(ctx: Context<Initialize>, message: String) -> Result<()>
```

**Parameters:**
- `message: String` - Initial greeting message

**Accounts Required:**
- `greeting_account` - New account to store greeting data (signer, writable, init)
- `user` - User paying for account creation (signer, writable)
- `system_program` - Solana System Program

**Instruction Discriminator:** `[175, 175, 109, 31, 13, 152, 155, 237]`

**Space Calculation:** `8 + 32 + 200 + 8 = 248 bytes`
- 8 bytes: Account discriminator
- 32 bytes: String length prefix
- 200 bytes: Maximum message content
- 8 bytes: u64 counter

### **2. Update Greeting**
Updates the greeting message and increments the counter.

**Function Signature:**
```rust
pub fn update_greeting(ctx: Context<UpdateGreeting>, new_message: String) -> Result<()>
```

**Parameters:**
- `new_message: String` - New greeting message

**Accounts Required:**
- `greeting_account` - Existing greeting account (writable)

**Instruction Discriminator:** `[92, 55, 69, 245, 121, 166, 1, 55]`

### **3. Get Greeting**
Retrieves and logs the current greeting (demonstration function).

**Function Signature:**
```rust
pub fn get_greeting(ctx: Context<GetGreeting>) -> Result<()>
```

**Parameters:** None

**Accounts Required:**
- `greeting_account` - Existing greeting account (read-only)

**Instruction Discriminator:** `[66, 56, 21, 185, 119, 54, 209, 184]`

## 📊 **Account Structure**

### **GreetingAccount**
```rust
pub struct GreetingAccount {
    pub message: String,    // The greeting message (variable length)
    pub count: u64,         // Counter for updates
}
```

**Account Discriminator:** `[190, 16, 56, 57, 246, 26, 112, 24]`

## 🛠️ **How to Interact**

### **Using Anchor CLI (Devnet)**

#### **1. Initialize a Greeting Account**
```bash
# Generate a new keypair for the greeting account
solana-keygen new --outfile greeting-account.json --no-bip39-passphrase

# Initialize the greeting account
anchor invoke initialize \
  --provider.cluster devnet \
  --program-id Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr \
  --args "Hello from CLI!" \
  --accounts greeting-account=greeting-account.json \
  --accounts user=~/.config/solana/id.json \
  --accounts system-program=11111111111111111111111111111111
```

#### **2. Update Greeting**
```bash
# Update the greeting message
anchor invoke update-greeting \
  --provider.cluster devnet \
  --program-id Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr \
  --args "Updated message!" \
  --accounts greeting-account=<GREETING_ACCOUNT_ADDRESS>
```

#### **3. Get Greeting**
```bash
# Call get greeting function
anchor invoke get-greeting \
  --provider.cluster devnet \
  --program-id Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr \
  --accounts greeting-account=<GREETING_ACCOUNT_ADDRESS>
```

### **Using Solana CLI**

#### **View Account Data**
```bash
# View raw account data
solana account <GREETING_ACCOUNT_ADDRESS> --url devnet

# View account info
solana account <GREETING_ACCOUNT_ADDRESS> --url devnet --output json
```

#### **Get Program Info**
```bash
# View program details
solana program show Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr --url devnet
```

### **Using TypeScript/JavaScript**

#### **Install Dependencies**
```bash
npm install @solana/web3.js @coral-xyz/anchor
```

#### **Basic Interaction Example**
```typescript
import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";

// Setup
const connection = new Connection("https://api.devnet.solana.com");
const programId = new PublicKey("Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr");

// Initialize greeting account
const greetingAccount = Keypair.generate();
await program.methods
  .initialize("Hello from TypeScript!")
  .accounts({
    greetingAccount: greetingAccount.publicKey,
    user: wallet.publicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
  })
  .signers([greetingAccount])
  .rpc();

// Update greeting
await program.methods
  .updateGreeting("Updated from TypeScript!")
  .accounts({
    greetingAccount: greetingAccount.publicKey,
  })
  .rpc();

// Get greeting data
const account = await program.account.greetingAccount.fetch(greetingAccount.publicKey);
console.log("Message:", account.message);
console.log("Count:", account.count.toString());
```

## 🧪 **Testing**

### **Run Full Test Suite**
```bash
# Run all tests (starts local validator automatically)
anchor test

# Run specific test
npm run test:hello-world
```

### **Manual Testing on Devnet**
```bash
# Make sure you're on devnet
solana config set --url devnet

# Check your balance
solana balance

# Request airdrop if needed
solana airdrop 1

# Deploy (if changes made)
anchor deploy

# Run tests against devnet
anchor test --provider.cluster devnet --skip-deploy
```

## 📝 **Important Notes**

1. **Account Creation**: Each greeting account needs a unique keypair and requires SOL for rent exemption
2. **Message Length**: Maximum message length is 200 characters (configurable in contract)
3. **Counter**: Automatically increments with each update
4. **Rent**: Accounts need ~0.00203928 SOL to be rent-exempt
5. **Network**: Currently deployed on devnet only

## 🔐 **Security Considerations**

1. **Account Ownership**: Only the program can modify greeting accounts
2. **Signer Requirements**: Initialize requires both user and greeting account signatures
3. **Account Validation**: Anchor handles account type validation automatically
4. **Input Validation**: Message length should be validated in production

## 🚀 **Next Steps**

1. Test all functions using your Phantom wallet
2. Create multiple greeting accounts
3. Monitor transactions on Solana Explorer
4. Experiment with different message lengths
5. Try upgrading the program with new features

---

**Last Updated**: 2025-06-29
**Anchor Version**: 0.31.1
**Solana CLI Version**: 2.2.18
