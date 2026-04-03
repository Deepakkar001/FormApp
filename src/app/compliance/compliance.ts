import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { FormDataService } from '../services/form-data-services';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper';

@Component({
  selector: 'app-compliance',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, ReactiveFormsModule, ToastModule, ProgressStepperComponent],
  templateUrl: './compliance.html',
  styleUrl: './compliance.css'
})
export class Compliance implements OnInit {
  complianceForm: FormGroup;
  isCompleted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private formDataService: FormDataService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.complianceForm = this.fb.group({
      namfisaComplaintInfoProvided: ['', Validators.required],
      coolingOffPeriodExplained: ['', Validators.required],
      insuranceDetails: ['', Validators.required],
      financeChargesBreakdown: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const savedData = this.formDataService.getCompliance();
    if (savedData) {
      this.complianceForm.patchValue(savedData);
    }

    // Auto-save and track completion status
    this.complianceForm.valueChanges.subscribe(() => {
      this.updateCompletionStatus();
    });

    this.updateCompletionStatus();
  }

  onSubmit() {
    if (this.complianceForm.valid) {
      this.formDataService.submitCompliance(this.complianceForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Compliance details submitted successfully!'
      });
    } else {
      this.complianceForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly.'
      });
    }
  }

  saveCompliance() {
    if (this.complianceForm.valid) {
      this.formDataService.submitCompliance(this.complianceForm.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Compliance details saved successfully!'
      });
    } else {
      this.complianceForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly before saving.'
      });
    }
  }

  nextPage() {
    if (this.complianceForm.valid) {
      this.formDataService.submitCompliance(this.complianceForm.value);
      this.router.navigate(['/terms-acknowledgement']); // Replace with actual next route
    } else {
      this.complianceForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly before proceeding.'
      });
    }
  }

  previousPage() {
    this.formDataService.setCompliance(this.complianceForm.value);
    this.router.navigate(['/attachments']); // Replace with actual previous route
  }

  private updateCompletionStatus(): void {
    this.isCompleted = this.complianceForm.valid;
  }
}