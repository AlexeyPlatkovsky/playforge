import { z } from "zod";

const optionalString = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().optional()
);

const envSchema = z.object({
  BASE_URL: z.url(),
  HIGHLIGHT: z.enum(["0", "1"]).default("0"),
  TEST_PASSWORD: optionalString,
  TEST_USERNAME: optionalString
});

export type ParsedEnv = z.infer<typeof envSchema>;

export function parseEnv(rawEnv: NodeJS.ProcessEnv): ParsedEnv {
  return envSchema.parse(rawEnv);
}
