// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, Timestamp } from "@iota/identity-wasm/node/index.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiReplicaDids as ebsiDids } from "./dids-replica";
import { get, toUnixSeconds } from "../../utilHttp";
import { JWK, JWT } from "ts-jose";
import { legalEntitySchema } from "../schemas";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { EBSI_REPLICA_ENDPOINT } = process.env;
async function run() {
    // The root of trust accredits to accredit to the ES Government
    const issuerDid = ebsiDids.tao.did;
    const privateKey = await JWK.fromObject(ebsiDids.tao.privateKeySign);
    let kid = privateKey.kid;
    if (!kid) {
        kid = await privateKey.getThumbprint();
    }
    // We overwrite it in order the sign process does not fail
    privateKey.metadata.kid = `${issuerDid}#${kid}`;
    const issuerDocument = await get(`${EBSI_REPLICA_ENDPOINT}/did-registry/v4/identifiers/${encodeURIComponent(issuerDid)}`, "");
    console.error("Resolved DID document:", JSON.stringify(issuerDocument, null, 2));
    const subject = {
        id: ebsiDids.ti.did,
        legalName: "Company Recycler AG",
        domainName: "recycler.example.org",
        economicActivity: "http://data.europa.eu/ux2/nace2.1/38"
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
            "id": legalEntitySchema,
            "type": "FullJsonSchemaValidator2021"
        },
        credentialSubject: subject,
        credentialStatus: {
            id: `https://api-test.ebsi.eu/trusted-issuers-registry/v4/issuers/${ebsiDids.tao.did}/attributes/60ae46e4fe9adffe0bc83c5e5be825aafe6b5246676398cd1ac36b8999e088a8`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlQXR0ZXN0YXRpb240TGVnYWxFbnRpdHlBc0pXVC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9lYnNpL3JlcGxpY2EvY3JlYXRlQXR0ZXN0YXRpb240TGVnYWxFbnRpdHlBc0pXVC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sRUFDSCxVQUFVLEVBQ1YsU0FBUyxFQUNaLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFDakMsT0FBTyxLQUFLLFlBQVksTUFBTSxlQUFlLENBQUM7QUFFOUMsT0FBTyxFQUFFLGVBQWUsSUFBSSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU3RCxPQUFPLEVBQUUsR0FBRyxFQUFFLGFBQWEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUF3RCxNQUFNLFNBQVMsQ0FBQztBQUV6RixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHL0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFNUIsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUU5QyxLQUFLLFVBQVUsR0FBRztJQUVkLCtEQUErRDtJQUMvRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUVuQyxNQUFNLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFzQyxDQUFDLENBQUM7SUFDN0YsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQztJQUN6QixJQUFJLENBQUMsR0FBRyxFQUFF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