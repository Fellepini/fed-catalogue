import { generateAddresses } from "../utilAddress";
import { post } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { JWK } from "ts-jose";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
import { Converter } from "@iota/util.js";
const { NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
async function run() {
    // From the menemonic a key pair
    // The account #0 will be controlling the DID
    // The account #1 will be the verification method
    // Write the key pairs to the std output
    const { bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
    // Now the JWK is generated and its public key just copied to the DID and the Private Key printed to stdout
    const key = await JWK.generate("EdDSA", {
        // At this point in time we don't know the full Kid as we don't know the DID
        // This could be done in two steps, one generating an empty DID and then adding the Ver Method through
        // an update operation
        use: "sig",
        // crv: string, some algorithms need to add curve - EdDSA
        // modulusLength: number, some algorithms need to add length - RSA
    });
    const verMethod = await key.getThumbprint();
    // This DID Document can also be created with the help of the IOTA Identity Library
    const did = {
        id: "did:0:0",
        verificationMethod: [{
                id: `did:0:0#${verMethod}`,
                type: "JsonWebKey2020",
                controller: "did:0:0",
                publicKeyJwk: {}
            }]
    };
    const pubKey = key.toObject(false);
    did.verificationMethod[0].publicKeyJwk = pubKey;
    // Posting data to the plugin
    const result = await postToPlugin(did, bech32Addresses);
    const privateKey = key.toObject(true);
    privateKey.kid = `${verMethod}`;
    console.log("Private Key of the Verification Method: ");
    console.log(JSON.stringify(privateKey, undefined, 2));
    console.log();
    console.log("DID: ", result.doc["id"]);
    console.log("Metadata:\n", result.meta);
    const privateKeyRaw = Buffer.from(privateKey.d, "base64");
    console.log("Raw signing key: ", Converter.bytesToHex(privateKeyRaw, true));
    const publicKeyRaw = Buffer.from(pubKey.x, "base64");
    console.log("Raw public key: ", Converter.bytesToHex(publicKeyRaw, true));
}
async function postToPlugin(did, bech32Addresses) {
    const pluginRequest = {
        type: "DIDCreation",
        action: "Issue",
        doc: did,
        meta: {
            // The stateController address could be omitted but in that case the plugin itself will be controller
            stateControllerAddress: bech32Addresses[0]
        }
    };
    const result = await post(`${PLUGIN_ENDPOINT}/identities`, TOKEN, pluginRequest);
    return result;
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRElEV2l0aEpXS0Z1bmRlZEJ5UGx1Z2luRWQyNTUxOS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pZGVudGl0eS9jcmVhdGVESURXaXRoSldLRnVuZGVkQnlQbHVnaW5FZDI1NTE5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxJQUFJLEVBQWdCLE1BQU0sYUFBYSxDQUFDO0FBRWpELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDOUIsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUxQyxNQUFNLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRzlELEtBQUssVUFBVSxHQUFHO0lBQ2QsZ0NBQWdDO0lBQ2hDLDZDQUE2QztJQUM3QyxpREFBaUQ7SUFDakQsd0NBQXdDO0lBQ3hDLE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxNQUFNLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0UsMkdBQTJHO0lBQzNHLE1BQU0sR0FBRyxHQUFRLE1BQU0sR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7UUFDekMsNEVBQTRFO1FBQzVFLHNHQUFzRztRQUN0RyxzQkFBc0I7UUFDdEIsR0FBRyxFQUFFLEtBQUs7UUFDVix5REFBeUQ7UUFDekQsa0VBQWtFO0tBQ3JFLENBQUMsQ0FBQztJ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