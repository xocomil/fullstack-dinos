import { ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID } from '@angular/common';
import { PLATFORM_ID, signal } from '@angular/core';
import { DeferBlockBehavior, TestBed } from '@angular/core/testing';
import {
  DetailsStoreService,
  Dinosaur,
  createEmptyDino,
} from '@fullstack-dinos/angular-dinos/dinos-gql';
import { byTextContent, createComponentFactory } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { EditDinoComponent } from '../edit-dino/edit-dino.component';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  const editMode = signal(false);
  const dinosaur = signal<Dinosaur>(createEmptyDino());
  const genusSpecies = signal('');
  const displayTrivia = signal(0);
  const mockDetailsStoreService = (): Partial<DetailsStoreService> => ({
    editMode,
    dinosaur,
    genusSpecies,
    displayTrivia,
  });

  const createComponent = createComponentFactory({
    component: DetailsComponent,
    componentProviders: [
      MockProvider(DetailsStoreService, mockDetailsStoreService()),
    ],
    providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }],
  });

  it('should create', () => {
    const spectator = createComponent();

    expect(spectator).toBeTruthy();
  });

  describe('when not in edit mode', () => {
    beforeEach(() => {
      editMode.set(false);
    });

    it('should show display dino component', () => {
      const spectator = createComponent();

      expect(spectator.query(DisplayDinoComponent)).toBeTruthy();
    });
  });

  describe('when in edit mode', () => {
    beforeEach(() => {
      editMode.set(true);
    });

    it('should show placeholder first', () => {
      const spectator = createComponent();

      const button = spectator.query(
        byTextContent('Click me...', { selector: 'button' }),
      );

      expect(button).toBeTruthy();
    });

    it('should show dinosaur edit component after defer completes', async () => {
      const spectator = createComponent();

      console.log(
        'isEditMode',
        editMode(),
        spectator.fixture.debugElement.nativeElement.innerHTML,
      );

      expect(spectator.query(EditDinoComponent)).toBeFalsy();

      const defer = await spectator.fixture.getDeferBlocks();

      console.log('defer blocks', defer);

      expect(defer.length).toBeGreaterThan(0);

      // await defer.render(DeferBlockState.Complete);

      expect(spectator.query(EditDinoComponent)).toBeTruthy();
    });

    it('should show dinosaur edit component after defer completes (TestBed)', async () => {
      TestBed.configureTestingModule({
        imports: [DisplayDinoComponent, EditDinoComponent],
        providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }],
        deferBlockBehavior: DeferBlockBehavior.Manual,
      }).overrideComponent(DetailsComponent, {
        remove: { providers: [DetailsStoreService] },
        add: {
          providers: [
            MockProvider(DetailsStoreService, mockDetailsStoreService()),
          ],
        },
      });

      const fixture = TestBed.createComponent(DetailsComponent);

      const service = fixture.componentRef.injector.get(DetailsStoreService);

      console.log(
        'isEditMode',
        service.editMode(),
        fixture.debugElement.nativeElement.innerHTML,
      );

      // expect(spectator.query(EditDinoComponent)).toBeFalsy();

      fixture.detectChanges();

      const defer = await fixture.getDeferBlocks();

      console.log('defer blocks', defer);

      expect(defer.length).toBeGreaterThan(0);

      // await defer.render(DeferBlockState.Complete);

      // expect(spectator.query(EditDinoComponent)).toBeTruthy();
    });
  });
});
