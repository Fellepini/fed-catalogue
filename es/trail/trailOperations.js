import { post } from "../utilHttp";
import { Converter } from "@iota/util.js";
import { Ed25519 } from "@iota/crypto.js";
export async function createTrail(endpoint, trail, stateControllerBech32Addr) {
    const pluginRequest = {
        type: "TrailCreation",
        action: "Issue",
        trail,
        meta: {
            // The stateController address could be omitted but in that case the plugin will be controlling as well
            stateControllerAddress: stateControllerBech32Addr
        }
    };
    const result = await post(`${endpoint.url}/trails`, endpoint.token, pluginRequest);
    return result;
}
export async function addTrailRecord(endpoint, trailID, record, address) {
    const pluginRequest = {
        type: "TrailRecordAdd",
        action: "TransactionRequest",
        record
    };
    const stateControllerPrivateKey = address.privateKey;
    const stateControllerPublicKey = address.publicKey;
    const updateEndpoint = `${endpoint.url}/trails/${encodeURIComponent(trailID)}`;
    const result1 = await post(updateEndpoint, endpoint.token, pluginRequest);
    const nextPayload = result1;
    // Now the transaction has to be signed by the state controller
    // The result will contain a txEssence that has to be signed
    // Once it is signed it has to be submitted to the plugin again
    const essence = Converter.hexToBytes(nextPayload.txEssenceHash);
    const essenceSigned = Ed25519.sign(Converter.hexToBytes(stateControllerPrivateKey), essence);
    // Now the essence is signed then the same payload is sent including a signature
    nextPayload.type = "TrailRecordAdd";
    nextPayload.action = "TransactionSignature";
    nextPayload.signature = [{
            publicKey: stateControllerPublicKey,
            signature: Converter.bytesToHex(essenceSigned, true)
        }];
    const finalResult = await post(updateEndpoint, endpoint.token, nextPayload);
    return finalResult;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhaWxPcGVyYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3RyYWlsL3RyYWlsT3BlcmF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUEyRCxNQUFNLGFBQWEsQ0FBQztBQUU1RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUxQyxNQUFNLENBQUMsS0FBSyxVQUFVLFdBQVcsQ0FBQyxRQUF3QyxFQUN0RSxLQUFnQyxFQUFFLHlCQUFpQztJQUVuRSxNQUFNLGFBQWEsR0FBRztRQUNsQixJQUFJLEVBQUUsZUFBZTtRQUNyQixNQUFNLEVBQUUsT0FBTztRQUNmLEtBQUs7UUFDTCxJQUFJLEVBQUU7WUFDRix1R0FBdUc7WUFDdkcsc0JBQXNCLEVBQUUseUJBQXlCO1NBQ3BEO0tBQ0osQ0FBQztJQUVGLE1BQU0sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLEdBQUcsU0FBUyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFbkYsT0FBTyxNQUFlLENBQUM7QUFDM0IsQ0FBQztBQUdELE1BQU0sQ0FBQyxLQUFLLFVBQVUsY0FBYyxDQUFDLFFBQXdDLEVBQ3pFLE9BQWUsRUFBRSxNQUFtQixFQUFFLE9BQWtEO0lBQ3hGLE1BQU0sYUFBYSxHQUFHO1FBQ2xCLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsTUFBTSxFQUFFLG9CQUFvQjtRQUM1QixNQUFNO0tBQ1QsQ0FBQztJQUVGLE1BQU0seUJBQXlCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQztJQUNyRCxNQUFNLHdCQUF3QixHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFFbkQsTUFBTSxjQUFjLEdBQUcsR0FBRyxRQUFRLENBQUMsR0FBRyxXQUFXLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7SUFFL0UsTUFBTSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDMUUsTUFBTSxXQUFXLEdBQUcsT0FDa0UsQ0FBQztJQUV2RiwrREFBK0Q7SUFFL0QsNERBQTREO0lBQzVELCtEQUErRDtJQUMvRCxNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNoRSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMseUJBQXlCLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUU3RixnRkFBZ0Y7SUFDaEYsV0FBVyxDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztJQUNwQyxXQUFXLENBQUMsTUFBTSxHQUFHLHNCQUFzQixDQUFDO0lBQzVDLFdBQVcsQ0FBQyxTQUFTLEdBQUcsQ0FBQztZQUNyQixTQUFTLEVBQUUsd0JBQXdCO1lBQ25DLFNBQVMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUM7U0FDdkQsQ0FBQyxDQUFDO0lBRUgsTUFBTSxXQUFXLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFNUUsT0FBTyxXQUFvQixDQUFDO0FBQ2hDLENBQUMifQ==