var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT
    },
    width: window.innerWidth * window.devicePixelRatio, //800,
    height: window.innerHeight * window.devicePixelRatio, //600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [], 
//    audio: {
//        disableWebAudio: fal
//    }
};

var game = new Phaser.Game(config);
var gamestate= {};
gamestate.currentStory= 4; //this is where the story variation is selected
gamestate.stories= ["what,why,how", "what,how,why", "how,what,why", "how,why,what", "why,what,how", "why,how,what"];
var originalConcepts= ["part", "reason", "process"]
var storySeq= gamestate.stories[gamestate.currentStory].split(",");
gamestate.questions= {'q1': storySeq[0], 'q2': storySeq[1], 'q3': storySeq[2]}
gamestate.questions2= {'q1': storySeq[0], 'q2': storySeq[1], 'q3': storySeq[2], 'q4': storySeq[1]+"2"}
gamestate.concept_names =  {'what': originalConcepts[storySeq.indexOf("what")],
                            'why': originalConcepts[storySeq.indexOf("why")],
                            'how': originalConcepts[storySeq.indexOf("how")],
                            'what2': originalConcepts[storySeq.indexOf("what")]+'_extend',
                            'why2': originalConcepts[storySeq.indexOf("why")]+'_extend',
                            'how2': originalConcepts[storySeq.indexOf("why")] +'_extend'};
//gamestate.concept_names = {'what': 'part', 'why': 'reason', 'how': 'process','what2': 'part_extend', 'why2': 'reason_extend', 'how2': 'process_extend'}
//gamestate.questions= {'q1': 'what', 'q2': 'why', 'q3': 'how'};
//gamestate.questions2= {'q1': 'what', 'q2': 'why', 'q3': 'how', 'q4': 'why2'};
gamestate.game3done=false;
gamestate.screenHeight= window.innerHeight * window.devicePixelRatio;
gamestate.screenWidth= window.innerWidth * window.devicePixelRatio;




