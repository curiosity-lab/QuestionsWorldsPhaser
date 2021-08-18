class World5 extends WorldClass {
	constructor(){
		super({ key: 'World5' });
    };

    preload (){
        super.preload_generic("network_5");
        this.load.audio("game5,introduction", "items/sounds/introduction5.wav")
    };

    create() {
        gamestate.finishedExplanation= true;
        super.create_generic();
        this.time.addEvent({
            delay: 68000,
            callback: ()=> {
                gamestate.timerUp= true;
                console.log("game finished. insert thank you page")
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
            //game.scene.add("CloseScreen", CloseScreen, true);
            this.scene.stop('World5');
            window.open('end.html', '_self')
            //this.scene.start("CloseScreen");
            
        }
    };
};
//game.scene.add('World5', World5, true);

