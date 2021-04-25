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
gamestate.concept_names = {'what': 'part', 'why': 'reason', 'how': 'process',
                            'what2': 'part_extend', 'why2': 'reason_extend', 'how2': 'process_extend'}
gamestate.questions= {'q1': 'what', 'q2': 'why', 'q3': 'how'};
gamestate.questions2= {'q1': 'what', 'q2': 'why', 'q3': 'how', 'q4': 'why2'};
gamestate.questionsButtons= [];
gamestate.objects=[];
gamestate.introAudios=[];
gamestate.allAudios={};
gamestate.pressed=[];
gamestate.selectedQuestion= false;
gamestate.soundPlaying= false;
gamestate.edges={};




