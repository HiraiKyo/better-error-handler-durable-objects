/**
 * API TEMPLATE
 *
 * To create a new API, copy this to your new file and follow this instruction.
 * 1. Import from the parent index route file. (The root is at src/index.ts)
 * 2. Name a path of the route and add the handler to Hono instance.
 * 3. If nested route, create a new folder and add the index file.
 * 4. Write your own code between TODO sections.
 * 5. Try removing all TODO comments.
 * 6. Delete unnecessary comments.
 */

import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";

export const app = new OpenAPIHono();

/**
 * Common preprocessors
 */

// Logging
// app.use(logger());
app.use(requestId());

// CORS
const corsMiddleware = cors({
	origin: ["localhost"],
	allowHeaders: ["*"],
	allowMethods: ["GET"],
	exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
	maxAge: 600,
	credentials: true,
});
app.use(corsMiddleware);

/**
 * Endpoint Specifics
 */

const responseSchema = z.object({
	count: z.number().int(),
});

// Routing, Request, Response
const route = createRoute({
	path: "/",
	method: "get",
	description: "Get the current counter value.",
	responses: {
		200: {
			description: "Current counter value",
			content: {
				"application/json": {
					schema: responseSchema,
				},
			},
		},
		500: {
			description: "Internal Server Error",
		},
	},
});

// Handler
app.openapi(route, async (c) => {
	try {
		const id = await c.env.COUNTER.idFromName("main");
		const stub = await c.env.COUNTER.get(id);
		const count = await stub.getCounterValue();
		const resBody: z.infer<typeof responseSchema> = {
			count,
		};

		return c.json(resBody, 200);
	} catch (e: any) {
		if (e instanceof HTTPException) {
			throw e;
		}
		console.error("Failed to get Counter value", {
			requestId: c.get("requestId"),
			...e,
		});
		throw new HTTPException(500);
	}
});
