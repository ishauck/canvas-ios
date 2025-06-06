export type AccountBasic = {
    id: string;
    domain: string;
    key: string;
};

export type Account = AccountBasic & {
    name: string;
    avatar?: string;
    email: string;
};