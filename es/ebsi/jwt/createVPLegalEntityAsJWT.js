// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiDidsJwk as ebsiDids } from "../dids";
import { JWK, JWT } from "ts-jose";
import { get } from "../../utilHttp";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { PLUGIN_ENDPOINT, TOKEN } = process.env;
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
    const holder = ebsiDids.recyclerTI;
    const holderDid = holder.did;
    const privateKey = await JWK.fromObject(holder.privateKeySign);
    const kid = privateKey.kid;
    // We overwrite it in order the sign process does not fail
    privateKey.metadata.kid = `${holderDid}#${kid}`;
    const holderDocument = await get(`${PLUGIN_ENDPOINT}/identities/${encodeURIComponent(holderDid)}`, TOKEN);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVlBMZWdhbEVudGl0eUFzSldULmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2Vic2kvand0L2NyZWF0ZVZQTGVnYWxFbnRpdHlBc0pXVC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLElBQUksUUFBUSxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQ2xELE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUF3RCxNQUFNLFNBQVMsQ0FBQztBQUN6RixPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFckMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRS9DLEtBQUssVUFBVSxHQUFHO0lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDbEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1FBQ2xGLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQjtJQUNELDZEQUE2RDtJQUM3RCxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWhDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkMsSUFBSSxXQUFXLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUN6QixPQUFPLENBQUMsS0FBSyxDQUFD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