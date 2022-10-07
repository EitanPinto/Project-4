import { TestBed } from '@angular/core/testing';

import { OnInitHomePageService } from './on-init-home-page.service';

describe('OnInitHomePageService', () => {
  let service: OnInitHomePageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnInitHomePageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
