import { TestBed } from '@angular/core/testing';

import { TaskSettingService } from './task-setting.service';

describe('TaskSettingService', () => {
  let service: TaskSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
