export type AccountBasic = {
    id: string;
    domain: string;
};

export type Account = AccountBasic & {
    name: string;
    avatar?: string;
    email: string;
};