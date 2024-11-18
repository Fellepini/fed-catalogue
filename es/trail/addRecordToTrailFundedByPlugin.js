import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { addTrailRecord } from "./trailOperations";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { PLUGIN_ENDPOINT, TOKEN } = process.env;
const trailID = "urn:trail:iota:ebsi:0x51b68173108c7ce357f09836da611057768c7641f823834aec49232667900ce2";
// The private key of whom controls the DID
const stateControllerPrivateKey = "0xaf6a6c1713c147920b87879d720b40c029883658cbd7df21366265211946337ad08f4711282a234005b19906dcea534e62d7cfc8220badf46a488b618f73a99e";
// Bech32Addr : tst1qqsjpwktq5xfrhd092u4rj4aye4peymgrg44glgg4g4vmlw2sjavqqtkv7g
const stateControllerPublicKey = "0xd08f4711282a234005b19906dcea534e62d7cfc8220badf46a488b618f73a99e";
async function run() {
    // A new record to the trail is added
    const record = {
        proof: {
            value: "4567888888"
        }
    };
    // Posting data to the plugin
    const result = await addTrailRecord({ url: PLUGIN_ENDPOINT, token: TOKEN }, trailID, record, {
        publicKey: stateControllerPublicKey, privateKey: stateControllerPrivateKey
    });
    console.log("Trail Next State: ", result.trail);
    console.log("Metadata:\n", result.meta);
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkUmVjb3JkVG9UcmFpbEZ1bmRlZEJ5UGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYWlsL2FkZFJlY29yZFRvVHJhaWxGdW5kZWRCeVBsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRS9DLE1BQU0sT0FBTyxHQUFHLHdGQUF3RixDQUFDO0FBQ3pHLDJDQUEyQztBQUMzQyxNQUFNLHlCQUF5QixHQUFHLG9JQUFvSSxDQUFDO0FBQ3ZLLCtFQUErRTtBQUMvRSxNQUFNLHdCQUF3QixHQUFHLG9FQUFvRSxDQUFDO0FBRXRHLEtBQUssVUFBVSxHQUFHO0lBQ2QscUNBQXFDO0lBQ3JDLE1BQU0sTUFBTSxHQUFHO1FBQ1gsS0FBSyxFQUFFO1lBQ0gsS0FBSyxFQUFFLFlBQVk7U0FDdEI7S0FDSixDQUFDO0lBRUYsNkJBQTZCO0lBQzdCLE1BQU0sTUFBTSxHQUFHLE1BQU0sY0FBYyxDQUFDLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtRQUN6RixTQUFTLEVBQUUsd0JBQXdCLEVBQUUsVUFBVSxFQUFFLHlCQUF5QjtLQUM3RSxDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoRCxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsQ0FBQztBQUlELEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIn0=