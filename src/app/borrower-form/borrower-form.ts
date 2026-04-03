import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper';
import { FormDataService } from '../services/form-data-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-borrower-form',
  imports: [ReactiveFormsModule, CommonModule, ToastModule, ProgressStepperComponent],
  templateUrl: './borrower-form.html',
   styleUrl: './borrower-form.css'
})
export class BorrowerFormComponent implements OnInit, OnDestroy {
  borrowerForm: FormGroup;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private messageService: MessageService,
    private formDataService: FormDataService
  ) {
    this.borrowerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      postalAddress: [''],
      residentialAddress: ['', Validators.required],
      telephoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      emailAddress: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      maritalStatus: ['', Validators.required],
      idPassportNumber: ['', Validators.required],
      occupation: ['', Validators.required],
      employerName: ['', Validators.required],
      employerTelephone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      employerAddress: [''],
      payslipEmployeeNo: ['']
    });
  }

  ngOnInit() {
    const savedData = this.formDataService.getBorrowerDataValue();
    if (savedData) {
      this.borrowerForm.patchValue(savedData);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  saveBorrower() {
    if (this.borrowerForm.valid) {
      this.formDataService.submitBorrowerData(this.borrowerForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Borrower information saved successfully!'
      });
    } else {
      this.borrowerForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly.'
      });
    }
  }

  onSubmit() {
    if (this.borrowerForm.valid) {
      this.formDataService.submitBorrowerData(this.borrowerForm.value);
      console.log('Form Data:', this.borrowerForm.value);
    }
  }

  resetForm() {
    this.borrowerForm.reset();
    this.formDataService.setBorrowerData(this.borrowerForm.value);
  }

  nextPage() {
    if (this.borrowerForm.valid) {
      this.formDataService.submitBorrowerData(this.borrowerForm.value);
      this.router.navigate(['/banking-details']);
    } else {
      this.borrowerForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly'
      });
    }
  }

  previousPage() {
    // Save current data before going back
    this.formDataService.setBorrowerData(this.borrowerForm.value);
    // Navigate to previous page (if exists)
    this.router.navigate(['/']); // Replace with actual previous route
  }
}
