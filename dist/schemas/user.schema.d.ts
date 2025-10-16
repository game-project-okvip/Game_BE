export declare const createUserSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            username: {
                type: string;
            };
            password: {
                type: string;
            };
            role: {
                type: string;
            };
        };
    };
};
export declare const UserSchema: {
    querystring: {
        type: string;
        properties: {
            id: {
                type: string;
            };
        };
    };
};
export declare const updateUserSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            id: {
                type: string;
            };
            name: {
                type: string;
            };
            role: {
                type: string;
            };
        };
    };
};
//# sourceMappingURL=user.schema.d.ts.map