class World2 extends WorldClass {
	constructor(){
		super({ key: 'World2' });
    };

    preload (){
        super.preload_generic("network_2");
        this.load.audio("game2,introduction", "items/sounds/introduction2.wav")
    };

    create() {
        gamestate.finishedExplanation= true;
        super.create_generic();
        this.time.addEvent({
            delay: 70000,
            callback: ()=> {
                gamestate.timerUp= true;
            }
        });
    };

    update() {
        super.update_generic();
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
        if(gamestate.timerUp && !gamestate.soundPlaying){
            game.scene.add('World3', World3, true);
            this.scene.stop("World2")
            this.scene.start("World3")
        }
    };
};

//game.scene.add('World2', World2, true);

