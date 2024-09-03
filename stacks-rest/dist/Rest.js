"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StacksRest = exports.RestHandler = void 0;
const Response_1 = require("./Response");
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const cors_1 = __importDefault(require("@koa/cors"));
var RestHandler;
(function (RestHandler) {
    RestHandler["NoOp"] = "::noop";
})(RestHandler || (exports.RestHandler = RestHandler = {}));
/*
   Potential future of defining get:

   rest.get(UrlNames.paths.users, {
      model: user,
      many: ({ props }) => props(["name", "verified", "image"]),
      single: ({ noop } => noop
   })
*/
// export class GetDefineOptions = {
//    props
// }
// export type GetDefineHandler = (opts: GetDefineOptions) => RequestHandler | undefined
// export type Get2Options = {
//    model?: IModel
//    single?: GetDefineHandler
//    many?: GetDefineHandler
// }
class StacksRest {
    get restContext() {
        return {
            app: this.app,
            router: this.router,
            stack: this.stack
        };
    }
    constructor(stack, options) {
        this.stack = stack;
        this.app = new koa_1.default();
        if (options === null || options === void 0 ? void 0 : options.cors) {
            this.app.use((0, cors_1.default)());
        }
        this.router = new router_1.default();
    }
    async use(middleware) {
        await middleware.setup(this.restContext);
    }
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
    get(urlPath, options) {
        var _a;
        options = options || {};
        options.model = options.model || undefined;
        options.many = options.many || undefined;
        options.single = options.single || undefined;
        if (options.many === undefined &&
            options.single === undefined &&
            options.model === undefined) {
            throw new Error(`When defining the ${urlPath} GET endpoint, the 'model' or at least one of the 'detailed' or 'minimal' handlers must be defined.`);
        }
        if (typeof options.many === 'function') {
            this.router.get(urlPath, async (ctx, next) => {
                if (typeof options.many !== 'function') {
                    throw new Error(`When defining the GET endpoint for ${urlPath}, the 'minimal' property is expected to be a RequestHandler.`);
                }
                await options.many(ctx, this.restContext, next);
            });
        }
        else if (typeof options.many === "string" && options.many === RestHandler.NoOp) {
            // Do nothing      
        }
        else { // Default Behavior
            let props = new Array();
            if (options.model == null || options.model === undefined) {
                throw new Error(`When defining the ${urlPath} GET endpoint, the Model must be provided`);
            }
            if (Array.isArray(options.many)) {
                props.push(...options.many);
            }
            this.router.get(urlPath, async (ctx, next) => {
                let model = options.model;
                let query = ctx.request.query;
                let cursor = query.page || '';
                let limit = query.limit || 100;
                //@ts-ignore
                let results = await model.getMany({ cursor, limit });
                //@donotcheckin
                // ctx.header['access-control-allow-headers'] = "*"
                ctx.body = (0, Response_1.buildMinimalResponse)(results.items, props);
                ctx.status = 200;
            });
        }
        if (typeof options.single === 'function') {
            this.router.get(`${urlPath}/:id`, async (ctx, next) => {
                if (typeof options.single !== 'function') {
                    throw new Error(`When defining the GET endpoint for ${urlPath}, the 'detailed' property is expected to be a RequestHandler.`);
                }
                await options.single(ctx, this.restContext, next);
            });
        }
        else if (typeof options.single === "string" && options.single === RestHandler.NoOp) {
            // Do nothing      
        }
        else { // Default behavior
            let props = new Array();
            if (Array.isArray(options.single)) {
                if (options.model == null) {
                    throw new Error(`When defining the ${urlPath} GET endpoint, when supplying a string Array for the 'detailed' property, the Model must be also be provided`);
                }
                props.push(...options.single);
            }
            else if (options.single == null) {
                // Default is to use the Model's properties
                //@ts-ignore
                for (let member of (_a = options.model) === null || _a === void 0 ? void 0 : _a.members) {
                    props.push(member.name);
                }
            }
            this.router.get(`${urlPath}/:id`, async (ctx, next) => {
                let model = options.model;
                let id = ctx.params.id;
                let result = await model.get(id);
                if (result === undefined) {
                    ctx.status = 400;
                    ctx.body = { message: `No Object with id ${id} exists ` };
                    return;
                }
                if (typeof options.single === 'function') {
                    // Should never get here
                    throw new Error(`When defining the ${urlPath} GET endoint, the 'detailed' property is expected to be a string Array, received a 'function' instead.`);
                }
                ctx.body = (0, Response_1.buildDetailedResponse)(result, props);
                ctx.status = 200;
            });
        }
    }
    /**
     * Defines a PUT endpoint
     *
     * @param urlPath The URL path
     * @param options The options that define the endpoint
     */
    put(urlPath, options) {
        options = options || {};
        options.model = options.model || undefined;
        options.handler = options.handler || undefined;
        if (options.handler !== undefined) {
            this.router.put(urlPath, async (ctx, next) => {
                if (options.handler === undefined) {
                    throw new Error(`When defining the ${urlPath} PUT endoint, the 'handler' property is expected to be a function, received a 'undefined' instead.`);
                }
                await options.handler(ctx, this.restContext, next);
            });
        }
        else {
            if (options.model == null) {
                throw new Error(`When defining the ${urlPath} PUT request, the 'model' property is expected when a 'handler' function is not provided.`);
            }
            this.router.put(`${urlPath}/:id`, async (ctx) => {
                let body = ctx.request.body;
                if (body == null || typeof body !== 'object') {
                    ctx.throw(400, `A body must be provided`);
                    return;
                }
                let id = ctx.params.id;
                let model = options.model;
                let obj = await model.get(id);
                if (obj === undefined) {
                    ctx.throw(400, { message: `No Object with id ${id} exists ` });
                    return;
                }
                for (let prop of Object.keys(body)) {
                    obj[prop] = body[prop];
                }
                let valid = await model.validate(obj);
                if (!valid.success) {
                    let errors = new Array();
                    for (let result of valid.results) {
                        if (result.success == false && result.error != null) {
                            errors.push(result.error);
                        }
                    }
                    ctx.throw(400, (0, Response_1.buildErrorResponse)(errors));
                    return;
                }
                await model.save(obj);
                let props = new Array();
                for (let member of model.members) {
                    props.push(member.name);
                }
                ctx.body = (0, Response_1.buildDetailedResponse)(obj, props);
                ctx.status = 200;
            });
        }
    }
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
    post(urlPath, options) {
        options = options || {};
        options.model = options.model || undefined;
        options.handler = options.handler || undefined;
        if (options.handler !== undefined) {
            this.router.post(urlPath, async (ctx, next) => {
                if (options.handler != null) {
                    await options.handler(ctx, this.restContext, next);
                }
            });
            return;
        }
        if (options.model === undefined) {
            throw new Error(`When defining the POST ${urlPath} endpoint, 'model' must be defined if a handler isn't provided`);
        }
        this.router.post(urlPath, async (ctx, next) => {
            let model = options.model;
            let body = ctx.request.body;
            if (!body) {
                ctx.throw(400, `A body must be provided`);
                return;
            }
            let obj = await model.create(body);
            await model.save(obj);
            ctx.body = (0, Response_1.buildDetailedResponse)(obj);
            ctx.status = 200;
        });
    }
    del(urlPath, options) {
        options = options || {};
        options.model = options.model || undefined;
        options.handler = options.handler || undefined;
        if (options.handler !== undefined) {
            this.router.delete(urlPath, async (ctx, next) => {
                if (options.handler != null) {
                    await options.handler(ctx, this.restContext, next);
                }
            });
            return;
        }
        if (options.model === undefined) {
            throw new Error(`When defining the DELETE ${urlPath} endpoint, 'model' must be defined if a handler isn't provided`);
        }
        this.router.delete(`${urlPath}/:id`, async (ctx, next) => {
            let model = options.model;
            let id = ctx.params.id;
            let obj = await model.get(id);
            if (obj === undefined) {
                ctx.status = 200;
                ctx.body = undefined;
                return;
            }
            await model.delete(obj);
            ctx.status = 200;
            ctx.body = (0, Response_1.buildDetailedResponse)(obj);
        });
    }
    listen(port = 3401, handler = () => { }) {
        this.app
            .use((0, koa_bodyparser_1.default)())
            .use(this.router.routes())
            .use(this.router.allowedMethods());
        this.app.use(async (ctx) => {
            // the parsed body will store in ctx.request.body
            // if nothing was parsed, body will be an empty object {}
            ctx.body = ctx.request.body;
        });
        return this.app.listen(port, () => {
            handler();
        });
    }
}
exports.StacksRest = StacksRest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BLHlDQUltQjtBQUduQiw4Q0FBcUI7QUFDckIseURBQWdDO0FBQ2hDLG9FQUF1QztBQUN2QyxxREFBNEI7QUFlNUIsSUFBWSxXQUVYO0FBRkQsV0FBWSxXQUFXO0lBQ3BCLDhCQUFlLENBQUE7QUFDbEIsQ0FBQyxFQUZXLFdBQVcsMkJBQVgsV0FBVyxRQUV0QjtBQTRCRDs7Ozs7Ozs7RUFRRTtBQUVGLG9DQUFvQztBQUNwQyxXQUFXO0FBQ1gsSUFBSTtBQUVKLHdGQUF3RjtBQUV4Riw4QkFBOEI7QUFDOUIsb0JBQW9CO0FBQ3BCLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0IsSUFBSTtBQUVKLE1BQWEsVUFBVTtJQUtwQixJQUFJLFdBQVc7UUFDWixPQUFPO1lBQ0osR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHO1lBQ2IsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztTQUNuQixDQUFBO0lBQ0osQ0FBQztJQUVELFlBQVksS0FBYSxFQUFFLE9BQTBCO1FBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFBO1FBQ2xCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQTtRQUVwQixJQUFJLE9BQU8sYUFBUCxPQUFPLHVCQUFQLE9BQU8sQ0FBRSxJQUFJLEVBQUUsQ0FBQztZQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFBLGNBQUksR0FBRSxDQUFDLENBQUE7UUFDdkIsQ0FBQztRQUVELElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxFQUFFLENBQUE7SUFDN0IsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBMkI7UUFDbEMsTUFBTSxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxX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TUFBTSxFQUFFLENBQUM7YUFDekIsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQTtRQUVyQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsR0FBZ0IsRUFBRSxFQUFFO1lBQ3JDLGlEQUFpRDtZQUNqRCx5REFBeUQ7WUFDekQsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQTtRQUM5QixDQUFDLENBQUMsQ0FBQTtRQUVGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtZQUMvQixPQUFPLEVBQUUsQ0FBQTtRQUNaLENBQUMsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztDQUNIO0FBaFZELGdDQWdWQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICBJTW9kZWwsXG4gICBJU3RhY2ssXG4gICBPYmplY3RDcmVhdGVQYXJhbXMsXG4gICBTdGFja09iamVjdFxufSBmcm9tICdAc3Bpa2VkcHVuY2gvc3RhY2tzJ1xuXG5pbXBvcnQge1xuICAgYnVpbGREZXRhaWxlZFJlc3BvbnNlLFxuICAgYnVpbGRFcnJvclJlc3BvbnNlLFxuICAgYnVpbGRNaW5pbWFsUmVzcG9uc2Vcbn0gZnJvbSAnLi9SZXNwb25zZSdcblxuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSAnaHR0cCdcbmltcG9ydCBLb2EgZnJvbSAna29hJ1xuaW1wb3J0IFJvdXRlciBmcm9tICdAa29hL3JvdXRlcidcbmltcG9ydCBib2R5cGFyc2VyIGZyb20gJ2tvYS1ib2R5cGFyc2VyJ1xuaW1wb3J0IGNvcnMgZnJvbSBcIkBrb2EvY29yc1wiXG5cbmV4cG9ydCB0eXBlIFJlc3RDb250ZXh0ID0ge1xuICAgYXBwOiBLb2FcbiAgIHJvdXRlcjogUm91dGVyXG4gICBzdGFjazogSVN0YWNrXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVJlc3RNaWRkbGV3YXJlIHtcbiAgIHNldHVwKGNvbnRleHQ6IFJlc3RDb250ZXh0KTogUHJvbWlzZTx2b2lkPlxufVxuXG5leHBvcnQgdHlwZSBSZXF1ZXN0SGFuZGxlciA9IChjdHg6IEtvYS5Db250ZXh0LCByZXN0OiBSZXN0Q29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IFByb21pc2U8dm9pZD5cbmV4cG9ydCB0eXBlIExpc3RlbkhhbmRsZXIgPSAoKSA9PiB2b2lkXG5cbmV4cG9ydCBlbnVtIFJlc3RIYW5kbGVyIHtcbiAgIE5vT3AgPSBcIjo6bm9vcFwiXG59XG5cbmV4cG9ydCB0eXBlIEdldFJlcXVlc3RPcHRpb25zID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbiAgIG1hbnk/OiBSZXF1ZXN0SGFuZGxlciB8IHN0cmluZ1tdIHwgUmVzdEhhbmRsZXJcbiAgIHNpbmdsZT86IFJlcXVlc3RIYW5kbGVyIHwgc3RyaW5nW10gfCBSZXN0SGFuZGxlclxufVxuXG5leHBvcnQgdHlwZSBQdXRSZXF1ZXN0T3B0aW9ucyA9IHtcbiAgIG1vZGVsPzogSU1vZGVsXG4gICBoYW5kbGVyPzogUmVxdWVzdEhhbmRsZXJcbn1cblxuZXhwb3J0IHR5cGUgUG9zdFJlcXVlc3RPcHRpb25zID0ge1xuICAgbW9kZWw/OiBJTW9kZWxcbiAgIGhhbmRsZXI/OiBSZXF1ZXN0SGFuZGxlclxufVxuXG5leHBvcnQgdHlwZSBEZWxldGVSZXF1ZXN0T3B0aW9ucyA9IHtcbiAgIG1vZGVsPzogSU1vZGVsXG4gICBoYW5kbGVyPzogUmVxdWVzdEhhbmRsZXJcbn1cblxuZXhwb3J0IHR5cGUgU3RhY2tSZXN0T3B0aW9ucyA9IHtcbiAgIGNvcnM/OiBib29sZWFuXG59XG5cblxuLypcbiAgIFBvdGVudGlhbCBmdXR1cmUgb2YgZGVmaW5pbmcgZ2V0OlxuXG4gICByZXN0LmdldChVcmxOYW1lcy5wYXRocy51c2Vycywge1xuICAgICAgbW9kZWw6IHVzZXIsXG4gICAgICBtYW55OiAoeyBwcm9wcyB9KSA9PiBwcm9wcyhbXCJuYW1lXCIsIFwidmVyaWZpZWRcIiwgXCJpbWFnZVwiXSksXG4gICAgICBzaW5nbGU6ICh7IG5vb3AgfSA9PiBub29wXG4gICB9KVxuKi9cblxuLy8gZXhwb3J0IGNsYXNzIEdldERlZmluZU9wdGlvbnMgPSB7XG4vLyAgICBwcm9wc1xuLy8gfVxuXG4vLyBleHBvcnQgdHlwZSBHZXREZWZpbmVIYW5kbGVyID0gKG9wdHM6IEdldERlZmluZU9wdGlvbnMpID0+IFJlcXVlc3RIYW5kbGVyIHwgdW5kZWZpbmVkXG5cbi8vIGV4cG9ydCB0eXBlIEdldDJPcHRpb25zID0ge1xuLy8gICAgbW9kZWw/OiBJTW9kZWxcbi8vICAgIHNpbmdsZT86IEdldERlZmluZUhhbmRsZXJcbi8vICAgIG1hbnk/OiBHZXREZWZpbmVIYW5kbGVyXG4vLyB9XG5cbmV4cG9ydCBjbGFzcyBTdGFja3NSZXN0IHtcbiAgIHJlYWRvbmx5IGFwcDogS29hXG4gICByZWFkb25seSByb3V0ZXI6IFJvdXRlclxuICAgcmVhZG9ubHkgc3RhY2s6IElTdGFja1xuXG4gICBnZXQgcmVzdENvbnRleHQoKTogUmVzdENvbnRleHQge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIGFwcDogdGhpcy5hcHAsXG4gICAgICAgICByb3V0ZXI6IHRoaXMucm91dGVyLFxuICAgICAgICAgc3RhY2s6IHRoaXMuc3RhY2tcbiAgICAgIH1cbiAgIH1cblxuICAgY29uc3RydWN0b3Ioc3RhY2s6IElTdGFjaywgb3B0aW9ucz86IFN0YWNrUmVzdE9wdGlvbnMpIHtcbiAgICAgIHRoaXMuc3RhY2sgPSBzdGFja1xuICAgICAgdGhpcy5hcHAgPSBuZXcgS29hKClcblxuICAgICAgaWYgKG9wdGlvbnM/LmNvcnMpIHtcbiAgICAgICAgIHRoaXMuYXBwLnVzZShjb3JzKCkpXG4gICAgICB9XG5cbiAgICAgIHRoaXMucm91dGVyID0gbmV3IFJvdXRlcigpXG4gICB9XG5cbiAgIGFzeW5jIHVzZShtaWRkbGV3YXJlOiBJUmVzdE1pZGRsZXdhcmUpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIGF3YWl0IG1pZGRsZXdhcmUuc2V0dXAodGhpcy5yZXN0Q29udGV4dClcbiAgIH1cblxuICAgLyoqXG4gICAgKiBEZWZpbmVzIGEgR0VUIFJFU1QgZW5kcG9pbnQuXG4gICAgKiBcbiAgICAqIG1hbnkgeyBmdW5jdGlvbiB8IHN0cmluZ1tdIH1cbiAgICAqICAgIElmIG1hbnkgaXMgYSBmdW5jdGlvbiwgaXQgZGVmaW5lcyB0aGUgbWFueSBoYW5kbGVyIChjdHgpID0+IFByb21pc2U8dm9pZD5cbiAgICAqICAgIElmIG1hbnkgaXMgYSBzdHJpbmdbXSwgaXQgZGVmaW5lcyB0aGUgcHJvcGVydGllcyB0aGF0IHdpbGwgYmUgcmV0dXJuZWQgZnJvbVxuICAgICogICAgdGhlIHJldGVyaWV2ZWQgb2JqZWN0LlxuICAgICogXG4gICAgKiBzaW5nbGUgeyBmdW5jdGlvbiB8IHN0cmluZ1tdIH1cbiAgICAqICAgIElmIHNpbmdsZSBpcyBhIGZ1bmN0aW9uLCBpdCBoYW5kbGVzIHRoZSBSRVNUIGNhbGwgdGhhdCBpbmNsdWRlcyB0aGUgJ2lkJy5cbiAgICAqICAgIElmIHNpbmdsZSBpcyBhIHN0cmluZ1tdLCBpdCB3aWxsIGJlIGRlZmF1bHQgYmVoYXZpb3IsIGJ1dCB3aWxsIG9ubHkgcmV0dXJuIFxuICAgICogICAgdGhlIHByb3BlcnRpZXMgaW4gdGhlIHN0cmluZ1tdLlxuICAgICogXG4gICAgKiBtb2RlbCB7IElNb2RlbCB9XG4gICAgKiAgICBUaGUgTW9kZWxcbiAgICAqIFxuICAgICogXG4gICAgKiBcbiAgICAqIEBwYXJhbSB1cmxQYXRoIFRoZSBVUkwgcGF0aFxuICAgICogQHBhcmFtIG9wdGlvbnMgVGhlIG9wdGlvbnMgZm9yIEdFVFxuICAgICovXG4gICBnZXQodXJsUGF0aDogc3RyaW5nLCBvcHRpb25zOiBHZXRSZXF1ZXN0T3B0aW9ucyk6IHZvaWQge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgIG9wdGlvbnMubW9kZWwgPSBvcHRpb25zLm1vZGVsIHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5tYW55ID0gb3B0aW9ucy5tYW55IHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5zaW5nbGUgPSBvcHRpb25zLnNpbmdsZSB8fCB1bmRlZmluZWRcblxuICAgICAgaWYgKG9wdGlvbnMubWFueSA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICBvcHRpb25zLnNpbmdsZSA9PT0gdW5kZWZpbmVkICYmXG4gICAgICAgICBvcHRpb25zLm1vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBHRVQgZW5kcG9pbnQsIHRoZSAnbW9kZWwnIG9yIGF0IGxlYXN0IG9uZSBvZiB0aGUgJ2RldGFpbGVkJyBvciAnbWluaW1hbCcgaGFuZGxlcnMgbXVzdCBiZSBkZWZpbmVkLmApXG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tYW55ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5nZXQodXJsUGF0aCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMubWFueSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSBHRVQgZW5kcG9pbnQgZm9yICR7dXJsUGF0aH0sIHRoZSAnbWluaW1hbCcgcHJvcGVydHkgaXMgZXhwZWN0ZWQgdG8gYmUgYSBSZXF1ZXN0SGFuZGxlci5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBvcHRpb25zLm1hbnkoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdGlvbnMubWFueSA9PT0gXCJzdHJpbmdcIiAmJiBvcHRpb25zLm1hbnkgPT09IFJlc3RIYW5kbGVyLk5vT3ApIHtcbiAgICAgICAgIC8vIERvIG5vdGhpbmcgICAgICBcbiAgICAgIH0gZWxzZSB7IC8vIERlZmF1bHQgQmVoYXZpb3JcbiAgICAgICAgIGxldCBwcm9wcyA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgICAgaWYgKG9wdGlvbnMubW9kZWwgPT0gbnVsbCB8fCBvcHRpb25zLm1vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBHRVQgZW5kcG9pbnQsIHRoZSBNb2RlbCBtdXN0IGJlIHByb3ZpZGVkYClcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5tYW55KSkge1xuICAgICAgICAgICAgcHJvcHMucHVzaCguLi5vcHRpb25zLm1hbnkpXG4gICAgICAgICB9XG5cbiAgICAgICAgIHRoaXMucm91dGVyLmdldCh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IG9wdGlvbnMubW9kZWxcblxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gY3R4LnJlcXVlc3QucXVlcnlcbiAgICAgICAgICAgIGxldCBjdXJzb3IgPSBxdWVyeS5wYWdlIHx8ICcnXG4gICAgICAgICAgICBsZXQgbGltaXQgPSBxdWVyeS5saW1pdCB8fCAxMDBcblxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IG1vZGVsLmdldE1hbnk8U3RhY2tPYmplY3Q+KHsgY3Vyc29yLCBsaW1pdCB9KVxuXG4gICAgICAgICAgICAvL0Bkb25vdGNoZWNraW5cbiAgICAgICAgICAgIC8vIGN0eC5oZWFkZXJbJ2FjY2Vzcy1jb250cm9sLWFsbG93LWhlYWRlcnMnXSA9IFwiKlwiXG5cbiAgICAgICAgICAgIGN0eC5ib2R5ID0gYnVpbGRNaW5pbWFsUmVzcG9uc2UocmVzdWx0cy5pdGVtcywgcHJvcHMpXG4gICAgICAgICAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5nZXQoYCR7dXJsUGF0aH0vOmlkYCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlIEdFVCBlbmRwb2ludCBmb3IgJHt1cmxQYXRofSwgdGhlICdkZXRhaWxlZCcgcHJvcGVydHkgaXMgZXhwZWN0ZWQgdG8gYmUgYSBSZXF1ZXN0SGFuZGxlci5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBvcHRpb25zLnNpbmdsZShjdHgsIHRoaXMucmVzdENvbnRleHQsIG5leHQpXG4gICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGUgPT09IFwic3RyaW5nXCIgJiYgb3B0aW9ucy5zaW5nbGUgPT09IFJlc3RIYW5kbGVyLk5vT3ApIHtcbiAgICAgICAgIC8vIERvIG5vdGhpbmcgICAgICBcbiAgICAgIH0gZWxzZSB7IC8vIERlZmF1bHQgYmVoYXZpb3JcbiAgICAgICAgIGxldCBwcm9wcyA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5zaW5nbGUpKSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5tb2RlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gR0VUIGVuZHBvaW50LCB3aGVuIHN1cHBseWluZyBhIHN0cmluZyBBcnJheSBmb3IgdGhlICdkZXRhaWxlZCcgcHJvcGVydHksIHRoZSBNb2RlbCBtdXN0IGJlIGFsc28gYmUgcHJvdmlkZWRgKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcm9wcy5wdXNoKC4uLm9wdGlvbnMuc2luZ2xlKVxuICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnNpbmdsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBEZWZhdWx0IGlzIHRvIHVzZSB0aGUgTW9kZWwncyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIGZvciAobGV0IG1lbWJlciBvZiBvcHRpb25zLm1vZGVsPy5tZW1iZXJzKSB7XG4gICAgICAgICAgICAgICBwcm9wcy5wdXNoKG1lbWJlci5uYW1lKVxuICAgICAgICAgICAgfVxuICAgICAgICAgfVxuXG4gICAgICAgICB0aGlzLnJvdXRlci5nZXQoYCR7dXJsUGF0aH0vOmlkYCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBvcHRpb25zLm1vZGVsIGFzIElNb2RlbFxuXG4gICAgICAgICAgICBsZXQgaWQgPSBjdHgucGFyYW1zLmlkXG5cbiAgICAgICAgICAgIGxldCByZXN1bHQgPSBhd2FpdCBtb2RlbC5nZXQ8U3RhY2tPYmplY3Q+KGlkKVxuXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIGN0eC5zdGF0dXMgPSA0MDBcbiAgICAgICAgICAgICAgIGN0eC5ib2R5ID0geyBtZXNzYWdlOiBgTm8gT2JqZWN0IHdpdGggaWQgJHtpZH0gZXhpc3RzIGAgfVxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIC8vIFNob3VsZCBuZXZlciBnZXQgaGVyZVxuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IEdFVCBlbmRvaW50LCB0aGUgJ2RldGFpbGVkJyBwcm9wZXJ0eSBpcyBleHBlY3RlZCB0byBiZSBhIHN0cmluZyBBcnJheSwgcmVjZWl2ZWQgYSAnZnVuY3Rpb24nIGluc3RlYWQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2UocmVzdWx0LCBwcm9wcylcbiAgICAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgIH0pXG4gICAgICB9XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVmaW5lcyBhIFBVVCBlbmRwb2ludFxuICAgICogXG4gICAgKiBAcGFyYW0gdXJsUGF0aCBUaGUgVVJMIHBhdGhcbiAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIHRoYXQgZGVmaW5lIHRoZSBlbmRwb2ludFxuICAgICovXG4gICBwdXQodXJsUGF0aDogc3RyaW5nLCBvcHRpb25zOiBQdXRSZXF1ZXN0T3B0aW9ucyk6IHZvaWQge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgIG9wdGlvbnMubW9kZWwgPSBvcHRpb25zLm1vZGVsIHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5oYW5kbGVyID0gb3B0aW9ucy5oYW5kbGVyIHx8IHVuZGVmaW5lZFxuXG4gICAgICBpZiAob3B0aW9ucy5oYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLnB1dCh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhhbmRsZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IFBVVCBlbmRvaW50LCB0aGUgJ2hhbmRsZXInIHByb3BlcnR5IGlzIGV4cGVjdGVkIHRvIGJlIGEgZnVuY3Rpb24sIHJlY2VpdmVkIGEgJ3VuZGVmaW5lZCcgaW5zdGVhZC5gKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhd2FpdCBvcHRpb25zLmhhbmRsZXIoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBpZiAob3B0aW9ucy5tb2RlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gUFVUIHJlcXVlc3QsIHRoZSAnbW9kZWwnIHByb3BlcnR5IGlzIGV4cGVjdGVkIHdoZW4gYSAnaGFuZGxlcicgZnVuY3Rpb24gaXMgbm90IHByb3ZpZGVkLmApXG4gICAgICAgICB9XG5cbiAgICAgICAgIHRoaXMucm91dGVyLnB1dChgJHt1cmxQYXRofS86aWRgLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgbGV0IGJvZHkgPSBjdHgucmVxdWVzdC5ib2R5XG5cbiAgICAgICAgICAgIGlmIChib2R5ID09IG51bGwgfHwgdHlwZW9mIGJvZHkgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICBjdHgudGhyb3coNDAwLCBgQSBib2R5IG11c3QgYmUgcHJvdmlkZWRgKVxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBpZCA9IGN0eC5wYXJhbXMuaWRcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IG9wdGlvbnMubW9kZWwgYXMgSU1vZGVsXG5cbiAgICAgICAgICAgIGxldCBvYmogPSBhd2FpdCBtb2RlbC5nZXQoaWQpXG5cbiAgICAgICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgY3R4LnRocm93KDQwMCwgeyBtZXNzYWdlOiBgTm8gT2JqZWN0IHdpdGggaWQgJHtpZH0gZXhpc3RzIGAgfSlcbiAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBwcm9wIG9mIE9iamVjdC5rZXlzKGJvZHkpKSB7XG4gICAgICAgICAgICAgICBvYmpbcHJvcF0gPSBib2R5W3Byb3BdXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCB2YWxpZCA9IGF3YWl0IG1vZGVsLnZhbGlkYXRlKG9iailcblxuICAgICAgICAgICAgaWYgKCF2YWxpZC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gbmV3IEFycmF5PEVycm9yPigpXG4gICAgICAgICAgICAgICBmb3IgKGxldCByZXN1bHQgb2YgdmFsaWQucmVzdWx0cykge1xuICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzID09IGZhbHNlICYmIHJlc3VsdC5lcnJvciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChyZXN1bHQuZXJyb3IpXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgIGN0eC50aHJvdyg0MDAsIGJ1aWxkRXJyb3JSZXNwb25zZShlcnJvcnMpKVxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IG1vZGVsLnNhdmUob2JqKVxuXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG5cbiAgICAgICAgICAgIGZvciAobGV0IG1lbWJlciBvZiBtb2RlbC5tZW1iZXJzKSB7XG4gICAgICAgICAgICAgICBwcm9wcy5wdXNoKG1lbWJlci5uYW1lKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjdHguYm9keSA9IGJ1aWxkRGV0YWlsZWRSZXNwb25zZShvYmosIHByb3BzKVxuICAgICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgICAgfSlcbiAgICAgIH1cbiAgIH1cblxuICAgLyoqXG4gICAgKiBcbiAgICAqIENvbnNpZGVyIGFkZGluZyBhbiBlYXNpZXIgd2F5IHRvIG1vZGlmeSB0aGUgcmVxdWVzdDpcbiAgICAqICAgIChcbiAgICAqICAgICAgIHZhbGlkYXRlOiB7XG4gICAgKiAgICAgICAgICByZXF1aXJlZDoge1xuICAgICogICAgICAgICAgICAgICAgb25lOiB7IHR5cGU6ICdzdHJpbmcnIH1cbiAgICAqICAgICAgICAgICAgICAgdHdvOiB7IHR5cGU6ICdudW1iZXInIH1cbiAgICAqICAgICAgICAgIH0sXG4gICAgKiAgICAgICBoYW5kbGVyOiAoeyBib2R5LCBwYXJhbXMsIHFzLCBtb2RlbCwgc3RhY2t9KSA9PiB7XG4gICAgKiAgICAgICBtb2RlbC5jcmVhdGU8TW9kZWw+KHtcbiAgICAqICAgICAgICAgIG9uZTogYm9keS5vbmVcbiAgICAqICAgICAgIH0pXG4gICAgKiBcbiAgICAqICAgIH1cbiAgICAqICAgIFxuICAgICogXG4gICAgKiBAcGFyYW0gdXJsUGF0aCBcbiAgICAqIEBwYXJhbSBvcHRpb25zIFxuICAgICogQHJldHVybnMgXG4gICAgKi9cbiAgIHBvc3QodXJsUGF0aDogc3RyaW5nLCBvcHRpb25zOiBQb3N0UmVxdWVzdE9wdGlvbnMpOiB2b2lkIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICBvcHRpb25zLm1vZGVsID0gb3B0aW9ucy5tb2RlbCB8fCB1bmRlZmluZWRcbiAgICAgIG9wdGlvbnMuaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlciB8fCB1bmRlZmluZWRcblxuICAgICAgaWYgKG9wdGlvbnMuaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5wb3N0KHVybFBhdGgsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMuaGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICBhd2FpdCBvcHRpb25zLmhhbmRsZXIoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSlcblxuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLm1vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgUE9TVCAke3VybFBhdGh9IGVuZHBvaW50LCAnbW9kZWwnIG11c3QgYmUgZGVmaW5lZCBpZiBhIGhhbmRsZXIgaXNuJ3QgcHJvdmlkZWRgKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJvdXRlci5wb3N0KHVybFBhdGgsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgbGV0IG1vZGVsID0gb3B0aW9ucy5tb2RlbCBhcyBJTW9kZWxcbiAgICAgICAgIGxldCBib2R5ID0gY3R4LnJlcXVlc3QuYm9keVxuXG4gICAgICAgICBpZiAoIWJvZHkpIHtcbiAgICAgICAgICAgIGN0eC50aHJvdyg0MDAsIGBBIGJvZHkgbXVzdCBiZSBwcm92aWRlZGApXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIH1cblxuICAgICAgICAgbGV0IG9iaiA9IGF3YWl0IG1vZGVsLmNyZWF0ZShib2R5IGFzIE9iamVjdENyZWF0ZVBhcmFtcylcbiAgICAgICAgIGF3YWl0IG1vZGVsLnNhdmUob2JqKVxuXG4gICAgICAgICBjdHguYm9keSA9IGJ1aWxkRGV0YWlsZWRSZXNwb25zZShvYmopXG4gICAgICAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgICB9KVxuICAgfVxuXG4gICBkZWwodXJsUGF0aDogc3RyaW5nLCBvcHRpb25zOiBEZWxldGVSZXF1ZXN0T3B0aW9ucyk6IHZvaWQge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgIG9wdGlvbnMubW9kZWwgPSBvcHRpb25zLm1vZGVsIHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5oYW5kbGVyID0gb3B0aW9ucy5oYW5kbGVyIHx8IHVuZGVmaW5lZFxuXG4gICAgICBpZiAob3B0aW9ucy5oYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLmRlbGV0ZSh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmIChvcHRpb25zLmhhbmRsZXIgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgYXdhaXQgb3B0aW9ucy5oYW5kbGVyKGN0eCwgdGhpcy5yZXN0Q29udGV4dCwgbmV4dClcbiAgICAgICAgICAgIH1cbiAgICAgICAgIH0pXG5cbiAgICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5tb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlIERFTEVURSAke3VybFBhdGh9IGVuZHBvaW50LCAnbW9kZWwnIG11c3QgYmUgZGVmaW5lZCBpZiBhIGhhbmRsZXIgaXNuJ3QgcHJvdmlkZWRgKVxuICAgICAgfVxuXG4gICAgICB0aGlzLnJvdXRlci5kZWxldGUoYCR7dXJsUGF0aH0vOmlkYCwgYXN5bmMgKGN0eDogS29hLkNvbnRleHQsIG5leHQ6IEtvYS5OZXh0KSA9PiB7XG4gICAgICAgICBsZXQgbW9kZWwgPSBvcHRpb25zLm1vZGVsIGFzIElNb2RlbFxuICAgICAgICAgbGV0IGlkID0gY3R4LnBhcmFtcy5pZFxuXG4gICAgICAgICBsZXQgb2JqID0gYXdhaXQgbW9kZWwuZ2V0KGlkKVxuXG4gICAgICAgICBpZiAob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgICAgIGN0eC5ib2R5ID0gdW5kZWZpbmVkXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIH1cblxuICAgICAgICAgYXdhaXQgbW9kZWwuZGVsZXRlKG9iailcblxuICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2Uob2JqKVxuICAgICAgfSlcbiAgIH1cblxuICAgbGlzdGVuKHBvcnQ6IG51bWJlciA9IDM0MDEsIGhhbmRsZXI6IExpc3RlbkhhbmRsZXIgPSAoKSA9PiB7IH0pOiBTZXJ2ZXIge1xuICAgICAgdGhpcy5hcHBcbiAgICAgICAgIC51c2UoYm9keXBhcnNlcigpKVxuICAgICAgICAgLnVzZSh0aGlzLnJvdXRlci5yb3V0ZXMoKSlcbiAgICAgICAgIC51c2UodGhpcy5yb3V0ZXIuYWxsb3dlZE1ldGhvZHMoKSlcblxuICAgICAgdGhpcy5hcHAudXNlKGFzeW5jIChjdHg6IEtvYS5Db250ZXh0KSA9PiB7XG4gICAgICAgICAvLyB0aGUgcGFyc2VkIGJvZHkgd2lsbCBzdG9yZSBpbiBjdHgucmVxdWVzdC5ib2R5XG4gICAgICAgICAvLyBpZiBub3RoaW5nIHdhcyBwYXJzZWQsIGJvZHkgd2lsbCBiZSBhbiBlbXB0eSBvYmplY3Qge31cbiAgICAgICAgIGN0eC5ib2R5ID0gY3R4LnJlcXVlc3QuYm9keVxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRoaXMuYXBwLmxpc3Rlbihwb3J0LCAoKSA9PiB7XG4gICAgICAgICBoYW5kbGVyKClcbiAgICAgIH0pXG4gICB9XG59Il19