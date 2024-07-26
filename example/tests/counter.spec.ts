import { describe, expect, it } from "vitest";
import { env } from "cloudflare:test";
import { app } from "../src/routes/counter";

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
	it("POST /increment", async () => {
		const res = await app.request(
			"/increment",
			{
				method: "POST",
				body: JSON.stringify({ value: 1 }),
				headers: {
					"Content-Type": "application/json",
				},
			},
			env
		);
		expect(res.status).toEqual(201);
		const body = await res.json();
		expect(body).toEqual({
			count: 1,
		});
	});
	it("POST /decrement", async () => {
		const res = await app.request(
			"/decrement",
			{
				method: "POST",
				body: JSON.stringify({ value: 1 }),
				headers: {
					"Content-Type": "application/json",
				},
			},
			env
		);
		expect(res.status).toEqual(201);
		const body = await res.json();
		expect(body).toEqual({
			count: -1,
		});
	});
	it("GET /", async () => {
		const res = await app.request(
			"/",
			{
				method: "GET",
			},
			env
		);
		expect(res.status).toEqual(200);
		const body = await res.json();
		expect(body).toEqual({
			count: 0,
		});
	});
});
