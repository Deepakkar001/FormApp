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
  selector: 'app-attachments',
  imports: [ReactiveFormsModule, CommonModule, ToastModule, ProgressStepperComponent],
  templateUrl: './attachments.html',
  styleUrl: './attachments.css'
})
export class Attachments implements OnInit, OnDestroy {
  attachmentsForm: FormGroup;
  uploadedFiles: { [key: string]: File | null } = {};
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private messageService: MessageService,
    private formDataService: FormDataService
  ) {
    this.attachmentsForm = this.fb.group({
      borrowerIdProof: ['', Validators.required],
      payslipProofOfIncome: ['', Validators.required],
      bankStatement: ['', Validators.required],
      proofOfAddress: ['', Validators.required]
    });
  }

  ngOnInit() {
    const savedData = this.formDataService.getAttachmentsDataValue();
    const savedFiles = this.formDataService.getUploadedFilesValue();
    
    if (savedData) {
      this.attachmentsForm.patchValue(savedData);
    }
    
    if (savedFiles) {
      this.uploadedFiles = { ...savedFiles };
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onFileSelect(event: any, fieldName: string) {
    const file = event.target.files[0];
    if (file) {
      if (this.validateFile(file)) {
        this.uploadedFiles[fieldName] = file;
        this.attachmentsForm.patchValue({ [fieldName]: file.name });
        this.formDataService.setUploadedFiles(this.uploadedFiles);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${file.name} uploaded successfully!`
        });
      } else {
        event.target.value = '';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please upload PDF or JPG files only (max 5MB)'
        });
      }
    }
  }

  validateFile(file: File): boolean {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  }

  removeFile(fieldName: string) {
    this.uploadedFiles[fieldName] = null;
    this.attachmentsForm.patchValue({ [fieldName]: '' });
    this.formDataService.setUploadedFiles(this.uploadedFiles);
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'File removed successfully'
    });
  }

  saveAttachments() {
    if (this.attachmentsForm.valid) {
      this.formDataService.submitAttachmentsData(this.attachmentsForm.value);
      this.formDataService.setUploadedFiles(this.uploadedFiles);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'All attachments saved successfully!'
      });
    } else {
      this.attachmentsForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload all required documents'
      });
    }
  }

  previousPage() {
    this.formDataService.setAttachmentsData(this.attachmentsForm.value);
    this.formDataService.setUploadedFiles(this.uploadedFiles);
    this.router.navigate(['/total-replayable']);
  }

  nextPage() {
    if (this.attachmentsForm.valid) {
      this.formDataService.submitAttachmentsData(this.attachmentsForm.value);
      this.formDataService.setUploadedFiles(this.uploadedFiles);
      this.router.navigate(['/compliance']);
    } else {
      this.attachmentsForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload all required documents before proceeding'
      });
    }
  }

  previewFile(fieldName: string) {
    const file = this.uploadedFiles[fieldName];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  }

  getFileIcon(fieldName: string): string {
    const file = this.uploadedFiles[fieldName];
    if (!file) return '';
    
    if (file.type === 'application/pdf') {
      return '📄';
    } else if (file.type.startsWith('image/')) {
      return '🖼️';
    }
    return '📎';
  }
}
