import wallet from "../wba-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Define our Mint address

//umi syntax
const mint_umi = publicKey("9EmGYqp5od9RU62KgiWz2q3RxYfFuJu4AB2QVEZGSche");

//web3js syntax
const mint = new PublicKey("9EmGYqp5od9RU62KgiWz2q3RxYfFuJu4AB2QVEZGSche");

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

const [pda, bump] = PublicKey.findProgramAddressSync([Buffer.from("metadata"), mint.toBuffer()], TOKEN_PROGRAM_ID);


(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint: mint_umi,
            mintAuthority: signer
        }

        let data: DataV2Args = {
            name: "Rugg Day-0",
            symbol: "$",
            uri: "",
            sellerFeeBasisPoints: 500,
            creators: null,
            collection: null, 
            uses: null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data,
            isMutable: false,
            collectionDetails: null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
