var po = require('./page-objects');
var ptor = protractor.getInstance();

describe('lean coffee', function() {
  var global = new po.GlobalFunction();

  describe('merge phase', function() {
    var mergePhase = new po.MergePage();
    var topics = [];

    it('should allow you to navigate to the merge phase', function() {
      mergePhase.bypassEarlierPages(topics);
      expect(global.getPhaseText()).toMatch(/PHASE: MERGE/);
    });

    it('should allow merging of 2+ topics', function(){

      expect(global.allSubmitTopics.count()).toEqual(9);
      expect(global.getTopicElem(0,'body').getText()).toEqual(topics[0]);
      global.clickElemById("mergeCheckBoxes0");
      global.clickElemById("mergeCheckBoxes1");

      expect(global.getElemByModel('newMergeText.value')
        .getAttribute('value')).toEqual(topics[0]+'\n'+topics[1]);
      global.clickElemByButtonText('Merge Topics');
      expect(global.allSubmitTopics.count()).toEqual(8);

    });

    describe('merge ownership', function(){

      it('should show a list of owners for a merged topic', function(){
        expect(global.getTopicElem(0, 'author').getText()).toMatch(/[\s\w]+/);
      });
    });

    describe('merge text', function(){

      it('should merge text when topics are merged', function(){
        global.clickElemById("mergeCheckBoxes1");
        global.clickElemById("mergeCheckBoxes7");
        expect(global.getElemByModel('newMergeText.value').getAttribute('value')).toEqual(topics[3]+'\n'+topics[0]+'\n'+topics[1]);
        global.clickElemByButtonText('Merge Topics');
        expect(global.allSubmitTopics.count()).toEqual(7);
      });

      it('should do nothing on Cancel', function(){
        global.clickElemById("mergeCheckBoxes1");
        global.clickElemById("mergeCheckBoxes2");
        global.clickElemByButtonText('Cancel');
        expect(global.allSubmitTopics.count()).toEqual(7);
      });

      it('should allow editing of the merged text', function(){
        global.clickElemById("mergeCheckBoxes2");
        var newMergeText=global.getElemByModel('newMergeText.value');
        newMergeText.clear();
        newMergeText.sendKeys('New Text Added');

        expect(global.getElemByModel('newMergeText.value')
          .getAttribute('value')).toEqual('New Text Added');
        global.clickElemByButtonText('Edit Topic');
        expect(global.allSubmitTopics.count()).toEqual(7);
      });
    });

    describe('timer', function(){
      it('should do nothing', function() {
        var start = global.getElementById('startTimer');
        expect(start.isDisplayed()).toEqual(false);
      });
    });
  });
});
