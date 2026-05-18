export interface UserData {
  name: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipCode: string;
  mobileNumber: string;
  company: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

const FIRST_NAMES = ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley"];
const LAST_NAMES = ["Smith", "Johnson", "Brown", "Davis", "Wilson", "Miller"];
const STREETS = ["Main Street", "Market Street", "Oak Avenue", "Cedar Lane", "Maple Road", "Pine Drive"];
const CITIES = ["Austin", "Seattle", "Denver", "Boston", "Chicago", "Phoenix"];
const STATES = ["Texas", "Washington", "Colorado", "Massachusetts", "Illinois", "Arizona"];
const COMPANIES = ["Playforge Labs", "Example Works", "Test Automation Co", "Quality Forge"];

function createRandom(seed?: number): () => number {
  if (seed === undefined) {
    return Math.random;
  }

  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick<T>(values: readonly T[], random: () => number): T {
  const value = values[Math.floor(random() * values.length)];
  if (value === undefined) {
    throw new Error("Cannot pick from an empty values list");
  }
  return value;
}

function numberBetween(random: () => number, min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min;
}

function alphaNumeric(random: () => number, length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[numberBetween(random, 0, chars.length - 1)]).join("");
}

export function buildUser(overrides: Partial<UserData> & { seed?: number } = {}): UserData {
  const random = createRandom(overrides.seed);
  const firstName = overrides.firstName ?? pick(FIRST_NAMES, random);
  const lastName = overrides.lastName ?? pick(LAST_NAMES, random);
  return {
    name: overrides.name ?? `${firstName} ${lastName}`,
    email:
      overrides.email ??
      (overrides.seed !== undefined
        ? `playforge-${alphaNumeric(random, 12)}@example.com`
        : `playforge-${String(Date.now())}-${alphaNumeric(random, 6)}@example.com`),
    password: overrides.password ?? "Playforge123!",
    firstName,
    lastName,
    address: overrides.address ?? `${String(numberBetween(random, 100, 9999))} ${pick(STREETS, random)}`,
    city: overrides.city ?? pick(CITIES, random),
    country: overrides.country ?? "United States",
    state: overrides.state ?? pick(STATES, random),
    zipCode: overrides.zipCode ?? String(numberBetween(random, 10000, 99999)),
    mobileNumber: overrides.mobileNumber ?? `555${String(numberBetween(random, 1000000, 9999999))}`,
    company: overrides.company ?? pick(COMPANIES, random),
    birthDay: overrides.birthDay ?? String(numberBetween(random, 1, 28)),
    birthMonth: overrides.birthMonth ?? String(numberBetween(random, 1, 12)),
    birthYear: overrides.birthYear ?? String(numberBetween(random, 1970, 2000))
  };
}

export async function createUser(overrides: Partial<UserData> & { seed?: number } = {}): Promise<UserData> {
  const user = buildUser(overrides);
  const body = new URLSearchParams({
    address1: user.address,
    address2: "",
    birth_date: user.birthDay,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    city: user.city,
    company: user.company,
    country: user.country,
    email: user.email,
    firstname: user.firstName,
    lastname: user.lastName,
    mobile_number: user.mobileNumber,
    name: user.name,
    password: user.password,
    state: user.state,
    title: "Mr",
    zipcode: user.zipCode
  });

  const response = await fetch("https://automationexercise.com/api/createAccount", {
    body: body.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "POST"
  });

  const json = (await response.json()) as { message: string; responseCode: number };
  if (json.responseCode !== 201) {
    throw new Error(`createUser failed (${String(json.responseCode)}): ${json.message}`);
  }

  return user;
}

export async function deleteUser(email: string, password: string): Promise<void> {
  const body = new URLSearchParams({ email, password });
  await fetch("https://automationexercise.com/api/deleteAccount", {
    body: body.toString(),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    method: "DELETE"
  });
}
