use anchor_lang::prelude::*;

// This declares the program ID - a unique identifier on Solana blockchain
// Every program needs a unique ID that identifies it on the network
declare_id!("Hj9Hb5XYVqZNcPwVswyT47rtpozHW6NdjoP3FubmYFDr");

// This is the main program module that contains all your smart contract logic
#[program]
pub mod hello_world {
    use super::*;

    // Initialize function - sets up initial data for your program
    // Context<T> provides access to accounts and program execution context
    pub fn initialize(ctx: Context<Initialize>, message: String) -> Result<()> {
        let greeting_account = &mut ctx.accounts.greeting_account;
        greeting_account.message = message;
        greeting_account.count = 0;
        msg!("Initialized with message: {}", greeting_account.message);
        Ok(())
    }

    // Function to update the greeting message and increment counter
    pub fn update_greeting(ctx: Context<UpdateGreeting>, new_message: String) -> Result<()> {
        let greeting_account = &mut ctx.accounts.greeting_account;
        greeting_account.message = new_message;
        greeting_account.count += 1;
        msg!("Updated message to: {} (count: {})", greeting_account.message, greeting_account.count);
        Ok(())
    }

    // Function to get current greeting (for demonstration)
    pub fn get_greeting(ctx: Context<GetGreeting>) -> Result<()> {
        let greeting_account = &ctx.accounts.greeting_account;
        msg!("Current greeting: {} (accessed {} times)", greeting_account.message, greeting_account.count);
        Ok(())
    }
}

// Account structure that defines what data we store on-chain
#[account]
pub struct GreetingAccount {
    pub message: String,    // The greeting message (variable length)
    pub count: u64,         // Counter for how many times it's been updated
}

// Account validation for the initialize function
#[derive(Accounts)]
pub struct Initialize<'info> {
    // The account that will store our greeting data
    #[account(
        init,                           // Create new account
        payer = user,                   // User pays for account creation
        space = 8 + 32 + 200 + 8        // Discriminator + String + Message + Counter
    )]
    pub greeting_account: Account<'info, GreetingAccount>,
    
    // The user who is calling this function and paying for the transaction
    #[account(mut)]  // Mutable because they're paying (balance changes)
    pub user: Signer<'info>,
    
    // System program needed for account creation
    pub system_program: Program<'info, System>,
}

// Account validation for updating greeting
#[derive(Accounts)]
pub struct UpdateGreeting<'info> {
    // The existing greeting account we want to modify
    #[account(mut)]  // Mutable because we're changing its data
    pub greeting_account: Account<'info, GreetingAccount>,
}

// Account validation for reading greeting
#[derive(Accounts)]
pub struct GetGreeting<'info> {
    // Read-only access to the greeting account
    pub greeting_account: Account<'info, GreetingAccount>,
}
