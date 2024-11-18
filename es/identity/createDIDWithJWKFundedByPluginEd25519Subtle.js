import { generateAddresses } from "../utilAddress";
import { post } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { JWK } from "ts-jose";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
import { Converter } from "@iota/util.js";
const { NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
const { subtle } = globalThis.crypto;
async function run() {
    // From the menemonic a key pair
    // The account #0 will be controlling the DID
    // The account #1 will be the verification method
    // Write the key pairs to the std output
    const { bech32Addresses, privateKeys } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
    // Now the JWK is generated and its public key just copied to the DID and the Private Key printed to stdout
    let key = await JWK.generate("EdDSA", {
        // At this point in time we don't know the full Kid as we don't know the DID
        // This could be done in two steps, one generating an empty DID and then adding the Ver Method through
        // an update operation
        use: "sig",
        // crv: string, some algorithms need to add curve - EdDSA
        // modulusLength: number, some algorithms need to add length - RSA
    });
    if (key === null) {
        console.log("Dummy");
    }
    const pemUrl = process.argv[2];
    if (!pemUrl) {
        console.error("PEM URL not provided");
        process.exit(-1);
    }
    const theKey = await subtle.generateKey("Ed25519", true, ["sign", "verify"]);
    const privateKey = theKey.privateKey;
    const publicKey = theKey.publicKey;
    // const pubKey = key.toObject(false);
    const pubKey = await subtle.exportKey("jwk", publicKey);
    const pubKeyAsJose = await JWK.fromObject(pubKey);
    const kid = await pubKeyAsJose.getThumbprint();
    // This DID Document can also be created with the help of the IOTA Identity Library
    const did = {
        id: "did:0:0",
        verificationMethod: [{
                id: `did:0:0#${kid}`,
                type: "JsonWebKey2020",
                controller: "did:0:0",
                publicKeyJwk: {}
            }]
    };
    const pubKeyObj = pubKeyAsJose.toObject(false);
    pubKeyObj.x5u = pemUrl;
    pubKeyObj.use = "sig";
    pubKeyObj.alg = "EdDSA";
    did.verificationMethod[0].publicKeyJwk = pubKeyObj;
    delete did.verificationMethod[0].publicKeyJwk["key_ops"];
    // Posting data to the plugin
    const result = await postToPlugin(did, bech32Addresses);
    const privateKeyAsJsonWebToken = await subtle.exportKey("jwk", theKey.privateKey);
    const privateKeyAsJose = await JWK.fromObject(privateKeyAsJsonWebToken);
    const kidPrivate = await privateKeyAsJose.getThumbprint();
    const privateKeyObj = privateKeyAsJose.toObject(true);
    privateKeyObj.kid = `${kidPrivate}`;
    privateKeyObj.alg = "EdDSA";
    privateKeyObj.use = "sig";
    console.log("Private Key of the Verification Method: ");
    console.log(JSON.stringify(privateKeyObj, undefined, 2));
    console.log();
    console.log("DID: ", result.doc["id"]);
    console.log("Metadata:\n", result.meta);
    const privateKeyRaw = Buffer.from(privateKeyObj.d, "base64");
    console.log("Raw signing key: ", Converter.bytesToHex(privateKeyRaw, true));
    const publicKeyRaw = Buffer.from(pubKey.x, "base64");
    console.log("Raw public key: ", Converter.bytesToHex(publicKeyRaw, true));
    const exported = await subtle.exportKey("pkcs8", privateKey);
    console.log("-----BEGIN PRIVATE KEY-----");
    console.log(Buffer.from(exported).toString("base64"));
    console.log("-----END PRIVATE KEY-----");
    const exported2 = await subtle.exportKey("spki", publicKey);
    console.log("-----BEGIN PUBLIC KEY-----");
    console.log(Buffer.from(exported2).toString("base64"));
    console.log("-----END PUBLIC KEY-----");
    const finalObject = {
        "did": result.doc["id"],
        "privateKeyDidControl": Converter.bytesToHex(privateKeys[0], true),
        "privateKeyJwk": privateKeyObj,
        "privateKeyVerificationMethodRaw": Converter.bytesToHex(privateKeyRaw, true),
        "publicKeyVerificationMethodRaw": Converter.bytesToHex(publicKeyRaw, true)
    };
    console.log(JSON.stringify(finalObject, undefined, 2));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRElEV2l0aEpXS0Z1bmRlZEJ5UGx1Z2luRWQyNTUxOVN1YnRsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pZGVudGl0eS9jcmVhdGVESURXaXRoSldLRnVuZGVkQnlQbHVnaW5FZDI1NTE5U3VidGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxJQUFJLEVBQWdCLE1BQU0sYUFBYSxDQUFDO0FBRWpELE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxHQUFHLEVBQWtCLE1BQU0sU0FBUyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU5RCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQztBQUdyQyxLQUFLLFVBQVUsR0FBRztJQUNkLGdDQUFnQztJQUNoQyw2Q0FBNkM7SUFDN0MsaURBQWlEO0lBQ2pELHdDQUF3QztJQUN4QyxNQUFNLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0saUJBQWlCLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUUxRiwyR0FBMkc7SUFDM0csSUFBSSxHQUFHLEdBQVEsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN2Qyw0RUFBNEU7UUFDNUUsc0dBQXNHO1FB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