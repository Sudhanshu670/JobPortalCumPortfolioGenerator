import { LightningElement } from 'lwc';
import getJobsOnLoad from '@salesforce/apex/FetchJobsController.getJobsOnLoad';
import { NavigationMixin } from 'lightning/navigation';
export default class JobsAvaliableComp extends NavigationMixin(LightningElement) {
   jobsFetched
   jobFetchedTemp
   connectedCallback() {
    getJobsOnLoad()
    .then(result => {
        this.jobsFetched=result;
        this.jobFetchedTemp=result;
      console.log('Result', result);
    })
    .catch(error => {
      console.error('Error:', error);
  });
    
   }
   handleOnclick(event){
        console.log(event.target.name,'onclick')
        let navigationTarget = {
          type: 'comm__namedPage',
          attributes: {
              name: "Jobdetails__c"
          },
          state : {
              jobId : event.target.name,
              
          }
      }
      
      this[NavigationMixin.Navigate](navigationTarget);
   }
   handleChange(event){
    if(event.target.name==='Country' &&  event.target.value.length>2){
        this.jobsFetched = this.jobsFetched.filter(item => item.Country__c.toLowerCase().includes(event.target.value.toLowerCase()))
    }
    else if(event.target.name==='JobId' && event.target.value.length>0){
      console.log('inside jobid filter::::')
      this.jobsFetched = this.jobsFetched.filter(item => item.JOBID__c == event.target.value)
    }
    else if (event.target.value.length>2){
      this.jobsFetched = this.jobsFetched.filter(item => item.Name.toLowerCase().includes(event.target.value.toLowerCase()))

    }
    else{
      this.jobsFetched = this.jobFetchedTemp;
    }
     
   }

}