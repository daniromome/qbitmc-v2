import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { applicationResolver } from './application.resolver';

describe('applicationResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => applicationResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
