import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideAddDinoStore } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
  selector: 'fullstack-dinos-add-dino',
  standalone: true,
  template: `
    <fullstack-dinos-edit-dino />
  `,
  styleUrls: ['./add-dino.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, EditDinoComponent],
  providers: [provideAddDinoStore()],
})
export class AddDinoComponent {}
