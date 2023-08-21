import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fullstack-dinos-display-dino',
  standalone: true,
  imports: [CommonModule],
  template: `<p>display-dino works!</p>`,
  styleUrls: ['./display-dino.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DisplayDinoComponent {}
