import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerForm } from './borrower-form';

describe('BorrowerForm', () => {
  let component: BorrowerForm;
  let fixture: ComponentFixture<BorrowerForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowerForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowerForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
