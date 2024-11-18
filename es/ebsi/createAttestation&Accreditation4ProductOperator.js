// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, ProofPurpose, IotaDIDUrl, Timestamp } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { dids } from "./dids";
import { /* accreditationSchema,*/ dppSchema, legalEntitySchema } from "./schemas";
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
    const issuerDid = dids.revenueAgencyTAO.did;
    const verMethod = "#sign-1";
    const privateKey = dids.revenueAgencyTAO.privateKeySign;
    const elements = issuerDid.split(":");
    const did = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const issuerDocument = await didClient.resolveDid(did);
    console.log("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    // Create a credential subject for the Legal Entity for which the attestation is being created
    const subject = {
        id: dids.manufacturerLegalEntity.did,
        legalName: "Company Manufacturer AG",
        domainName: "manufacturer.example.org",
        limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP",
        accreditedFor: [
            {
                schemaId: dppSchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAttestation",
                    "DPPClaimSet"
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            }
        ],
        economicActivity: "http://data.europa.eu/ux2/nace2.1/26"
    };
    const unsignedVc = {
        "@context": [
            "https://europa.eu/schemas/v-id/2020/v1",
            "https://www.w3.org/2018/credentials/v1"
        ],
        id: "https://example.edu/credentials/3732",
        type: [
            "VerifiableCredential",
            "VerifiableAttestation",
            "VerifiableAccreditationToAttest"
        ],
        issuer: issuerDid,
        credentialSubject: subject,
        credentialSchema: /*[ Commented due to misalignment of EBSI Legal Entity Schema with latest Attestation Schema */ {
            type: "FullJsonSchemaValidator2021",
            id: legalEntitySchema
        } /*,
            {
                type: "FullJsonSchemaValidator2021",
                id: accreditationSchema
            }
        ]*/,
        issuanceDate: Timestamp.nowUTC(),
        issued: Timestamp.nowUTC(),
        validFrom: Timestamp.nowUTC(),
        evidence: [
            {
                id: "https://europa.eu/tsr-vid/evidence/f2aeec97-fc0d-42bf-8ca7-0548192d4231",
                type: ["DocumentVerification"],
                verifier: "did:ebsi:2e81454f76775c687694ee6772a17796436768a30e289555",
                evidenceDocument: ["Passport"],
                subjectPresence: "Physical",
                documentPresence: ["Physical"]
            }
        ],
        credentialStatus: {
            id: "https://api-test.ebsi.eu/trusted-issuers-registry/v4/issuers/did:ebsi:zZeKyEJfUTGwajhNyNX928z/attributes/60ae46e4fe9adffe0bc83c5e5be825aafe6b5246676398cd1ac36b8999e088a8",
            type: "EbsiAccreditationEntry"
        },
        termsOfUse: {
            id: "https://api-test.ebsi.eu/trusted-issuers-registry/terms/of/use",
            type: "IssuanceCertificate"
        }
    };
    const privateKeyBytes = Converter.hexToBytes(privateKey);
    // Sign Credential.
    let signedVc;
    try {
        const options = new ProofOptions({
            purpose: ProofPurpose.assertionMethod(),
            created: Timestamp.nowUTC()
        });
        const iotaUrl = IotaDIDUrl.parse(`${issuerDid}${verMethod}`);
        const finalCred = Credential.fromJSON(unsignedVc);
        signedVc = issuerDocument.signCredential(finalCred, privateKeyBytes.slice(0, 32), iotaUrl, options);
    }
    catch (error) {
        console.error(error);
        return;
    }
    const credentialJSON = signedVc;
    console.log("Issued credential: \n", JSON.stringify(credentialJSON, null, 2));
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXR0ZXN0YXRpb24mQWNjcmVkaXRhdGlvbjRQcm9kdWN0T3BlcmF0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZWJzaS9jcmVhdGVBdHRlc3RhdGlvbiZBY2NyZWRpdGF0aW9uNFByb2R1Y3RPcGVyYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sRUFDSCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFBRSxrQkFBa0IsRUFDOUIsT0FBTyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsU0FBUyxFQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUseUJBQXlCLENBQUMsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ25GLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU3QyxLQUFLLFVBQVUsR0FBRztJQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO1FBQ3RCLFdBQVcsRUFBRTtZQUNULEdBQUcsRUFBRSxhQUFhO1lBQ2xCLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7U0FDdkI7UUFDRCxRQUFRLEVBQUUsSUFB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