import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDinosDinoUiComponent } from './angular-dinos-dino-ui.component';

describe('AngularDinosDinoUiComponent', () => {
  let component: AngularDinosDinoUiComponent;
  let fixture: ComponentFixture<AngularDinosDinoUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ AngularDinosDinoUiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AngularDinosDinoUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
