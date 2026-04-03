import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from "@angular/router";
import { FormDataService } from '../services/form-data-services';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper';
@Component({
  selector: 'TotalReplayable',
  standalone: true,
  providers: [MessageService],
  imports: [CommonModule, ReactiveFormsModule, ToastModule,ProgressStepperComponent],
  templateUrl: './total-replayable.html',
  styleUrl: './total-replayable.css'
})
export class TotalReplayable implements OnInit {
  loanForm: FormGroup;
  isCompleted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private formDataService: FormDataService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      loanAmount: [null, [Validators.required, Validators.min(0.01)]],
      financeChargePercent: [null, [Validators.required, Validators.min(0), Validators.max(30)]],
      financeChargeType: ['fixed'],
      totalRepayable: [{ value: 0, disabled: true }],
      installmentAmount: [{ value: 0, disabled: true }],
      numberOfInstallments: [null, [Validators.required, Validators.min(1)]],
      installmentFrequency: ['monthly'],
      firstInstallmentDate: [null, [Validators.required]],
      lastInstallmentDate: [null, [Validators.required]],
      penaltyInterestPercent: [null, [Validators.min(0), Validators.max(5)]],
      loanPeriodEndDate: [null, [Validators.required]]
    }, { validators: [this.validateFinanceCharge.bind(this), this.validateDates.bind(this)] });
  }

  ngOnInit(): void {
    // Load saved data if available
    this.loadSavedData();

    const recalc = () => {
      const loanAmount = +this.loanForm.get('loanAmount')!.value || 0;
      const percent = +this.loanForm.get('financeChargePercent')!.value || 0;
      const installments = +this.loanForm.get('numberOfInstallments')!.value || 0;

      const total = loanAmount + loanAmount * (percent / 100);
      const installment = installments > 0 ? total / installments : 0;

      this.loanForm.get('totalRepayable')!.setValue(this.roundCurrency(total), { emitEvent: false });
      this.loanForm.get('installmentAmount')!.setValue(this.roundCurrency(installment), { emitEvent: false });
    };

    ['loanAmount', 'financeChargePercent', 'numberOfInstallments'].forEach(key => {
      this.loanForm.get(key)!.valueChanges.subscribe(recalc);
    });

    const recomputeDates = () => {
      const first = this.loanForm.get('firstInstallmentDate')!.value;
      const installments = +this.loanForm.get('numberOfInstallments')!.value || 0;
      const freq = this.loanForm.get('installmentFrequency')!.value;

      if (first && installments > 0) {
        const computedLast = this.computeLastInstallmentDate(new Date(first), installments, freq);
        this.loanForm.get('lastInstallmentDate')!.setValue(this.toInputDate(computedLast), { emitEvent: false });
        this.loanForm.get('loanPeriodEndDate')!.setValue(this.toInputDate(computedLast), { emitEvent: false });
      }
    };

    ['firstInstallmentDate', 'numberOfInstallments', 'installmentFrequency'].forEach(key => {
      this.loanForm.get(key)!.valueChanges.subscribe(recomputeDates);
    });

    // Auto-save on form changes
    this.loanForm.valueChanges.subscribe(() => {
      this.saveFormData();
      this.updateCompletionStatus();
    });

    // Initial completion status check
    this.updateCompletionStatus();
  }

  private loadSavedData(): void {
    const savedData = this.formDataService.getLoanDetails();
    if (savedData) {
      this.loanForm.patchValue(savedData);
      // Re-enable disabled fields temporarily to set their values
      this.loanForm.get('totalRepayable')!.setValue(savedData.totalRepayable);
      this.loanForm.get('installmentAmount')!.setValue(savedData.installmentAmount);
    }
  }

  private saveFormData(): void {
    const formData = this.loanForm.getRawValue();
    this.formDataService.setLoanDetails(formData);
  }

  private validateFinanceCharge(group: FormGroup) {
    const percent = +group.get('financeChargePercent')!.value || 0;
    return percent <= 30 ? null : { financeChargeTooHigh: true };
  }

  private validateDates(group: FormGroup) {
    const first = group.get('firstInstallmentDate')!.value;
    const last = group.get('lastInstallmentDate')!.value;
    if (first && last) {
      const firstDate = new Date(first);
      const lastDate = new Date(last);
      return lastDate >= firstDate ? null : { lastBeforeFirst: true };
    }
    return null;
  }

  private computeLastInstallmentDate(first: Date, count: number, freq: 'monthly' | 'weekly'): Date {
    if (freq === 'weekly') {
      return this.addDays(first, (count - 1) * 7);
    }
    return this.addMonths(first, count - 1);
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  private addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  }

  private toInputDate(date: Date): string {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private roundCurrency(value: number): number {
    return Math.round(value * 100) / 100;
  }
    onPrevious() {
    this.router.navigate(['/references']);
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.formDataService.submitLoanDetails(this.loanForm.getRawValue());
      console.log('Loan Details:', this.loanForm.getRawValue());
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Loan details submitted successfully!'
      });
    } else {
      this.loanForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly.'
      });
    }
  }
  onNext() {
    if (this.loanForm.valid) {
      this.formDataService.submitLoanDetails(this.loanForm.getRawValue());
      this.router.navigate(['/attachments']);
    } else {
      this.loanForm.markAllAsTouched();
      this.scrollToFirstInvalidField();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields before proceeding.'
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

  private updateCompletionStatus(): void {
    this.isCompleted = this.loanForm.valid;
  }
}