import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressStepperComponent } from '../progress-stepper/progress-stepper';
import { FormDataService } from '../services/form-data-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-references',
  standalone: true,
  providers: [MessageService],
  imports: [ReactiveFormsModule, CommonModule, ToastModule, ProgressStepperComponent],
  templateUrl: './references.html',
  styleUrl: './references.css'
})
export class References implements OnInit, OnDestroy {
  referencesForm: FormGroup;
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder, 
    private router: Router, 
    private messageService: MessageService,
    private formDataService: FormDataService
  ) {
    this.referencesForm = this.fb.group({
      references: this.fb.array([
        this.createReferenceGroup(true),
        this.createReferenceGroup(true)
      ])
    });
  }

  ngOnInit() {
    const savedData = this.formDataService.getReferencesDataValue();
    if (savedData && savedData.length > 0) {
      this.loadSavedReferences(savedData);
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get references(): FormArray {
    return this.referencesForm.get('references') as FormArray;
  }

  createReferenceGroup(required: boolean = false): FormGroup {
    const validators = {
      name: required ? [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)] : [Validators.pattern(/^[A-Za-z ]+$/)],
      phone: required ? [Validators.required, Validators.pattern(/^\d{10,15}$/)] : [Validators.pattern(/^\d{10,15}$/)]
    };
    
    return this.fb.group({
      name: ['', validators.name],
      phone: ['', validators.phone]
    });
  }

  loadSavedReferences(savedData: any[]) {
    this.references.clear();
    savedData.forEach((ref, index) => {
      const isRequired = index < 2;
      const group = this.createReferenceGroup(isRequired);
      group.patchValue(ref);
      this.references.push(group);
    });
    
    if (this.references.length < 2) {
      while (this.references.length < 2) {
        this.references.push(this.createReferenceGroup(true));
      }
    }
  }

  addReference() {
    this.references.push(this.createReferenceGroup(false));
  }

  removeReference(index: number) {
    if (this.references.length > 2) {
      this.references.removeAt(index);
    }
  }

  saveReferences() {
    if (this.referencesForm.valid) {
      this.formDataService.submitReferencesData(this.references.value);
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'References saved successfully!'
      });
    } else {
      this.referencesForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields correctly.'
      });
    }
  }

  nextPage() {
    // Mark all form controls as touched to show validation errors
    this.referencesForm.markAllAsTouched();
    
    // Check if first two references are valid (required)
    const firstTwoValid = this.references.controls.slice(0, 2).every(control => control.valid);
    
    if (firstTwoValid && this.referencesForm.valid) {
      this.formDataService.submitReferencesData(this.references.value);
      this.router.navigate(['/total-replayable']);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly'
      });
    }
  }



  previousPage() {
    this.formDataService.setReferencesData(this.references.value);
    this.router.navigate(['/banking-details']);
  }
}
