// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, Timestamp } from "@iota/identity-wasm/node/index.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiDidsJwk as ebsiDids } from "../dids";
import { accreditationSchema, dppSchema, legalEntitySchema } from "../schemas";
import { JWK, JWT } from "ts-jose";
import { get, toUnixSeconds } from "../../utilHttp";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { PLUGIN_ENDPOINT, TOKEN } = process.env;
async function run() {
    const issuer = ebsiDids.rootTrust;
    const subject = ebsiDids.esGovernmentTAO;
    // The root of trust accredits to accredit to the ES Government
    const issuerDid = issuer.did;
    // Issuer's private key used to sign
    const privateKey = await JWK.fromObject(issuer.privateKeySign);
    const kid = privateKey.kid;
    // We overwrite it in order the sign process does not fail
    privateKey.metadata.kid = `${issuerDid}#${kid}`;
    const issuerDocument = await get(`${PLUGIN_ENDPOINT}/identities/${encodeURIComponent(issuerDid)}`, TOKEN);
    console.error("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    const subjectData = {
        id: subject.did,
        reservedAttributeId: "88888",
        accreditedFor: [
            {
                schemaId: legalEntitySchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAttestation"
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            },
            // The revenue agency can give this accreditation to those legal entities, i.e. economic operators
            // that are in economicActivity eligible for issuing DPP Data
            // That's why this is made explicit here, albeit it could have been implicit
            {
                schemaId: dppSchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAccreditation",
                    "VerifiableAccreditationToAttest",
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            }
        ]
    };
    const credAsJson = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        id: "https://id.example.org/id999999",
        type: [
            "VerifiableCredential",
            "VerifiableAccreditation",
            "VerifiableAccreditationToAttest",
            // The Rev Ag can accredit product operators to issue DPP Data
            "VerifiableAccreditationToAccredit"
        ],
        issuer: issuerDid,
        issuanceDate: Timestamp.nowUTC(),
        validFrom: Timestamp.nowUTC(),
        expirationDate: "2024-06-22T14:11:44Z",
        issued: Timestamp.nowUTC(),
        credentialSchema: {
            "id": accreditationSchema,
            "type": "FullJsonSchemaValidator2021"
        },
        credentialSubject: subjectData,
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
        subject: subject.did,
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
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQWNjcmVkaXRhdGlvbjRTdWJUQU9fUmV2QWdBc0pXVC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lYnNpL2p3dC9jcmVhdGVBY2NyZWRpdGF0aW9uNFN1YlRBT19SZXZBZ0FzSldULnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFVBQVUsRUFDVixTQUFTLEVBQ1osTUFBTSxtQ0FBbUMsQ0FBQztBQUczQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsV0FBVyxJQUFJLFFBQVEsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNsRCxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQy9FLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUF3RCxNQUFNLFNBQVMsQ0FBQztBQUN6RixPQUFPLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUUvQyxLQUFLLFVBQVUsR0FBRztJQUVkLE1BQU0sTUFBTSxHQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUM7SUFDbkMsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztJQUV6QywrREFBK0Q7SUFDL0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUU3QixvQ0FBb0M7SUFDcEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENB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