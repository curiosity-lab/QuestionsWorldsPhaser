class World4 extends Phaser.Scene {
	constructor(){
		super({ key: 'World4' });
    };
    
    preload (){
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
        this.load.setBaseURL('http://localhost:3000');
        gamestate.world= "network_4"
        const backgroundImage= network[gamestate.world]["dir"]+network[gamestate.world]["background"];
        this.load.image("background",backgroundImage);
        Object.keys(network[gamestate.world]["concepts"]).forEach((elem)=> {
            let curr_img= network[gamestate.world]["concepts"][elem]["image"]
            if(curr_img.length==2){
                let img= network[gamestate.world]["dir"]+network[gamestate.world]["concepts"][elem]["image"][1];
                this.load.image(elem, img)
            }
            else{
                let img= network[gamestate.world]["dir"]+network[gamestate.world]["concepts"][elem]["image"][0];
                this.load.image(elem, img)

            }
        });
        network["sequence"].forEach(obj=> {
            if(obj["network"]==gamestate.world){
                gamestate.introSounds= obj["introduction"][1];
                gamestate.introSounds.forEach(elem=>{
                    console.log(elem.split(".")[0])
                    this.load.audio(elem.split(".")[0], "items/sounds/"+elem)
                });
            }
        })
        gamestate.allSounds=[];
        Object.values(network[gamestate.world]["story"]["what,why,how"]).forEach(elem=>{
            let aud= elem[1][0];
            this.load.audio(aud, network[gamestate.world]["dir"]+"sounds/"+aud)
            gamestate.allSounds.push(aud);
        })
        Object.values(gamestate.questions).forEach((elem)=>{
            this.load.image(elem, "items/"+elem+"_he.png");
        });
        
    };

    create() {
        const screenHeight= window.innerHeight * window.devicePixelRatio;
        const screenWidth= window.innerWidth * window.devicePixelRatio;
        this.add.image(screenWidth/2, screenHeight/2, 'background')
            .setScale(screenWidth / 1068 ,screenHeight / 667);

        this.move= [false, null];
        let i=0.2;
        Object.values(gamestate.questions).forEach((elem)=> {
            let q=this.add.image(screenWidth*i,screenHeight*0.3,elem);
            i+=0.2;
            q.setInteractive();
            q.setVisible(false);
            gamestate.questionsButtons.push(q);
            q.input.enabled= true;
            let world= gamestate.world.split("_")[1];
            q.on("pointerdown", ()=>{
                for(let k=0; k<gamestate.questionsButtons.length; k++){
                    if(gamestate.questionsButtons[k]!=q){
                        gamestate.questionsButtons[k].setVisible(false);
                    }
                    this.move= [true, q, q.x, q.y];
                }
                if(!gamestate.soundPlaying && gamestate.finishedExplanation && gamestate.selectedQuestion){
                    let current= gamestate.edges[gamestate.pressed[0]][elem];
                    let sound= current.sound;
                    gamestate.allAudios[sound].play();
                    gamestate.soundPlaying= true;
                    (current.children).forEach(child=>{
                        child.setVisible(true);
                    })
                }
            })
        })
        gamestate.firstItem= false; //dont forget to make true 
        let concepts=network[gamestate.world]["concepts"];
        Object.keys(concepts).forEach((elem)=> {
            let concept= concepts[elem];
            let pos= concept["pos"].split(", ");
            let size= concept["size"].split(", ");
            let img= this.add.image(screenWidth*Number(pos[0]),screenHeight*(1-Number(pos[1])), elem);
            img.displayWidth= screenWidth*Number(size[0])*0.75;
            img.displayHeight= screenHeight*Number(size[1])*0.75;
            img.name= elem;
            img.setInteractive();
            img.setVisible(concept["level"]==1);
            gamestate.objects[elem]= img;
            img.input.enabled= true;
            img.on("pointerdown", function(){           
                gamestate.pressed= [img.name];
                for(let i=0; i<Object.values(gamestate.objects).length; i++){
                    Object.values(gamestate.objects)[i].clearTint();
                };
                img.setTint(0xffff);

            });
        });

        let sources= [];
        let leafs= [];
        network["edges"].forEach(edge=>{
            sources.push(edge["source"]);
        });
        // find the children of every edge
        network["edges"].forEach(edge=>{
            let question= gamestate.questions2[edge["edge"]];
            let source= edge["source"];
            // if edge is in form of "concept"- convert to reason/part/process
            if(!["alien","tech","plant"].includes(source)){
                source= gamestate.concept_names[gamestate.questions2["q"+source[8]]]+"_" +source[source.length-1];
            }
            if(!Object.keys(gamestate.edges).includes(source)){
                gamestate.edges[source]={}; // if we didnt already create an edge with this name (for another question) create here 
            };
            let edge_parent= gamestate.objects[source];
            let edge_audio= network[gamestate.world]["story"]["what,why,how"][source+","+question][1][0];
            let edge_children= [];
            edge["target"].forEach(target=>{
                let con= gamestate.concept_names[gamestate.questions2["q"+target[8]]]+"_" +target[target.length-1];
                if(Object.keys(network[gamestate.world]["concepts"]).includes(con)){
                    edge_children.push(gamestate.objects[con]); // only add the edges that are relevant to the current world
                }
                // check if the target is a source itself (or if we saved it already). if not- create new edge with no children (leaf) or audio
                if(!sources.includes(target)&& !leafs.includes(target)){
                    let leaf= gamestate.concept_names[gamestate.questions2["q"+target[8]]]+"_" +target[target.length-1]
                    gamestate.edges[leaf]=new Edge(gamestate.objects[leaf]);
                    leafs.push(target);
                }
            })
            let edge_question= edge["edge"];
            gamestate.edges[source][question]=new Edge(edge_parent, edge_question, edge_children, edge_audio);
        });
        console.log(gamestate.edges)

        gamestate.introSounds.forEach(elem=>{
            gamestate.introAudios.push(this.sound.add(elem.split(".")[0]));
        });
        gamestate.introAudios[0].play();
        for(let i=0; i<gamestate.introAudios.length-1; i++){
            gamestate.introAudios[i].on("complete", ()=>{
                if(i==gamestate.introAudios.length-2){
                    gamestate.questionsButtons.forEach(elem=>{
                        elem.setVisible(true);
                    })
                }
                gamestate.introAudios[i+1].play();
            });
        }

        gamestate.allSounds.forEach(elem=>{
            gamestate.allAudios[elem]=this.sound.add(elem)
        });
        Object.keys(gamestate.allAudios).forEach(elem=>{
            gamestate.allAudios[elem].on("complete", ()=>{
                gamestate.soundPlaying= false;
            })
        })
    };

    update() {
        if(this.move[0]){
            updateLocation(this.move[1], this.move[2], this.move[3], 0.8* window.innerWidth * window.devicePixelRatio, 0.8*window.innerHeight * window.devicePixelRatio);
        }
        /* if(sound_ended()){
            for(let i=0; i<gamestate.objects.length; i++){
                gamestate.objects[i].clearTint();
            }
        }
        if(!sound_playing()){
            hideQuestions();
        } */
    };
};

game.scene.add('World4', World4, true);
// stopping point: pressing an image hearing the sound (done) and then having other items appear (not done)
