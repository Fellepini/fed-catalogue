import { Base58, Converter } from "@iota/util.js";
import { generateAddresses } from "../utilAddress";
import { Ed25519 } from "@iota/crypto.js";
import { post } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
const didToUpdate = "did:iota:ebsi:0x6e78f05ebab593e1045bcf319d053b4c592dd446679bacfd8b7be631993c22bd";
// The private key of whom controls the DID
const stateControllerPrivateKey = "0xc757af48f988ab2ca14d7b6976b8f12d961ccc60633b8e8c593885329b2dce0a9f6c467187860c7f8221c5922102067fa9847ed8b0b16503e96a84ed1fc685d2";
// Bech32Addr : ebsi1qrelqrvcmmu2k6t0kpnr434jqlrlmg2vp6cqx2tchysf40t9tazw2zgyhu5
const stateControllerPublicKey = "0x9f6c467187860c7f8221c5922102067fa9847ed8b0b16503e96a84ed1fc685d2";
async function run() {
    // The DID is updated
    const did = {
        id: "did:0:0",
        verificationMethod: [{
                id: `${didToUpdate}#sign-11`,
                type: "Ed25519VerificationKey2018",
                controller: `${didToUpdate}`,
                publicKeyMultibase: ""
            }]
    };
    // A new keypair is generated for the verification method
    const { publicKeys } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
    // Now converting the second private key into Base58 and multibase format and adding to the verification method
    did.verificationMethod[0].publicKeyMultibase = `z${Base58.encode(publicKeys[0])}`;
    // Posting data to the plugin
    const result = await postToPlugin(did);
    console.log("DID: ", result.doc["id"]);
    console.log("Metadata:\n", result.meta);
}
async function postToPlugin(did) {
    const pluginRequest = {
        type: "DIDUpdate",
        action: "TransactionRequest",
        doc: did
    };
    const updateEndpoint = `${PLUGIN_ENDPOINT}/identities/${encodeURIComponent(didToUpdate)}`;
    const result1 = await post(updateEndpoint, TOKEN, pluginRequest);
    const nextPayload = result1;
    // Now the transaction has to be signed by the state controller
    // The result will contain a txEssence that has to be signed
    // Once it is signed it has to be submitted to the plugin again
    const essence = Converter.hexToBytes(nextPayload.txEssenceHash);
    const essenceSigned = Ed25519.sign(Converter.hexToBytes(stateControllerPrivateKey), essence);
    // Now the essence is signed then the same payload is sent including a signature
    nextPayload.type = "DIDUpdate";
    nextPayload.action = "TransactionSignature";
    nextPayload.signature = [{
            publicKey: stateControllerPublicKey,
            signature: Converter.bytesToHex(essenceSigned, true)
        }];
    const finalResult = await post(updateEndpoint, TOKEN, nextPayload);
    return finalResult;
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlRElERnVuZGVkQnlQbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaWRlbnRpdHkvdXBkYXRlRElERnVuZGVkQnlQbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDbEQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTFDLE9BQU8sRUFBRSxJQUFJLEVBQXFELE1BQU0sYUFBYSxDQUFDO0FBRXRGLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFOUQsTUFBTSxXQUFXLEdBQUcsa0ZBQWtGLENBQUM7QUFDdkcsMkNBQTJDO0FBQzNDLE1BQU0seUJBQXlCLEdBQUcsb0lBQW9JLENBQUM7QUFDdkssZ0ZBQWdGO0FBQ2hGLE1BQU0sd0JBQXdCLEdBQUcsb0VBQW9FLENBQUM7QUFFdEcsS0FBSyxVQUFVLEdBQUc7SUFDZCxxQkFBcUI7SUFDckIsTUFBTSxHQUFHLEdBQUc7UUFDUixFQUFFLEVBQUUsU0FBUztRQUNiLGtCQUFrQixFQUFFLENBQUM7Z0JBQ2pCLEVBQUUsRUFBRSxHQUFHLFdBQVcsVUFBVTtnQkFDNUIsSUFBSSxFQUFFLDRCQUE0QjtnQkFDbEMsVUFBVSxFQUFFLEdBQUcsV0FBVyxFQUFFO2dCQUM1QixrQkFBa0IsRUFBRSxFQUFFO2FBQ3pCLENBQUM7S0FDTCxDQUFBO0lBRUYseURBQXlEO0lBQ3hELE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFeEUsK0dBQStHO0lBQy9HLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVsRiw2QkFBNkI7SUFDN0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBR0QsS0FBSyxVQUFVLFlBQVksQ0FBQyxHQUE4QjtJQUN0RCxNQUFNLGFBQWEsR0FBRztRQUNsQixJQUFJLEVBQUUsV0FBVztRQUNqQixNQUFNLEVBQUUsb0JBQW9CO1FBQzVCLEdBQUcsRUFBRSxHQUFHO0tBQ1gsQ0FBQztJQUVGLE1BQU0sY0FBYyxHQUFHLEdBQUcsZUFBZSxlQUFlLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUM7SUFFMUYsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUNqRSxNQUFNLFdBQVcsR0FBRyxPQUNrRSxDQUFDO0lBRXZGLCtEQUErRDtJQUUvRCw0REFBNEQ7SUFDNUQsK0RBQStEO0lBQy9ELE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBRTdGLGdGQUFnRjtJQUNoRixXQUFXLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQztJQUMvQixXQUFXLENBQUMsTUFBTSxHQUFHLHNCQUFzQixDQUFDO0lBQzVDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsQ0FBQztZQUNyQixTQUFTLEVBQUUsd0JBQXdCO1lBQ25DLFNBQVMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUM7U0FDdkQsQ0FBQyxDQUFDO0lBRUgsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztJQUVuRSxPQUFPLFdBQXNCLENBQUM7QUFDbEMsQ0FBQztBQUlELEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIn0=