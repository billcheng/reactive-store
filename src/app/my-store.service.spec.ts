/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyStoreService } from './my-store.service';

describe('Service: MyStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyStoreService]
    });
  });

  it('should ...', inject([MyStoreService], (service: MyStoreService) => {
    expect(service).toBeTruthy();
  }));
});
