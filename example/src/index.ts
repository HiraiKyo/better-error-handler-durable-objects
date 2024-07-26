/**
 * Common Preprocessing
 */

import { OpenAPIHono } from "@hono/zod-openapi";
import { app as appIndex } from "./routes/index";
import { HTTPException } from "hono/http-exception";
import { swaggerUI } from "@hono/swagger-ui";
import { logger } from "hono/logger";

// TODO: Register new DurableObject classes here
export { Counter } from "./do";

const app = new OpenAPIHono();

app.route("/", appIndex);

app
	.doc("/specification", {
		openapi: "3.0.0",
		info: {
			title: "Example API",
			version: "1.0.0",
		},
	})
	.get(
		"/docs",
		swaggerUI({
			url: "/specification",
		})
	);

app.notFound((c) => {
	return c.text("Not Found", 404);
});

app.onError((err, c) => {
	return c.text(err.message, err instanceof HTTPException ? err.status : 500);
});

app.use(logger());
export default app;
