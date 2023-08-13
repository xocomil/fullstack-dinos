import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DinosTableComponent } from './dinos-table.component';

describe('DinosTableComponent', () => {
  let component: DinosTableComponent;
  let fixture: ComponentFixture<DinosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ DinosTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DinosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
