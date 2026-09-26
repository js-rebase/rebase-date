import test from "node:test";
import assert from "node:assert/strict";
import plugin, { formatDate } from "../index.js";

test("formats date tokens", () => {
  const value = new Date(2026, 8, 26, 14, 5, 9, 123);

  assert.equal(formatDate(value, "YYYY-MM-DD"), "2026-09-26");
  assert.equal(formatDate(value, "DD.MM.YYYY"), "26.09.2026");
  assert.equal(formatDate(value, "HH:mm:ss"), "14:05:09");
  assert.equal(formatDate(value, "hh:mm A"), "02:05 PM");
  assert.equal(formatDate(value, "YYYY-MM-DD HH:mm:ss.SSS"), "2026-09-26 14:05:09.123");
});

test("plugin registers date and datetime", async () => {
  const rebase = {
    directives: new Map(),
    directive(name, handler) {
      this.directives.set(name, handler);
      return this;
    }
  };

  plugin(rebase);

  assert.equal(rebase.directives.has("date"), true);
  assert.equal(rebase.directives.has("datetime"), true);

  const date = await rebase.directives.get("date")({ expression: "'2026-09-26' as DD.MM.YYYY" });
  const time = await rebase.directives.get("datetime")({ expression: "'2026-09-26T14:05:09' as HH:mm:ss" });

  assert.equal(date, "26.09.2026");
  assert.equal(time, "14:05:09");
});

test("defaults to current date and datetime formats", () => {
  const date = formatDate(new Date(2026, 8, 26, 14, 5, 9), "YYYY-MM-DD");
  const datetime = formatDate(new Date(2026, 8, 26, 14, 5, 9), "YYYY-MM-DD HH:mm:ss");

  assert.equal(date, "2026-09-26");
  assert.equal(datetime, "2026-09-26 14:05:09");
});
