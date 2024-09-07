import { LightningElement,wire,api } from 'lwc';
import PortfolioAssets from '@salesforce/resourceUrl/PortfolioAssets'
import {getRecord, getFieldValue} from 'lightning/uiRecordApi'
import FULLNAME from '@salesforce/schema/Portfolio__c.Full_Name__c'
import COMPANY_LOCATION from '@salesforce/schema/Portfolio__c.Company_Location__c'
import COMPANY_NAME from '@salesforce/schema/Portfolio__c.Company_Name__c'
import DESIGNATION from '@salesforce/schema/Portfolio__c.Designation__c'
import IMAGEVIEWURL from '@salesforce/schema/Portfolio__c.imageViewURL__c'
import TRAILHEADURL from '@salesforce/schema/Portfolio__c.Trailhead__c'
import TWITTERURL from '@salesforce/schema/Portfolio__c.Twitter__c'
import YOUTUBEURL from '@salesforce/schema/Portfolio__c.Youtube__c'
import SKILLS from '@salesforce/schema/Portfolio__c.Skills__c'
import LINKEDINURL from '@salesforce/schema/Portfolio__c.LinkedIn__c'
import GITHUBURL from '@salesforce/schema/Portfolio__c.Github__c'
import CERTIFICATIONS from '@salesforce/schema/Portfolio__c.Certifications__c'

import { CurrentPageReference} from 'lightning/navigation';

export default class PortfolioBanner extends LightningElement {
    @api recordId
    @api linkedinUrl
    @api twitterUrl  
    @api githubUrl
    @api youtubeUrl 
    @api trailheadUrl 
    
    staticuserPic = `${PortfolioAssets}/PortfolioAssets/userPic.jpeg`
    linkedin = `${PortfolioAssets}/PortfolioAssets/Social/linkedin.svg`
    youtube = `${PortfolioAssets}/PortfolioAssets/Social/youtube.svg`
    github = `${PortfolioAssets}/PortfolioAssets/Social/github.svg`
    twitter = `${PortfolioAssets}/PortfolioAssets/Social/twitter.svg`
    trailhead = `${PortfolioAssets}/PortfolioAssets/Social/trailhead1.svg`
    __currentPageReference
    @wire(CurrentPageReference)
    getCurrentPageReference(pageReference) {
    this.__currentPageReference = pageReference;
    this.recordId = this.__currentPageReference.state.recordId;
   }
    
    @wire(getRecord, {recordId:'$recordId', fields:[FULLNAME,COMPANY_LOCATION,COMPANY_NAME,DESIGNATION,IMAGEVIEWURL,
        TRAILHEADURL,TWITTERURL,YOUTUBEURL,SKILLS,LINKEDINURL,GITHUBURL,CERTIFICATIONS
    ]})
    portfolioData
    // portfolioHandler({data, error}){
    //     if(data){
    //         console.log("record Data", JSON.stringify(data))
    //     }
    //     if(error){
    //         console.error("error", error)
    //     }
    // }
    get userPic(){
        console.log('insdie data',this.portfolioData);

       //console.log(this.porfolioData.data.fields.pdfDownloadUrl__c.value,'dataa')
        return getFieldValue(this.portfolioData.data, IMAGEVIEWURL)
    }
    get fullName(){
        return getFieldValue(this.portfolioData.data, FULLNAME)
    }
    get companyLocation(){
        return getFieldValue(this.portfolioData.data, COMPANY_LOCATION)
    }
    get companyName(){
        return getFieldValue(this.portfolioData.data, COMPANY_NAME)
    }
    get designation(){
        return getFieldValue(this.portfolioData.data, DESIGNATION)
    }
    get linkedinURL(){
        return getFieldValue(this.portfolioData.data, LINKEDINURL)
    }
    get trailheadUrl(){
        return getFieldValue(this.portfolioData.data, TRAILHEADURL)
    }
    get twitterUrl(){
        return getFieldValue(this.portfolioData.data, TWITTERURL)
    }
    get youtubeUrl(){
        return getFieldValue(this.portfolioData.data, YOUTUBEURL)
    }
    get githubUrl(){
        return getFieldValue(this.portfolioData.data, GITHUBURL)
    }
  
    

}