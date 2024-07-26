import { DurableObjectNamespace } from "@cloudflare/workers-types";
import { Counter } from "./do";

declare module "hono" {
	interface Env {
		Bindings: {
			// TODO: Add the new Durable Object namespace here
			COUNTER: DurableObjectNamespace<Counter>;
		};
		Variables: {};
	}
}
