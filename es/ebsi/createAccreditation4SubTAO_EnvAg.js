// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, ProofPurpose, IotaDIDUrl, Timestamp } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { dids } from "./dids";
import { accreditationSchema, /*wasteDeclarationSchema, */ wasteOperatorSchema } from "./schemas";
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
        id: dids.envAgencyTAO.did,
        reservedAttributeId: "777777777",
        accreditedFor: [
            {
                schemaId: wasteOperatorSchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAttestation"
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            },
            /* This accreditation can be implicit. i.e. any waste operator might be entitled, implicitly, to
               issue waste declarations or any entity accredited to attest waste operators can accredit to attest Waste
               Declarations
            {
                schemaId: wasteDeclarationSchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAccreditation",
                    "VerifiableAccreditationToAttest",
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            } */
        ]
    };
    const credAsJson = {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        id: "https://id.example.org/id999999",
        type: [
            "VerifiableCredential",
            "VerifiableAccreditation",
            "VerifiableAccreditationToAccredit",
            "VerifiableAccreditationToAttest"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQWNjcmVkaXRhdGlvbjRTdWJUQU9fRW52QWcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZWJzaS9jcmVhdGVBY2NyZWRpdGF0aW9uNFN1YlRBT19FbnZBZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sRUFDSCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFBRSxrQkFBa0IsRUFDOUIsT0FBTyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsU0FBUyxFQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsNEJBQTRCLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDbEcsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO0FBRTdDLEtBQUssVUFBVSxHQUFHO0lBQ2QsTUFBTSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUM7UUFDdEIsV0FBVyxFQUFFO1lBQ1QsR0FBRyxFQUFFLGFBQWE7WUFDbEIsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtTQUN2QjtRQUNELFFBQVEsRUFBRSxJQUFJO0tBQ2pCLENBQUMsQ0FBQztJQUNILE1BQU0s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