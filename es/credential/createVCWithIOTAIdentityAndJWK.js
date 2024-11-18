// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { JWK } from "ts-jose";
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
    const issuerDid = "did:iota:tst:0x1857d5fc9394dc7b3495c1872f35e1ace8a52ee545c4898a1302cbbee05e4566";
    const privateKey = {
        "use": "sig",
        "alg": "EdDSA",
        "crv": "Ed25519",
        "d": "jtthhj-ln6wpD3NyzvpoW44i8ONqil7YzPgCDaX2UMo",
        "x": "OlXv4KUmDPuHC-doMbFc0LdrvMOdh8SHSnBwXQ55rOs",
        "kty": "OKP",
        "kid": "did:iota:tst:0x1857d5fc9394dc7b3495c1872f35e1ace8a52ee545c4898a1302cbbee05e4566#Bq_HhGeQUCqe82fL120PWcyZtZeJDKZ6WJ7rs8DTAjM"
    };
    const key = await JWK.fromObject(privateKey);
    console.log(key.alg);
    const elements = issuerDid.split(":");
    const did = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const issuerDocument = await didClient.resolveDid(did);
    console.log("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    // Create a credential subject indicating the degree earned by Alice, linked to their DID.
    const subject = {
        id: "did:iota:tst:0x986fe72c5e1e8f0a628daa02fe92e7e6c8d3482f73dc6052d8e932025081021b",
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
        validFrom: "2023-06-13T16:08:00Z"
    });
    const privateKeyBytes = Converter.hexToBytes("1234");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlVkNXaXRoSU9UQUlkZW50aXR5QW5kSldLLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NyZWRlbnRpYWwvY3JlYXRlVkNXaXRoSU9UQUlkZW50aXR5QW5kSldLLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUFFLGtCQUFrQixFQUM5QixPQUFPLEVBQ1osTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFN0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUxQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFrQixNQUFNLFNBQVMsQ0FBQztBQUM5QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1QixNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFN0MsS0FBSyxVQUFVLEdBQUc7SUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztRQUN0QixXQUFXLEVBQUU7WUFDVCxHQUFHLEVBQUUsYUFBYTtZQUNsQixJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO1NBQ3ZCO1FBQ0QsUUFBUSxFQUFFLElBQUk7S0FDakIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxTQUFTLEdBQUcsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVqRCxNQUFNLFNBQVMsR0FBRyxpRkFBaUYsQ0FBQztJQUNwRyxNQUFNLFVBQVUsR0FB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