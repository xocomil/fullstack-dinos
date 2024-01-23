import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { OpenaiDino } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { logObservable } from '@fullstack-dinos/rxjs-operators';
import { Observable } from 'rxjs';
import { environment } from '../../../../../src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenaiService {
  readonly #httpClient = inject(HttpClient);

  updateDino(dino: OpenaiDino): Observable<OpenaiDino> {
    return this.#httpClient
      .post<OpenaiDino>(`${environment.dinoApiUrl}/openai`, dino)
      .pipe(logObservable('OpenaiService updateDino'));
  }
}
