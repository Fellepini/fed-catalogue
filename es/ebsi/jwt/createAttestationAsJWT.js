// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, Timestamp } from "@iota/identity-wasm/node/index.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { didsJwk as ebsiDids } from "../dids";
import { dppSchema } from "../schemas";
import { get, toUnixSeconds } from "../../utilHttp";
import { JWK, JWT } from "ts-jose";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { TOKEN, PLUGIN_ENDPOINT } = process.env;
async function run() {
    // The root of trust accredits to accredit to the ES Government
    const issuerDid = ebsiDids.recyclerTI.did;
    const privateKey = await JWK.fromObject(ebsiDids.recyclerTI.privateKeySign);
    const kid = privateKey.kid;
    // We overwrite it in order the sign process does not fail
    privateKey.metadata.kid = `${issuerDid}#${kid}`;
    const issuerDocument = await get(`${PLUGIN_ENDPOINT}/identities/${encodeURIComponent(issuerDid)}`, TOKEN);
    console.error("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    const subject = {
        id: "https://dlnkd.tn.gg/01/95203454189156/21/6789",
        manufacturingDate: "2023-07-01"
    };
    const expiresAt = "2027-06-22T14:11:44Z";
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
            "id": dppSchema,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXR0ZXN0YXRpb25Bc0pXVC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lYnNpL2p3dC9jcmVhdGVBdHRlc3RhdGlvbkFzSldULnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFVBQVUsRUFDVixTQUFTLEVBQ1osTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUU5QyxPQUFPLEVBQUUsT0FBTyxJQUFJLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUU5QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQXdELE1BQU0sU0FBUyxDQUFDO0FBRXpGLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUUvQyxLQUFLLFVBQVUsR0FBRztJQUVkLCtEQUErRDtJQUMvRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztJQUUxQyxNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxjQUFzQyxDQUFDLENBQUM7SUFDcEcsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztJQUMzQiwwREFBMEQ7SUFDMUQsVUFBVSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcs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