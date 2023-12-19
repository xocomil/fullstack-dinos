import { inject, InjectionToken, Provider } from '@angular/core';
import { signalStore, withState } from '@ngrx/signals';
import {
  AddDinoState,
  EditDinoState,
  emptyAddDino,
  emptyEditDino,
} from '../models/details.state';
import { Dinosaur } from '../models/dinosaur';
import { withAddDino } from './with-add-dino.store';
import { withCallState } from './with-call-state.store';
import { withErrors } from './with-dino-errors.store';
import { withEditDino } from './with-edit-dino.store';

export const EditDinoStore = signalStore(
  withState<EditDinoState>(emptyEditDino()),
  withCallState(),
  withErrors<Dinosaur>(),
  withEditDino(),
);

export const AddDinoStore = signalStore(
  withState<AddDinoState>(emptyAddDino()),
  withErrors<Dinosaur>(),
  withCallState(),
  withAddDino(),
);

type EditStoreType = InstanceType<typeof EditDinoStore>;
type AddStoreType = InstanceType<typeof AddDinoStore>;

type DinoStore = EditStoreType | AddStoreType;

export const DINO_STORE = new InjectionToken<DinoStore>('DINO_STORE');

export const provideEditDinoStore = (): Provider => {
  return [
    {
      provide: DINO_STORE,
      useClass: EditDinoStore,
    },
    {
      provide: EditDinoStore,
      useFactory: () => inject(DINO_STORE),
      dependsOn: [DINO_STORE],
    },
  ];
};

export const provideAddDinoStore = (): Provider => {
  return [
    {
      provide: DINO_STORE,
      useClass: AddDinoStore,
    },
    {
      provide: AddDinoStore,
      useFactory: () => inject(DINO_STORE),
      dependsOn: [DINO_STORE],
    },
  ];
};
