import { type Trail, type TrailRecord } from "../utilHttp";
export declare function createTrail(endpoint: {
    url: string;
    token: string;
}, trail: {
    [id: string]: unknown;
}, stateControllerBech32Addr: string): Promise<Trail>;
export declare function addTrailRecord(endpoint: {
    url: string;
    token: string;
}, trailID: string, record: TrailRecord, address: {
    publicKey: string;
    privateKey: string;
}): Promise<Trail>;
