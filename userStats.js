import { LightningElement,api,wire } from 'lwc';
import {getRecord, getFieldValue} from 'lightning/uiRecordApi'
import CERTIFICATIONS from '@salesforce/schema/Portfolio__c.Certifications__c'
import SKILLS from '@salesforce/schema/Portfolio__c.Skills__c'
import TRAILS from '@salesforce/schema/Portfolio__c.Trails__c'
import BADGES from '@salesforce/schema/Portfolio__c.Total_Badges__c'
import SUPERBADGES from '@salesforce/schema/Portfolio__c.Superbadges__c'
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets'
import fetchProjectsforProfile from '@salesforce/apex/FetchJobsController.fetchProjectsforProfile';
export default class UserStats extends LightningElement {
    @api recordId
    @api objectApiName
    projectsList
    certPic = `${PortfolioAssets}/PortfolioAssets/cert_logo.png`
    scout=`${PortfolioAssets}/PortfolioAssets/Ranks/Scout.png`
    hiker=`${PortfolioAssets}/PortfolioAssets/Ranks/hiker.png`
    explorer=`${PortfolioAssets}/PortfolioAssets/Ranks/Explorer.png`
    adventurer=`${PortfolioAssets}/PortfolioAssets/Ranks/Adventurer.png`
    mountainer=`${PortfolioAssets}/PortfolioAssets/Ranks/Mountaineer.png`
    expeditioner=`${PortfolioAssets}/PortfolioAssets/Ranks/Expeditioner.png`
    ranger=`${PortfolioAssets}/PortfolioAssets/Ranks/Ranger.png`
    doublestarranger=`${PortfolioAssets}/PortfolioAssets/Ranks/Double star ranger.png`
    triple=`${PortfolioAssets}/PortfolioAssets/Ranks/Triple star ranger.png`
    fourstar=`${PortfolioAssets}/PortfolioAssets/Ranks/Four star ranger.png`
    fivestar=`${PortfolioAssets}/PortfolioAssets/Ranks/Five star ranger.png`
    allstar=`${PortfolioAssets}/PortfolioAssets/Ranks/All star ranger.png`

    @wire(getRecord, {recordId:'$recordId', fields:[CERTIFICATIONS,SKILLS,TRAILS,BADGES,SUPERBADGES]})
    porfolioData
    
    get skills(){
      
        return this.porfolioData.data.fields.Skills__c.value.split(',')
    }
    get certifications(){
        return this.porfolioData.data.fields.Certifications__c.value.split(',')
    }
    get Trials(){
        return this.porfolioData.data.fields.Trails__c.value
    }
    get Badges(){
        return this.porfolioData.data.fields.Total_Badges__c.value
    }
    get SuperBadges(){
        return this.porfolioData.data.fields.Superbadges__c.value
    }
    get Badgeimage(){
        let badge=this.Badges
        if(badge == 0 ){
           return this.scout
        }
        else if(badge < 5 ){
            return this.hiker
        }
        else if(badge >5 && badge <10  ){
            return this.explorer
        }
        else if(badge >=10 && badge <25  ){
            return this.adventurer
        }
        else if(badge >=25 && badge <50  ){
            return this.mountainer
        }
        else if(badge >=50 && badge <100 ){
            return this.expeditioner
        }
        else if(badge >=100 && badge <200 ){
            return this.ranger
        }
        else if(badge >=200 && badge <300 ){
            return this.doublestarranger
        }
        else if(badge >=300 && badge <400 ){
            return this.triple
        }
        else if(badge >=400 && badge <500 ){
            return this.fourstar
        }
        else if(badge >=500 && badge <600 ){
            return this.fivestar
        }
        else if(badge >=600  ){
            return this.allstar
        }



       
      
            
      

    }
    handleclick(event){
        console.log(event)
        console.log(this.porfolioData)
        if(event.target.value=='Projects'){
            fetchProjectsforProfile({ portfolioId: this.recordId })
              .then(result => {
                console.log('Result', result);
                result.forEach(item=>{
                    item.Project_Details__c=item.Project_Details__c
                })
                this.projectsList=result
              })
              .catch(error => {
                console.error('Error:', error);
            });
        }
    }
}