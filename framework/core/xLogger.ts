export type LogSink = (message: string) => void;
export type StepRunner = <T>(title: string, body: () => Promise<T> | T) => Promise<T>;

function defaultSink(message: string): void {
  console.info(`INFO: ${message}`);
}

async function defaultStepRunner<T>(_title: string, body: () => Promise<T> | T): Promise<T> {
  return await body();
}

let entries: string[] = [];
let sinks: LogSink[] = [defaultSink];
let stepRunner: StepRunner = defaultStepRunner;

function record(message: string): void {
  entries.push(message);

  for (const sink of sinks) {
    sink(message);
  }
}

export const xLogger = {
  history(): readonly string[] {
    return [...entries];
  },

  async step<T>(title: string, body: () => Promise<T> | T): Promise<T> {
    record(title);
    return await stepRunner(title, body);
  },

  setSinksForTesting(nextSinks: LogSink[]): void {
    sinks = nextSinks;
  },

  setStepRunnerForTesting(nextStepRunner: StepRunner): void {
    stepRunner = nextStepRunner;
  },

  resetForTesting(): void {
    entries = [];
    sinks = [defaultSink];
    stepRunner = defaultStepRunner;
  }
};
