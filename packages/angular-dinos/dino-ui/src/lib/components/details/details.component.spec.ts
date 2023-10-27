import { ɵPLATFORM_BROWSER_ID as PLATFORM_BROWSER_ID } from '@angular/common';
import { PLATFORM_ID, signal } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import {
  DetailsStoreService,
  Dinosaur,
  createEmptyDino,
} from '@fullstack-dinos/angular-dinos/dinos-gql';
import { byTextContent, createComponentFactory } from '@ngneat/spectator/jest';
import { MockProvider } from 'ng-mocks';
import { DisplayDinoComponent } from '../display-dino/display-dino.component';
import { DetailsComponent } from './details.component';

describe('DetailsComponent', () => {
  beforeEach(() => {
    window.performance.mark = jest.fn();
  });

  const editMode = signal(false);
  const dinosaur = signal<Dinosaur>(createEmptyDino());
  const genusSpecies = signal('');
  const displayTrivia = signal(0);
  const mockDetailsStoreService = (): Partial<DetailsStoreService> => ({
    editMode,
    dinosaur,
    genusSpecies,
    displayTrivia,
    setId: jest.fn(),
    setEditMode: jest.fn(),
  });

  const createComponent = createComponentFactory({
    component: DetailsComponent,
    componentProviders: [
      MockProvider(DetailsStoreService, mockDetailsStoreService()),
    ],
    providers: [
      { provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID },
      provideRouter(
        [{ path: 'details', component: DetailsComponent }],
        withComponentInputBinding(),
      ),
    ],
  });

  // const createHost = createHostFactory({
  //   component: DetailsComponent,
  //   componentProviders: [
  //     MockProvider(DetailsStoreService, mockDetailsStoreService()),
  //   ],
  //   providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }],
  // });

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

    afterEach(() => {
      editMode.set(false);
    });

    it('should show placeholder first', () => {
      const spectator = createComponent();

      const button = spectator.query(
        byTextContent('Click me...', { selector: 'button' }),
      );

      expect(button).toBeTruthy();
    });

    // it('should show dinosaur edit component after defer completes', async () => {
    //   const spectator = createComponent();

    //   console.log(
    //     'isEditMode',
    //     editMode(),
    //     spectator.fixture.debugElement.nativeElement.innerHTML,
    //   );

    //   expect(spectator.query(EditDinoComponent)).toBeFalsy();

    //   spectator.click('button[type="button"]');

    //   spectator.detectChanges();
    //   spectator.detectComponentChanges();

    //   console.log(
    //     'html after click',
    //     spectator.fixture.nativeElement.innerHTML,
    //   );

    //   const defer = await spectator.fixture.getDeferBlocks();

    //   console.log('defer blocks', defer);

    //   expect(defer.length).toBeGreaterThan(0);

    //   // await defer.render(DeferBlockState.Complete);

    //   expect(spectator.query(EditDinoComponent)).toBeTruthy();
    // });

    // it('should show dinosaur edit component after defer completes (Host Component)', async () => {
    //   const spectator = createHost(`<fullstack-dinos-details />`);

    //   console.log(
    //     'isEditMode (host)',
    //     editMode(),
    //     spectator.fixture.debugElement.nativeElement.innerHTML,
    //   );

    //   expect(spectator.query(EditDinoComponent)).toBeFalsy();

    //   spectator.click('button[type="button"]');

    //   spectator.detectChanges();
    //   spectator.detectComponentChanges();

    //   console.log(
    //     'html after click (host)',
    //     spectator.fixture.nativeElement.innerHTML,
    //   );

    //   const defer = await spectator.fixture.getDeferBlocks();

    //   console.log('defer blocks', defer);

    //   expect(defer.length).toBeGreaterThan(0);

    //   // await defer.render(DeferBlockState.Complete);

    //   expect(spectator.query(EditDinoComponent)).toBeTruthy();
    // });

    // it('should show dinosaur edit component after defer completes (TestBed)', async () => {
    //   TestBed.configureTestingModule({
    //     imports: [DisplayDinoComponent, EditDinoComponent],
    //     providers: [{ provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }],
    //     deferBlockBehavior: DeferBlockBehavior.Manual,
    //   }).overrideComponent(DetailsComponent, {
    //     remove: { providers: [DetailsStoreService] },
    //     add: {
    //       providers: [
    //         MockProvider(DetailsStoreService, mockDetailsStoreService()),
    //       ],
    //     },
    //   });

    //   const fixture = TestBed.createComponent(DetailsComponent);

    //   const service = fixture.componentRef.injector.get(DetailsStoreService);

    //   console.log(
    //     'isEditMode',
    //     service.editMode(),
    //     fixture.debugElement.nativeElement.innerHTML,
    //   );

    //   // expect(spectator.query(EditDinoComponent)).toBeFalsy();

    //   fixture.detectChanges();

    //   const defer = await fixture.getDeferBlocks();

    //   console.log('defer blocks', defer);

    //   expect(defer.length).toBeGreaterThan(0);

    //   // await defer.render(DeferBlockState.Complete);

    //   // expect(spectator.query(EditDinoComponent)).toBeTruthy();
    // });
  });

  describe('component inputs', () => {
    it('should call detailsStore.setId() when dinoId input changes', async () => {
      const dinoId = 'test-id-1234';

      const harness = await RouterTestingHarness.create();

      const activatedComponent = await harness.navigateByUrl(
        `/details?dinoId=${dinoId}`,
        DetailsComponent,
      );
      expect(activatedComponent).toBeInstanceOf(DetailsComponent);

      const detailsStore =
        harness.routeDebugElement?.injector.get(DetailsStoreService);

      expect(detailsStore?.setId).toHaveBeenCalledWith(dinoId);
    });

    it('should call detailsStore.setEditMode(true) when editMode is true', async () => {
      const dinoId = 'test-id-1234';

      const harness = await RouterTestingHarness.create();

      const activatedComponent = await harness.navigateByUrl(
        `/details?dinoId=${dinoId}&editMode=true`,
        DetailsComponent,
      );
      expect(activatedComponent).toBeInstanceOf(DetailsComponent);

      const detailsStore =
        harness.routeDebugElement?.injector.get(DetailsStoreService);

      expect(detailsStore?.setId).toHaveBeenCalledWith(dinoId);
      expect(detailsStore?.setEditMode).toHaveBeenCalledWith(true);
    });

    it('should call detailsStore.setEditMode(false) when editMode is false', async () => {
      const dinoId = 'test-id-1234';

      const harness = await RouterTestingHarness.create();

      const activatedComponent = await harness.navigateByUrl(
        `/details?dinoId=${dinoId}&editMode=false`,
        DetailsComponent,
      );
      expect(activatedComponent).toBeInstanceOf(DetailsComponent);

      const detailsStore =
        harness.routeDebugElement?.injector.get(DetailsStoreService);

      expect(detailsStore?.setId).toHaveBeenCalledWith(dinoId);
      expect(detailsStore?.setEditMode).toHaveBeenCalledWith(false);
    });

    it('should call detailsStore.setEditMode(false) when editMode is not present', async () => {
      const dinoId = 'test-id-1234';

      const harness = await RouterTestingHarness.create();

      const activatedComponent = await harness.navigateByUrl(
        `/details?dinoId=${dinoId}`,
        DetailsComponent,
      );
      expect(activatedComponent).toBeInstanceOf(DetailsComponent);

      const detailsStore =
        harness.routeDebugElement?.injector.get(DetailsStoreService);

      expect(detailsStore?.setId).toHaveBeenCalledWith(dinoId);
      expect(detailsStore?.setEditMode).toHaveBeenCalledWith(false);
    });
  });
});
