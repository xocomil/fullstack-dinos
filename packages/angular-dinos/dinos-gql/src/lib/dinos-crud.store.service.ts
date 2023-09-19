import { Injectable, inject } from '@angular/core';
import { Suspense } from '@jscutlery/operators';
import { ComponentStore } from '@ngrx/component-store';
import { filter, map, switchMap, tap } from 'rxjs';
import { DinosCrudService } from './dinos-crud.service';
import { BaseDinosaur } from './models/dinosaur';

type DinosCrudState = {
  dinosaurs: BaseDinosaur[];
};

const emptyState = (): DinosCrudState => ({
  dinosaurs: [],
});

@Injectable()
export class DinosCrudStoreService extends ComponentStore<DinosCrudState> {
  readonly #crudService = inject(DinosCrudService);

  readonly dinosaurs = this.selectSignal(({ dinosaurs }) => dinosaurs);

  constructor() {
    super(emptyState());
  }

  readonly getTableDinos = this.effect((getDinos$) =>
    getDinos$.pipe(
      switchMap(() => this.#crudService.getDinosTable()),
      tap((response) => {
        if (response.hasError) {
          console.error('Error getting data', response.error);
        }
      }),
      filter(hasValue),
      map((response) => response.value.allDinosaurs),
      tap((dinosaurs) => {
        this.patchState({ dinosaurs });
      }),
    ),
  );
}

const hasValue = <T>(
  response: Suspense<T>,
): response is Suspense<T> & { hasValue: true } => {
  return response.hasValue;
};
