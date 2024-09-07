import { LightningElement,api,wire } from 'lwc';
import { CurrentPageReference} from 'lightning/navigation';

export default class UserDetailsandOtherDetails extends LightningElement {
__currentPageReference  
@api recordId
@api portfolioID
objectApiName="Portfolio__c"
@wire(CurrentPageReference)
getCurrentPageReference(pageReference) {
    this.__currentPageReference = pageReference;
    this.recordId = this.__currentPageReference.state.recordId;
    console.log(this.recordId,'PID')
}


}