import { Base58 } from "@iota/util.js";
import { generateAddresses } from "../utilAddress";
import { post, sleep, get } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
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
    // From the menemonic a key pair
    // The account #0 will be controlling the DID
    // The account #1 will be the verification method of the controller DID
    // The account #2 will be the verification method of the final DID (controlled by the first one)
    // Write the key pairs to the std output
    const { publicKeys, bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 3);
    // Now converting the second private key into Base58 and multibase format and adding to the verification method
    did.verificationMethod[0].publicKeyMultibase = `z${Base58.encode(publicKeys[1])}`;
    // Posting data to the plugin
    const result = await postToPlugin(did, bech32Addresses[0]);
    console.log("DID: ", result.doc["id"]);
    console.log("Metadata:\n", result.meta);
    // Waiting for DID to be confirmed
    console.error("Waiting for confirmation of controller DID ...");
    await sleep(10000);
    // Now the original DID is resolved
    const resolveResponse = await get(`${PLUGIN_ENDPOINT}/identities/${encodeURIComponent(result.doc["id"])}`, TOKEN);
    const didControllerDetails = resolveResponse;
    // Here the controller of the DID and the controller of the verification method
    // Are the controller just created before
    // The controller property of the verification method needs to be set explicitly 
    const finalDid = {
        id: "did:0:0",
        verificationMethod: [{
                id: "did:0:0#sign-1",
                type: "Ed25519VerificationKey2018",
                controller: didControllerDetails.doc["id"],
                publicKeyMultibase: `z${Base58.encode(publicKeys[2])}`
            }]
    };
    // Posting data to the plugin
    const result2 = await postToPlugin(finalDid, didControllerDetails.meta["aliasAddress"]);
    console.log("Final DID: ", result2.doc["id"]);
    console.log("Metadata:\n", result2.meta);
}
async function postToPlugin(did, controller) {
    const pluginRequest = {
        type: "DIDCreation",
        action: "Issue",
        doc: did,
        meta: {
            stateControllerAddress: controller
        }
    };
    const result = await post(`${PLUGIN_ENDPOINT}/identities`, TOKEN, pluginRequest);
    return result;
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRElEQ29udHJvbGxlZEJ5RElELmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2lkZW50aXR5L2NyZWF0ZURJRENvbnRyb2xsZWRCeURJRC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxJQUFJLEVBQWdCLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFN0QsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU5RCxLQUFLLFVBQVUsR0FBRztJQUNkLG1GQUFtRjtJQUNuRixNQUFNLEdBQUcsR0FBRztRQUNSLEVBQUUsRUFBRSxTQUFTO1FBQ2Isa0JBQWtCLEVBQUUsQ0FBQztnQkFDakIsRUFBRSxFQUFFLGdCQUFnQjtnQkFDcEIsSUFBSSxFQUFFLDRCQUE0QjtnQkFDbEMsVUFBVSxFQUFFLFNBQVM7Z0JBQ3JCLGtCQUFrQixFQUFFLEVBQUU7YUFDekIsQ0FBQztLQUNMLENBQUM7SUFFRixnQ0FBZ0M7SUFDaEMsNkNBQTZDO0lBQzdDLHVFQUF1RTtJQUN2RSxnR0FBZ0c7SUFDaEcsd0NBQXdDO0lBQ3hDLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXpG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