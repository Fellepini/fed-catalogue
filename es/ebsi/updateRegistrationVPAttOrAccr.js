// Copyright 2020-2022 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
import { Credential, ProofOptions, IotaDocument, IotaIdentityClient, IotaDID, Timestamp, Duration, Presentation, } from "@iota/identity-wasm/node/index.js";
import { Client } from "@iota/client-wasm/node/lib/index.js";
import { Converter } from "@iota/util.js";
import { Ed25519 } from "@iota/crypto.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { dids as ebsiDids } from "./dids";
import { post } from "../utilHttp";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { NODE_ENDPOINT, TOKEN, PLUGIN_ENDPOINT } = process.env;
async function resolveDocument(didClient, did) {
    const elements = did.split(":");
    const didResult = IotaDID.fromAliasId(elements[elements.length - 1], elements[elements.length - 2]);
    const resolvedDocument = await didClient.resolveDid(didResult);
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
    const holderPrivateKeySign = ebsiDids.esGovernmentTAO.privateKeySign;
    const holderPrivateKeyDidControl = ebsiDids.esGovernmentTAO.privateKeyDidControl;
    const holderPublicKeyDidControl = ebsiDids.esGovernmentTAO.publicKeyDidControl;
    const holderDocument = await resolveDocument(didClient, holderDid);
    const holderPrivateKeyBytes = Converter.hexToBytes(holderPrivateKeySign);
    const registrationTrail = "urn:trail:iota:tst:0x2c7a8c3636356f6517f3ad62cc8291deef62db7fe960e456440cd9695159ae44";
    // const registrationTrail = "urn:trail:iota:ebsi:0x3c802ea821cf0e181f0b49498da70f2f55fec08a212d280ea1f0307cff7191d0";
    // The issuer is now sure that the credential they are about to issue satisfies their expectations.
    // The credential is then serialized to JSON and transmitted to the holder in a secure manner.
    // Note that the credential is NOT published to the IOTA Tangle. It is sent and stored off-chain.
    const credentialJSON = JSON.parse(process.argv[2]);
    // A unique random challenge generated by the requester per presentation can mitigate replay attacks.
    const challenge = "475a7984-1bb5-4c4c-a56f-822bccd46440";
    // The verifier and holder also agree that the signature should have an expiry date
    // 10 minutes from now.
    const expires = Timestamp.nowUTC().checkedAdd(Duration.minutes(240));
    // ===========================================================================
    // Step 5: Holder creates a verifiable presentation from the issued credential for the verifier to validate.
    // ===========================================================================
    // Deserialize the credential.
    const receivedVc = Credential.fromJSON(credentialJSON);
    // Create a Verifiable Presentation from the Credential
    const unsignedVp = new Presentation({
        holder: holderDid,
        verifiableCredential: receivedVc,
    });
    // Sign the verifiable presentation using the holder's verification method
    // and include the requested challenge and expiry timestamp.
    const signedVp = await holderDocument.signPresentation(unsignedVp, holderPrivateKeyBytes.slice(0, 32), "#sign-1", new ProofOptions({
        challenge: challenge,
        expires,
    }));
    // ===========================================================================
    // Step 6: Holder sends a verifiable presentation to the verifier.
    // ===========================================================================
    // Convert the Verifiable Presentation to JSON to send it to the verifier.
    const signedVpJSON = signedVp.toJSON();
    // ====================================
    console.log("Issued presentation: \n", JSON.stringify(signedVpJSON, null, 2));
    const registrationResult = await postToPlugin(signedVpJSON, registrationTrail, { publicKey: holderPublicKeyDidControl, privateKey: holderPrivateKeyDidControl });
    console.log("Registration Result: ", registrationResult);
}
async function postToPlugin(signedVp, registrationTrail, params) {
    const pluginRequest = {
        type: "TransactionRequest",
        registrationTrail,
        credential: signedVp
    };
    const result1 = await post(`${PLUGIN_ENDPOINT}/credentials/registrations`, TOKEN, pluginRequest);
    const nextPayload = result1;
    // The result will contain a txEssence that has to be signed
    // Once it is signed it has to be submitted to the plugin again
    const essence = Converter.hexToBytes(nextPayload.txEssenceHash);
    const essenceSigned = Ed25519.sign(Converter.hexToBytes(params.privateKey), essence);
    // Now the essence is signed then the same payload is sent including a signature
    nextPayload.type = "TransactionSignature";
    nextPayload.signature = [{
            publicKey: params.publicKey,
            signature: Converter.bytesToHex(essenceSigned, true)
        }];
    console.error("Signature: ", nextPayload.signature);
    const finalResult = await post(`${PLUGIN_ENDPOINT}/credentials/registrations`, TOKEN, nextPayload);
    return finalResult;
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlUmVnaXN0cmF0aW9uVlBBdHRPckFjY3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZWJzaS91cGRhdGVSZWdpc3RyYXRpb25WUEF0dE9yQWNjci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQ0FBb0M7QUFDcEMsc0NBQXNDO0FBRXRDLE9BQU8sRUFDSCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFlBQVksRUFBRSxrQkFBa0IsRUFBRSxPQUFPLEVBQ3pDLFNBQVMsRUFDVCxRQUFRLEVBQ1IsWUFBWSxHQUNmLE1BQU0sbUNBQW1DLENBQUM7QUFFM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFDQUFxQyxDQUFDO0FBRTdELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRTFDLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE9BQU8sRUFBRSxJQUFJLElBQUksUUFBUSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxJQUFJLEVBQWtCLE1BQU0sYUFBYSxDQUFDO0FBQ25ELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUM7QUFFOUQsS0FBSyxVQUFVLGVBQWUsQ0FBQyxTQUE2QixFQUFFLEdBQVc7SUFDckUsTUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFR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