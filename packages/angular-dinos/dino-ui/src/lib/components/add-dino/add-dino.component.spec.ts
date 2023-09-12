import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDinoComponent } from './add-dino.component';

describe('AddDinoComponent', () => {
  let component: AddDinoComponent;
  let fixture: ComponentFixture<AddDinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDinoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
