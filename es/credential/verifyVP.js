import { post } from "../utilHttp";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
const theEnv = dotenv.config();
dotenvExpand.expand(theEnv);
const { PLUGIN_ENDPOINT, TOKEN } = process.env;
const presentation = {
    "@context": "https://www.w3.org/2018/credentials/v1",
    "type": "VerifiablePresentation",
    "verifiableCredential": {
        "@context": "https://www.w3.org/2018/credentials/v1",
        "id": "https://example.edu/credentials/3732",
        "type": [
            "VerifiableCredential",
            "UniversityDegreeCredential"
        ],
        "credentialSubject": {
            "id": "did:iota:ebsi:0x58389b90eb77c8bf17940e44b4949d4c40b09d2bb5b75a18e57556ae61209c8b",
            "GPA": "4.0",
            "degreeName": "Bachelor of Science and Arts",
            "degreeType": "BachelorDegree",
            "name": "Alice"
        },
        "issuer": "did:iota:ebsi:0x9244145be500bcc71c1d4d29c895ef06cff5eb6c055eebe23208206b223cdb72",
        "issuanceDate": "2023-04-04T08:27:13Z",
        "proof": {
            "type": "JcsEd25519Signature2020",
            "verificationMethod": "did:iota:ebsi:0x9244145be500bcc71c1d4d29c895ef06cff5eb6c055eebe23208206b223cdb72#sign-1",
            "signatureValue": "3YMtyXKGNF4uzQ1AFpcPYjHKBBnRFY5Uoe567nsqqCcvazvXNtv6FoPX2FBRKWMgBpFXcAdLtNozvMDWVqLh1buN"
        }
    },
    "holder": "did:iota:ebsi:0x58389b90eb77c8bf17940e44b4949d4c40b09d2bb5b75a18e57556ae61209c8b",
    "proof": {
        "type": "JcsEd25519Signature2020",
        "verificationMethod": "did:iota:ebsi:0x58389b90eb77c8bf17940e44b4949d4c40b09d2bb5b75a18e57556ae61209c8b#sign-1",
        "signatureValue": "4oarWj3JAyjPdXXu6ZTz25YzcBFRkMG73r8dUCJsQBJU27YtaQnnistnhw1YjjD7J9WTa5V9EsgWnjn5nmNtSJc6",
        "expires": "2023-04-04T12:27:13Z",
        "challenge": "475a7984-1bb5-4c4c-a56f-822bccd46440"
    }
};
async function run() {
    const verificationResult = await post(`${PLUGIN_ENDPOINT}/credentials`, TOKEN, {
        type: "VerificationRequest",
        credential: presentation
    });
    console.log(verificationResult);
}
run().then(() => console.log("Done")).catch(err => console.error(err));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyaWZ5VlAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY3JlZGVudGlhbC92ZXJpZnlWUC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBRW5DLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQ2pDLE9BQU8sS0FBSyxZQUFZLE1BQU0sZUFBZSxDQUFDO0FBQzlDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUMvQixZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBRTVCLE1BQU0sRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUUvQyxNQUFNLFlBQVksR0FBRztJQUNuQixVQUFVLEVBQUUsd0NBQXdDO0lBQ3BELE1BQU0sRUFBRSx3QkFBd0I7SUFDaEMsc0JBQXNCLEVBQUU7UUFDdEIsVUFBVSxFQUFFLHdDQUF3QztRQUNwRCxJQUFJLEVBQUUsc0NBQXNDO1FBQzVDLE1BQU0sRUFBRTtZQUNOLHNCQUFzQjtZQUN0Qiw0QkFBNEI7U0FDN0I7UUFDRCxtQkFBbUIsRUFBRTtZQUNuQixJQUFJLEVBQUUsa0ZBQWtGO1lBQ3hGLEtBQUssRUFBRSxLQUFLO1lBQ1osWUFBWSxFQUFFLDhCQUE4QjtZQUM1QyxZQUFZLEVBQUUsZ0JBQWdCO1lBQzlCLE1BQU0sRUFBRSxPQUFPO1NBQ2hCO1FBQ0QsUUFBUSxFQUFFLGtGQUFrRjtRQUM1RixjQUFjLEVBQUUsc0JBQXNCO1FBQ3RDLE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSx5QkFBeUI7WUFDakMsb0JBQW9CLEVBQUUseUZBQXlGO1lBQy9HLGdCQUFnQixFQUFFLDBGQUEwRjtTQUM3RztLQUNGO0lBQ0QsUUFBUSxFQUFFLGtGQUFrRjtJQUM1RixPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUUseUJBQXlCO1FBQ2pDLG9CQUFvQixFQUFFLHlGQUF5RjtRQUMvRyxnQkFBZ0IsRUFBRSwwRkFBMEY7UUFDNUcsU0FBUyxFQUFFLHNCQUFzQjtRQUNqQyxXQUFXLEVBQUUsc0NBQXNDO0tBQ3BEO0NBQ0YsQ0FBQztBQUVGLEtBQUssVUFBVSxHQUFHO0lBQ2hCLE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxlQUFlLGNBQWMsRUFBRSxLQUFLLEVBQUU7UUFDN0UsSUFBSSxFQUFFLHFCQUFxQjtRQUMzQixVQUFVLEVBQUUsWUFBWTtLQUN6QixDQUFDLENBQUM7SUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDIn0=