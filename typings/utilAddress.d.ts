export declare function generateAddresses(endpoint: string, authToken: string, numAddresses: number): Promise<{
    publicKeys: Uint8Array[];
    privateKeys: Uint8Array[];
    bech32Addresses: string[];
}>;
export declare function requestFunds(url: string, credentials: {
    user: string;
    pass: string;
}, addressBech32: string): Promise<unknown>;
