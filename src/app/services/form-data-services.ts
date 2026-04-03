import { Injectable } from '@angular/core';
import { isDevMode } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface BorrowerData {
  fullName: string;
  postalAddress: string;
  residentialAddress: string;
  telephoneNumber: string;
  maritalStatus: string;
  idPassportNumber: string;
  occupation: string;
  employerName: string;
  employerTelephone: string;
  employerAddress: string;
  payslipEmployeeNo: string;
}

export interface ReferenceData {
  name: string;
  phone: string;
}

export interface AttachmentData {
  borrowerIdProof: string;
  payslipProofOfIncome: string;
  bankStatement: string;
  proofOfAddress: string;
}

export interface LoanDetailsData {
  loanAmount: number | null;
  financeChargePercent: number | null;
  financeChargeType: string;
  totalRepayable: number;
  installmentAmount: number;
  numberOfInstallments: number | null;
  installmentFrequency: string;
  firstInstallmentDate: string | null;
  lastInstallmentDate: string | null;
  penaltyInterestPercent: number | null;
  loanPeriodEndDate: string | null;
}

export interface BankingDetailsData {
  bankName: string;
  branch: string;
  accountNumber: string;
  accountType: string;
}

export interface ComplianceData {
  namfisaComplaintInfoProvided: string;
  coolingOffPeriodExplained: string;
  insuranceDetails: string;
  financeChargesBreakdown: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private borrowerData = new BehaviorSubject<BorrowerData | null>(null);
  private referencesData = new BehaviorSubject<ReferenceData[]>([]);
  private attachmentsData = new BehaviorSubject<AttachmentData | null>(null);
  private uploadedFiles = new BehaviorSubject<{ [key: string]: File | null }>({});
  private completedSteps = new BehaviorSubject<number[]>([]);
  private loanDetailsSubject = new BehaviorSubject<LoanDetailsData | null>(null);
  private bankingDetailsSubject = new BehaviorSubject<BankingDetailsData | null>(null);
  private complianceSubject = new BehaviorSubject<ComplianceData | null>(null);

  loanDetails$: Observable<LoanDetailsData | null> = this.loanDetailsSubject.asObservable();
  bankingDetails$: Observable<BankingDetailsData | null> = this.bankingDetailsSubject.asObservable();
  compliance$: Observable<ComplianceData | null> = this.complianceSubject.asObservable();

  constructor() {
    if (isDevMode()) {
      this.clearAllData();
    } else {
      this.loadFromStorage();
    }
  }

  // Borrower Data Methods
  setBorrowerData(data: BorrowerData) {
    this.borrowerData.next(data);
    localStorage.setItem('borrowerData', JSON.stringify(data));
  }

  getBorrowerData() {
    return this.borrowerData.asObservable();
  }

  getBorrowerDataValue(): BorrowerData | null {
    return this.borrowerData.value;
  }

  // References Data Methods
  setReferencesData(data: ReferenceData[]) {
    this.referencesData.next(data);
    localStorage.setItem('referencesData', JSON.stringify(data));
  }

  getReferencesData() {
    return this.referencesData.asObservable();
  }

  getReferencesDataValue(): ReferenceData[] {
    return this.referencesData.value;
  }

  // Attachments Data Methods
  setAttachmentsData(data: AttachmentData) {
    this.attachmentsData.next(data);
    localStorage.setItem('attachmentsData', JSON.stringify(data));
  }

  getAttachmentsData() {
    return this.attachmentsData.asObservable();
  }

  getAttachmentsDataValue(): AttachmentData | null {
    return this.attachmentsData.value;
  }

  // File Upload Methods
  setUploadedFiles(files: { [key: string]: File | null }) {
    this.uploadedFiles.next(files);
  }

  getUploadedFiles() {
    return this.uploadedFiles.asObservable();
  }

  getUploadedFilesValue(): { [key: string]: File | null } {
    return this.uploadedFiles.value;
  }

  // Loan Details Methods
  setLoanDetails(data: LoanDetailsData): void {
    this.loanDetailsSubject.next(data);
    this.saveToLocalStorage('loanDetails', data);
  }

  getLoanDetails(): LoanDetailsData | null {
    return this.loanDetailsSubject.value;
  }

  // Banking Details Methods
  setBankingDetails(data: BankingDetailsData): void {
    this.bankingDetailsSubject.next(data);
    this.saveToLocalStorage('bankingDetails', data);
  }

  getBankingDetails(): BankingDetailsData | null {
    return this.bankingDetailsSubject.value;
  }

  // Compliance Methods
  setCompliance(data: ComplianceData): void {
    this.complianceSubject.next(data);
    this.saveToLocalStorage('compliance', data);
  }

  getCompliance(): ComplianceData | null {
    return this.complianceSubject.value;
  }

  // Step completion methods
  markStepCompleted(stepIndex: number) {
    const completed = this.completedSteps.value;
    if (!completed.includes(stepIndex)) {
      completed.push(stepIndex);
      this.completedSteps.next([...completed]);
      localStorage.setItem('completedSteps', JSON.stringify(completed));
    }
  }

