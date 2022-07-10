import { StackObject } from '@spikedpunch/stacks';
export declare type RestResponseMinimal = {
    id: string;
};
export declare type RestResponseDetailed = {
    id: string;
    [key: string]: any;
};
export declare type RestErrorResponse = {
    message: string;
};
export declare type RestSuccessResponse = {
    message: string;
};
export declare function buildErrorResponse(errors: Error | Error[]): RestErrorResponse;
export declare function buildMinimalResponse(objects: StackObject[], props?: string[]): RestResponseMinimal[];
export declare function buildDetailedResponse(object: StackObject, props?: string[]): RestResponseDetailed;
