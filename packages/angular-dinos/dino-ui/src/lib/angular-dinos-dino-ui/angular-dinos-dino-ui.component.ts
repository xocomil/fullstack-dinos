import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fullstack-dinos-angular-dinos-dino-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './angular-dinos-dino-ui.component.html',
  styleUrls: ['./angular-dinos-dino-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AngularDinosDinoUiComponent {}
