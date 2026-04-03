import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDataService } from '../services/form-data-services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-stepper',
  imports: [CommonModule],
  templateUrl: './progress-stepper.html',
  styleUrl: './progress-stepper.css'
})
export class ProgressStepperComponent implements OnInit, OnDestroy {
  @Input() currentStep: number = 0;
  @Input() steps: Array<{label: string}> = [
    { label: 'Borrower Details' },
    {label:'Banking-details'},
    { label: 'References' },
    {label:'Total-replayable'},
     { label: 'Attachments' },
     {label:'Compliance'},
    { label: 'Terms Acknowledgement' },
  ];
  
  completedSteps: number[] = [];
  private subscription = new Subscription();

  constructor(private formDataService: FormDataService) {}

  ngOnInit() {
    this.subscription.add(
      this.formDataService.getCompletedSteps().subscribe(completed => {
        this.completedSteps = completed;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isStepCompleted(stepIndex: number): boolean {
    return this.completedSteps.includes(stepIndex);
  }
}
