// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0

import {
    Credential,
    ProofOptions,
    IotaDocument, IotaIdentityClient, IotaDID,
    Timestamp,
    Duration,
    Presentation
} from "@iota/identity-wasm/node/index.js";

import { Client } from "@iota/client-wasm/node/lib/index.js";

import { Converter } from "@iota/util.js";

import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { ebsiDids as ebsiDids } from "./dids";
import { post } from "../utilHttp";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);

const { NODE_ENDPOINT, TOKEN, PLUGIN_ENDPOINT } = process.env;

async function resolveDocument(didClient: IotaIdentityClient, did: string): Promise<IotaDocument> {
    const elements = did.split(":");
    const didResult = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);

    const resolvedDocument: IotaDocument = await didClient.resolveDid(didResult);
    console.log("Resolved DID document:", JSON.stringify(resolvedDocument, null, 2));

    return resolvedDocument;
}

async function run() {
    const client = new Client({
        primaryNode: {
            url: NODE_ENDPOINT,
            auth: { jwt: TOKEN }
        },
        localPow: true,
    });
    const didClient = new IotaIdentityClient(client);

    const holderDid = ebsiDids.esGovernmentTAO.did;
    const holderPrivateKey = ebsiDids.esGovernmentTAO.privateKeySign;
    const holderPrivateKeyBytes = Converter.hexToBytes(holderPrivateKey);

    const holderDocument = await resolveDocument(didClient, holderDid);

    console.log("Arg: ", process.argv[2]);

    const credentialJSON = JSON.parse(process.argv[2]);
    console.log("Issued credential: \n", JSON.stringify(credentialJSON, null, 2));

    // A unique random challenge generated by the requester per presentation can mitigate replay attacks.
    const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440";

    // The verifier and holder also agree that the signature should have an expiry date
    // 10 minutes from now.
    const expires = Timestamp.nowUTC().checkedAdd(Duration.hours(24));

    // Deserialize the credential.
    const receivedVc = Credential.fromJSON(credentialJSON);

    // Create a Verifiable Presentation from the Credential
    const unsignedVp = new Presentation({
        holder: holderDid,
        verifiableCredential: receivedVc,
    });

    // Sign the verifiable presentation using the holder's verification method
    // and include the requested challenge and expiry timestamp.
    const signedVp = await holderDocument.signPresentation(
        unsignedVp,
        holderPrivateKeyBytes.slice(0, 32),
        "#sign-1",
        new ProofOptions({
            challenge: challenge,
            expires,
        }),
    );

    // Convert the Verifiable Presentation to JSON to send it to the verifier.
    const signedVpJSON = signedVp.toJSON();

    // ====================================
    console.log("Issued presentation: \n", JSON.stringify(signedVpJSON, null, 2));

    const registrationResult = await postToPlugin(signedVpJSON);

    console.log("Registration Result: ", registrationResult);
}


async function postToPlugin(signedVp: unknown): Promise<unknown> {
    const pluginRequest = {
        type: "RegistrationRequest",
        credential: signedVp
    };

    const result = await post(`${PLUGIN_ENDPOINT}/credentials/registrations`, TOKEN, pluginRequest);

    return result;
}


export { };

run().then(() => console.log("Done")).catch(err => console.error(err));