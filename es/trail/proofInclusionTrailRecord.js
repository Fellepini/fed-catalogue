import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { generateAddresses } from "../utilAddress";
import { addTrailRecord, createTrail } from "./trailOperations";
import { Converter } from "@iota/util.js";
import { get, post, sleep } from "../utilHttp";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { NODE_ENDPOINT, PLUGIN_ENDPOINT, TOKEN } = process.env;
const trailRecord0 = {
    proof: "1234"
};
const initialTrail = {
    record: trailRecord0,
    immutable: {
        "sub": "A45678"
    }
};
async function run() {
    const endpointDetails = { url: PLUGIN_ENDPOINT, token: TOKEN };
    // first addresses are generated
    const { bech32Addresses, privateKeys, publicKeys } = await generateAddresses(NODE_ENDPOINT, TOKEN, 1);
    // then a trail created
    const result = await createTrail(endpointDetails, initialTrail, bech32Addresses[0]);
    const trailID = result.trail["id"];
    const trailRecord1 = {
        proof: "6789"
    };
    console.log("Waiting for confirmation. Trail Creation ...");
    await sleep(10000);
    const publicKey = Converter.bytesToHex(publicKeys[0], true);
    const privateKey = Converter.bytesToHex(privateKeys[0], true);
    // then another record added
    await addTrailRecord(endpointDetails, trailID, trailRecord1, { publicKey, privateKey });
    const trailRecord2 = {
        proof: "00000"
    };
    console.log("Waiting for confirmation. Trail Record addition ...");
    await sleep(10000);
    // then another record added
    await addTrailRecord(endpointDetails, trailID, trailRecord2, { publicKey, privateKey });
    console.log("Waiting for confirmation. Trail Record addition ...");
    await sleep(10000);
    // then Proof of Inclusion of Record #1
    const resource = `${PLUGIN_ENDPOINT}/trails/${trailID}/inclusion`;
    const pluginRequest = {
        type: "TrailRecordInclusion",
        action: "Prove",
        query: {
            stateIndex: 0,
            record: trailRecord0
        }
    };
    const inclusionResult = await post(resource, TOKEN, pluginRequest);
    const inclResultObj = inclusionResult;
    console.log("Inclusion Result: \n", inclusionResult);
    if (!inclResultObj.inclusionProofed) {
        console.error("Error inclusion not proofed!!!");
        return;
    }
    const poiURL = PLUGIN_ENDPOINT + inclResultObj.proof.href;
    console.log("Retrieving POI from: ", poiURL);
    // Now retrieving the POI
    const poi = await get(poiURL, TOKEN);
    console.log("Proof of Inclusion retrieved ... Validating against standard PoI plugin");
    const verificationEndpoint = NODE_ENDPOINT + "/api/poi/v1/validate";
    const verResult = await post(verificationEndpoint, TOKEN, poi);
    console.log("Validation result: ", verResult);
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvb2ZJbmNsdXNpb25UcmFpbFJlY29yZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmFpbC9wcm9vZkluY2x1c2lvblRyYWlsUmVjb3JkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDaEUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxQyxPQUFPLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFFL0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLGFBQWEsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU5RCxNQUFNLFlBQVksR0FBRztJQUNqQixLQUFLLEVBQUUsTUFBTTtDQUNoQixDQUFDO0FBRUYsTUFBTSxZQUFZLEdBQUc7SUFDakIsTUFBTSxFQUFFLFlBQVk7SUFDcEIsU0FBUyxFQUFFO1FBQ1AsS0FBSyxFQUFFLFFBQVE7S0FDbEI7Q0FDSixDQUFDO0FBRUYsS0FBSyxVQUFVLEdBQUc7SUFDZCxNQUFNLGVBQWUsR0FBRyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBRS9ELGdDQUFnQztJQUNoQyxNQUFNLEVBQUUsZUFBZSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLGlCQUFpQixDQUFDLGFBQWEs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