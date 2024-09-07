public without sharing class FetchJobsController {
  @AuraEnabled
  public static List<Job__c> getJobsOnLoad() {
    List<Job__c> jobsActive = [
      SELECT Id, Job_Details__c, Country__c, Name, JOBID__c, Technology__c
      FROM Job__c
    ];
    return jobsActive;
  }
  @AuraEnabled
  public static List<Job__c> getJob(Id recordId) {
    System.debug('Inside: ');
    List<Job__c> jobsActive = [
      SELECT
        Id,
        Job_Details__c,
        Country__c,
        Name,
        JOBID__c,
        Technology__c,
        Skills__c,
        Certifications__c
      FROM Job__c
      WHERE id = :recordId
    ];
    return jobsActive;
  }

  @AuraEnabled
  public static Portfolio__c createPortfolio(String PortfolioObj) {
    Portfolio__c portfolio = (Portfolio__c) Json.deserialize(
      PortfolioObj,
      Portfolio__c.class
    );
    insert portfolio;

    return portfolio;
  }
  @AuraEnabled
  public static String uploadFile(String base64, String filename, Id recordId) {
    ContentVersion cv = createContentVersion(base64, filename);
    List<ContentVersion> cvRec = new List<ContentVersion>();
    Map<Id, ContentVersion> cvMap = new Map<Id, ContentVersion>();
    // cvMap.put(cv.Id,cv);
    ContentDocumentLink cdl = createContentLink(cv.Id, recordId);
    cvRec = [
      SELECT Id, ContentDocumentId, FileType, Title
      FROM ContentVersion
      WHERE id = :cv.Id
    ];
    cvMap.put(cvRec[0].Id, cvRec[0]);
    ContentVersionTriggerHandler.createPublicLinkForFile(cvRec, cvMap);
    if (cv == null || cdl == null) {
      return null;
    }
    return cdl.Id;
  }

  private static ContentVersion createContentVersion(
    String base64,
    String filename
  ) {
    ContentVersion cv = new ContentVersion();
    cv.VersionData = EncodingUtil.base64Decode(base64);
    cv.Title = filename;
    cv.PathOnClient = filename;
    cv.SharingPrivacy = 'N';
    try {
      insert cv;
      return cv;
    } catch (DMLException e) {
      System.debug(e);
      return null;
    }
  }
  private static ContentDocumentLink createContentLink(
    String contentVersionId,
    String recordId
  ) {
    if (contentVersionId == null) {
      return null;
    }
    ContentDocumentLink cdl = new ContentDocumentLink();
    cdl.ContentDocumentId = [
      SELECT ContentDocumentId
      FROM ContentVersion
      WHERE Id = :contentVersionId
    ]
    .ContentDocumentId;

    cdl.LinkedEntityId = recordId;

    // ShareType is either 'V', 'C', or 'I'
    // V = Viewer, C = Collaborator, I = Inferred
    cdl.ShareType = 'V';
    try {
      insert cdl;
      return cdl;
    } catch (DMLException e) {
      System.debug(e);
      return null;
    }
  }
  @AuraEnabled
  public static List<Project__c> createProject(String projectRec) {
    List<Project__c> proj = new List<Project__c>();
    try {
      proj = (List<Project__c>) Json.deserialize(
        projectRec,
        List<Project__c>.class
      );
      insert proj;
      return proj;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static List<Project__c> fetchProjectsforProfile(String portfolioId) {
    try {
      List<Project__c> proj = [
        SELECT Id, Name, Project_Details__c
        FROM Project__c
        WHERE Portfolio__c = :portfolioId
      ];
      return proj;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
