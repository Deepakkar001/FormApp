import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalReplayable } from './total-replayable';

describe('TotalReplayable', () => {
  let component: TotalReplayable;
  let fixture: ComponentFixture<TotalReplayable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalReplayable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalReplayable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
