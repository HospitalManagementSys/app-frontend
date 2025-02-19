import { TestBed } from '@angular/core/testing';
import { redirectGuard } from './redirect.guard';

describe('redirectGuard', () => {
  let guard: redirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [redirectGuard],
    });

    guard = TestBed.inject(redirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
