# Angular Dependency Injection Patterns

## Table of Contents
- [Service Patterns](#service-patterns)
- [Abstract Classes as Tokens](#abstract-classes-as-tokens)
- [Hierarchical Injection](#hierarchical-injection)
- [Dynamic Providers](#dynamic-providers)
- [Testing with DI](#testing-with-di)
- [DestroyRef and Cleanup](#destroyref-and-cleanup)

## Service Patterns

### Facade Service

Combine multiple services into a single API:

```typescript
@Injectable({ providedIn: 'root' })
export class ShopFacade {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  
  // Expose combined state
  readonly products = this.productService.products;
  readonly cart = this.cartService.items;
  readonly cartTotal = this.cartService.total;
  
  // Unified actions
  addToCart(productId: string, quantity: number) {
    const product = this.productService.getById(productId);
    if (product) {
      this.cartService.add(product, quantity);
    }
  }
  
  async checkout() {
    const items = this.cartService.items();
    const order = await this.orderService.create(items);
    this.cartService.clear();
    return order;
  }
}
```

### State Service Pattern

```typescript
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private state = signal<UserState>({
    user: null,
    loading: false,
    error: null,
  });
  
  // Selectors
  readonly user = computed(() => this.state().user);
  readonly loading = computed(() => this.state().loading);
  readonly error = computed(() => this.state().error);
  readonly isAuthenticated = computed(() => this.state().user !== null);
  
  // Actions
  setUser(user: User) {
    this.state.update(s => ({ ...s, user, loading: false, error: null }));
  }
  
  setLoading() {
    this.state.update(s => ({ ...s, loading: true, error: null }));
  }
  
  setError(error: string) {
    this.state.update(s => ({ ...s, loading: false, error }));
  }
  
  clear() {
    this.state.set({ user: null, loading: false, error: null });
  }
}
```

### Repository Pattern

```typescript
// Generic repository interface
export abstract class Repository<T extends { id: string }> {
  abstract getAll(): Promise<T[]>;
  abstract getById(id: string): Promise<T | null>;
  abstract create(item: Omit<T, 'id'>): Promise<T>;
  abstract update(id: string, item: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<void>;
}

// HTTP implementation
@Injectable()
export class HttpUserRepository extends Repository<User> {
  private http = inject(HttpClient);
  private apiUrl = inject(API_URL);
  
  async getAll(): Promise<User[]> {
    return firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/users`));
  }
  
  async getById(id: string): Promise<User | null> {
    return firstValueFrom(
      this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
        catchError(() => of(null))
      )
    );
  }
  
  async create(user: Omit<User, 'id'>): Promise<User> {
    return firstValueFrom(this.http.post<User>(`${this.apiUrl}/users`, user));
  }
  
  async update(id: string, user: Partial<User>): Promise<User> {
    return firstValueFrom(this.http.patch<User>(`${this.apiUrl}/users/${id}`, user));
  }
  
  async delete(id: string): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.apiUrl}/users/${id}`));
  }
}

// Provide implementation
{ provide: Repository, useClass: HttpUserRepository }
```

## Abstract Classes as Tokens

Use abstract classes for better type safety:

```typescript
// Abstract service definition
export abstract class Logger {
  abstract log(message: string): void;
  abstract error(message: string, error?: Error): void;
  abstract warn(message: string): void;
}

// Console implementation
@Injectable()
export class ConsoleLogger extends Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
  
  error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}`, error);
  }
  
  warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }
}

// Remote implementation
@Injectable()
export class RemoteLogger extends Logger {
  private http = inject(HttpClient);
  
  log(message: string) {
    this.send('log', message);
  }
  
  error(message: string, error?: Error) {
    this.send('error', message, error);
  }
  
  warn(message: string) {
    this.send('warn', message);
  }
  
  private send(level: string, message: string, error?: Error) {
    this.http.post('/api/logs', { level, message, error: error?.message }).subscribe();
  }
}

// Provide based on environment
{
  provide: Logger,
  useClass: environment.production ? RemoteLogger : ConsoleLogger,
}

// Inject using abstract class
@Injectable({ providedIn: 'root' })
export class UserService {
  private logger = inject(Logger);
  
  createUser(user: User) {
    this.logger.log(`Creating user: ${user.email}`);
    // ...
  }
}
```

## Hierarchical Injection

### Component Tree Injection

```typescript
// Parent provides service
@Component({
  selector: 'app-form-container',
  providers: [FormStateService],
  template: `
    <app-form-header />
    <app-form-body />
    <app-form-footer />
  `,
})
export class FormContainerComponent {
  private formState = inject(FormStateService);
}

// Children share same instance
@Component({
  selector: 'app-form-body',
  template: `...`,
})
export class FormBodyComponent {
  // Gets same instance as parent
  private formState = inject(FormStateService);
}

// Grandchildren also share
@Component({
  selector: 'app-form-field',
  template: `...`,
})
export class FormFieldComponent {
  // Gets same instance from ancestor
  private formState = inject(FormStateService);
}
```

### viewProviders vs providers

```typescript
@Component({
  selector: 'app-tabs',
  // providers: Available to component AND content children
  providers: [TabsService],
  
  // viewProviders: Available to component AND view children only
  // NOT available to content children (<ng-content>)
  viewProviders: [InternalTabsService],
  
  template: `
    <div class="tabs">
      <ng-content /> <!-- Content children can't access viewProviders -->
    </div>
  `,
})
export class TabsComponent {}
```

## Dynamic Providers

### Feature Flags

```typescript
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FeatureFlags');

