import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingDetails } from './banking-details';

describe('BankingDetails', () => {
  let component: BankingDetails;
  let fixture: ComponentFixture<BankingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankingDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankingDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
