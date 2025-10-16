export declare const roleCreateSchema: {
    body: {
        type: string;
        required: string[];
        properties: {
            role: {
                type: string;
            };
            isSuperAdmin: {
                type: string;
            };
            permission: {
                type: string;
                patternProperties: {
                    '.*': {
                        type: string;
                        properties: {
                            GET: {
                                type: string;
                            };
                            POST: {
                                type: string;
                            };
                            PATCH: {
                                type: string;
                            };
                            DELETE: {
                                type: string;
                            };
                        };
                        additionalProperties: boolean;
                    };
                };
                additionalProperties: boolean;
            };
        };
    };
};
export declare const roleUpdateSchema: {
    querystring: {
        type: string;
        required: string[];
        properties: {
            id: {
                type: string;
            };
        };
    };
    body: {
        type: string;
        properties: {
            role: {
                anyOf: {
                    type: string;
                }[];
            };
            isSuperAdmin: {
                type: string;
            };
            permission: {
                anyOf: ({
                    type: string;
                    patternProperties: {
                        '.*': {
                            type: string;
                            properties: {
                                GET: {
                                    type: string;
                                };
                                POST: {
                                    type: string;
                                };
                                PATCH: {
                                    type: string;
                                };
                                DELETE: {
                                    type: string;
                                };
                            };
                            additionalProperties: boolean;
                        };
                    };
                    additionalProperties: boolean;
                } | {
                    type: string;
                    patternProperties?: undefined;
                    additionalProperties?: undefined;
                })[];
            };
        };
    };
};
//# sourceMappingURL=role.schema.d.ts.map