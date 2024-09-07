public without sharing class ContentVersionTriggerHandler {
  public static Set<String> fileTypeSet = new Set<String>{
    'jpg',
    'png',
    'jpeg',
    'svg',
    'jfif',
    'pdf'
  };

  public static void createPublicLinkForFile(
    List<ContentVersion> contentVersionList,
    Map<Id, ContentVersion> contentVersionMap
  ) {
    Map<Id, ContentDocumentLink> contentDocumentLinkMap = getContentDocumentLinkMap(
      contentVersionList
    );

    List<ContentDistribution> distributionsToInsert = new List<ContentDistribution>();
    for (ContentVersion version : contentVersionList) {
      ContentDocumentLink link = contentDocumentLinkMap.get(
        version.ContentDocumentId
      );
      if (link != null) {
        if (
          (link.LinkedEntityId.getSObjectType() == Event__c.sObjectType ||
          link.LinkedEntityId.getSObjectType() == Speaker__c.sObjectType ||
          link.LinkedEntityId.getSObjectType() ==
          Event_Organizer__c.sObjectType ||
          link.LinkedEntityId.getSObjectType() == Portfolio__c.sObjectType &&
          fileTypeSet.contains(version.FileType.toLowerCase()))
        ) {
          distributionsToInsert.add(
            prepareContentDistribution(version.Id, version.Title)
          );
        }
      }
    }

    if (!distributionsToInsert.isEmpty()) {
      List<Content_Distribution__e> event = new List<Content_Distribution__e>();
      Content_Distribution__e ev = new Content_Distribution__e();
      ev.IdstoInsert__c = Json.serialize(distributionsToInsert);
      ev.ContentVersionMap__c = Json.serialize(contentVersionMap);
      ev.ContentVersionList__c = Json.serialize(contentVersionList);
      event.add(ev);
      EventBus.publish(event);
    }

    /* List<ContentDistribution> distributionList = [
      SELECT Id, ContentVersionId, ContentDownloadUrl, DistributionPublicUrl
      FROM ContentDistribution
      WHERE Id IN :distributionsToInsert
    ];

    List<Event__c> eventListToUpdate = new List<Event__c>();
    List<Speaker__c> speakersToUpdate = new List<Speaker__c>();
    List<Event_Organizer__c> organizerToUpdate = new List<Event_Organizer__c>();
    List<Portfolio__c> portfolioToUpdate = new List<Portfolio__c>();

    for (ContentDistribution cd : distributionList) {
      /*
       * ContentDistribution => ContnentVersion
       * ContnentVersion => ContentDocumentLink
       * ContentDocumentLink => LinkedEntityId ( Object )
       
      ContentVersion version = contentVersionMap.get(cd.ContentVersionId);

      ContentDocumentLink link = contentDocumentLinkMap.get(
        version.ContentDocumentId
      );

      String picUrl = '';
      String pdfDownloadUrl = '';
      system.debug(version.filetype + 'ghgjhg');
      if (version.FileType != 'pdf') {
        system.debug('inside');
        picUrl = cd.ContentDownloadUrl.replace(
          'download/?',
          'renditionDownload?rendition=ORIGINAL_Jpg&'
        );
        picUrl = picUrl.replace('&ids', '&versionId');
      } else {
        system.debug('inside PDF');
        picUrl = cd.ContentDownloadUrl;
      }

      if (
        link != null &&
        link.LinkedEntityId.getSObjectType() == Event__c.sObjectType
      ) {
        Event__c eventRecord = new Event__c();
        eventRecord.Id = link.LinkedEntityId;
        eventRecord.TitleImageUrl__c = picUrl;
        eventListToUpdate.add(eventRecord);
      } else if (
        link != null &&
        link.LinkedEntityId.getSObjectType() == Speaker__c.sObjectType
      ) {
        Speaker__c speaker = new Speaker__c();
        speaker.Id = link.LinkedEntityId;
        speaker.Picture__c = picUrl;
        speakersToUpdate.add(speaker);
      } else if (
        link != null &&
        link.LinkedEntityId.getSObjectType() == Event_Organizer__c.sObjectType
      ) {
        Event_Organizer__c organizer = new Event_Organizer__c();
        organizer.Id = link.LinkedEntityId;
        organizer.Picture__c = picUrl;
        organizerToUpdate.add(organizer);
      } else {
        system.debug('Inside doc port');
        Portfolio__c pf = new Portfolio__c();
        pf.Id = link.LinkedEntityId;
        if (version.FileType != 'pdf') {
          pf.imageViewURL__c = picUrl;
        } else {
          pf.pdfDownloadUrl__c = picUrl;
        }

        portfolioToUpdate.add(pf);
      }
    }

    /*update eventListToUpdate;
        update speakersToUpdate;
        update organizerToUpdate;

    List<sObject> allObjectsToUpdate = new List<Sobject>();
    allObjectsToUpdate.addAll(eventListToUpdate);
    allObjectsToUpdate.addAll(speakersToUpdate);
    allObjectsToUpdate.addAll(organizerToUpdate);
    allObjectsToUpdate.addAll(portfolioToUpdate);

    update allObjectsToUpdate;*/
  }

  public static ContentDistribution prepareContentDistribution(
    Id contentVersionId,
    String title
  ) {
    ContentDistribution newDist = new ContentDistribution();
    newDist.ContentVersionId = contentVersionId;
    newDist.Name = title;
    newDist.PreferencesNotifyOnVisit = false;
    newDist.PreferencesAllowViewInBrowser = true;
    newDist.PreferencesAllowOriginalDownload = true;
    return newDist;
  }

  public static Map<Id, ContentDocumentLink> getContentDocumentLinkMap(
    List<ContentVersion> contentVersionList
  ) {
    Set<String> contentDocumentIdsSet = new Set<String>();
    for (ContentVersion version : contentVersionList) {
      contentDocumentIdsSet.add(version.ContentDocumentId);
    }
    Map<Id, ContentDocumentLink> contentDocumentLinkMap = new Map<Id, ContentDocumentLink>();
    for (ContentDocumentLink link : [
      SELECT Id, LinkedEntityId, ContentDocumentId
      FROM ContentDocumentLink
      WHERE ContentDocumentId IN :contentDocumentIdsSet
    ]) {
      if (
        link.LinkedEntityId.getSObjectType() == Event__c.sObjectType ||
        link.LinkedEntityId.getSObjectType() == Speaker__c.sObjectType ||
        link.LinkedEntityId.getSObjectType() ==
        Event_Organizer__c.sObjectType ||
        link.LinkedEntityId.getSObjectType() == Portfolio__c.sObjectType
      ) {
        contentDocumentLinkMap.put(link.ContentDocumentId, link);
      }
    }
    return contentDocumentLinkMap;
  }
}
