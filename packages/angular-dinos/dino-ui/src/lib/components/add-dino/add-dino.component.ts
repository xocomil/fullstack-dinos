
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideAddDinoStore } from '@fullstack-dinos/angular-dinos/dinos-gql';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';

@Component({
    selector: 'fullstack-dinos-add-dino',
    template: `
    <fullstack-dinos-edit-dino />
  `,
    styleUrls: ['./add-dino.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [EditDinoComponent],
    providers: [provideAddDinoStore()]
})
export class AddDinoComponent {}
