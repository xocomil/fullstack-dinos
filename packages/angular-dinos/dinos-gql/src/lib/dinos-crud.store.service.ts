import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { map, switchMap, tap } from 'rxjs';
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
  readonly #dinosTableQuery = this.#crudService.getDinosTable();

  readonly dinosaurs = this.selectSignal(({ dinosaurs }) => dinosaurs);

  constructor() {
    super(emptyState());
  }

  readonly getTableDinos = this.effect((getDinos$) =>
    getDinos$.pipe(
      switchMap(() => this.#dinosTableQuery.refetch()),
      map((apolloResult) => apolloResult.data.allDinosaurs),
      tap((dinosaurs) => {
        this.patchState({ dinosaurs });
      }),
    ),
  );
}
