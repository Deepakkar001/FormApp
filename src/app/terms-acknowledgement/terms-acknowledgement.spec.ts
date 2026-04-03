import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsAcknowledgement } from './terms-acknowledgement';

describe('TermsAcknowledgement', () => {
  let component: TermsAcknowledgement;
  let fixture: ComponentFixture<TermsAcknowledgement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsAcknowledgement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsAcknowledgement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
