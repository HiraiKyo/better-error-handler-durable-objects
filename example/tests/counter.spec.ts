import { describe, expect, it } from "vitest";
import { env } from "cloudflare:test";
import app from "../src";

// Durable Object Integration test
describe("Counter Test", () => {
	it("increment count", async () => {
		const id = env.COUNTER.idFromName("main");
		const stub = await env.COUNTER.get(id);
		const count = await stub.increment(1);
		expect(count).toEqual(1);
	});

	it("decrement count", async () => {
		const id = env.COUNTER.idFromName("main");
		const stub = await env.COUNTER.get(id);
		const count = await stub.decrement(1);
		expect(count).toEqual(-1);
	});

	it("get current count", async () => {
		const id = env.COUNTER.idFromName("main");
		const stub = await env.COUNTER.get(id);
		const count = await stub.getCounterValue();
		expect(count).toEqual(0);
	});
});

// Endpoint Integration tests
describe("Counter Endpoint Test", () => {
	it("POST /counter/increment", async () => {
		const res = await app.request("/counter/increment", {
			method: "POST",
			body: JSON.stringify({ value: 1 }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(res.status).toEqual(201);
		const body = await res.json();
		expect(body).toEqual({
			count: 1,
		});
	});
	it("POST /counter/decrement", async () => {
		const res = await app.request("/counter/decrement", {
			method: "POST",
			body: JSON.stringify({ value: 1 }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(res.status).toEqual(201);
		const body = await res.json();
		expect(body).toEqual({
			count: -1,
		});
	});
	it("GET /counter", async () => {
		const res = await app.request("/counter");
		expect(res.status).toEqual(200);
		const body = await res.json();
		expect(body).toEqual({
			count: 0,
		});
	});
});
