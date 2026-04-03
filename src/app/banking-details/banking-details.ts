import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from "@angular/router";
import { FormDataService } from '../services/form-data-services';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper';

@Component({
  selector: 'app-banking-details',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, ReactiveFormsModule, ToastModule,ProgressStepperComponent],
  templateUrl: './banking-details.html',
  styleUrl: './banking-details.css'
})
export class BankingDetails implements OnInit {
  bankingForm: FormGroup;

  // Predefined list of banks (customize as needed)
  banks = [
    'Bank Windhoek',
    'FNB',
    'Standard Bank',
    'Nedbank',
    'ABSA',
    'Capitec'
  ];

  accountTypes = [
    { value: 'savings', label: 'Savings' },
    { value: 'current', label: 'Current' },
    { value: 'fixed', label: 'Fixed Deposit' }
  ];

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private formDataService: FormDataService,
    private router: Router
  ) {
    this.bankingForm = this.fb.group({
      bankName: ['', Validators.required],
      branch: [''], // Optional
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z\- ]{6,30}$/)]],
      accountType: ['savings', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load saved data if available
    this.loadSavedData();

    // Auto-save on form changes
    this.bankingForm.valueChanges.subscribe(() => {
      this.saveFormData();
    });
  }

  private loadSavedData(): void {
    const savedData = this.formDataService.getBankingDetails();
    if (savedData) {
      this.bankingForm.patchValue(savedData);
    }
  }

  private saveFormData(): void {
    const formData = this.bankingForm.getRawValue();
    this.formDataService.setBankingDetails(formData);
  }

  onSubmit() {
    if (this.bankingForm.valid) {
      this.formDataService.submitBankingDetails(this.bankingForm.getRawValue());
      console.log('Banking Details:', this.bankingForm.getRawValue());
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Banking details submitted successfully!'
      });
    } else {
      this.bankingForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly.'
      });
    }
  }
  onPrevious() {
    this.router.navigate(['/borrower-form']);
  }
  onNext() {
    if (this.bankingForm.valid) {
      this.formDataService.submitBankingDetails(this.bankingForm.getRawValue());
      this.router.navigate(['/references']);
    } else {
      this.bankingForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly'
      });
    }
  }

  private scrollToFirstInvalidField(): void {
    const firstInvalidControl = document.querySelector('.ng-invalid:not(form)');
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstInvalidControl as HTMLElement).focus();
    }
  }
}