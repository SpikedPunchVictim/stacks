import { IModel, IStack } from '@spikedpunch/stacks';
import { Server } from 'http';
import Koa from 'koa';
import Router from '@koa/router';
export type RestContext = {
    app: Koa;
    router: Router;
    stack: IStack;
};
export interface IRestMiddleware {
    setup(context: RestContext): Promise<void>;
}
export type RequestHandler = (ctx: Koa.Context, rest: RestContext, next: Koa.Next) => Promise<void>;
export type ListenHandler = () => void;
export declare enum RestHandler {
    NoOp = "::noop"
}
export type GetRequestOptions = {
    model?: IModel;
    many?: RequestHandler | string[] | RestHandler;
    single?: RequestHandler | string[] | RestHandler;
};
export type PutRequestOptions = {
    model?: IModel;
    handler?: RequestHandler;
};
export type PostRequestOptions = {
    model?: IModel;
    handler?: RequestHandler;
};
export type DeleteRequestOptions = {
    model?: IModel;
    handler?: RequestHandler;
};
export type StackRestOptions = {
    cors?: boolean;
};
export declare class StacksRest {
    readonly app: Koa;
    readonly router: Router;
    readonly stack: IStack;
    get restContext(): RestContext;
    constructor(stack: IStack, options?: StackRestOptions);
    use(middleware: IRestMiddleware): Promise<void>;
    /**
     * Defines a GET REST endpoint.
     *
     * many { function | string[] }
     *    If many is a function, it defines the many handler (ctx) => Promise<void>
     *    If many is a string[], it defines the properties that will be returned from
     *    the reterieved object.
     *
     * single { function | string[] }
     *    If single is a function, it handles the REST call that includes the 'id'.
     *    If single is a string[], it will be default behavior, but will only return
     *    the properties in the string[].
     *
     * model { IModel }
     *    The Model
     *
     *
     *
     * @param urlPath The URL path
     * @param options The options for GET
     */
    get(urlPath: string, options: GetRequestOptions): void;
    /**
     * Defines a PUT endpoint
     *
     * @param urlPath The URL path
     * @param options The options that define the endpoint
     */
    put(urlPath: string, options: PutRequestOptions): void;
    /**
     *
     * Consider adding an easier way to modify the request:
     *    (
     *       validate: {
     *          required: {
     *                one: { type: 'string' }
     *               two: { type: 'number' }
     *          },
     *       handler: ({ body, params, qs, model, stack}) => {
     *       model.create<Model>({
     *          one: body.one
     *       })
     *
     *    }
     *
     *
     * @param urlPath
     * @param options
     * @returns
     */
    post(urlPath: string, options: PostRequestOptions): void;
    del(urlPath: string, options: DeleteRequestOptions): void;
    listen(port?: number, handler?: ListenHandler): Server;
}
