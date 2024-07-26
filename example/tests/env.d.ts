import { Env } from "hono";

type BaseEnv = Env["Bindings"];

declare module "cloudflare:test" {
	interface ProvidedEnv extends BaseEnv {}
}
