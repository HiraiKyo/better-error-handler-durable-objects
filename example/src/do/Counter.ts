import { DurableObject } from "cloudflare:workers";
import { Env } from "hono";

export class Counter extends DurableObject {
  constructor(
    private readonly state: DurableObjectState,
    readonly env: Env["Bindings"]
  ) {
    super(state, env);
  }

  /** ==============
   * Standard methods
   *  ============== */

  async getCounterValue() {
    let stored = await this.state.storage.get<number>("value");
    if (!stored) {
      return 0;
    }
    return stored;
  }

  async increment(amount = 1) {
    let value: number = await this.getCounterValue();
    value += amount;
    await this.state.storage.put<number>("value", value);
    return value;
  }

  async decrement(amount = 1) {
    let value: number = await this.getCounterValue();
    value -= amount;
    await this.state.storage.put<number>("value", value);
    return value;
  }
}
