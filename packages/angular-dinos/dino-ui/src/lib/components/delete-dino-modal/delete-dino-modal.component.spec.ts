import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteDinoModalComponent } from './delete-dino-modal.component';

describe('DeleteDinoModalComponent', () => {
  let component: DeleteDinoModalComponent;
  let fixture: ComponentFixture<DeleteDinoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteDinoModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteDinoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
