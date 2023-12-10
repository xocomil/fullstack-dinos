import { SignalStoreFeature } from '@ngrx/signals';
import {
  EmptyFeatureResult,
  InnerSignalStore,
} from '@ngrx/signals/src/signal-store-models';

export function declareState<State extends object>(): SignalStoreFeature<
  EmptyFeatureResult,
  EmptyFeatureResult & { state: State }
> {
  return (store) => store as InnerSignalStore<State>;
}
