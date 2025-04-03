import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("9EmGYqp5od9RU62KgiWz2q3RxYfFuJu4AB2QVEZGSche");

// Recipient address
const to = new PublicKey("Hhf7nz1BiwTLq9cp3cwjQ5BwwMy3hnWYthDDtL7UQqdF");

const token_decimals = 1_000_000n;

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey            
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );

        // Transfer the new token to the "toTokenAccount" we just created
        const signature = await transfer(
            connection,
            keypair,
            fromTokenAccount.address,
            toTokenAccount.address,
            keypair,
            token_decimals * 3n
        );
        //conform the transaction
        console.log(`Sign of the transaction is ${signature}`);


    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();