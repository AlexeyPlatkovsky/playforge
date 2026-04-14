import { expect, test } from "@playwright/test";

import { xComponent } from "../../framework/core/xComponent";
import { wrapLocator } from "../../framework/core/xLocator";
import { createFakeLocator, flushMicrotasks, type RecordedCall } from "./helpers/fakes";
import { xLogger } from "../../framework/core/xLogger";

class AvatarComponent extends xComponent {
  readonly image = this.$("[data-testid='avatar-image']");
}

class LoginFormComponent extends xComponent {
  readonly username = this.$("input[name='username']");
  readonly avatar = new AvatarComponent(this.$("[data-testid='avatar']"));
}

test.beforeEach(() => {
  xLogger.resetForTesting();
});

test("xComponent binds field names after construction and names nested roots @unit", async () => {
  const calls: RecordedCall[] = [];
  const form = new LoginFormComponent(
    wrapLocator(createFakeLocator("#login-form", calls), { selector: "#login-form" })
  );

  await flushMicrotasks();

  expect(form.username.__meta.name).toBe("username");
  expect(form.avatar.root.__meta.name).toBe("avatar");
  expect(form.avatar.image.__meta.name).toBe("image");
  expect(calls).toEqual([
    { args: ["input[name='username']"], method: "locator", target: "#login-form" },
    { args: ["[data-testid='avatar']"], method: "locator", target: "#login-form" },
    { args: ["[data-testid='avatar-image']"], method: "locator", target: "#login-form >> [data-testid='avatar']" }
  ]);
});
