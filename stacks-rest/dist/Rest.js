"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StacksRest = void 0;
const Response_1 = require("./Response");
const koa_1 = __importDefault(require("koa"));
const router_1 = __importDefault(require("@koa/router"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
class StacksRest {
    constructor(stack) {
        this.stack = stack;
        this.app = new koa_1.default();
        this.router = new router_1.default();
    }
    get restContext() {
        return {
            app: this.app,
            router: this.router,
            stack: this.stack
        };
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
        else {
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
        else {
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
                if (!body) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9SZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQU9BLHlDQUltQjtBQUduQiw4Q0FBcUI7QUFDckIseURBQWdDO0FBQ2hDLG9FQUF1QztBQW9DdkMsTUFBYSxVQUFVO0lBYXBCLFlBQVksS0FBYTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUE7UUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLEVBQUUsQ0FBQTtJQUM3QixDQUFDO0lBWkQsSUFBSSxXQUFXO1FBQ1osT0FBTztZQUNKLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRztZQUNiLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtZQUNuQixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7U0FDbkIsQ0FBQTtJQUNKLENBQUM7SUFRRCxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQTJCO1FBQ2xDLE1BQU0sVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW9CRztJQUNILEdBQUcsQ0FBQyxPQUFlLEVBQUUsT0FBMEI7O1FBQzVDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO1FBQ3ZCLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxTQUFTLENBQUE7UUFDMUMsT0FBTyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQTtRQUN4QyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFBO1FBRTVDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxTQUFTO1lBQzNCLE9BQU8sQ0FBQyxNQUFNLEtBQUssU0FBUztZQUM1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QWlEO1lBQ2pELHlEQUF5RDtZQUN6RCxHQUFHLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFBO1FBQzlCLENBQUMsQ0FBQyxDQUFBO1FBRUYsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO1lBQy9CLE9BQU8sRUFBRSxDQUFBO1FBQ1osQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDO0NBQ0g7QUEvU0QsZ0NBK1NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgIElNb2RlbCxcbiAgIElTdGFjayxcbiAgIE9iamVjdENyZWF0ZVBhcmFtcyxcbiAgIFN0YWNrT2JqZWN0XG59IGZyb20gJ0BzcGlrZWRwdW5jaC9zdGFja3MnXG5cbmltcG9ydCB7IFxuICAgYnVpbGREZXRhaWxlZFJlc3BvbnNlLFxuICAgYnVpbGRFcnJvclJlc3BvbnNlLFxuICAgYnVpbGRNaW5pbWFsUmVzcG9uc2UgXG59IGZyb20gJy4vUmVzcG9uc2UnXG5cbmltcG9ydCB7IFNlcnZlciB9IGZyb20gJ2h0dHAnXG5pbXBvcnQgS29hIGZyb20gJ2tvYSdcbmltcG9ydCBSb3V0ZXIgZnJvbSAnQGtvYS9yb3V0ZXInXG5pbXBvcnQgYm9keXBhcnNlciBmcm9tICdrb2EtYm9keXBhcnNlcidcblxuZXhwb3J0IHR5cGUgUmVzdENvbnRleHQgPSB7XG4gICBhcHA6IEtvYVxuICAgcm91dGVyOiBSb3V0ZXJcbiAgIHN0YWNrOiBJU3RhY2tcbn1cblxuZXhwb3J0IGludGVyZmFjZSBJUmVzdE1pZGRsZXdhcmUge1xuICAgc2V0dXAoY29udGV4dDogUmVzdENvbnRleHQpOiBQcm9taXNlPHZvaWQ+XG59XG5cbmV4cG9ydCB0eXBlIFJlcXVlc3RIYW5kbGVyID0gKGN0eDogS29hLkNvbnRleHQsIHJlc3Q6IFJlc3RDb250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4gUHJvbWlzZTx2b2lkPlxuZXhwb3J0IHR5cGUgTGlzdGVuSGFuZGxlciA9ICgpID0+IHZvaWRcblxuZXhwb3J0IHR5cGUgR2V0UmVxdWVzdE9wdGlvbnMgPSB7XG4gICBtb2RlbD86IElNb2RlbFxuICAgbWFueT86IFJlcXVlc3RIYW5kbGVyIHwgc3RyaW5nW11cbiAgIHNpbmdsZT86IFJlcXVlc3RIYW5kbGVyIHwgc3RyaW5nW11cbn1cblxuZXhwb3J0IHR5cGUgUHV0UmVxdWVzdE9wdGlvbnMgPSB7XG4gICBtb2RlbD86IElNb2RlbFxuICAgaGFuZGxlcj86IFJlcXVlc3RIYW5kbGVyXG59XG5cbmV4cG9ydCB0eXBlIFBvc3RSZXF1ZXN0T3B0aW9ucyA9IHtcbiAgIG1vZGVsPzogSU1vZGVsXG4gICBoYW5kbGVyPzogUmVxdWVzdEhhbmRsZXJcbn1cblxuZXhwb3J0IHR5cGUgRGVsZXRlUmVxdWVzdE9wdGlvbnMgPSB7XG4gICBtb2RlbD86IElNb2RlbFxuICAgaGFuZGxlcj86IFJlcXVlc3RIYW5kbGVyXG59XG5cbmV4cG9ydCBjbGFzcyBTdGFja3NSZXN0IHtcbiAgIHJlYWRvbmx5IGFwcDogS29hXG4gICByZWFkb25seSByb3V0ZXI6IFJvdXRlclxuICAgcmVhZG9ubHkgc3RhY2s6IElTdGFja1xuXG4gICBnZXQgcmVzdENvbnRleHQoKTogUmVzdENvbnRleHQge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgIGFwcDogdGhpcy5hcHAsXG4gICAgICAgICByb3V0ZXI6IHRoaXMucm91dGVyLFxuICAgICAgICAgc3RhY2s6IHRoaXMuc3RhY2tcbiAgICAgIH1cbiAgIH1cblxuICAgY29uc3RydWN0b3Ioc3RhY2s6IElTdGFjaykge1xuICAgICAgdGhpcy5zdGFjayA9IHN0YWNrXG4gICAgICB0aGlzLmFwcCA9IG5ldyBLb2EoKVxuICAgICAgdGhpcy5yb3V0ZXIgPSBuZXcgUm91dGVyKClcbiAgIH1cblxuICAgYXN5bmMgdXNlKG1pZGRsZXdhcmU6IElSZXN0TWlkZGxld2FyZSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgYXdhaXQgbWlkZGxld2FyZS5zZXR1cCh0aGlzLnJlc3RDb250ZXh0KVxuICAgfVxuXG4gICAvKipcbiAgICAqIERlZmluZXMgYSBHRVQgUkVTVCBlbmRwb2ludC5cbiAgICAqIFxuICAgICogbWFueSB7IGZ1bmN0aW9uIHwgc3RyaW5nW10gfVxuICAgICogICAgSWYgbWFueSBpcyBhIGZ1bmN0aW9uLCBpdCBkZWZpbmVzIHRoZSBtYW55IGhhbmRsZXIgKGN0eCkgPT4gUHJvbWlzZTx2b2lkPlxuICAgICogICAgSWYgbWFueSBpcyBhIHN0cmluZ1tdLCBpdCBkZWZpbmVzIHRoZSBwcm9wZXJ0aWVzIHRoYXQgd2lsbCBiZSByZXR1cm5lZCBmcm9tXG4gICAgKiAgICB0aGUgcmV0ZXJpZXZlZCBvYmplY3QuXG4gICAgKiBcbiAgICAqIHNpbmdsZSB7IGZ1bmN0aW9uIHwgc3RyaW5nW10gfVxuICAgICogICAgSWYgc2luZ2xlIGlzIGEgZnVuY3Rpb24sIGl0IGhhbmRsZXMgdGhlIFJFU1QgY2FsbCB0aGF0IGluY2x1ZGVzIHRoZSAnaWQnLlxuICAgICogICAgSWYgc2luZ2xlIGlzIGEgc3RyaW5nW10sIGl0IHdpbGwgYmUgZGVmYXVsdCBiZWhhdmlvciwgYnV0IHdpbGwgb25seSByZXR1cm4gXG4gICAgKiAgICB0aGUgcHJvcGVydGllcyBpbiB0aGUgc3RyaW5nW10uXG4gICAgKiBcbiAgICAqIG1vZGVsIHsgSU1vZGVsIH1cbiAgICAqICAgIFRoZSBNb2RlbFxuICAgICogXG4gICAgKiBcbiAgICAqIFxuICAgICogQHBhcmFtIHVybFBhdGggVGhlIFVSTCBwYXRoXG4gICAgKiBAcGFyYW0gb3B0aW9ucyBUaGUgb3B0aW9ucyBmb3IgR0VUXG4gICAgKi9cbiAgIGdldCh1cmxQYXRoOiBzdHJpbmcsIG9wdGlvbnM6IEdldFJlcXVlc3RPcHRpb25zKTogdm9pZCB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgb3B0aW9ucy5tb2RlbCA9IG9wdGlvbnMubW9kZWwgfHwgdW5kZWZpbmVkXG4gICAgICBvcHRpb25zLm1hbnkgPSBvcHRpb25zLm1hbnkgfHwgdW5kZWZpbmVkXG4gICAgICBvcHRpb25zLnNpbmdsZSA9IG9wdGlvbnMuc2luZ2xlIHx8IHVuZGVmaW5lZFxuXG4gICAgICBpZiAob3B0aW9ucy5tYW55ID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgIG9wdGlvbnMuc2luZ2xlID09PSB1bmRlZmluZWQgJiZcbiAgICAgICAgIG9wdGlvbnMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IEdFVCBlbmRwb2ludCwgdGhlICdtb2RlbCcgb3IgYXQgbGVhc3Qgb25lIG9mIHRoZSAnZGV0YWlsZWQnIG9yICdtaW5pbWFsJyBoYW5kbGVycyBtdXN0IGJlIGRlZmluZWQuYClcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLm1hbnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLmdldCh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5tYW55ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlIEdFVCBlbmRwb2ludCBmb3IgJHt1cmxQYXRofSwgdGhlICdtaW5pbWFsJyBwcm9wZXJ0eSBpcyBleHBlY3RlZCB0byBiZSBhIFJlcXVlc3RIYW5kbGVyLmApXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IG9wdGlvbnMubWFueShjdHgsIHRoaXMucmVzdENvbnRleHQsIG5leHQpXG4gICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgIGxldCBwcm9wcyA9IG5ldyBBcnJheTxzdHJpbmc+KClcblxuICAgICAgICAgaWYgKG9wdGlvbnMubW9kZWwgPT0gbnVsbCB8fCBvcHRpb25zLm1vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBHRVQgZW5kcG9pbnQsIHRoZSBNb2RlbCBtdXN0IGJlIHByb3ZpZGVkYClcbiAgICAgICAgIH1cblxuICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5tYW55KSkge1xuICAgICAgICAgICAgcHJvcHMucHVzaCguLi5vcHRpb25zLm1hbnkpXG4gICAgICAgICB9XG5cbiAgICAgICAgIHRoaXMucm91dGVyLmdldCh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IG9wdGlvbnMubW9kZWxcblxuICAgICAgICAgICAgbGV0IHF1ZXJ5ID0gY3R4LnJlcXVlc3QucXVlcnlcbiAgICAgICAgICAgIGxldCBjdXJzb3IgPSBxdWVyeS5wYWdlIHx8ICcnXG4gICAgICAgICAgICBsZXQgbGltaXQgPSBxdWVyeS5saW1pdCB8fCAxMDBcblxuICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICBsZXQgcmVzdWx0cyA9IGF3YWl0IG1vZGVsLmdldE1hbnk8U3RhY2tPYmplY3Q+KHsgY3Vyc29yLCBsaW1pdCB9KVxuXG4gICAgICAgICAgICBjdHguYm9keSA9IGJ1aWxkTWluaW1hbFJlc3BvbnNlKHJlc3VsdHMuaXRlbXMsIHByb3BzKVxuICAgICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgdGhpcy5yb3V0ZXIuZ2V0KGAke3VybFBhdGh9LzppZGAsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSBHRVQgZW5kcG9pbnQgZm9yICR7dXJsUGF0aH0sIHRoZSAnZGV0YWlsZWQnIHByb3BlcnR5IGlzIGV4cGVjdGVkIHRvIGJlIGEgUmVxdWVzdEhhbmRsZXIuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYXdhaXQgb3B0aW9ucy5zaW5nbGUoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICBsZXQgcHJvcHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG5cbiAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG9wdGlvbnMuc2luZ2xlKSkge1xuICAgICAgICAgICAgaWYgKG9wdGlvbnMubW9kZWwgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IEdFVCBlbmRwb2ludCwgd2hlbiBzdXBwbHlpbmcgYSBzdHJpbmcgQXJyYXkgZm9yIHRoZSAnZGV0YWlsZWQnIHByb3BlcnR5LCB0aGUgTW9kZWwgbXVzdCBiZSBhbHNvIGJlIHByb3ZpZGVkYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJvcHMucHVzaCguLi5vcHRpb25zLnNpbmdsZSlcbiAgICAgICAgIH0gZWxzZSBpZihvcHRpb25zLnNpbmdsZSA9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBEZWZhdWx0IGlzIHRvIHVzZSB0aGUgTW9kZWwncyBwcm9wZXJ0aWVzXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgIGZvcihsZXQgbWVtYmVyIG9mIG9wdGlvbnMubW9kZWw/Lm1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgIHByb3BzLnB1c2gobWVtYmVyLm5hbWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9XG5cbiAgICAgICAgIHRoaXMucm91dGVyLmdldChgJHt1cmxQYXRofS86aWRgLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGxldCBtb2RlbCA9IG9wdGlvbnMubW9kZWwgYXMgSU1vZGVsXG5cbiAgICAgICAgICAgIGxldCBpZCA9IGN0eC5wYXJhbXMuaWRcblxuICAgICAgICAgICAgbGV0IHJlc3VsdCA9IGF3YWl0IG1vZGVsLmdldDxTdGFja09iamVjdD4oaWQpXG5cbiAgICAgICAgICAgIGlmKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICBjdHguc3RhdHVzID0gNDAwXG4gICAgICAgICAgICAgICBjdHguYm9keSA9IHsgbWVzc2FnZTogYE5vIE9iamVjdCB3aXRoIGlkICR7aWR9IGV4aXN0cyBgfVxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgIC8vIFNob3VsZCBuZXZlciBnZXQgaGVyZVxuICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSAke3VybFBhdGh9IEdFVCBlbmRvaW50LCB0aGUgJ2RldGFpbGVkJyBwcm9wZXJ0eSBpcyBleHBlY3RlZCB0byBiZSBhIHN0cmluZyBBcnJheSwgcmVjZWl2ZWQgYSAnZnVuY3Rpb24nIGluc3RlYWQuYClcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2UocmVzdWx0LCBwcm9wcylcbiAgICAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgIH0pXG4gICAgICB9XG4gICB9XG5cbiAgIC8qKlxuICAgICogRGVmaW5lcyBhIFBVVCBlbmRwb2ludFxuICAgICogXG4gICAgKiBAcGFyYW0gdXJsUGF0aCBUaGUgVVJMIHBhdGhcbiAgICAqIEBwYXJhbSBvcHRpb25zIFRoZSBvcHRpb25zIHRoYXQgZGVmaW5lIHRoZSBlbmRwb2ludFxuICAgICovXG4gICBwdXQodXJsUGF0aDogc3RyaW5nLCBvcHRpb25zOiBQdXRSZXF1ZXN0T3B0aW9ucyk6IHZvaWQge1xuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICAgIG9wdGlvbnMubW9kZWwgPSBvcHRpb25zLm1vZGVsIHx8IHVuZGVmaW5lZFxuICAgICAgb3B0aW9ucy5oYW5kbGVyID0gb3B0aW9ucy5oYW5kbGVyIHx8IHVuZGVmaW5lZFxuXG4gICAgICBpZihvcHRpb25zLmhhbmRsZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhpcy5yb3V0ZXIucHV0KHVybFBhdGgsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgICAgaWYob3B0aW9ucy5oYW5kbGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgV2hlbiBkZWZpbmluZyB0aGUgJHt1cmxQYXRofSBQVVQgZW5kb2ludCwgdGhlICdoYW5kbGVyJyBwcm9wZXJ0eSBpcyBleHBlY3RlZCB0byBiZSBhIGZ1bmN0aW9uLCByZWNlaXZlZCBhICd1bmRlZmluZWQnIGluc3RlYWQuYClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXdhaXQgb3B0aW9ucy5oYW5kbGVyKGN0eCwgdGhpcy5yZXN0Q29udGV4dCwgbmV4dClcbiAgICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgaWYob3B0aW9ucy5tb2RlbCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlICR7dXJsUGF0aH0gUFVUIHJlcXVlc3QsIHRoZSAnbW9kZWwnIHByb3BlcnR5IGlzIGV4cGVjdGVkIHdoZW4gYSAnaGFuZGxlcicgZnVuY3Rpb24gaXMgbm90IHByb3ZpZGVkLmApXG4gICAgICAgICB9XG5cbiAgICAgICAgIHRoaXMucm91dGVyLnB1dChgJHt1cmxQYXRofS86aWRgLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCkgPT4ge1xuICAgICAgICAgICAgbGV0IGJvZHkgPSBjdHgucmVxdWVzdC5ib2R5XG5cbiAgICAgICAgICAgIGlmICghYm9keSkge1xuICAgICAgICAgICAgICAgY3R4LnRocm93KDQwMCwgYEEgYm9keSBtdXN0IGJlIHByb3ZpZGVkYClcbiAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgaWQgPSBjdHgucGFyYW1zLmlkXG4gICAgICAgICAgICBsZXQgbW9kZWwgPSBvcHRpb25zLm1vZGVsIGFzIElNb2RlbFxuXG4gICAgICAgICAgICBsZXQgb2JqID0gYXdhaXQgbW9kZWwuZ2V0KGlkKVxuXG4gICAgICAgICAgICBpZihvYmogPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgY3R4LnRocm93KDQwMCwgeyBtZXNzYWdlOiBgTm8gT2JqZWN0IHdpdGggaWQgJHtpZH0gZXhpc3RzIGB9KVxuICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihsZXQgcHJvcCBvZiBPYmplY3Qua2V5cyhib2R5KSkge1xuICAgICAgICAgICAgICAgb2JqW3Byb3BdID0gYm9keVtwcm9wXVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdmFsaWQgPSBhd2FpdCBtb2RlbC52YWxpZGF0ZShvYmopXG5cbiAgICAgICAgICAgIGlmKCF2YWxpZC5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICBsZXQgZXJyb3JzID0gbmV3IEFycmF5PEVycm9yPigpXG4gICAgICAgICAgICAgICBmb3IobGV0IHJlc3VsdCBvZiB2YWxpZC5yZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICBpZihyZXN1bHQuc3VjY2VzcyA9PSBmYWxzZSAmJiByZXN1bHQuZXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2gocmVzdWx0LmVycm9yKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICBjdHgudGhyb3coNDAwLCBidWlsZEVycm9yUmVzcG9uc2UoZXJyb3JzKSlcbiAgICAgICAgICAgICAgIHJldHVybiAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGF3YWl0IG1vZGVsLnNhdmUob2JqKVxuXG4gICAgICAgICAgICBsZXQgcHJvcHMgPSBuZXcgQXJyYXk8c3RyaW5nPigpXG5cbiAgICAgICAgICAgIGZvcihsZXQgbWVtYmVyIG9mIG1vZGVsLm1lbWJlcnMpIHtcbiAgICAgICAgICAgICAgIHByb3BzLnB1c2gobWVtYmVyLm5hbWUpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN0eC5ib2R5ID0gYnVpbGREZXRhaWxlZFJlc3BvbnNlKG9iaiwgcHJvcHMpXG4gICAgICAgICAgICBjdHguc3RhdHVzID0gMjAwXG4gICAgICAgICB9KVxuICAgICAgfVxuICAgfVxuXG4gICBwb3N0KHVybFBhdGg6IHN0cmluZywgb3B0aW9uczogUG9zdFJlcXVlc3RPcHRpb25zKTogdm9pZCB7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fVxuICAgICAgb3B0aW9ucy5tb2RlbCA9IG9wdGlvbnMubW9kZWwgfHwgdW5kZWZpbmVkXG4gICAgICBvcHRpb25zLmhhbmRsZXIgPSBvcHRpb25zLmhhbmRsZXIgfHwgdW5kZWZpbmVkXG5cbiAgICAgIGlmKG9wdGlvbnMuaGFuZGxlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aGlzLnJvdXRlci5wb3N0KHVybFBhdGgsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgICAgaWYob3B0aW9ucy5oYW5kbGVyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgIGF3YWl0IG9wdGlvbnMuaGFuZGxlcihjdHgsIHRoaXMucmVzdENvbnRleHQsIG5leHQpXG4gICAgICAgICAgICB9XG4gICAgICAgICB9KVxuXG4gICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgaWYob3B0aW9ucy5tb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFdoZW4gZGVmaW5pbmcgdGhlIFBPU1QgJHt1cmxQYXRofSBlbmRwb2ludCwgJ21vZGVsJyBtdXN0IGJlIGRlZmluZWQgaWYgYSBoYW5kbGVyIGlzbid0IHByb3ZpZGVkYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5yb3V0ZXIucG9zdCh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgIGxldCBtb2RlbCA9IG9wdGlvbnMubW9kZWwgYXMgSU1vZGVsXG4gICAgICAgICBsZXQgYm9keSA9IGN0eC5yZXF1ZXN0LmJvZHlcblxuICAgICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgICAgICBjdHgudGhyb3coNDAwLCBgQSBib2R5IG11c3QgYmUgcHJvdmlkZWRgKVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICB9XG5cbiAgICAgICAgIGxldCBvYmogPSBhd2FpdCBtb2RlbC5jcmVhdGUoYm9keSBhcyBPYmplY3RDcmVhdGVQYXJhbXMpXG4gICAgICAgICBhd2FpdCBtb2RlbC5zYXZlKG9iailcblxuICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2Uob2JqKVxuICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgfSlcbiAgIH1cblxuICAgZGVsKHVybFBhdGg6IHN0cmluZywgb3B0aW9uczogRGVsZXRlUmVxdWVzdE9wdGlvbnMpOiB2b2lkIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9XG4gICAgICBvcHRpb25zLm1vZGVsID0gb3B0aW9ucy5tb2RlbCB8fCB1bmRlZmluZWRcbiAgICAgIG9wdGlvbnMuaGFuZGxlciA9IG9wdGlvbnMuaGFuZGxlciB8fCB1bmRlZmluZWRcblxuICAgICAgaWYob3B0aW9ucy5oYW5kbGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgIHRoaXMucm91dGVyLmRlbGV0ZSh1cmxQYXRoLCBhc3luYyAoY3R4OiBLb2EuQ29udGV4dCwgbmV4dDogS29hLk5leHQpID0+IHtcbiAgICAgICAgICAgIGlmKG9wdGlvbnMuaGFuZGxlciAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICBhd2FpdCBvcHRpb25zLmhhbmRsZXIoY3R4LCB0aGlzLnJlc3RDb250ZXh0LCBuZXh0KVxuICAgICAgICAgICAgfVxuICAgICAgICAgfSlcblxuICAgICAgICAgcmV0dXJuXG4gICAgICB9XG5cbiAgICAgIGlmKG9wdGlvbnMubW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBXaGVuIGRlZmluaW5nIHRoZSBERUxFVEUgJHt1cmxQYXRofSBlbmRwb2ludCwgJ21vZGVsJyBtdXN0IGJlIGRlZmluZWQgaWYgYSBoYW5kbGVyIGlzbid0IHByb3ZpZGVkYClcbiAgICAgIH1cblxuICAgICAgdGhpcy5yb3V0ZXIuZGVsZXRlKGAke3VybFBhdGh9LzppZGAsIGFzeW5jIChjdHg6IEtvYS5Db250ZXh0LCBuZXh0OiBLb2EuTmV4dCkgPT4ge1xuICAgICAgICAgbGV0IG1vZGVsID0gb3B0aW9ucy5tb2RlbCBhcyBJTW9kZWxcbiAgICAgICAgIGxldCBpZCA9IGN0eC5wYXJhbXMuaWRcblxuICAgICAgICAgbGV0IG9iaiA9IGF3YWl0IG1vZGVsLmdldChpZClcblxuICAgICAgICAgaWYob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGN0eC5zdGF0dXMgPSAyMDBcbiAgICAgICAgICAgIGN0eC5ib2R5ID0gdW5kZWZpbmVkXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgIH1cblxuICAgICAgICAgYXdhaXQgbW9kZWwuZGVsZXRlKG9iailcblxuICAgICAgICAgY3R4LnN0YXR1cyA9IDIwMFxuICAgICAgICAgY3R4LmJvZHkgPSBidWlsZERldGFpbGVkUmVzcG9uc2Uob2JqKVxuICAgICAgfSlcbiAgIH1cblxuICAgbGlzdGVuKHBvcnQ6IG51bWJlciA9IDM0MDEsIGhhbmRsZXI6IExpc3RlbkhhbmRsZXIgPSAoKSA9PiB7fSk6IFNlcnZlciB7XG4gICAgICB0aGlzLmFwcFxuICAgICAgICAgLnVzZShib2R5cGFyc2VyKCkpXG4gICAgICAgICAudXNlKHRoaXMucm91dGVyLnJvdXRlcygpKVxuICAgICAgICAgLnVzZSh0aGlzLnJvdXRlci5hbGxvd2VkTWV0aG9kcygpKVxuXG4gICAgICB0aGlzLmFwcC51c2UoYXN5bmMgKGN0eDogS29hLkNvbnRleHQpID0+IHtcbiAgICAgICAgIC8vIHRoZSBwYXJzZWQgYm9keSB3aWxsIHN0b3JlIGluIGN0eC5yZXF1ZXN0LmJvZHlcbiAgICAgICAgIC8vIGlmIG5vdGhpbmcgd2FzIHBhcnNlZCwgYm9keSB3aWxsIGJlIGFuIGVtcHR5IG9iamVjdCB7fVxuICAgICAgICAgY3R4LmJvZHkgPSBjdHgucmVxdWVzdC5ib2R5XG4gICAgICB9KVxuXG4gICAgICByZXR1cm4gdGhpcy5hcHAubGlzdGVuKHBvcnQsICgpID0+IHtcbiAgICAgICAgIGhhbmRsZXIoKVxuICAgICAgfSlcbiAgIH1cbn0iXX0=