type TemplateInputs =
  | string[]
  | [...string[], Record<string, unknown>]
  | [Record<string, unknown>];

function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

function isStringArray(values: TemplateInputs): values is string[] {
  const lastValue = values.at(-1);

  return typeof lastValue === 'string';
}

function breakUpValues(values: TemplateInputs): {
  stringValues: string[];
  dictionary: Record<string, unknown>;
} {
  if (isStringArray(values)) {
    return { stringValues: values, dictionary: {} };
  }

  const dictionary = values.pop() as Record<string, string>;

  return { stringValues: values as string[], dictionary };
}

export function template(
  strings: TemplateStringsArray,
  ...keys: (string | number)[]
) {
  return (...values: TemplateInputs) => {
    const { stringValues, dictionary } = breakUpValues(values);
    const result: unknown[] = [strings[0]];

    keys.forEach((key, i) => {
      const value = isInteger(key) ? stringValues.at(key) : dictionary[key];
      result.push(value, strings[i + 1]);
    });

    return result.join('');
  };
}
