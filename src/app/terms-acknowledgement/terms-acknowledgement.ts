import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper';
import { FormDataService } from '../services/form-data-services';

export interface TermsData {
  confirmationChecked: boolean;
  borrowerSignature: string;
  lenderSignature: string;
  witnessBorrower: string;
  witnessLender: string;
  signatureDate: string;
  signaturePlace: string;
}

@Component({
  selector: 'app-terms-acknowledgement',
  providers: [MessageService],
  imports: [ProgressStepperComponent, FormsModule, ToastModule],
  templateUrl: './terms-acknowledgement.html',
  styleUrl: './terms-acknowledgement.css'
})
export class TermsAcknowledgement implements OnInit {
  confirmationChecked: boolean = false;
  borrowerSignature: string = '';
  lenderSignature: string = '';
  witnessBorrower: string = '';
  witnessLender: string = '';
  signatureDate: string = '';
  signaturePlace: string = '';

  constructor(
    private router: Router,
    private messageService: MessageService,
    private formDataService: FormDataService
  ) {}

  ngOnInit() {
    // Load saved data if available
    this.loadSavedData();
  }

  private loadSavedData() {
    // Load from localStorage or service if needed
    const savedData = localStorage.getItem('termsData');
    if (savedData) {
      const data = JSON.parse(savedData);
      Object.assign(this, data);
    }
  }

  private saveData() {
    const termsData: TermsData = {
      confirmationChecked: this.confirmationChecked,
      borrowerSignature: this.borrowerSignature,
      lenderSignature: this.lenderSignature,
      witnessBorrower: this.witnessBorrower,
      witnessLender: this.witnessLender,
      signatureDate: this.signatureDate,
      signaturePlace: this.signaturePlace
    };
    localStorage.setItem('termsData', JSON.stringify(termsData));
  }

  private isFormValid(): boolean {
    return this.confirmationChecked && 
           this.borrowerSignature.trim() !== '' && 
           this.lenderSignature.trim() !== '' && 
           this.signatureDate !== '' && 
           this.signaturePlace.trim() !== '';
  }

  goToPrevious() {
    this.saveData();
    this.router.navigate(['/compliance']);
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.saveData();
      this.formDataService.markStepCompleted(6);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Terms & Acknowledgment completed successfully!'
      });
      // Navigate to final confirmation or home
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields and check the confirmation box.'
      });
    }
  }
}
