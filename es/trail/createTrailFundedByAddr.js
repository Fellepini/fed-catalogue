import { Converter } from "@iota/util.js";
import { generateAddresses, requestFunds } from "../utilAddress";
import { Ed25519 } from "@iota/crypto.js";
import { post, sleep } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { FAUCET, FAUCET_PASS, FAUCET_USER, NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
async function run() {
    const trail = {
        record: {
            proof: "1234"
        },
        immutable: {
            "sub": "A45678"
        }
    };
    const { publicKeys, privateKeys, bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
    // Funding the address that will control #0
    const fundingResult = await requestFunds(FAUCET, { user: FAUCET_USER, pass: FAUCET_PASS }, bech32Addresses[0]);
    console.log(fundingResult);
    console.log("Waiting for funding address ...");
    await sleep(6000);
    // Posting data to the plugin
    const result = await postToPlugin(trail, { bech32Addresses, privateKeys, publicKeys });
    console.log("Trail ID: ", result.trail["id"]);
    console.log("Metadata:\n", result.meta);
}
async function postToPlugin(trail, params) {
    const pluginRequest = {
        type: "TrailCreation",
        action: "TransactionRequest",
        trail,
        meta: {
            stateControllerAddress: params.bech32Addresses[0],
            // In this case the funding an state controller addresses are the same but they can be different
            fundingAddress: params.bech32Addresses[0]
        }
    };
    const result1 = await post(`${PLUGIN_ENDPOINT}/trails`, TOKEN, pluginRequest);
    const nextPayload = result1;
    // The result will contain a txEssence that has to be signed
    // Once it is signed it has to be submitted to the plugin again
    const essence = Converter.hexToBytes(nextPayload.txEssenceHash);
    const essenceSigned = Ed25519.sign(params.privateKeys[0], essence);
    // Now the essence is signed then the same payload is sent including a signature
    nextPayload.type = "TrailCreation";
    nextPayload.action = "TransactionSignature";
    nextPayload.signature = [{
            publicKey: Converter.bytesToHex(params.publicKeys[0], true),
            signature: Converter.bytesToHex(essenceSigned, true)
        }];
    const finalResult = await post(`${PLUGIN_ENDPOINT}/trails`, TOKEN, nextPayload);
    return finalResult;
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVHJhaWxGdW5kZWRCeUFkZHIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhaWwvY3JlYXRlVHJhaWxGdW5kZWRCeUFkZHIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDakUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTFDLE9BQU8sRUFBRSxJQUFJLEVBQWEsS0FBSyxFQUE4QixNQUFNLGFBQWEsQ0FBQztBQUVqRixPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1QixNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRWhHLEtBQUssVUFBVSxHQUFHO0lBQ2QsTUFBTSxLQUFLLEdBQUc7UUFDVixNQUFNLEVBQUU7WUFDSixLQUFLLEVBQUUsTUFBTTtTQUNoQjtRQUNELFNBQVMsRUFBRTtZQUNQLEtBQUssRUFBRSxRQUFRO1NBQ2xCO0tBQ0osQ0FBQTtJQUVELE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxHQUFHLE1BQU0saUJBQWlCLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV0RywyQ0FBMkM7SUFDM0MsTUFBTSxhQUFhLEdBQUcsTUFBTSxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsSUFBSSxF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