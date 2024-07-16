import { IMember, IModel } from "@spikedpunch/stacks";
export type ColumnInfo = {
    member: IMember;
    columnName: string;
    reference?: {
        table: string;
        model: IModel;
    };
};
export type TableInfo = {
    model: IModel;
    tableName: string;
    columns: ColumnInfo[];
    indexes: {
        id: string;
    };
};
