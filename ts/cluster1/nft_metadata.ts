import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/9LaXEoTt9Eg9gaRuHHc2UksqViBw3jARBFkBBoSToN1C"
        const metadata = {
            name: "Nike-prem",
            symbol: "O",
            description: "football not soccer ball, football!",
            image: image,
            attributes: [
                {trait_type: 'lol', value: 'btw jeff is cool'}
            ],
            properties: {
                files: [
                    {
                        type: "image/jpg",
                        uri: "https://devnet.irys.xyz/9LaXEoTt9Eg9gaRuHHc2UksqViBw3jARBFkBBoSToN1C"
                    },
                ]
            },
            creators: []
        };
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
