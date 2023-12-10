import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouteToHomeComponent } from './route-to-home.component';

describe('RouteToHomeComponent', () => {
  let component: RouteToHomeComponent;
  let fixture: ComponentFixture<RouteToHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteToHomeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RouteToHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
