export declare function post(endpoint: string, auth: string, payload: unknown): Promise<unknown>;
export declare function get(endpoint: string, auth: string): Promise<unknown>;
export declare function sleep(ms: number): Promise<void>;
export declare function toUnixSeconds(iso8601Date: string): number;
export type Doc = {
    [id: string]: unknown;
};
export type Meta = {
    [id: string]: unknown;
};
export type Signature = {
    publicKey: string;
    signature: string;
};
export type FullDoc = {
    doc: Doc;
    meta: Meta;
};
export type TrailRecord = {
    [id: string]: unknown;
};
export type TrailImmutable = {
    [id: string]: unknown;
};
export type Trail = {
    trail: {
        record: TrailRecord;
        immutable: TrailImmutable;
    };
    meta: Meta;
};
