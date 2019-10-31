import { TestBed } from '@angular/core/testing';
import { DataService } from './data-service.service';
import { MODULE } from '../app.component.spec';

describe('DataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule(MODULE));

  it('should be created', () => {
    const service: DataService = TestBed.get(DataService);
    expect(service).toBeTruthy();
  });
});