  // Manual step completion for form submissions
  submitBorrowerData(data: BorrowerData) {
    this.setBorrowerData(data);
    this.markStepCompleted(0);
  }

  submitBankingDetails(data: BankingDetailsData) {
    this.setBankingDetails(data);
    this.markStepCompleted(1);
  }

  submitReferencesData(data: ReferenceData[]) {
    this.setReferencesData(data);
    this.markStepCompleted(2);
  }

  submitAttachmentsData(data: AttachmentData) {
    this.setAttachmentsData(data);
    this.markStepCompleted(4);
  }

  submitLoanDetails(data: LoanDetailsData) {
    this.setLoanDetails(data);
    this.markStepCompleted(3);
  }

  submitCompliance(data: ComplianceData) {
    this.setCompliance(data);
    this.markStepCompleted(5);
  }

  getCompletedSteps() {
    return this.completedSteps.asObservable();
  }

  getCompletedStepsValue(): number[] {
    return this.completedSteps.value;
  }

  removeStepCompletion(stepIndex: number) {
    const completed = this.completedSteps.value.filter(step => step !== stepIndex);
    this.completedSteps.next(completed);
    localStorage.setItem('completedSteps', JSON.stringify(completed));
  }

  clearAllData() {
    this.borrowerData.next(null);
    this.referencesData.next([]);
    this.attachmentsData.next(null);
    this.uploadedFiles.next({});
    this.completedSteps.next([]);
    this.loanDetailsSubject.next(null);
    this.bankingDetailsSubject.next(null);
    this.complianceSubject.next(null);
    localStorage.removeItem('borrowerData');
    localStorage.removeItem('referencesData');
    localStorage.removeItem('attachmentsData');
    localStorage.removeItem('completedSteps');
    localStorage.removeItem('loanDetails');
    localStorage.removeItem('bankingDetails');
    localStorage.removeItem('compliance');
  }

  private loadFromStorage() {
    const borrowerData = localStorage.getItem('borrowerData');
    if (borrowerData) {
      const data = JSON.parse(borrowerData);
      this.borrowerData.next(data);
      if (this.isBorrowerDataValid(data)) {
        this.markStepCompleted(0);
      }
    }

    const referencesData = localStorage.getItem('referencesData');
    if (referencesData) {
      const data = JSON.parse(referencesData);
      this.referencesData.next(data);
      if (this.isReferencesDataValid(data)) {
        this.markStepCompleted(2);
      }
    }

    const attachmentsData = localStorage.getItem('attachmentsData');
    if (attachmentsData) {
      const data = JSON.parse(attachmentsData);
      this.attachmentsData.next(data);
      if (this.isAttachmentsDataValid(data)) {
        this.markStepCompleted(4);
      }
    }

    const completedSteps = localStorage.getItem('completedSteps');
    if (completedSteps) {
      this.completedSteps.next(JSON.parse(completedSteps));
    }

    const loanDetails = localStorage.getItem('loanDetails');
    if (loanDetails) {
      const data = JSON.parse(loanDetails);
      this.loanDetailsSubject.next(data);
      if (this.isLoanDetailsValid(data)) {
        this.markStepCompleted(3);
      }
    }

    const bankingDetails = localStorage.getItem('bankingDetails');
    if (bankingDetails) {
      const data = JSON.parse(bankingDetails);
      this.bankingDetailsSubject.next(data);
      if (this.isBankingDetailsValid(data)) {
        this.markStepCompleted(1);
      }
    }

    const compliance = localStorage.getItem('compliance');
    if (compliance) {
      const data = JSON.parse(compliance);
      this.complianceSubject.next(data);
      if (this.isComplianceDataValid(data)) {
        this.markStepCompleted(5);
      }
    }
  }

  private isBorrowerDataValid(data: BorrowerData): boolean {
    return !!(data.fullName && data.telephoneNumber && data.idPassportNumber);
  }

  private isReferencesDataValid(data: ReferenceData[]): boolean {
    return data.length >= 2 && data.slice(0, 2).every(ref => ref.name && ref.phone);
  }

  private isBankingDetailsValid(data: BankingDetailsData): boolean {
    return !!(data.bankName && data.accountNumber && data.accountType);
  }

  private isAttachmentsDataValid(data: AttachmentData): boolean {
    return !!(data.borrowerIdProof && data.payslipProofOfIncome);
  }

  private isLoanDetailsValid(data: LoanDetailsData): boolean {
    return !!(data.loanAmount && data.financeChargePercent && data.numberOfInstallments);
  }

  private isComplianceDataValid(data: ComplianceData): boolean {
    return !!(data.namfisaComplaintInfoProvided && data.coolingOffPeriodExplained && 
             data.insuranceDetails && data.financeChargesBreakdown);
  }

  private saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }
}
