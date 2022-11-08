import { IMember, IModel } from "@spikedpunch/stacks";
export declare type ColumnInfo = {
    member: IMember;
    columnName: string;
    reference?: {
        table: string;
        model: IModel;
    };
};
export declare type TableInfo = {
    model: IModel;
    tableName: string;
    columns: ColumnInfo[];
};
