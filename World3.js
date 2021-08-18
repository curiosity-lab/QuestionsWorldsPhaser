class World3 extends WorldClass {
	constructor(){
		super({ key: 'World3' });
    };
    
    preload (){
        console.log(gamestate.screenWidth, gamestate.screenHeight)
        super.preload_generic("network_3");
        this.load.audio("game3,introduction", "items/sounds/introduction3.wav")
    };

    create() {
        gamestate.finishedExplanation= true;
        super.create_generic();
        console.log(gamestate.timerUp)
    };

    update() {
        super.update_generic();
        if(gamestate.items==5){
            gamestate.game3done= true;
        }
        if(gamestate.soundPlaying){
            hideQuestions();
        }
        if(this.finishedIntros){
            Object.keys(gamestate.objects).forEach(elem=>{
                gamestate.objects[elem].on("pointerdown", ()=>{
                    Object.keys(gamestate.edges[elem]).forEach(key=>{
                        if(gamestate.edges[elem][key]==null){ //if the edge doesnt have children- do not diplay buttons 
                            displayQuestions(false)
                        }
                        else{
                            displayQuestions(true);
                        }
                    })
                })
            })
        }
    };
};

//game.scene.add('World3', World3, true);