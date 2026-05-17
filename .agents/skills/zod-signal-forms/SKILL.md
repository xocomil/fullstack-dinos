---
name: zod-signal-forms
description: Augments Angular Signal Forms with Zod-based validation. Use when integrating Zod schemas as validators in Signal Forms, bridging Zod field schemas to Signal Forms validate(), or maintaining a single source of truth for validation rules across frontend forms and backend/API layers.
---

# Zod + Signal Forms Validation

Use `validateStandardSchema()` from `@angular/forms/signals` with Zod v4 schemas. Zod v4 implements the [Standard Schema](https://standardschema.dev/) spec natively.

**Prerequisites**: Angular v21+, Zod v4+. Read [signal-forms.md](../angular-developer/references/signal-forms.md) first.

## Whole-Model Validation

Pass the root schema path and the full Zod object schema:

```ts
import * as z from 'zod';
import { form, validateStandardSchema } from '@angular/forms/signals';

const userParser = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  age: z.number().min(18, { message: 'Must be at least 18.' }),
});

// In component class:
protected readonly model = signal({ name: '', email: '', age: 0 });

protected readonly userForm = form(this.model, (schemaPath) => {
  validateStandardSchema(schemaPath, userParser);
});
```

## Field-Level Validation

Use `.shape` to extract individual field schemas when you need per-field control:

```ts
protected readonly userForm = form(this.model, (s) => {
  validateStandardSchema(s.name, userParser.shape.name);
  validateStandardSchema(s.email, userParser.shape.email);
  validateStandardSchema(s.age, userParser.shape.age);
});
```

This is useful when combining with Signal Forms rules like `disabled()` or `hidden()` on specific fields.

## Nullable/Optional Fields

Signal Forms models use non-null defaults (`''`, `0`, `[]`). Use Zod unions for "empty or valid" patterns:

```ts
const schema = z.object({
  // Empty string OR 3+ chars
  description: z.string().min(3).or(z.string().max(0)).nullish(),
  // Empty string OR valid URL
  website: z.string().url().or(z.string().max(0)).nullish(),
});
```

## Combining with Angular Built-in Validators

You can mix `validateStandardSchema()` with Angular's built-in validators on the same field:

```ts
import { required, validateStandardSchema } from '@angular/forms/signals';

protected readonly userForm = form(this.model, (s) => {
  required(s.email, { message: 'Email is required.' });
  validateStandardSchema(s.email, z.string().email({ message: 'Invalid email.' }));
});
```

## Store-Level Safety Net

Keep Zod `safeParse()` in the store/service layer as a guard before API calls. Signal Forms handles UI validation; Zod in the store prevents bad data from reaching the API:

```ts
switchMap((data) => {
  const result = myModelParser.safeParse(data);
  if (!result.success) {
    console.warn('Store-level validation failed:', result.error.issues);
    return EMPTY;
  }
  return apiService.save(result.data);
}),
```

## Common Pitfalls

| Pitfall              | Problem                                          | Solution                                                                        |
| -------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| **Type mismatch**    | Zod schema expects `null` but form field is `''` | Use `.or(z.string().max(0))` for optional string fields                         |
| **Number fields**    | Zod expects `number` but input gives `string`    | Signal Forms `[formField]` with `type="number"` coerces to number automatically |
| **Async validation** | Using `validateStandardSchema` for async checks  | Use `validateAsync()` with `resource()` instead — Zod is sync only              |
