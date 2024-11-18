import { post } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { PLUGIN_ENDPOINT, TOKEN } = process.env;
const credential = {
    "@context": "https://www.w3.org/2018/credentials/v1",
    "id": "https://example.edu/credentials/3732",
    "type": [
        "VerifiableCredential",
        "UniversityDegreeCredential"
    ],
    "credentialSubject": {
        "id": "did:iota:tst:0x6abe6ef35e4dfd4242f932d6fbe1b1ae01b87a1b42a49329141602a9222980de",
        "GPA": "4.0",
        "degreeName": "Bachelor of Science and Arts",
        "degreeType": "BachelorDegree",
        "name": "Alice"
    },
    "issuer": "did:iota:ebsi:0x9244145be500bcc71c1d4d29c895ef06cff5eb6c055eebe23208206b223cdb72",
    "issuanceDate": "2023-04-04T08:25:59Z",
    "proof": {
        "type": "JcsEd25519Signature2020",
        "verificationMethod": "did:iota:ebsi:0x9244145be500bcc71c1d4d29c895ef06cff5eb6c055eebe23208206b223cdb72#sign-1",
        "signatureValue": "4KuuzAEB2EVPDU3H9LfL2awNgxE74XHaxdqs4AwdUz6ashXxe1KQQNuBXwiuxPWSkhyEnrapF9eKGgyVkn7CV8RG"
    }
};
async function run() {
    const verificationResult = await post(`${PLUGIN_ENDPOINT}/credentials`, TOKEN, {
        type: "VerificationRequest",
        credential
    });
    console.log(verificationResult);
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyaWZ5VkMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3JlZGVudGlhbC92ZXJpZnlWQy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRW5DLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUcvQyxNQUFNLFVBQVUsR0FBRztJQUNmLFVBQVUsRUFBRSx3Q0FBd0M7SUFDcEQsSUFBSSxFQUFFLHNDQUFzQztJQUM1QyxNQUFNLEVBQUU7UUFDSixzQkFBc0I7UUFDdEIsNEJBQTRCO0tBQy9CO0lBQ0QsbUJBQW1CLEVBQUU7UUFDakIsSUFBSSxFQUFFLGlGQUFpRjtRQUN2RixLQUFLLEVBQUUsS0FBSztRQUNaLFlBQVksRUFBRSw4QkFBOEI7UUFDNUMsWUFBWSxFQUFFLGdCQUFnQjtRQUM5QixNQUFNLEVBQUUsT0FBTztLQUNsQjtJQUNELFFBQVEsRUFBRSxrRkFBa0Y7SUFDNUYsY0FBYyxFQUFFLHNCQUFzQjtJQUN0QyxPQUFPLEVBQUU7UUFDTCxNQUFNLEVBQUUseUJBQXlCO1FBQ2pDLG9CQUFvQixFQUFFLHlGQUF5RjtRQUMvRyxnQkFBZ0IsRUFBRSwwRkFBMEY7S0FDL0c7Q0FDSixDQUFDO0FBRUYsS0FBSyxVQUFVLEdBQUc7SUFDZCxNQUFNLGtCQUFrQixHQUFHLE1BQU0sSUFBSSxDQUFDLEdBQUcsZUFBZSxjQUFjLEVBQUUsS0FBSyxFQUFFO1FBQzNFLElBQUksRUFBRSxxQkFBcUI7UUFDM0IsVUFBVTtLQUNiLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMifQ==