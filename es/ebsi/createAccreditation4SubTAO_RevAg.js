// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, ProofPurpose, IotaDIDUrl, Timestamp } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { dids } from "./dids";
import { accreditationSchema, dppSchema, legalEntitySchema } from "./schemas";
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
    // The root of trust accredits to accredit to the ES Government
    const issuerDid = dids.esGovernmentTAO.did;
    const verMethod = "#sign-1";
    const privateKey = dids.esGovernmentTAO.privateKeySign;
    const elements = issuerDid.split(":");
    const did = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const issuerDocument = await didClient.resolveDid(did);
    console.log("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    const subject = {
        id: dids.revenueAgencyTAO.did,
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
            // that are in economicActivity elegible for issuing DPP Data
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
    // Workaround to add Credential Schema
    const privateKeyBytes = Converter.hexToBytes(privateKey);
    // Sign Credential.
    let signedVc;
    try {
        const options = new ProofOptions({
            purpose: ProofPurpose.assertionMethod(),
            created: credAsJson["issued"]
        });
        const iotaUrl = IotaDIDUrl.parse(`${issuerDid}${verMethod}`);
        signedVc = issuerDocument.signCredential(Credential.fromJSON(credAsJson), privateKeyBytes.slice(0, 32), iotaUrl, options);
    }
    catch (error) {
        console.error(error);
        return;
    }
    const credentialJSON = signedVc;
    console.log("Issued credential: \n", JSON.stringify(credentialJSON, null, 2));
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQWNjcmVkaXRhdGlvbjRTdWJUQU9fUmV2QWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZWJzaS9jcmVhdGVBY2NyZWRpdGF0aW9uNFN1YlRBT19SZXZBZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sRUFDSCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFBRSxrQkFBa0IsRUFDOUIsT0FBTyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsU0FBUyxFQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzlFLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU3QyxLQUFLLFVBQVUsR0FBRztJQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO1FBQ3RCLFdBQVcsRUFBRTtZQUNULEdBQUcsRUFBRSxhQUFhO1lBQ2xCLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7U0FDdkI7UUFDRCxRQUFRLEVBQUUsSUFBSTtLQUNqQixDQUFDLENBQUM7SUFDSCxNQUFNLFNB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