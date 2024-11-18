import { Converter, Base58 } from "@iota/util.js";
import { generateAddresses, requestFunds } from "../utilAddress";
import { Ed25519 } from "@iota/crypto.js";
import { post, sleep } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { FAUCET, FAUCET_PASS, FAUCET_USER, NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
async function run() {
    // This DID Document can also be created with the help of the IOTA Identity Library
    const did = {
        id: "did:0:0",
        verificationMethod: [{
                id: "did:0:0#sign-1",
                type: "Ed25519VerificationKey2018",
                controller: "did:0:0",
                publicKeyMultibase: ""
            }]
    };
    const { publicKeys, privateKeys, bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 2);
    // Now converting the second private key into Base58 and multibase format and adding to the verification method
    did.verificationMethod[0].publicKeyMultibase = `z${Base58.encode(publicKeys[1])}`;
    // Funding the address that will control #0
    const fundingResult = await requestFunds(FAUCET, { user: FAUCET_USER, pass: FAUCET_PASS }, bech32Addresses[0]);
    console.log(fundingResult);
    console.log("Waiting for funding address ...");
    await sleep(6000);
    // Posting data to the plugin
    const result = await postToPlugin(did, { bech32Addresses, privateKeys, publicKeys });
    console.log("DID: ", result.doc["id"]);
    console.log("Metadata:\n", result.meta);
}
async function postToPlugin(did, params) {
    const pluginRequest = {
        type: "DIDCreation",
        action: "TransactionRequest",
        doc: did,
        meta: {
            stateControllerAddress: params.bech32Addresses[0],
            // In this case the funding an state controller addresses are the same but they can be different
            fundingAddress: params.bech32Addresses[0]
        }
    };
    const result1 = await post(`${PLUGIN_ENDPOINT}/identities`, TOKEN, pluginRequest);
    const nextPayload = result1;
    // The result will contain a txEssence that has to be signed
    // Once it is signed it has to be submitted to the plugin again
    const essence = Converter.hexToBytes(nextPayload.txEssenceHash);
    const essenceSigned = Ed25519.sign(params.privateKeys[0], essence);
    // Now the essence is signed then the same payload is sent including a signature
    nextPayload.type = "DIDCreation";
    nextPayload.action = "TransactionSignature";
    nextPayload.signature = [{
            publicKey: Converter.bytesToHex(params.publicKeys[0], true),
            signature: Converter.bytesToHex(essenceSigned, true)
        }];
    const finalResult = await post(`${PLUGIN_ENDPOINT}/identities`, TOKEN, nextPayload);
    return finalResult;
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRElERnVuZGVkQnlBZGRyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2lkZW50aXR5L2NyZWF0ZURJREZ1bmRlZEJ5QWRkci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTFDLE9BQU8sRUFBRSxJQUFJLEVBQXFDLEtBQUssRUFBa0IsTUFBTSxhQUFhLENBQUM7QUFFN0YsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUVoRyxLQUFLLFVBQVUsR0FBRztJQUNkLG1GQUFtRjtJQUNuRixNQUFNLEdBQUcsR0FBRztRQUNSLEVBQUUsRUFBRSxTQUFTO1FBQ2Isa0JBQWtCLEVBQUUsQ0FBQztnQkFDakIsRUFBRSxFQUFFLGdCQUFnQjtnQkFDcEIsSUFBSSxFQUFFLDRCQUE0QjtnQkFDbEMsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLGtCQUFrQixFQUFFLEVBQUU7YUFDekIsQ0FBQztLQUNMLENBQUE7SUFFRCxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsR0FBRyxNQUFNLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxLQUFLLEVB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