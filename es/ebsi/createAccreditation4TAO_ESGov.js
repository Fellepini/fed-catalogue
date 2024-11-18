// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, ProofPurpose, IotaDIDUrl, Timestamp } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiDids as ebsiDids } from "./dids";
import { accreditationSchema, auditOrgSchema, legalEntitySchema, wasteOperatorSchema } from "./schemas";
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
    if (process.argv[2]) {
        ebsiDids.esGovernmentTAO.did = process.argv[2];
    }
    // The root of trust accredits to accredit to the ES Government
    const issuerDid = ebsiDids.rootTrust.did;
    const verMethod = "#sign-1";
    const privateKey = ebsiDids.rootTrust.privateKeySign;
    const elements = issuerDid.split(":");
    const did = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const issuerDocument = await didClient.resolveDid(did);
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
    console.log(JSON.stringify(credentialJSON, null, 2));
}
run().then(() => console.error("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQWNjcmVkaXRhdGlvbjRUQU9fRVNHb3YuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZWJzaS9jcmVhdGVBY2NyZWRpdGF0aW9uNFRBT19FU0dvdi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sRUFDSCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFBRSxrQkFBa0IsRUFDOUIsT0FBTyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsU0FBUyxFQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLFFBQVEsSUFBSSxRQUFRLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDOUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUN4RyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1QixNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFN0MsS0FBSyxVQUFVLEdBQUc7SUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztRQUN0QixXQUFXLEVBQUU7WUFDVCxHQUFHLEVBQUUsYUFBYTtZQUNsQixJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO1NBQ3ZCO1FBQ0QsUUFBUSxFQUFFLElBQUk7S0FDakIsQ0FBQyxD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