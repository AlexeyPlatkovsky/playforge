import { rm } from "fs/promises";
import { resolve } from "path";

export default async function globalSetup(): Promise<void> {
  await rm(resolve("allure-results"), { recursive: true, force: true });
}
