// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { didsJwk as ebsiDids } from "../dids";
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
    const holder = ebsiDids.naturalPerson;
    const holderDid = holder.did;
    const privateKey = await JWK.fromObject(holder.privateKeySign);
    const kid = await privateKey.getThumbprint();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVlBBc0pXVFdpdGhIb2xkZXJEaWRLZXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvZWJzaS9qd3QvY3JlYXRlVlBBc0pXVFdpdGhIb2xkZXJEaWRLZXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsb0NBQW9DO0FBQ3BDLHNDQUFzQztBQUV0QyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBd0QsTUFBTSxTQUFTLENBQUM7QUFDekYsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXJDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUUvQyxLQUFLLFVBQVUsR0FBRztJQUNkLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xCLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0VBQWtFLENBQUMsQ0FBQztRQUNsRixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEI7SUFDRCw2REFBNkQ7SUFDN0QsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVoQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZDLElBQUksV0FBVyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDekIsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ2hDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNwQjtJQUVELDhFQUE4RTtJQUM5RSxNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsRUFBRSxDQUFDO0lBQ2xDLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFckYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuQixPQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDL0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3BCO0lBQ0QsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRW5DLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7SUFDdEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUU3QixNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLGNBQXNDLENBQUMsQ0FBQztJQUN2RixNQUFNLEdBQUcsR0FBRyxNQUFNLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM3QywwREFBMEQ7SUFDMUQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFLENBQUM7SUFFaEQsTUFBTSxjQUFjLEdBQUcsTUFBTSxHQUFHLENBQUMsR0FBRyxlQUFlLGVBQWUsa0JBQWtCLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMxRyxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWpGLE1BQU0sc0JBQXNCLEdBQUc7UUFDM0IsVUFBVSxFQUFFLHdDQUF3QztRQUNwRCxFQUFFLEVBQUUsa0NBQWtDO1FBQ3RDLElBQUksRUFBRSx3QkFBd0I7UUFDOUIsTUFBTSxFQUFFLFNBQVM7UUFDakIsb0JBQW9CLEVBQUUsQ0FBQyxPQUFPLENBQUM7S0FDbEMsQ0FBQztJQUVGLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQztJQUN4QixNQUFNLE9BQU8sR0FBZTtRQUN4QixFQUFFLEVBQUUsc0JBQXNCO1FBQzFCLEtBQUs7S0FDUixDQUFDO0lBRUYsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFFMUMsTUFBTSxPQUFPLEdBQW1CO1FBQzVCLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE9BQU8sRUFBRSxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDN0MsR0FBRyxFQUFFLHNCQUFzQixDQUFDLElBQUksQ0FBQztRQUNqQyxHQUFHLEVBQUUsR0FBRyxTQUFTLElBQUksR0FBRyxFQUFFO1FBQzFCLFNBQVMsRUFBRSxHQUFHO1FBQ2QsR0FBRyxFQUFFLEdBQUc7UUFDUixxQkFBcUI7UUFDckIsR0FBRyxFQUFFLEdBQUcsR0FBRyxTQUFTO1FBQ3BCLFFBQVEsRUFBRSwwQkFBMEI7S0FDdkMsQ0FBQztJQUVGLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLElBQUk7UUFDQSxpQ0FBaUM7UUFDakMsS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0tBQ3ZEO0lBQ0QsT0FBTyxLQUFLLEVBQUU7UUFDVixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLE9BQU87S0FDVjtJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFdkIsQ0FBQztBQUlELEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIn0=