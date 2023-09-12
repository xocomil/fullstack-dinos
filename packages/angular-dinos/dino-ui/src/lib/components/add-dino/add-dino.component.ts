import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fullstack-dinos-add-dino',
  standalone: true,
  imports: [CommonModule],
  template: `<p>add-dino works!</p>`,
  styleUrls: ['./add-dino.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDinoComponent {}
