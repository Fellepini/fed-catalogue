import { Base58 } from "@iota/util.js";
import { generateAddresses } from "../utilAddress";
import { post } from "../utilHttp";
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
    // The account #1 will be the verification method
    // Write the key pairs to the std output
    const { publicKeys, bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 2);
    // Now converting the second private key into Base58 and multibase format and adding to the verification method
    did.verificationMethod[0].publicKeyMultibase = `z${Base58.encode(publicKeys[1])}`;
    // Posting data to the plugin
    const result = await postToPlugin(did, bech32Addresses);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlRElERnVuZGVkQnlQbHVnaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaWRlbnRpdHkvY3JlYXRlRElERnVuZGVkQnlQbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN2QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVuRCxPQUFPLEVBQUUsSUFBSSxFQUFnQixNQUFNLGFBQWEsQ0FBQztBQUVqRCxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1QixNQUFNLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRTlELEtBQUssVUFBVSxHQUFHO0lBQ2QsbUZBQW1GO0lBQ25GLE1BQU0sR0FBRyxHQUFHO1FBQ1IsRUFBRSxFQUFFLFNBQVM7UUFDYixrQkFBa0IsRUFBRSxDQUFDO2dCQUNqQixFQUFFLEVBQUUsZ0JBQWdCO2dCQUNwQixJQUFJLEVBQUUsNEJBQTRCO2dCQUNsQyxVQUFVLEVBQUUsU0FBUztnQkFDckIsa0JBQWtCLEVBQUUsRUFBRTthQUN6QixDQUFDO0tBQ0wsQ0FBQTtJQUVELGdDQUFnQztJQUNoQyw2Q0FBNkM7SUFDN0MsaURBQWlEO0lBQ2pELHdDQUF3QztJQUN4QyxNQUFNLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxHQUFHLE1BQU0saUJBQWlCLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6RiwrR0FBK0c7SUFDL0csR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRWxGLDZCQUE2QjtJQUM3QixNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ3ZDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBR0QsS0FBSyxVQUFVLFlBQVksQ0FBQyxHQUE4QixFQUFFLGVBQXlCO0lBQ2pGLE1BQU0sYUFBYSxHQUFHO1FBQ2xCLElBQUksRUFBRSxhQUFhO1FBQ25CLE1BQU0sRUFBRSxPQUFPO1FBQ2YsR0FBRyxFQUFFLEdBQUc7UUFDUixJQUFJLEVBQUU7WUFDRixxR0FBcUc7WUFDckcsc0JBQXNCLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztTQUM3QztLQUNKLENBQUM7SUFFRixNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxHQUFHLGVBQWUsYUFBYSxFQUFFLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUVqRixPQUFPLE1BQWlCLENBQUM7QUFDN0IsQ0FBQztBQUlELEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIn0=