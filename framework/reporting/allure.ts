import { test } from "@playwright/test";

export interface AttachmentOptions {
  body: Buffer | string;
  contentType?: string;
  name: string;
}

export async function allureStep<T>(title: string, body: () => Promise<T> | T): Promise<T> {
  return await test.step(title, async () => {
    return await Promise.resolve(body());
  });
}

export async function allureAttachment(options: AttachmentOptions): Promise<void> {
  await test.info().attach(options.name, {
    body: options.body,
    contentType: options.contentType ?? "application/octet-stream"
  });
}

export async function allureText(name: string, text: string): Promise<void> {
  await allureAttachment({ body: text, contentType: "text/plain", name });
}

export async function allureJson(name: string, value: unknown): Promise<void> {
  await allureAttachment({
    body: JSON.stringify(value, null, 2),
    contentType: "application/json",
    name
  });
}
