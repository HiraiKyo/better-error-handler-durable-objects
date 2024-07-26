import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";

export const app = new OpenAPIHono();

/**
 * Common preprocessors
 */

// Logging
app.use(requestId());

// CORS
const corsMiddleware = cors({
	origin: ["localhost"],
	allowHeaders: ["*"],
	allowMethods: ["POST", "OPTIONS"],
	exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
	maxAge: 600,
	credentials: true,
});
app.use(corsMiddleware);

/**
 * Endpoint Specifics
 */

// Request and Response Schema
const requestSchema = z.object({
	value: z.number().positive().int(),
});

const errorSchema = z.object({
	code: z.number().openapi({
		example: 422,
	}),
	message: z.string().openapi({
		example: "Invalid input",
	}),
});

const responseSchema = z.object({
	count: z.number().int(),
});

// Routing, Request, Response
const route = createRoute({
	path: "/",
	method: "post",
	description: "decrement the counter value.",
	request: {
		body: {
			required: true,
			content: {
				"application/json": {
					schema: requestSchema,
				},
			},
		},
	},
	responses: {
		201: {
			description: "Increment counter succeeded",
			content: {
				"application/json": {
					schema: responseSchema,
				},
			},
		},
		422: {
			description: "Invalid input",
			content: {
				"application/json": {
					schema: errorSchema,
				},
			},
		},
		500: {
			description: "Internal Server Error",
		},
	},
});

// Handler
app.openapi(
	route,
	async (c) => {
		const reqBody = await c.req.json<z.infer<typeof requestSchema>>();
		try {
			const id = await c.env.COUNTER.idFromName("main");
			const stub = await c.env.COUNTER.get(id);
			const count = await stub.increment(reqBody.value);
			const resBody: z.infer<typeof responseSchema> = {
				count,
			};
			return c.json(resBody, 201);
		} catch (e: any) {
			if (e instanceof HTTPException) {
				throw e;
			}
			console.error("Failed to increment counter value", {
				requestId: c.get("requestId"),
				...e,
			});
			throw new HTTPException(500);
		}
	},
	(result, c) => {
		if (!result.success) {
			return c.json({ code: 422, message: result.error.message }, 422);
		}
	}
);
