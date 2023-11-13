import { ComponentFixture, TestBed } from '@angular/core/testing';
import { YesNoComponent } from './yes-no.component';

describe('YesNoComponent', () => {
  let component: YesNoComponent;
  let fixture: ComponentFixture<YesNoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YesNoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(YesNoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
