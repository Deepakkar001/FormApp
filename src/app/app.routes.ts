import { Routes } from '@angular/router';
import { References } from './references/references';
import { BorrowerFormComponent } from './borrower-form/borrower-form';
import { Attachments } from './attachments/attachments';
import { BankingDetails } from './banking-details/banking-details';
import { TotalReplayable } from './total-replayable/total-replayable';
import { TermsAcknowledgement } from './terms-acknowledgement/terms-acknowledgement';
import { Compliance } from './compliance/compliance';
export const routes: Routes = [
    { path: '', component: BorrowerFormComponent },
    {path: 'banking-details', component: BankingDetails},
    { path: 'borrower-form', component: BorrowerFormComponent },
    { path: 'references', component: References },
    {path: 'attachments', component: Attachments},
    {path: 'total-replayable', component: TotalReplayable},
    {path: 'terms-acknowledgement', component: TermsAcknowledgement},
    {path: 'compliance', component: Compliance}
];
