// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, Timestamp } from "@iota/identity-wasm/node/index.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiDidsJwk as ebsiDids } from "../dids";
import { get, toUnixSeconds } from "../../utilHttp";
import { JWK, JWT } from "ts-jose";
import { legalEntitySchema } from "../schemas";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { TOKEN, PLUGIN_ENDPOINT } = process.env;
async function run() {
    // The root of trust accredits to accredit to the ES Government
    const issuerDid = ebsiDids.esGovernmentTAO.did;
    const privateKey = await JWK.fromObject(ebsiDids.esGovernmentTAO.privateKeySign);
    const kid = privateKey.kid;
    // We overwrite it in order the sign process does not fail
    privateKey.metadata.kid = `${issuerDid}#${kid}`;
    const issuerDocument = await get(`${PLUGIN_ENDPOINT}/identities/${encodeURIComponent(issuerDid)}`, TOKEN);
    console.error("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    const subject = {
        id: ebsiDids.recyclerTI.did,
        legalName: "Company Recycler AG",
        domainName: "recycler.example.org",
        economicActivity: "http://data.europa.eu/ux2/nace2.1/38",
        legalEmailAddress: "info@recycler.example.org",
        account: "0x8324905441AA4cb6a9C7da0B5a9d644aea825360"
    };
    const expiresAt = "2023-10-24T08:22:00Z";
    const credAsJson = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        id: "https://id.example.org/id999999",
        type: [
            "VerifiableCredential",
            "VerifiableAttestation"
        ],
        issuer: issuerDid,
        issuanceDate: Timestamp.nowUTC(),
        validFrom: Timestamp.nowUTC(),
        expirationDate: expiresAt,
        validUntil: expiresAt,
        issued: Timestamp.nowUTC(),
        credentialSchema: {
            "id": legalEntitySchema,
            "type": "FullJsonSchemaValidator2021"
        },
        credentialSubject: subject,
        credentialStatus: {
            id: "https://api-test.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zZeKyEJfUTGwajhNyNX928z/attributes/60ae46e4fe9adffe0bc83c5e5be825aafe6b5246676398cd1ac36b8999e088a8",
            type: "EbsiAccreditationEntry"
        },
        termsOfUse: {
            id: "https://api-test.ebsi.eu/trusted-issuers-registry/terms/of/use",
            type: "IssuanceCertificate"
        }
    };
    const cred = Credential.fromJSON(credAsJson);
    const finalCred = cred.toJSON();
    console.log(JSON.stringify(finalCred));
    const payload = {
        vc: finalCred,
    };
    const options = {
        issuer: issuerDid,
        subject: subject.id,
        jti: finalCred["id"],
        kid: `${issuerDid}#${kid}`,
        notBefore: toUnixSeconds(finalCred["validFrom"]),
        iat: toUnixSeconds(finalCred["issued"]),
        exp: toUnixSeconds(finalCred["expirationDate"])
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
run().then(() => console.error("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXR0ZXN0YXRpb240TGVnYWxFbnRpdHlBc0pXVC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lYnNpL2p3dC9jcmVhdGVBdHRlc3RhdGlvbjRMZWdhbEVudGl0eUFzSldULnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFVBQVUsRUFDVixTQUFTLEVBQ1osTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUU5QyxPQUFPLEVBQUUsV0FBVyxJQUFJLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVsRCxPQUFPLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUF3RCxNQUFNLFNBQVMsQ0FBQztBQUV6RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHL0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRS9DLEtBQUssVUFBVSxHQUFHO0lBRWQsK0RBQStEO0lBQy9ELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO0lBRS9DLE1BQU0sVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLGNBQXNDLENBQUMsQ0FBQztJQUN6RyxNQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDO0lBQzNCLDBEQUEwRDtJQUMxRCxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxHQUFHLFNBQVMsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUVoRCxNQUFNLGNBQWMsR0FBRyxNQUFNLEdBQUcsQ0FBQyxHQUFHLGVBQWUsZUFBZSxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFakYsTUFBTSxPQUFPLEdBQUc7UUFDWixFQUFFLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHO1FBQzNCLFNBQVMsRUFBRSxxQkFBcUI7UUFDaEMsVUFBVSxFQUFFLHNCQUFzQjtRQUNsQyxnQkFBZ0IsRUFBRSxzQ0FBc0M7UUFDeEQsaUJBQWlCLEVBQUUsMkJBQTJCO1FBQzlDLE9BQU8sRUFBRSw0Q0FBNEM7S0FDeEQsQ0FBQztJQUVGLE1BQU0sU0FBUyxHQUFJLHNCQUFzQixDQUFDO0lBQzFDLE1BQU0sVUFBVSxHQUFHO1FBQ2YsVUFBVSxFQUFFLENBQUMsd0NBQXdDLENBQUM7UUFDdEQsRUFBRSxFQUFFLGlDQUFpQztRQUNyQyxJQUFJLEVBQUU7WUFDRixzQkFBc0I7WUFDdEIsdUJBQXVCO1NBQzFCO1FBQ0QsTUFBTSxFQUFFLFNBQVM7UUFDakIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDaEMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDN0IsY0FBYyxFQUFFLFNBQVM7UUFDekIsVUFBVSxFQUFFLFNBQVM7UUFDckIsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUU7UUFDMUIsZ0JBQWdCLEVBQUU7WUFDZCxJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLE1BQU0sRUFBRSw2QkFBNkI7U0FDeEM7UUFDRCxpQkFBaUIsRUFBRSxPQUFPO1FBQzFCLGdCQUFnQixFQUFFO1lBQ2QsRUFBRSxFQUFFLDJLQUEySztZQUMvSyxJQUFJLEVBQUUsd0JBQXdCO1NBQ2pDO1FBQ0QsVUFBVSxFQUNWO1lBQ0ksRUFBRSxFQUFFLGdFQUFnRTtZQUNwRSxJQUFJLEVBQUUscUJBQXFCO1NBQzlCO0tBQ0osQ0FBQztJQUVGLE1BQU0sSUFBSSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0MsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBRWhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBRXZDLE1BQU0sT0FBTyxHQUFlO1FBQ3hCLEVBQUUsRUFBRSxTQUFTO0tBQ2hCLENBQUM7SUFFRixNQUFNLE9BQU8sR0FBbUI7UUFDN0IsTUFBTSxFQUFFLFNBQVM7UUFDakIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFO1FBQ25CLEdBQUcsRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3BCLEdBQUcsRUFBRSxHQUFHLFNBQVMsSUFBSSxHQUFHLEVBQUU7UUFDMUIsU0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDaEQsR0FBRyxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUNqRCxDQUFDO0lBRUYsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsSUFBSTtRQUNBLGlDQUFpQztRQUNqQyxLQUFLLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUE7S0FDdkQ7SUFDRCxPQUFPLEtBQUssRUFBRTtRQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckIsT0FBTztLQUNWO0lBRUYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN0QixDQUFDO0FBSUQsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMifQ==