import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DinoErrorsComponent } from './dino-errors.component';

describe('DinoErrorsComponent', () => {
  let component: DinoErrorsComponent;
  let fixture: ComponentFixture<DinoErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DinoErrorsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DinoErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
