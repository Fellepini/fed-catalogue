import { generateAddresses } from "../utilAddress";
import { post } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { JWK } from "ts-jose";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
async function run() {
    // From the menemonic a key pair
    // The account #0 will be controlling the DID
    // The account #1 will be the verification method
    // Write the key pairs to the std output
    const { bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
    // Now the JWK is generated and its public key just copied to the DID and the Private Key printed to stdout
    const key = await JWK.generate("ES256", {
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
    did.verificationMethod[0].publicKeyJwk = key.toObject(false);
    // Posting data to the plugin
    const result = await postToPlugin(did, bech32Addresses);
    const privateKey = key.toObject(true);
    privateKey.kid = `${verMethod}`;
    console.log("Private Key of the Verification Method: ");
    console.log(JSON.stringify(privateKey, undefined, 2));
    console.log();
    console.log("DID: ", result.doc["id"]);
    console.log("Metadata:\n", result.meta);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRElEV2l0aEpXS0Z1bmRlZEJ5UGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2lkZW50aXR5L2NyZWF0ZURJRFdpdGhKV0tGdW5kZWRCeVBsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsSUFBSSxFQUFnQixNQUFNLGFBQWEsQ0FBQztBQUVqRCxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFOUQsS0FBSyxVQUFVLEdBQUc7SUFDZCxnQ0FBZ0M7SUFDaEMsNkNBQTZDO0lBQzdDLGlEQUFpRDtJQUNqRCx3Q0FBd0M7SUFDeEMsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLE1BQU0saUJBQWlCLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU3RSwyR0FBMkc7SUFDM0csTUFBTSxHQUFHLEdBQVEsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN6Qyw0RUFBNEU7UUFDNUUsc0dBQXNHO1FBQ3RHLHNCQUFzQjtRQUN0QixHQUFHLEVBQUUsS0FBSztRQUNWLHlEQUF5RDtRQUN6RCxrRUFBa0U7S0FDckUsQ0FBQyxDQUFDO0lBRUgsTUFBTSxTQUFTLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7SUFFM0MsbUZBQW1GO0lBQ25GLE1BQU0sR0FBRyxHQUFHO1FBQ1QsRUFBRSxFQUFFLFNBQVM7UUFDYixrQkFBa0IsRUFBRSxDQUFDO2dCQUNqQixFQUFFLEVBQUUsV0FBVyxTQUFTLEVBQUU7Z0JBQzFCLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLFVBQVUsRUFBRSxTQUFTO2dCQUNyQixZQUFZLEVBQUUsRUFBRTthQUNuQixDQUFDO0tBQ0wsQ0FBQztJQUVGLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUU3RCw2QkFBNkI7SUFDN0IsTUFBTSxNQUFNLEdBQUcsTUFBTSxZQUFZLENBQUMsR0FBRyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBRXhELE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEMsVUFBVSxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsRUFBRSxDQUFDO0lBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMENBQTBDLENBQUMsQ0FBQztJQUN4RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVkLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN2QyxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUdELEtBQUssVUFBVSxZQUFZLENBQUMsR0FBOEIsRUFBRSxlQUF5QjtJQUNqRixNQUFNLGFBQWEsR0FBRztRQUNsQixJQUFJLEVBQUUsYUFBYTtRQUNuQixNQUFNLEVBQUUsT0FBTztRQUNmLEdBQUcsRUFBRSxHQUFHO1FBQ1IsSUFBSSxFQUFFO1lBQ0YscUdBQXFHO1lBQ3JHLHNCQUFzQixFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7U0FDN0M7S0FDSixDQUFDO0lBRUYsTUFBTSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxlQUFlLGFBQWEsRUFBRSxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFakYsT0FBTyxNQUFpQixDQUFDO0FBQzdCLENBQUM7QUFJRCxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyJ9