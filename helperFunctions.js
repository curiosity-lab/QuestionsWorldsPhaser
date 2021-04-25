class Edge{
    constructor(parent, question=null, children=null, sound= null){
    this.parent= parent;
    this.question= question;
    this.children= children;
    this.sound= sound;
    };
};

function displayQuestions(command){
    for(let i=0; i<gamestate.questionsButtons.length; i++){
        gamestate.questionsButtons[i].setVisible(command); 

    }
}

function hideQuestions(){
    displayQuestions(false);
}

function updateLocation(item, x, y, newX, newY){
    item.setX
    const incline= 1/((newX-x)/(newY-y));
    const speedX= (newX-x)/incline;
    const speedY= (newY-y)/incline;
    console.log(speedX, speedY)

    if(item.x< newX){
        item.x+= 0.02*speedX;
    }
    if(item.y< newY){
        item.y+= 0.02*speedY;
    }
    else{
        gamestate.selectedQuestion=item;
    }
    if(gamestate.move!=undefined){
        gamestate.move[item.name][3]=false;
    } 
}

function getKey(dict, val) {
    return Object.keys(dict).find(key => dict[key] === val);
  }

/* 
function playIntro(soundArray) {
    soundArray[0].play();
    soundArray.forEach(function(element, index, array){
        console.log(soundArray[index + 1])
        if (soundArray[index + 1]) {
            soundArray[index].onStop.addOnce(function(){soundArray[index + 1].play();}, this);
        }
    });
} */

