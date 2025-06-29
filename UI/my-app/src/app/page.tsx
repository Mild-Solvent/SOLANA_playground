import Image from "next/image";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { useCallback, useState } from 'react';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [txSig, setTxSig] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace with your deployed program ID
  const PROGRAM_ID = new PublicKey('REPLACE_WITH_YOUR_PROGRAM_ID');

  // Replace with the PDA or account your contract expects
  const PDA = new PublicKey('REPLACE_WITH_PDA_OR_ACCOUNT');

  const onTestContract = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTxSig(null);
    if (!publicKey) {
      setError('Wallet not connected');
      setLoading(false);
      return;
    }
    try {
      // This is a placeholder transaction. Replace with your contract's instruction.
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: PDA,
          lamports: 1 // Send 1 lamport as a test (replace with your instruction)
        })
      );
      const signature = await sendTransaction(tx, connection);
      setTxSig(signature);
    } catch (e: any) {
      setError(e.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  }, [publicKey, sendTransaction, connection]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <WalletMultiButton />
        <button
          className="mt-4 rounded bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
          onClick={onTestContract}
          disabled={!publicKey || loading}
        >
          {loading ? 'Testing...' : 'Test Hello World Contract'}
        </button>
        {txSig && (
          <div className="mt-2 text-green-600">
            Success! Tx: <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="underline">{txSig}</a>
          </div>
        )}
        {error && <div className="mt-2 text-red-600">Error: {error}</div>}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
