// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, ProofPurpose, IotaDIDUrl, Timestamp } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { dids } from "./dids";
import { accreditationSchema, wasteDeclarationSchema, wasteOperatorSchema } from "./schemas";
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
    const issuerDid = dids.envAgencyTAO.did;
    const verMethod = "#sign-1";
    const privateKey = dids.envAgencyTAO.privateKeySign;
    const elements = issuerDid.split(":");
    const did = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const issuerDocument = await didClient.resolveDid(did);
    console.log("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    // Create a credential subject for the Legal Entity for which the attestation is being created
    const subject = {
        id: dids.recyclerTI.did,
        reservedAttributeId: "088888888",
        legalName: "Company Recycler AG",
        wasteOperatorNumber: "A456789",
        limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP",
        accreditedFor: [
            {
                schemaId: wasteDeclarationSchema,
                types: [
                    "VerifiableCredential",
                    "VerifiableAttestation",
                    "WasteOperationDeclaration"
                ],
                limitJurisdiction: "https://publications.europa.eu/resource/authority/atu/ESP"
            }
        ]
    };
    const unsignedVc = {
        "@context": [
            "https://europa.eu/schemas/v-id/2020/v1",
            "https://www.w3.org/2018/credentials/v1"
        ],
        id: "https://example.edu/credentials/38013",
        type: [
            "VerifiableCredential",
            "VerifiableAttestation",
            "VerifiableAccreditationToAttest"
        ],
        issuer: issuerDid,
        credentialSubject: subject,
        credentialSchema: [
            {
                type: "FullJsonSchemaValidator2021",
                id: wasteOperatorSchema
            },
            {
                type: "FullJsonSchemaValidator2021",
                id: accreditationSchema
            }
        ],
        issuanceDate: Timestamp.nowUTC(),
        issued: Timestamp.nowUTC(),
        validFrom: Timestamp.nowUTC(),
        expirationDate: "2025-01-01T12:00:00Z",
        // We are not sure about evidence in the form of a digital verifiable credential
        evidence: [
            {
                id: "https://europa.eu/tsr-vid/evidence/f2aeec97-fc0d-42bf-8ca7-0548192d4231",
                verifiableCredentialId: "https://example.edu/credentials/3732",
                type: ["VerifiableCredential"],
                verifier: issuerDid,
                evidenceDocument: ["LegalEntityCredential"],
                subjectPresence: "Digital",
                documentPresence: ["Digital"]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXR0ZXN0YXRpb24mQWNjcmVkaXRhdGlvbjRXYXN0ZU9wZXJhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Vic2kvY3JlYXRlQXR0ZXN0YXRpb24mQWNjcmVkaXRhdGlvbjRXYXN0ZU9wZXJhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLG9DQUFvQztBQUNwQyxzQ0FBc0M7QUFFdEMsT0FBTyxFQUNILFVBQVUsRUFDVixZQUFZLEVBQ1osWUFBWSxFQUFFLGtCQUFrQixFQUM5QixPQUFPLEVBQ1QsWUFBWSxFQUNaLFVBQVUsRUFDVixTQUFTLEVBQ1osTUFBTSxtQ0FBbUMsQ0FBQztBQUUzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUNBQXFDLENBQUM7QUFFN0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUxQyxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzlCLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxzQkFBc0IsRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUM3RixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDL0IsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU1QixNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFN0MsS0FBSyxVQUFVLEdBQUc7SUFDZCxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQztRQUN0QixXQUFXLEVBQUU7WUFDVCxHQUFHLEVBQUUsYUFBYTtZQUNsQixJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO1NBQ3ZCO1FBQ0QsUUFBUSxFQUFFLElBQUk7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