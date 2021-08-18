class World4 extends WorldClass {
	constructor(){
		super({ key: 'World4' });
    };
    
    preload (){
        console.log(gamestate.screenWidth, gamestate.screenHeight)
        super.preload_generic("network_4");
        this.load.audio("game4,introduction", "items/sounds/introduction4.wav") 
        
    };

    create() {
/*         const screenHeight= window.innerHeight * window.devicePixelRatio;
        const screenWidth= window.innerWidth * window.devicePixelRatio; */
        gamestate.chosenQuestion=[];
        super.create_generic();
        this.time.addEvent({
            delay: 71000,
            callback: ()=> {
                gamestate.timerUp= true;
            }
        });

        this.intro.on("complete", ()=>{
            displayQuestions(true);
            gamestate.finishedIntros=true; 
        })

        let i=1;
        console.log(gamestate.questionsButtons)
        gamestate.questionsButtons.forEach(elem=> {
            elem.x= 0.2*i*gamestate.screenWidth;
            elem.y= 0.3*gamestate.screenHeight;
            i++;
            elem.on("pointerdown", ()=>{
                gamestate.chosenQuestion.push(elem);
                gamestate.questionsButtons.forEach(button=>{
                    if(button!=gamestate.chosenQuestion[0]){
                        button.setVisible(false);
                    }
                })
            });
        })
    };

    update() {
        super.update_generic();
        const curr= this.num;
        if(gamestate.chosenQuestion.length!=0){
            gamestate.chosenQuestion[0].on("pointerdown", function(){
                if(!gamestate.soundPlaying&& gamestate.pressed.length!=0){
                    let current= gamestate.edges[gamestate.pressed[0]][gamestate.chosenQuestion[0].name];
                    let sound= current.sound;
                    gamestate.allAudios[curr+sound].play();
                    gamestate.soundPlaying= true;
                    (current.children).forEach(child=>{
                        child.setVisible(true);
                        if(gamestate.edges[child.name].what!= undefined){
                            gamestate.firstItemAppeared= true; // for World1
                        }
                    })
                }
            });
        }
        if(gamestate.soundPlaying){
            hideQuestions();
        }
        if(this.finishedIntros&& gamestate.chosenQuestion.length!=0){
            Object.keys(gamestate.objects).forEach(elem=>{
                gamestate.objects[elem].on("pointerdown", ()=>{
                    Object.keys(gamestate.edges[elem]).forEach(key=>{
                        if(gamestate.edges[elem][key]==null){ //if the edge doesnt have children- do not diplay buttons 
                            displayQuestions(false)
                        }
                        else{
                            displayChosenQuestion(gamestate.chosenQuestion[0]);
                        }
                    })
                })
            })
        };
        
        if(gamestate.chosenQuestion.length==1){
            updateLocation(gamestate.chosenQuestion[0], gamestate.chosenQuestion[0].x, gamestate.chosenQuestion[0].y, 0.9* window.innerWidth * window.devicePixelRatio, 0.9*window.innerHeight * window.devicePixelRatio);
        }
        if(gamestate.timerUp && !gamestate.soundPlaying){
            game.scene.add('World5', World5, true);
            this.scene.stop("World4")
            this.scene.start("World5")
        }

    };
};

//game.scene.add('World4', World4, true);
