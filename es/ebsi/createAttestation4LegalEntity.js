// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, ProofPurpose, IotaDIDUrl, Timestamp, Duration } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { dids } from "./dids";
import { legalEntitySchema } from "./schemas";
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
    console.error("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    // Create a credential subject for the Legal Entity for which the attestation is being created
    const subject = {
        id: dids.recyclerTI.did,
        legalName: "Company Recycler AG",
        domainName: "recycler.example.org",
        economicActivity: "http://data.europa.eu/ux2/nace2.1/38",
        legalEmailAddress: "info@recycler.example.org"
    };
    const expiresAt = Timestamp.nowUTC().checkedAdd(Duration.days(1200));
    const unsignedVc = {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://europa.eu/schemas/v-id/2020/v1"
        ],
        id: "https://example.edu/credentials/3732",
        type: [
            "VerifiableCredential",
            "VerifiableAttestation"
        ],
        issuer: issuerDid,
        credentialSubject: subject,
        credentialSchema: {
            type: "FullJsonSchemaValidator2021",
            id: legalEntitySchema
        },
        issuanceDate: Timestamp.nowUTC(),
        issued: Timestamp.nowUTC(),
        validFrom: Timestamp.nowUTC(),
        validUntil: expiresAt,
        expirationDate: expiresAt,
        evidence: [
            {
                id: "https://europa.eu/tsr-vid/evidence/f2aeec97-fc0d-42bf-8ca7-0548192d4231",
                type: ["DocumentVerification"],
                verifier: "did:ebsi:2e81454f76775c687694ee6772a17796436768a30e289555",
                evidenceDocument: ["Passport"],
                subjectPresence: "Physical",
                documentPresence: ["Physical"]
            }
        ]
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
    console.log(JSON.stringify(credentialJSON));
}
run().then(() => console.error("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXR0ZXN0YXRpb240TGVnYWxFbnRpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZWJzaS9jcmVhdGVBdHRlc3RhdGlvbjRMZWdhbEVudGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sRUFDSCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFBRSxrQkFBa0IsRUFDOUIsT0FBTyxFQUNULFlBQVksRUFDWixVQUFVLEVBQ1YsU0FBUyxFQUNULFFBQVEsRUFDWCxNQUFNLG1DQUFtQyxDQUFDO0FBRTNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUU3RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFDLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDOUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU3QyxLQUFLLFVBQVUsR0FBRztJQUNkLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDO1FBQ3RCLFdBQVcsRUFBRTtZQUNULEdBQUcsRUFBRSxhQUFhO1lBQ2xCLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7U0FDdkI7UUFDRCxRQUFRLEVBQUUsSUFBSTtLQUNqQixDQUFDLENBQUM7SUFDSCxNQUFNLFNBQVMsR0FBRyxJQUFJLGtCQUFr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