import { CreateTableBuilder } from 'kysely';
export declare type ModelSymbols = {
    tablename: string;
    custom: undefined | ((builder: CreateTableBuilder<any, any>) => Promise<CreateTableBuilder<any, any>>);
};
export declare type MemberSymbols = {
    datatype: string;
    columname: string;
    customcolumn: undefined | ((builder: CreateTableBuilder<any, any>) => Promise<CreateTableBuilder<any, any>>);
};
