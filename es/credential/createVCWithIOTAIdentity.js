// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, Timestamp } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { NODE_ENDPOINT, TOKEN } = process.env;
async function run() {
    const client = new Client({
        primaryNode: {
            url: NODE_ENDPOINT,
            auth: { jwt: TOKEN }
        },
        localPow: true,
    });
    const didClient = new IotaIdentityClient(client);
    const issuerDid = "did:iota:ebsi:0x294504304088c482f5c56ad011c7233780e33191264ce65cc0617bd46493a137";
    const privateKey = "0x67787a144c107e3541998eb8d2189ab9baf3503cef9378a870d997aef570db6b8ac05ef856571d063c9a728af26f0afd831a10b572950a5cf2bf180ddef4c781";
    const elements = issuerDid.split(":");
    const did = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const issuerDocument = await didClient.resolveDid(did);
    console.log("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    // Create a credential subject indicating the degree earned by Alice, linked to their DID.
    const subject = {
        id: "did:key:z2dmzD81cgPx8Vki7JbuuMmFYrWPgYoytykUZ3eyqht1j9KbrzdmNG8Mo31GpCiGD5E6GjYBiq6Dnz81gRmtWEsRrmcML3V2UNRtfXgZToChY2dfQq9ySg92PhH4vebHp2TJyuSFcLZBmx8FKD2McNDAiTELZNyyzatLWCv841s94DJgWg",
        name: "Alice",
        degreeName: "Bachelor of Science and Arts",
        degreeType: "BachelorDegree",
        GPA: "4.0",
    };
    // Create an unsigned `UniversityDegree` credential for Alice
    const unsignedVc = new Credential({
        id: "https://example.edu/credentials/3732",
        type: "UniversityDegreeCredential",
        issuer: issuerDid,
        credentialSubject: subject,
        validFrom: Timestamp.nowUTC()
    });
    const privateKeyBytes = Converter.hexToBytes(privateKey);
    // Sign Credential.
    let signedVc;
    try {
        signedVc = issuerDocument.signCredential(unsignedVc, privateKeyBytes.slice(0, 32), "#sign-1", ProofOptions.default());
    }
    catch (error) {
        console.error(error);
        return;
    }
    // The issuer is now sure that the credential they are about to issue satisfies their expectations.
    // The credential is then serialized to JSON and transmitted to the holder in a secure manner.
    // Note that the credential is NOT published to the IOTA Tangle. It is sent and stored off-chain.
    const credentialJSON = signedVc.toJSON();
    console.log("Issued credential: \n", JSON.stringify(credentialJSON, null, 2));
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVkNXaXRoSU9UQUlkZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NyZWRlbnRpYWwvY3JlYXRlVkNXaXRoSU9UQUlkZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUFFLGtCQUFrQixFQUM5QixPQUFPLEVBQ1QsU0FBUyxFQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRTdDLEtBQUssVUFBVSxHQUFHO0lBQ2QsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUM7UUFDdEIsV0FBVyxFQUFFO1lBQ1QsR0FBRyxFQUFFLGFBQWE7WUFDbEIsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFHLEtBQUssRUFBRTtTQUN4QjtRQUNELFFBQVEsRUFBRSxJQUFJO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0sU0FBUyxHQUFHLElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFakQsTUFBTSxTQUFTLEdBQUcsa0ZBQWtGLENBQUM7SUFDckcsTUFBTSxVQUFVLEdBQUcsb0lBQW9JLENBQUM7SUFFeEosTUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0QyxNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUYsTUFBTSxjQUFjLEdBQWlCLE1BQU0sU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNyRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUF3QixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRS9FLDBGQUEwRjtJQUMxRixNQUFNLE9BQU8sR0FBRztRQUNaLEVBQUUsRUFBRSw0TEFBNEw7UUFDaE0sSUFBSSxFQUFFLE9BQU87UUFDYixVQUFVLEVBQUUsOEJBQThCO1FBQzFDLFVBQVUsRUFBRSxnQkFBZ0I7UUFDNUIsR0FBRyxFQUFFLEtBQUs7S0FDYixDQUFDO0lBRUYsNkRBQTZEO0lBQzdELE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDO1FBQzlCLEVBQUUsRUFBRSxzQ0FBc0M7UUFDMUMsSUFBSSxFQUFFLDRCQUE0QjtRQUNsQyxNQUFNLEVBQUUsU0FBUztRQUNqQixpQkFBaUIsRUFBRSxPQUFPO1FBQzFCLFNBQVMsRUFBRSxTQUFTLENBQUMsTUFBTSxFQUFFO0tBQ2hDLENBQUMsQ0FBQztJQUVILE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFekQsbUJBQW1CO0lBQ25CLElBQUksUUFBUSxDQUFDO0lBRWIsSUFBSTtRQUNBLFFBQVEsR0FBRyxjQUFjLENBQUMsY0FBYyxDQUFDLFVBQVUsRUFBRSxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDekg7SUFDRCxPQUFPLEtBQUssRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTztLQUNWO0lBRUQsbUdBQW1HO0lBQ25HLDhGQUE4RjtJQUM5RixpR0FBaUc7SUFDakcsTUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEYsQ0FBQztBQUlELEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIn0=