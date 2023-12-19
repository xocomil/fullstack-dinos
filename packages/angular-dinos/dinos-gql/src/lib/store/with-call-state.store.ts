// Taken from: https://github.com/markostanimirovic/ngrx-signal-store-playground/blob/main/src/app/shared/call-state.feature.ts
import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type CallState = 'init' | 'loading' | 'loaded' | { error: string };
export type CallStateSlice = { callState: CallState };

export function withCallState() {
  return signalStoreFeature(
    withState<CallStateSlice>({ callState: 'init' }),
    withComputed(({ callState }) => ({
      loading: computed(() => callState() === 'loading'),
      loaded: computed(() => callState() === 'loaded'),
      error: computed(() => {
        const state = callState();
        return typeof state === 'object' ? state.error : null;
      }),
    })),
  );
}

// Copied from https://www.angulararchitects.io/en/blog/the-new-ngrx-signal-store-for-angular-2-1-flavors/
export function setLoading(): { callState: CallState } {
  return { callState: 'loading' };
}

export function setLoaded(): { callState: CallState } {
  return { callState: 'loaded' };
}

export function setError(error: string): { callState: CallState } {
  return { callState: { error } };
}
