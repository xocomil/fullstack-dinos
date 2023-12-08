import { computed } from '@angular/core';
import {
  patchState,
  signalStoreFeature,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

type DinoPropDict<T extends object> = Partial<Record<keyof T, string>>;
type ErrorsSlice<T extends object> = { errors: DinoPropDict<T> };

export function withErrors<T extends object>() {
  return signalStoreFeature(
    withState<ErrorsSlice<T>>({
      errors: {},
    }),
    withComputed(({ errors }) => ({
      errorsArray: computed(() => Object.values(errors())),
    })),
    withMethods((state) => ({
      clearErrors: () => {
        patchState(state, clearDinoErrors());
      },
    })),
  );
}

export function updateDinoErrors<T extends object>(
  errors: DinoPropDict<T>,
): ErrorsSlice<T> {
  return { errors };
}

export function clearDinoErrors(): ErrorsSlice<object> {
  return { errors: {} };
}
