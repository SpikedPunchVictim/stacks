export type PostgresConfig = {
    database: string;
    host: string;
    port: number;
    user: string;
    password: string;
    pageLimit?: number;
};
