// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiReplicaDids as ebsiDids } from "./dids-replica";
import { JWK, JWT } from "ts-jose";
import { get } from "../../utilHttp";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { EBSI_REPLICA_ENDPOINT } = process.env;
async function run() {
    if (!process.argv[2]) {
        console.error("Please provide a VC encoded as a JWT as a command line parameter");
        process.exit(-1);
    }
    // This is the Vc (as JWT) that has to be wrapped into the VP
    const vcAsJwt = process.argv[2];
    const jwtSegments = vcAsJwt.split(".");
    if (jwtSegments.length != 3) {
        console.error("Invalid VC JWT");
        process.exit(-1);
    }
    // The VC is parsed before being wrapped into a VP, just to obtain the subject
    const decoder = new TextDecoder();
    const jwtPayload = JSON.parse(decoder.decode(Buffer.from(jwtSegments[1], "base64")));
    if (!jwtPayload["vc"]) {
        console.error("The JWT does not contain a VC");
        process.exit(-1);
    }
    const vcPayload = jwtPayload["vc"];
    const holder = ebsiDids.ti;
    const holderDid = holder.did;
    const privateKey = await JWK.fromObject(holder.privateKeySign);
    let kid = privateKey.kid;
    if (!kid) {
        kid = await privateKey.getThumbprint();
    }
    // We overwrite it in order the sign process does not fail
    privateKey.metadata.kid = `${holderDid}#${kid}`;
    const holderDocument = await get(`${EBSI_REPLICA_ENDPOINT}/did-registry/v4/identifiers/${encodeURIComponent(holderDid)}`, "");
    console.error("Resolved DID document:", JSON.stringify(holderDocument, null, 2));
    const verifiablePresentation = {
        "@context": "https://www.w3.org/2018/credentials/v1",
        id: "https://id.example.org/vp/456789",
        type: "VerifiablePresentation",
        holder: holderDid,
        verifiableCredential: [vcAsJwt]
    };
    const nonce = "4567789";
    const payload = {
        vp: verifiablePresentation,
        nonce
    };
    const now = Math.floor(Date.now() / 1000);
    const options = {
        issuer: holderDid,
        subject: vcPayload["credentialSubject"]["id"],
        jti: verifiablePresentation["id"],
        kid: `${holderDid}#${kid}`,
        notBefore: now,
        iat: now,
        // Expires in 5 years
        exp: now + 157680000,
        audience: "https://dpp.registry.org"
    };
    let token = "";
    try {
        // Now the JWT Claims are defined
        token = await JWT.sign(payload, privateKey, options);
    }
    catch (error) {
        console.error(error);
        return;
    }
    console.log(token);
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVlBMZWdhbEVudGl0eUFzSldULmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Vic2kvcmVwbGljYS9jcmVhdGVWUExlZ2FsRW50aXR5QXNKV1QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0NBQW9DO0FBQ3BDLHNDQUFzQztBQUV0QyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsZUFBZSxJQUFJLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdELE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUF3RCxNQUFNLFNBQVMsQ0FBQztBQUN6RixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU5QyxLQUFLLFVBQVUsR0FBRztJQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0VBQWtFLENBQUMsQ0FBQztRQUNsRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEI7SUFDRCw2REFBNkQ7SUFDN0QsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQjtJQUVELDhFQUE4RTtJQUM5RSxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRW5DLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUM7SUFFM0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUU3QixNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQXNDLENBQUMsQ0FBQztJQUN2RixJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxHQUFHLEVBQUU7UUFDTixHQUFHLEdBQUcsTUFBTSxVQUFVLENBQUMsYUFBYSxFQUFFLENBQUM7S0FDMUM7SUFDRCwwREFBMEQ7SUFDMUQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFLENBQUM7SUFFL0MsTUFBTSxjQUFjLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxxQkFBcUIsZ0NBQWdDLGtCQUFrQixDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDOUgsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRixNQUFNLHNCQUFzQixHQUFHO1FBQzNCLFVBQVUsRUFBRSx3Q0FBd0M7UUFDcEQsRUFBRSxFQUFFLGtDQUFrQztRQUN0QyxJQUFJLEVBQUUsd0JBQXdCO1FBQzlCLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLG9CQUFvQixFQUFFLENBQUMsT0FBTyxDQUFDO0tBQ2xDLENBQUM7SUFFRixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUM7SUFDeEIsTUFBTSxPQUFPLEdBQWU7UUFDeEIsRUFBRSxFQUFFLHNCQUFzQjtRQUMxQixLQUFLO0tBQ1IsQ0FBQztJQUVGLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRTFDLE1BQU0sT0FBTyxHQUFtQjtRQUM3QixNQUFNLEVBQUUsU0FBUztRQUNqQixPQUFPLEVBQUUsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzdDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxJQUFJLENBQUM7UUFDakMsR0FBRyxFQUFFLEdBQUcsU0FBUyxJQUFJLEdBQUcsRUFBRTtRQUMxQixTQUFTLEVBQUUsR0FBRztRQUNkLEdBQUcsRUFBRSxHQUFHO1FBQ1IscUJBQXFCO1FBQ3JCLEdBQUcsRUFBRSxHQUFHLEdBQUcsU0FBUztRQUNwQixRQUFRLEVBQUUsMEJBQTBCO0tBQ3RDLENBQUM7SUFFRixJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDZixJQUFJO1FBQ0EsaUNBQWlDO1FBQ2pDLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQTtLQUN2RDtJQUNELE9BQU8sS0FBSyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixPQUFPO0tBQ1Y7SUFFRixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRXRCLENBQUM7QUFJRCxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyJ9