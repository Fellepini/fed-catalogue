import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { JWK } from "ts-jose";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
import { Converter } from "@iota/util.js";
async function run() {
    // Now the JWK is generated and its public key just copied to the DID and the Private Key printed to stdout
    const key = await JWK.generate("ES256", {
        // At this point in time we don't know the full Kid as we don't know the DID
        // This could be done in two steps, one generating an empty DID and then adding the Ver Method through
        // an update operation
        use: "sig",
        // crv: string, some algorithms need to add curve - EdDSA
        // modulusLength: number, some algorithms need to add length - RSA
    });
    const keyThumbprint = await key.getThumbprint();
    const publicKey = key.toObject(false);
    publicKey.kid = keyThumbprint;
    console.log("Public Key: ");
    console.log(JSON.stringify(publicKey, undefined, 2));
    console.log();
    const privateKey = key.toObject(true);
    privateKey.kid = keyThumbprint;
    console.log("Private Key: ");
    console.log(JSON.stringify(privateKey, undefined, 2));
    console.log();
    const privateKeyRaw = Buffer.from(privateKey.d, "base64");
    console.log("Raw signing key: ", Converter.bytesToHex(privateKeyRaw, true));
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlSldLLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2lkZW50aXR5L2NyZWF0ZUpXSy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssTUFBTSxNQUFNLFFBQVEsQ0FBQztBQUNqQyxPQUFPLEtBQUssWUFBWSxNQUFNLGVBQWUsQ0FBQztBQUM5QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBQzlCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFMUMsS0FBSyxVQUFVLEdBQUc7SUFDZCwyR0FBMkc7SUFDM0csTUFBTSxHQUFHLEdBQVEsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUN6Qyw0RUFBNEU7UUFDNUUsc0dBQXNHO1FBQ3RHLHNCQUFzQjtRQUN0QixHQUFHLEVBQUUsS0FBSztRQUNWLHlEQUF5RDtRQUN6RCxrRUFBa0U7S0FDckUsQ0FBQyxDQUFDO0lBRUgsTUFBTSxhQUFhLEdBQUcsTUFBTSxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7SUFFaEQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN0QyxTQUFTLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQztJQUU5QixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDckQsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRWQsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxVQUFVLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQztJQUUvQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEQsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRWQsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsU0FBUyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoRixDQUFDO0FBSUQsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMifQ==