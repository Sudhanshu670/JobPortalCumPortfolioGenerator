trigger ContentVersionTrigger on ContentVersion (after insert) {
    ContentVersionTriggerHandler.createPublicLinkForFile(trigger.new,trigger.newMap);
}