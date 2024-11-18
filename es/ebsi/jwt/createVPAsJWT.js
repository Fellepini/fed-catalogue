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
    const holder = ebsiDids.esGovernmentTAO;
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
        // Expires in 1 hour
        exp: now + 3600,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVlBBc0pXVC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lYnNpL2p3dC9jcmVhdGVWUEFzSldULnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLFdBQVcsSUFBSSxRQUFRLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDbEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQXdELE1BQU0sU0FBUyxDQUFDO0FBQ3pGLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUVyQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1QixNQUFNLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFL0MsS0FBSyxVQUFVLEdBQUc7SUFDZCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7UUFDbEYsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsNkRBQTZEO0lBQzdELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFaEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2QyxJQUFJLFdBQVcsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3pCLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNo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