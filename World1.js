class World1 extends WorldClass {
	constructor(){
		super({ key: 'World1' });
    };

    preload (){
        super.preload_generic("network_1");

        this.load.audio("intro_specific_object", "items/sounds/intro_specific_object.wav" )
        this.load.audio("game1,introduction", "items/sounds/introduction1.wav")
        this.load.audio("intro_new_object", "items/sounds/intro-new-object.wav")
    };

    create() {
        gamestate.firstItemSoundDone= false;
        gamestate.finishedExplanation= false;
        gamestate.newItem= false;
        super.create_generic();
        this.explanation= this.sound.add("intro_specific_object")
        this.newItemSound= this.sound.add("intro_new_object")
        this.time.addEvent({
            delay: 74000, // added 14 seconds for intro 
            callback: ()=> {
                gamestate.timerUp= true; 
            }
        });
    };

    update() {
        super.update_generic();
        if(gamestate.firstItemAppeared && !gamestate.firstItemSoundDone){
            if(!gamestate.soundPlaying){
                this.newItemSound.play();
                gamestate.soundPlaying= true;
                this.newItemSound.on("complete", ()=>{
                    gamestate.soundPlaying= false;
                    gamestate.firstItemSoundDone= true;
                })
            }
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
                    if(gamestate.firstItem){
                        this.explanation.play();
                        this.explanation.on("complete", ()=>{
                            gamestate.finishedExplanation= true;
                        })
                        gamestate.firstItem= false;
                    }
                })
            })
        }
        if(gamestate.timerUp && !gamestate.soundPlaying){
            game.scene.add('World2', World2, true);
            this.scene.stop("World1")
            this.scene.start("World2")
        }
    };
};

game.scene.add('World1', World1, true);
