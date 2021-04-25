class World1 extends WorldClass {
	constructor(){
		super({ key: 'World1' });
    };

    preload (){
        super.preload_generic("network_1");

        this.load.audio("intro_specific_object", "items/sounds/intro_specific_object.wav" )
        this.load.audio("introduction", "items/sounds/introduction1.wav")
    };

    create() {
        super.create_generic();
        this.explanation= this.sound.add("intro_specific_object")
        this.time.addEvent({
            delay: 60000,
            callback: ()=> {
                console.log("move to next world")
                /* this.scene.stop("World1")
                this.scene.start("World2") */
            }
        });
    };

    update() {
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
        //not working- ask goren...
/*         Object.keys(gamestate.move).forEach(item=>{
            let curr_item= gamestate.move[item]
            if(curr_item[5]){
                let obj= curr_item[0];
                let x= curr_item[1];
                let y= curr_item[2];
                let newX= curr_item[3];
                let newY= curr_item[4];
                updateLocation(obj, x, y, newX, newY)
            }
        }) */
    };
};

game.scene.add('World1', World1, true);
