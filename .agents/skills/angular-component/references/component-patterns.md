# Angular Component Patterns

## Table of Contents
- [Model Inputs (Two-Way Binding)](#model-inputs-two-way-binding)
- [View Queries](#view-queries)
- [Content Queries](#content-queries)
- [Dependency Injection in Components](#dependency-injection-in-components)
- [Component Communication Patterns](#component-communication-patterns)
- [Dynamic Components](#dynamic-components)

## Model Inputs (Two-Way Binding)

For two-way binding with `[(value)]` syntax:

```typescript
import { Component, model } from '@angular/core';

@Component({
  selector: 'app-slider',
  host: {
    '(input)': 'onInput($event)',
  },
  template: `
    <input 
      type="range" 
      [value]="value()" 
      [min]="min()" 
      [max]="max()" 
    />
    <span>{{ value() }}</span>
  `,
})
export class SliderComponent {
  // Model creates both input and output
  value = model(0);
  min = input(0);
  max = input(100);
  
  onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.value.set(Number(target.value));
  }
}

// Usage: <app-slider [(value)]="sliderValue" />
```

Required model:

```typescript
value = model.required<number>();
```

## View Queries

Query elements and components in the template:

```typescript
import { Component, viewChild, viewChildren, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  template: `
    <div #container class="gallery">
      @for (image of images(); track image.id) {
        <app-image-card [image]="image" />
      }
    </div>
  `,
})
export class GalleryComponent implements AfterViewInit {
  images = input.required<Image[]>();
  
  // Query single element
  container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  
  // Query single component (optional)
  firstCard = viewChild(ImageCardComponent);
  
  // Query all matching components
  allCards = viewChildren(ImageCardComponent);
  
  ngAfterViewInit() {
    console.log('Container:', this.container().nativeElement);
    console.log('Cards:', this.allCards().length);
  }
}
```

## Content Queries

Query projected content:

```typescript
import { Component, contentChild, contentChildren, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tab-headers">
      @for (tab of tabs(); track tab.label()) {
        <button 
          [class.active]="tab === activeTab()"
          (click)="selectTab(tab)"
        >
          {{ tab.label() }}
        </button>
      }
    </div>
    <div class="tab-content">
      <ng-content />
    </div>
  `,
})
export class TabsComponent implements AfterContentInit {
  // Query all projected TabComponent children
  tabs = contentChildren(TabComponent);
  
  // Query single projected element
  header = contentChild('tabHeader');
  
  activeTab = signal<TabComponent | undefined>(undefined);
  
  ngAfterContentInit() {
    // Set first tab as active
    const firstTab = this.tabs()[0];
    if (firstTab) {
      this.activeTab.set(firstTab);
    }
  }
  
  selectTab(tab: TabComponent) {
    this.activeTab.set(tab);
  }
}

@Component({
  selector: 'app-tab',
  template: `<ng-content />`,
  host: {
    '[class.active]': 'isActive()',
    '[style.display]': 'isActive() ? "block" : "none"',
  },
})
export class TabComponent {
  label = input.required<string>();
  isActive = input(false);
}
```

## Dependency Injection in Components

Use `inject()` function instead of constructor injection:

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `...`,
})
export class DashboardComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private config = inject(APP_CONFIG);
  
  // Optional injection
  private analytics = inject(AnalyticsService, { optional: true });
  
  // Self-only injection
  private localService = inject(LocalService, { self: true });
  
  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
```

## Component Communication Patterns

### Parent to Child (Inputs)

```typescript
// Parent
@Component({
  template: `<app-child [data]="parentData()" [config]="config" />`,
})
export class ParentComponent {
  parentData = signal({ name: 'Test' });
  config = { theme: 'dark' };
}

// Child
@Component({ selector: 'app-child' })
export class ChildComponent {
  data = input.required<Data>();
  config = input<Config>();
}
```

### Child to Parent (Outputs)

```typescript
// Child
@Component({
  selector: 'app-child',
  template: `<button (click)="save()">Save</button>`,
})
export class ChildComponent {
  saved = output<Data>();
  
  save() {
    this.saved.emit({ id: 1, name: 'Item' });
  }
}

// Parent
@Component({
  template: `<app-child (saved)="onSaved($event)" />`,
})
export class ParentComponent {
  onSaved(data: Data) {
    console.log('Saved:', data);
  }
}
```

### Shared Service Pattern

```typescript
// Shared state service
@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);
  
  readonly items$ = this.items.asReadonly();
  readonly total = computed(() => 
    this.items().reduce((sum, item) => sum + item.price, 0)
  );
  
  addItem(item: CartItem) {
    this.items.update(items => [...items, item]);
  }
  
  removeItem(id: string) {
    this.items.update(items => items.filter(i => i.id !== id));
  }
}

// Component A
@Component({ template: `<button (click)="add()">Add</button>` })
export class ProductComponent {
  private cart = inject(CartService);
  product = input.required<Product>();
  
  add() {
    this.cart.addItem({ ...this.product(), quantity: 1 });
  }
}

// Component B
@Component({ template: `<span>Total: {{ cart.total() }}</span>` })
export class CartSummaryComponent {
  cart = inject(CartService);
}
```

## Dynamic Components

Using `@defer` for lazy loading:

```typescript
@Component({
  template: `
    @defer (on viewport) {
      <app-heavy-chart [data]="chartData()" />
    } @placeholder {
      <div class="chart-placeholder">Loading chart...</div>
    } @loading (minimum 500ms) {
      <app-spinner />
    } @error {
      <p>Failed to load chart</p>
    }
  `,
})
export class DashboardComponent {
  chartData = input.required<ChartData>();
}
```

Defer triggers:
- `on viewport` - When element enters viewport
- `on idle` - When browser is idle
- `on interaction` - On user interaction (click, focus)
- `on hover` - On mouse hover
- `on immediate` - Immediately after non-deferred content
- `on timer(500ms)` - After specified delay
- `when condition` - When expression becomes true

```typescript
@Component({
  template: `
    @defer (on interaction; prefetch on idle) {
      <app-comments [postId]="postId()" />
    } @placeholder {
      <button>Load Comments</button>
    }
  `,
})
export class PostComponent {
  postId = input.required<string>();
}
```

## Attribute Directives on Components

```typescript
@Directive({
  selector: '[appHighlight]',
  host: {
    '[style.backgroundColor]': 'color()',
  },
})
export class HighlightDirective {
  color = input('yellow', { alias: 'appHighlight' });
}

// Usage on component
@Component({
  imports: [HighlightDirective],
  template: `<app-card appHighlight="lightblue" />`,
})
export class PageComponent {}
```

## Error Boundaries

```typescript
@Component({
  selector: 'app-error-boundary',
  template: `
    @if (hasError()) {
      <div class="error">
        <h3>Something went wrong</h3>
        <button (click)="retry()">Retry</button>
      </div>
    } @else {
      <ng-content />
    }
  `,
})
export class ErrorBoundaryComponent {
  hasError = signal(false);
  private errorHandler = inject(ErrorHandler);
  
  retry() {
    this.hasError.set(false);
  }
}
```
