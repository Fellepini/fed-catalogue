// import { generateAddresses } from "../utilAddress";
// import { post, type FullDoc } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { JWK } from "ts-jose";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
// import { Converter } from "@iota/util.js";
// const { PLUGIN_ENDPOINT, TOKEN } = process.env;
const { subtle } = globalThis.crypto;
async function run() {
    // From the menemonic a key pair
    // The account #0 will be controlling the DID
    // The account #1 will be the verification method
    // Write the key pairs to the std output
    // const { bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
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
    // const theKey = await subtle.generateKey("Ed25519", true, ["sign", "verify"]);
    const theKey = await subtle.importKey("jwk", {
        "key_ops": [
            "sign"
        ],
        "ext": true,
        "crv": "Ed25519",
        "d": "-8r2yxLzJmv2EehB8o2zm-s-3QQKNWXLuJhgXP-kYMM",
        "x": "qjTxYOYLHNzOj4vlxrIxzaDjDt2Ag-3AUOLLlWJKzVs",
        "kty": "OKP",
        "kid": "uXzLJyKfcEUGu2_Si6npNukkt3bnxyZk7ViLAca3LO4",
        "alg": "EdDSA",
        "use": "sig"
    }, { name: "Ed25519" }, true, ["sign"]);
    console.log(theKey);
    //const privateKey = (theKey as unknown as { [id: string]: unknown }).privateKey as CryptoKey;
    //const publicKey = (theKey as unknown as { [id: string]: unknown }).publicKey as CryptoKey;
    /*
        // const pubKey = key.toObject(false);
        const pubKey = await subtle.exportKey("jwk", publicKey);
        const pubKeyAsJose = await JWK.fromObject(pubKey as JWKObject);
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
    
        const privateKeyAsJsonWebToken = await subtle.exportKey("jwk", (theKey as unknown as { [id: string]: unknown }).privateKey as CryptoKey);
        const privateKeyAsJose = await JWK.fromObject(privateKeyAsJsonWebToken as JWKObject);
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
        */
    const exported = await subtle.exportKey("pkcs8", theKey);
    console.log("-----BEGIN PRIVATE KEY-----");
    console.log(Buffer.from(exported).toString("base64"));
    console.log("-----END PRIVATE KEY-----");
    const exported2 = await subtle.exportKey("spki", theKey);
    console.log("-----BEGIN PUBLIC KEY-----");
    console.log(Buffer.from(exported2).toString("base64"));
    console.log("-----END PUBLIC KEY-----");
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRElEV2l0aEpXS0Z1bmRlZEJ5UGx1Z2luRWQyNTUxOUF1eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pZGVudGl0eS9jcmVhdGVESURXaXRoSldLRnVuZGVkQnlQbHVnaW5FZDI1NTE5QXV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNEQUFzRDtBQUV0RCxvREFBb0Q7QUFFcEQsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUM5QixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1Qiw2Q0FBNkM7QUFFN0Msa0RBQWtEO0FBRWxELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0FBR3JDLEtBQUssVUFBVSxHQUFHO0lBQ2QsZ0NBQWdDO0lBQ2hDLDZDQUE2QztJQUM3QyxpREFBaUQ7SUFDakQsd0NBQXdDO0lBQ3hDLGdGQUFnRjtJQUVoRiwyR0FBMkc7SUFDM0csSUFBSSxHQUFHLEdBQVEsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN2Qyw0RUFBNEU7UUFDNUUsc0dBQXNHO1FBQ3RHLHNCQUFzQjtRQUN0QixHQUFHLEVBQUUsS0FBSztRQUNWLHlEQUF5RDtRQUN6RCxrRUFBa0U7S0FDckUsQ0FBQyxDQUFDO0lBRUgsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO1FBQ2QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN4QjtJQUVELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNULE9BQU8sQ0FBQyxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUN0QyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEI7SUFFRCxnRkFBZ0Y7SUFDaEYsTUFBTSxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFDdkM7UUFDSSxTQUFTLEVBQUU7WUFDUCxNQUFNO1NBQ1Q7UUFDRCxLQUFLLEVBQUUsSUFBSTtRQUNYLEtBQUssRUFBRSxTQUFTO1FBQ2hCLEdBQUcsRUFBRSw2Q0FBNkM7UUFDbEQsR0FBRyxFQUFFLDZDQUE2QztRQUNsRCxLQUFLLEVBQUUsS0FBSztRQUNaLEtBQUssRUFBRSw2Q0FBNkM7UUFDcEQsS0FBSyxFQUFFLE9BQU87UUFDZCxLQUFLLEVBQUUsS0FBSztLQUNELEVBQ2YsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLENBQ3RDLENBQUM7SUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRXBCLDhGQUE4RjtJQUM5Riw0RkFBNEY7SUFDaEc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7VUFpRE07SUFFRixNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztJQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0lBRXpDLE1BQU0sU0FBUyxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0lBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDNUMsQ0FBQztBQXNCRCxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyJ9