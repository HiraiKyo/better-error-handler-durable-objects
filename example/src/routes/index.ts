import { OpenAPIHono } from "@hono/zod-openapi";
import { app as appCounter } from "./counter/index";

export const app = new OpenAPIHono();

app.route("/counter", appCounter);
