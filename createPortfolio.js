import { LightningElement, api, track } from "lwc";
import createPortfolio from "@salesforce/apex/FetchJobsController.createPortfolio";
import uploadFile from "@salesforce/apex/FetchJobsController.uploadFile";
import { NavigationMixin } from "lightning/navigation";
import createProject from "@salesforce/apex/FetchJobsController.createProject";
export default class CreatePortfolio extends NavigationMixin(LightningElement) {
  @api recordId;
  data = [];
  projectLabel = "Add Projects";
  @api certOptions;
  @api skillOptions;
  projectRec = [];
  createProject = false;
  event1;
  portfolioId;
  fileData;
  imageData;
  showSpinner = false;
  @track portfolio = {};
  portfoliotemp;
  handleChange(event) {
    let { name, value } = event.target;

    this.portfolio[name] = value;
    console.log("portfolioData:", this.portfolio);
  }

  openfileUpload(event) {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = () => {
      var base64 = reader.result.split(",")[1];
      this.fileData = {
        filename: file.name,
        base64: base64
      };
      console.log(this.fileData, "file");
    };
    reader.readAsDataURL(file);
  }
  openImageUpload(event) {
    const file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = () => {
      var base64 = reader.result.split(",")[1];
      this.imageData = {
        filename: file.name,
        base64: base64
      };
      console.log(this.imageData, "file");
    };
    reader.readAsDataURL(file);
  }
  handleCancel() {
    this.dispatchEvent(new CustomEvent("cancel"));
  }
  handleClick() {
    this.showSpinner = true;
    console.log("Inside click");
    console.log(this.isValidData(), ":::checkVal");
    if (this.isValidData()) {
      this.portfoliotemp = this.portfolio;
      if (this.portfoliotemp["Skills__c"]) {
        this.portfoliotemp["Skills__c"] =
          this.portfolio["Skills__c"].toString(2);
      }
      if (this.portfoliotemp["Certifications__c"]) {
        this.portfoliotemp["Certifications__c"] =
          this.portfolio["Certifications__c"].toString(2);
      }
      let str = JSON.stringify(this.portfoliotemp);
      console.log("str:", str);
      // console.log('str2:', str2);
      createPortfolio({ PortfolioObj: JSON.stringify(this.portfolio) })
        .then((result) => {
          console.log("Result", result.Id);
          this.portfolioId = result.Id;
          this.createProjects(result.Id);
          if (this.fileData) {
            const { base64, filename } = this.fileData;
            uploadFile({
              base64: base64,
              filename: filename,
              recordId: this.portfolioId
            })
              .then((result) => {
                console.log("Result of upload", result);
                console.log(
                  this.portfolioId,
                  "preparing for dispatching of data"
                );
                //this.dispatchEvent(new CustomEvent("success",{detail:this.portfolioId}));
                if (!this.imageData) {
                  this.dispatchEvent(
                    new CustomEvent("success", { detail: this.portfolioId })
                  );
                } else {
                  this.uploadimage();
                }
              })
              .catch((error) => {
                console.error("Error:", error);
                this.showSpinner = false;
              });
          }
          // this.dispatchEvent(new CustomEvent('success'));
        })
        .catch((error) => {
          console.log("Error");
          console.error("Error:", error);
          this.showSpinner = false;
        });
    } else {
      this.showSpinner = false;
    }

    /* uploadFile({ base64: Base64, filename: Filename, recordId: this.portfolioId })
      .then(result => {
        console.log('Result', result);
      })
      .catch(error => {
        console.error('Error:', error);
    });*/
  }
  uploadimage() {
    if (this.imageData) {
      const { base64, filename } = this.imageData;
      uploadFile({
        base64: base64,
        filename: filename,
        recordId: this.portfolioId
      })
        .then((result) => {
          console.log("Result2ofimg", result);
          this.showSpinner = false;
          this.dispatchEvent(
            new CustomEvent("success", {
              detail: this.portfolioId
            })
          );
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
  handleSectionToggle(event) {
    console.log(event, "toggleEvent");
  }

  isValidData() {
    let isValid = true;
    const inpData = [...this.template.querySelectorAll("lightning-input")];
    inpData.forEach((input) => {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });
    console.log("isValid:", isValid);
    return isValid;
  }
  handleProject() {
    this.createProject = true;
  }
  handleCreate(event) {
    console.log(event.detail);
    console.log(JSON.stringify(event.detail));
    console.log(event, "event");
    if (this.data.length > 0) {
      this.data = [{ ...event.detail }, ...this.data];
    } else {
      this.data = [{ ...event.detail }];
    }
    let rec = JSON.stringify(this.data);

    // this.projectRec=data
    this.createProject = false;
    if (this.data.length >= 1) {
      this.projectLabel = "Add More Projects";
    }

    console.log(rec, "datawithchange::::::");
  }
  handleClose() {
    this.createProject = false;
  }
  createProjects(portfolioId) {
    console.log("insde proj");
    if (this.data.length > 0) {
      Array.from(this.data).forEach((item) => {
        item.Portfolio__c = portfolioId;
      });
      console.log("data:::::::", this.data);
      createProject({ projectRec: JSON.stringify(this.data) })
        .then((result) => {
          console.log("ResultData", result);
        })
        .catch((error) => {
          console.error("Error:", error);
          console.log("Inside error");
        });
    } else {
      console.log(this.data.length);
    }
  }
}
