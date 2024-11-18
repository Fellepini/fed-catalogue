import { generateAddresses } from "../utilAddress";
import { post } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
async function run() {
    const trail = {
        record: {
            proof: "1234"
        },
        immutable: {
            "sub": "A45678"
        }
    };
    // From the menemonic a key pair
    // The account #0 will be controlling the Trail
    // Write the key pairs to the std output
    const { bech32Addresses } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
    // Posting data to the plugin
    const result = await postToPlugin(trail, bech32Addresses);
    console.log("Trail ID: ", result.trail["id"]);
    console.log("Metadata:\n", result.meta);
}
async function postToPlugin(trail, bech32Addresses) {
    const pluginRequest = {
        type: "TrailCreation",
        action: "Issue",
        trail,
        meta: {
            // The stateController address could be omitted but in that case the plugin will be controlling as well
            stateControllerAddress: bech32Addresses[0]
        }
    };
    const result = await post(`${PLUGIN_ENDPOINT}/trails`, TOKEN, pluginRequest);
    return result;
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVHJhaWxGdW5kZWRCeVBsdWdpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFpbC9jcmVhdGVUcmFpbEZ1bmRlZEJ5UGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRW5ELE9BQU8sRUFBRSxJQUFJLEVBQWMsTUFBTSxhQUFhLENBQUM7QUFFL0MsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU5RCxLQUFLLFVBQVUsR0FBRztJQUNkLE1BQU0sS0FBSyxHQUFHO1FBQ1YsTUFBTSxFQUFFO1lBQ0osS0FBSyxFQUFFLE1BQU07U0FDaEI7UUFDRCxTQUFTLEVBQUU7WUFDUCxLQUFLLEVBQUUsUUFBUTtTQUNsQjtLQUNKLENBQUE7SUFFRCxnQ0FBZ0M7SUFDaEMsK0NBQStDO0lBQy9DLHdDQUF3QztJQUN4QyxNQUFNLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTdFLDZCQUE2QjtJQUM3QixNQUFNLE1BQU0sR0FBRyxNQUFNLFlBQVksQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFFMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBR0QsS0FBSyxVQUFVLFlBQVksQ0FBQyxLQUFnQyxFQUFFLGVBQXlCO0lBQ25GLE1BQU0sYUFBYSxHQUFHO1FBQ2xCLElBQUksRUFBRSxlQUFlO1FBQ3JCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsS0FBSztRQUNMLElBQUksRUFBRTtZQUNGLHVHQUF1RztZQUN2RyxzQkFBc0IsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1NBQzdDO0tBQ0osQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsZUFBZSxTQUFTLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBRTdFLE9BQU8sTUFBZSxDQUFDO0FBQzNCLENBQUM7QUFJRCxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyJ9