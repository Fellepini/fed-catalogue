// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { ProofOptions, IotaDocument, IotaIdentityClient, IotaDID } from "@iota/identity-wasm/node/index.js";
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
    // const signerDid = "did:iota:ebsi:0xcd838efcfe53548fbdcd5890e18b22bc2016b91b46bfc28e72dc660f08494d23";
    const signerDid = "did:iota:tst:0xcaa521e19b04f3c75dcc6aa927b666f6947aa56d5a71011aa9e29165d4b41be4";
    const privateKey = "0x52aa743d3d2a3cffa0d29ffaa56197c2ae1723545e9daffeb90de2dab8da9594008edc7881290e8b49c63eb12f75706bbcb3913aa9ec25e16f7e2869bc958234";
    const elements = signerDid.split(":");
    const did = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const issuerDocument = await didClient.resolveDid(did);
    console.log("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    // Create a credential subject indicating the degree earned by Alice, linked to their DID.
    const data = {
        "type": "Organization",
        "name": "IOTA Foundation"
    };
    const privateKeyBytes = Converter.hexToBytes(privateKey);
    // Sign Credential.
    let signedData;
    try {
        signedData = issuerDocument.signData(data, privateKeyBytes.slice(0, 32), did + "#sign-1", ProofOptions.default());
    }
    catch (error) {
        console.error(error);
        return;
    }
    // The issuer is now sure that the credential they are about to issue satisfies their expectations.
    // The credential is then serialized to JSON and transmitted to the holder in a secure manner.
    // Note that the credential is NOT published to the IOTA Tangle. It is sent and stored off-chain.
    const { verificationMethod } = signedData.proof;
    signedData.proof.verificationMethod = `${did}${verificationMethod}`;
    console.log("Signed Data: \n", JSON.stringify(signedData, null, 2));
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbkRhdGFXaXRoSU9UQUlkZW50aXR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NyZWRlbnRpYWwvc2lnbkRhdGFXaXRoSU9UQUlkZW50aXR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFlBQVksRUFDWixZQUFZLEVBQUUsa0JBQWtCLEVBQzlCLE9BQU8sRUFDWixNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUU3RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFDLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU3QyxLQUFLLFVBQVUsR0FBRztJQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO1FBQ3RCLFdBQVcsRUFBRTtZQUNULEdBQUcsRUFBRSxhQUFhO1lBQ2xCLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7U0FDdkI7UUFDRCxRQUFRLEVBQUUsSUFBSTtLQUNqQixDQUFDLENBQUM7SUFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRWpELHdHQUF3RztJQUN4RyxNQUFNLFNBQVMsR0FBRyxpRkFBaUYsQ0FBQztJQUNwRyxNQUFNLFVBQVUsR0FBRyxvSUFBb0ksQ0FBQztJQUV4SixNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5RixNQUFNLGNBQWMsR0FBaUIsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFL0UsMEZBQTBGO0lBQzFGLE1BQU0sSUFBSSxHQUFHO1FBQ1QsTUFBTSxFQUFFLGNBQWM7UUFDdEIsTUFBTSxFQUFFLGlCQUFpQjtLQUM1QixDQUFDO0lBR0YsTUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUV6RCxtQkFBbUI7SUFDbkIsSUFBSSxVQUFVLENBQUM7SUFFZixJQUFJO1FBQ0EsVUFBVSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxTQUFTLEVBQUUsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7S0FDckg7SUFDRCxPQUFPLEtBQUssRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTztLQUNWO0lBRUQsbUdBQW1HO0lBQ25HLDhGQUE4RjtJQUM5RixpR0FBaUc7SUFDakcsTUFBTSxFQUFFLGtCQUFrQixFQUFFLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQztJQUNoRCxVQUFVLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixFQUFFLENBQUM7SUFDcEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4RSxDQUFDO0FBSUQsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMifQ==