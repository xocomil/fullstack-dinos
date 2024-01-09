import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpenaiComponent } from './openai.component';

describe('OpenaiComponent', () => {
  let component: OpenaiComponent;
  let fixture: ComponentFixture<OpenaiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenaiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
