# better-error-handler-durable-objects

Better error handling for Cloudflare DurableObjects with Cloudflare Worker + Hono

## Concept

The main purpose is to use DurableObjects more stabler with some frontend by handling errors and responses, by Hono.

Cloudflare DurableObjects throws a variety of errors which expects retries, limit high load or user code errors.
But Frontend does not concern the reason but only what to do.
