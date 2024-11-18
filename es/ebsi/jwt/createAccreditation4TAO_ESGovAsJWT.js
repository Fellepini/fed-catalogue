// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, Timestamp } from "@iota/identity-wasm/node/index.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiDidsJwk as ebsiDids } from "../dids";
import { accreditationSchema, auditOrgSchema, legalEntitySchema, wasteOperatorSchema } from "../schemas";
import { get, toUnixSeconds } from "../../utilHttp";
import { JWK, JWT } from "ts-jose";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { TOKEN, PLUGIN_ENDPOINT } = process.env;
async function run() {
    // The root of trust accredits to accredit to the ES Government
    const issuerDid = ebsiDids.rootTrust.did;
    const privateKey = await JWK.fromObject(ebsiDids.rootTrust.privateKeySign);
    const kid = privateKey.kid;
    // We overwrite it in order the sign process does not fail
    privateKey.metadata.kid = `${issuerDid}#${kid}`;
    const issuerDocument = await get(`${PLUGIN_ENDPOINT}/identities/${encodeURIComponent(issuerDid)}`, TOKEN);
    console.error("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    const subject = {
        id: ebsiDids.esGovernmentTAO.did,
        reservedAttributeId: "1244",
        accreditedFor: [
            {
                schemaId: legalEntitySchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAccreditation",
                    "VerifiableAccreditationToAttest"
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            },
            {
                schemaId: wasteOperatorSchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAccreditation",
                    "VerifiableAccreditationToAttest"
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            },
            {
                schemaId: auditOrgSchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAttestation"
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            }
        ]
    };
    const expiresAt = "2024-06-22T14:11:44Z";
    const credAsJson = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        id: "https://id.example.org/id999999",
        type: [
            "VerifiableCredential",
            "VerifiableAccreditation",
            "VerifiableAccreditationToAccredit"
        ],
        issuer: issuerDid,
        issuanceDate: Timestamp.nowUTC(),
        validFrom: Timestamp.nowUTC(),
        expirationDate: expiresAt,
        validUntil: expiresAt,
        issued: Timestamp.nowUTC(),
        credentialSchema: {
            "id": accreditationSchema,
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
        subject: ebsiDids.esGovernmentTAO.did,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQWNjcmVkaXRhdGlvbjRUQU9fRVNHb3ZBc0pXVC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lYnNpL2p3dC9jcmVhdGVBY2NyZWRpdGF0aW9uNFRBT19FU0dvdkFzSldULnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFVBQVUsRUFDVixTQUFTLEVBQ1osTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUU5QyxPQUFPLEVBQUUsV0FBVyxJQUFJLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVsRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLG1CQUFtQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3pHLE9BQU8sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQXdELE1BQU0sU0FBUyxDQUFDO0FBRXpGLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxLQUFLLEVBQUUsZUFBZSxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUUvQyxLQUFLLFVBQVUsR0FBRztJQUVkLCtEQUErRDtJQUMvRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQztJQUV6QyxNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxjQUFzQyxDQUFDLENBQUM7SUFDbkcsTUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFD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