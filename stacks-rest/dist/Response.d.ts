import { StackObject } from '@spikedpunch/stacks';
export type RestResponseMinimal = {
    id: string;
};
export type RestResponseDetailed = {
    id: string;
    [key: string]: any;
};
export type RestErrorResponse = {
    message: string;
};
export type RestSuccessResponse = {
    message: string;
};
export declare function buildErrorResponse(errors: Error | Error[]): RestErrorResponse;
export declare function buildMinimalResponse(objects: StackObject[], props?: string[]): RestResponseMinimal[];
export declare function buildDetailedResponse(object: StackObject, props?: string[]): RestResponseDetailed;
