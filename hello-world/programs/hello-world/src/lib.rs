use anchor_lang::prelude::*;

declare_id!("FvVa2tCp7QotYj1twzQN43QXWd63ndEVh3XiynUvfe5w");

#[program]
pub mod hello_world {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn send_message(ctx: Context<SendMessage>, message: String) -> Result<()> {
        let message_account = &mut ctx.accounts.message_account;
        message_account.sender = *ctx.accounts.user.key;
        message_account.message = message;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct SendMessage<'info> {
    #[account(init, payer = user, space = 8 + 32 + 4 + 280)] // 8 (discriminator) + 32 (pubkey) + 4 (string prefix) + 280 (max message length)
    pub message_account: Account<'info, MessageAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct MessageAccount {
    pub sender: Pubkey,
    pub message: String, // Limit message length in client to 280 chars
}
