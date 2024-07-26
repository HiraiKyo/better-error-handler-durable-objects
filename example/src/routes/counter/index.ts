import { OpenAPIHono } from "@hono/zod-openapi";
import { app as appIndex } from "./index.route";
import { app as appIncrement } from "./increment.route";
import { app as appDecrement } from "./decrement.route";

export const app = new OpenAPIHono();
app.route("/", appIndex);
app.route("/increment", appIncrement);
app.route("/decrement", appDecrement);