interface FeatureFlags {
  newDashboard: boolean;
  betaFeatures: boolean;
  experimentalApi: boolean;
}

// Load from API
{
  provide: FEATURE_FLAGS,
  useFactory: async () => {
    const response = await fetch('/api/features');
    return response.json();
  },
}

// Use in components
@Component({...})
export class DashboardComponent {
  private features = inject(FEATURE_FLAGS);
  
  showNewDashboard = this.features.newDashboard;
}
```

### Platform-Specific Services

```typescript
export abstract class StorageService {
  abstract get(key: string): string | null;
  abstract set(key: string, value: string): void;
  abstract remove(key: string): void;
}

@Injectable()
export class BrowserStorageService extends StorageService {
  get(key: string) { return localStorage.getItem(key); }
  set(key: string, value: string) { localStorage.setItem(key, value); }
  remove(key: string) { localStorage.removeItem(key); }
}

@Injectable()
export class ServerStorageService extends StorageService {
  private store = new Map<string, string>();
  
  get(key: string) { return this.store.get(key) ?? null; }
  set(key: string, value: string) { this.store.set(key, value); }
  remove(key: string) { this.store.delete(key); }
}

// Provide based on platform
import { PLATFORM_ID, isPlatformBrowser } from '@angular/common';

{
  provide: StorageService,
  useFactory: (platformId: object) => {
    return isPlatformBrowser(platformId)
      ? new BrowserStorageService()
      : new ServerStorageService();
  },
  deps: [PLATFORM_ID],
}
```

## Testing with DI

### Mocking Services

```typescript
describe('UserComponent', () => {
  let userServiceSpy: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);
    userServiceSpy.getUser.and.returnValue(of({ id: '1', name: 'Test' }));
    
    await TestBed.configureTestingModule({
      imports: [UserComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();
  });
  
  it('should load user', () => {
    const fixture = TestBed.createComponent(UserComponent);
    fixture.detectChanges();
    
    expect(userServiceSpy.getUser).toHaveBeenCalled();
  });
});
```

### Overriding Providers

```typescript
describe('with different config', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    })
    .overrideProvider(APP_CONFIG, {
      useValue: { apiUrl: 'http://test-api.com' },
    })
    .compileComponents();
  });
});
```

### Testing Injection Tokens

```typescript
describe('API_URL token', () => {
  it('should provide correct URL', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: API_URL, useValue: 'https://api.test.com' },
      ],
    });
    
    const apiUrl = TestBed.inject(API_URL);
    expect(apiUrl).toBe('https://api.test.com');
  });
});
```

## DestroyRef and Cleanup

### Automatic Cleanup

```typescript
import { DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class DataComponent {
  private destroyRef = inject(DestroyRef);
  private dataService = inject(DataService);
  
  constructor() {
    // Auto-unsubscribe when component destroys
    this.dataService.data$
      .pipe(takeUntilDestroyed())
      .subscribe(data => {
        console.log(data);
      });
  }
  
  // Or use DestroyRef directly
  ngOnInit() {
    const subscription = this.dataService.updates$.subscribe();
    
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      console.log('Cleaned up!');
    });
  }
}
```

### In Services

```typescript
@Injectable()
export class WebSocketService {
  private destroyRef = inject(DestroyRef);
  private socket: WebSocket | null = null;
  
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.socket?.close();
    });
  }
  
  connect(url: string) {
    this.socket = new WebSocket(url);
  }
}
```

### takeUntilDestroyed Outside Constructor

```typescript
@Component({...})
export class MyComponent {
  private destroyRef = inject(DestroyRef);
  
  loadData() {
    // Pass destroyRef when using outside constructor
    this.http.get('/api/data')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
```

## Injection Context Utilities

### assertInInjectionContext

```typescript
import { assertInInjectionContext, inject } from '@angular/core';

export function injectLogger(): Logger {
  assertInInjectionContext(injectLogger);
  return inject(Logger);
}

// Usage - must be called in injection context
@Component({...})
export class MyComponent {
  private logger = injectLogger(); // OK
  
  someMethod() {
    // injectLogger(); // ERROR - not in injection context
  }
}
```

### Custom inject Functions

```typescript
// Create reusable injection utilities
export function injectRouteParam(param: string): Signal<string | null> {
  assertInInjectionContext(injectRouteParam);
  
  const route = inject(ActivatedRoute);
  return toSignal(
    route.paramMap.pipe(map(params => params.get(param))),
    { initialValue: null }
  );
}

export function injectQueryParam(param: string): Signal<string | null> {
  assertInInjectionContext(injectQueryParam);
  
  const route = inject(ActivatedRoute);
  return toSignal(
    route.queryParamMap.pipe(map(params => params.get(param))),
    { initialValue: null }
  );
}

// Usage
@Component({...})
export class UserComponent {
  userId = injectRouteParam('id');
  tab = injectQueryParam('tab');
}
```
