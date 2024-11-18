export declare const dids: {
    rootTrust: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: string;
    };
    esGovernmentTAO: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: string;
    };
    revenueAgencyTAO: {
        did: string;
        privateKeySign: string;
    };
    envAgencyTAO: {
        did: string;
        privateKeySign: string;
    };
    recyclerTI: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: string;
    };
    manufacturerLegalEntity: {
        did: string;
    };
};
export declare const ebsiDids: {
    rootTrust: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: string;
    };
    esGovernmentTAO: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: string;
    };
};
export declare const ebsiDidsJwk: {
    rootTrust: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
            kid: string;
        };
    };
    esGovernmentTAO: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
            kid: string;
        };
    };
    revenueAgencyTAO: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
            kid: string;
        };
    };
    recyclerTI: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            crv: string;
            d: string;
            x: string;
            kty: string;
            kid: string;
        };
        rawPrivateKeySign: string;
    };
    naturalPerson: {
        did: string;
        privateKeyDidControl: {};
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
        };
        rawPrivateKeySign: string;
    };
};
export declare const didsJwk: {
    naturalPerson: {
        did: string;
        privateKeyDidControl: {};
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
        };
        rawPrivateKeySign: string;
    };
    rootTrust: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
            kid: string;
        };
    };
    esGovernmentTAO: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
            kid: string;
        };
    };
    revenueAgencyTAO: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            kty: string;
            x: string;
            y: string;
            crv: string;
            d: string;
            kid: string;
        };
    };
    recyclerTI: {
        did: string;
        privateKeyDidControl: string;
        publicKeyDidControl: string;
        privateKeySign: {
            use: string;
            alg: string;
            crv: string;
            d: string;
            x: string;
            kty: string;
            kid: string;
        };
        rawPrivateKeySign: string;
    };
};
