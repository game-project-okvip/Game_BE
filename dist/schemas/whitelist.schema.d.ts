export declare const createWhitelistSchema: {
    body: {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            ip: {
                anyOf: {
                    type: string;
                    format: string;
                }[];
            };
            description: {
                type: string;
            };
            createBy: {
                type: string;
            };
        };
    };
};
export declare const updateWhitelistSchema: {
    querystring: {
        type: string;
        required: string[];
        additionalProperties: boolean;
        properties: {
            id: {
                type: string;
            };
        };
    };
    body: {
        type: string;
        additionalProperties: boolean;
        properties: {
            ip: {
                anyOf: {
                    type: string;
                    format: string;
                }[];
            };
            description: {
                type: string;
            };
            updateBy: {
                type: string;
            };
        };
    };
};
export declare const deleteWhitelistSchema: {
    querystring: {
        type: string;
        properties: {
            id: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=whitelist.schema.d.ts.map