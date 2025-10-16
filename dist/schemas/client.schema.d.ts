export declare const transactionSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            account: {
                type: string;
            };
            amount: {
                type: string;
            };
            type: {
                type: string;
                enum: string[];
            };
        };
    };
};
export declare const playHistorySchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            account: {
                type: string;
            };
            game: {
                type: string;
            };
            status: {
                type: string;
                enum: string[];
            };
            amount: {
                type: string;
            };
        };
    };
};
export declare const clientSchema: {
    querystring: {
        type: string;
        required: string[];
        properties: {
            account: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=client.schema.d.ts.map