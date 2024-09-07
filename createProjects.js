import { LightningElement,api } from 'lwc';

export default class CreateProjects extends LightningElement {
   
    projectRec={}
    handleChange(event){
    const{name,value}=event.target;
    this.projectRec[name]=value;
    }
    handleCancel(){
        this.dispatchEvent(new CustomEvent('close'));
    }
    handleClick(){
        
        if(this.isValid()){
            this.dispatchEvent(new CustomEvent("datarec",{
                detail:this.projectRec
    
                
            }));
        }
       
    }
    isValid(){
        let isValid=true
        const inpData = [...this.template.querySelectorAll('lightning-input')]
        inpData.forEach(input =>{
            if(!input.checkValidity()){
                input.reportValidity();
                isValid=false;
            }
        });
        return isValid;
    }
   
}