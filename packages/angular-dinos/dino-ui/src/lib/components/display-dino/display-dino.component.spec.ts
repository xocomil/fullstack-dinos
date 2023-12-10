import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayDinoComponent } from './display-dino.component';

describe('DisplayDinoComponent', () => {
  let component: DisplayDinoComponent;
  let fixture: ComponentFixture<DisplayDinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayDinoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DisplayDinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
