import { LightningElement,wire } from 'lwc';
import getJob from '@salesforce/apex/FetchJobsController.getJob';
import { CurrentPageReference,NavigationMixin} from 'lightning/navigation';
export default class JobDetailsPage extends NavigationMixin(LightningElement) {
    recordId
    certoptions
    skilloptions
    __currentPageReference
    showModal=false
    jobdetails
    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
        this.__currentPageReference = pageReference;
             
        this.recordId = this.__currentPageReference.state.jobId;
        this.getdatafromApex();
    }
    getdatafromApex() {
        if(!this.jobdetails){
            console.log(this.recordId,'recordId')
            getJob({ recordId: this.recordId })
            .then(result => {
                console.log('Result before', result);
                this.jobdetails = result
                let cert=result[0].Certifications__c
                let skills=result[0].Skills__c
                console.log('cert', cert);
                console.log('skills', skills);
                this.certoptions= cert.split(';').map(item=> ({label :item , value : item}));
                this.skilloptions= skills.split(';').map(item=> ({label : item , value :item}));
                console.log(this.certoptions,':::::cert');
                console.log(this.skilloptions,'::::skills');

              console.log('Result', result);
              console.log('Result', result.Certifications__c);
              console.log('Result', result.Skills__c);
            })
            .catch(error => {
              console.error('Error:', error);
          });
        }
       
    }
    handleApply(){
        this.showModal=true;
    }
    cancelHandler(){
        this.showModal=false;
    }
    successHandler(event){
        console.log(event,'eventData')
        //console.log(event.detail.portfolioId,'PID')
        this.showModal=false;
        alert('Your Portfolio has been created Someone will get back to you soon');
        let navigationTarget = {
            type: 'comm__namedPage',
            attributes: {
                name: "Home"
            },
            state : {
                recordId : event.detail
                
            }
        }
        
        this[NavigationMixin.Navigate](navigationTarget);
    }
}