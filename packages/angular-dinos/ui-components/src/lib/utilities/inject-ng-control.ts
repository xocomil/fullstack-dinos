// This code came from https://netbasal.com/forwarding-form-controls-to-custom-control-components-in-angular-701e8406cc55

import { inject } from '@angular/core';
import {
  FormControlDirective,
  FormControlName,
  NgControl,
  NgModel,
} from '@angular/forms';

export function injectNgControl() {
  const ngControl = inject(NgControl, { self: true, optional: true });

  if (!ngControl)
    throw new Error(
      '[INGC-0001]: You must provide an ngControl to use injectNgControl.',
    );

  if (
    ngControl instanceof FormControlDirective ||
    ngControl instanceof FormControlName ||
    ngControl instanceof NgModel
  ) {
    return ngControl;
  }

  throw new Error(
    '[INGC-0002]: Unsupported ngControl type when using injectNgControl.',
  );
}
