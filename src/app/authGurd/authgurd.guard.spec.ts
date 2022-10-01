import { TestBed } from '@angular/core/testing';

import { AuthgurdGuard } from './authgurd.guard';

describe('AuthgurdGuard', () => {
  let guard: AuthgurdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthgurdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
