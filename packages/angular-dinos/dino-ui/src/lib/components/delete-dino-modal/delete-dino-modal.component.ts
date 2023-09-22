import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import {
  BaseDinosaur,
  createEmptyBaseDino,
} from '@fullstack-dinos/angular-dinos/dinos-gql';
import { Subject } from 'rxjs';

@Component({
  selector: 'fullstack-dinos-delete-dino-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog #dialog class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Confirm delete!</h3>
        <p class="py-4">Are you sure you want to delete this dinosaur?</p>
        <p>
          {{ dinoToDelete().name }} ({{ dinoToDelete().genus }}
          {{ dinoToDelete().species }})
        </p>
        <div class="modal-action">
          <form method="dialog">
            <button class="btn">Cancel</button>
            <button class="btn btn-primary" (click)="onClick()">Confirm</button>
          </form>
        </div>
      </div>
    </dialog>
  `,
  styleUrls: ['./delete-dino-modal.component.scss'],
})
export class DeleteDinoModalComponent {
  @ViewChild('dialog', { static: true }) dialog!: ElementRef<HTMLDialogElement>;

  readonly #confirmDelete$ = new Subject<BaseDinosaur>();
  readonly confirmDelete$ = this.#confirmDelete$.asObservable();

  protected dinoToDelete = signal(createEmptyBaseDino());

  open(dino: BaseDinosaur) {
    this.dinoToDelete.set(dino);
    this.dialog.nativeElement.showModal();
  }

  protected onClick() {
    this.#confirmDelete$.next(this.dinoToDelete());
  }
}
