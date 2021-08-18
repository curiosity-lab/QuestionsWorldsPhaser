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

function displayChosenQuestion(question){
    question.setVisible(true);
}

function hideQuestions(){
    displayQuestions(false);
}

function updateLocation(item, x, y, newX, newY){
    const incline= 1/((newX-x)/(newY-y));
    const speedX= (newX-x)/incline;
    const speedY= (newY-y)/incline;
    item.x+= 0.05*speedX;
    item.y+= 0.05*speedY;
}

function getKey(dict, val) {
    return Object.keys(dict).find(key => dict[key] === val);
  }

function remove(dict, item){
    var newDict= {};
    Object.keys(dict).forEach(elem=>{
        if(elem!=item){
            newDict[elem]= dict[elem];
        }
    })
    return newDict;
}
