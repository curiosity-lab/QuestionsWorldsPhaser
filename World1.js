class World1 extends Phaser.Scene {
	constructor(){
		super({ key: 'World1' });
    };

    preload (){
        console.log(this);
        this.load.setBaseURL('http://localhost:3000');
        gamestate.world= "network_1"
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

        gamestate.allSounds=[];
        Object.values(network[gamestate.world]["story"]["what,why,how"]).forEach(elem=>{
            let aud= elem[1][0];
            this.load.audio(aud, network[gamestate.world]["dir"]+"sounds/"+aud)
            gamestate.allSounds.push(aud);
        });

        Object.values(gamestate.questions).forEach((elem)=>{
            this.load.image(elem, "items/"+elem+"_he.png");
        });

        this.load.audio("intro_specific_object", "items/sounds/intro_specific_object.wav" )
        this.load.audio("introduction1", "items/sounds/introduction1.wav")
    };

    create() {
        this.finishedIntros= false; // make true for debugging 
        gamestate.finishedExplanation= false; // make true for debugging 
        this.time.addEvent({
            delay: 60000,
            callback: ()=> {
                console.log("move to next world")
                /* this.scene.stop("World1")
                this.scene.start("World2") */
            }
        });

        const screenHeight= window.innerHeight * window.devicePixelRatio;
        const screenWidth= window.innerWidth * window.devicePixelRatio;
        this.add.image(screenWidth/2, screenHeight/2, 'background')
            .setScale(screenWidth / 1068 ,screenHeight / 667);

        //not in networks.js. loading separately 
        this.explanation= this.sound.add("intro_specific_object")
        this.intro= this.sound.add("introduction1");
        this.intro.on("complete", ()=>{
            this.finishedIntros=true;
        })
        this.intro.play();
        
        gamestate.allSounds.forEach(elem=>{
            gamestate.allAudios[elem]=this.sound.add(elem)
        });
        Object.keys(gamestate.allAudios).forEach(elem=>{
            gamestate.allAudios[elem].on("complete", ()=>{
                gamestate.soundPlaying= false;
            })
        })

        let i=0.2;
        gamestate.move={}
        Object.values(gamestate.questions).forEach((elem)=> {
            let q=this.add.image(screenWidth*i,screenHeight*0.9,elem);
            i+=0.2;
            q.setInteractive();
            q.setVisible(false);
            gamestate.questionsButtons.push(q);
            q.displayHeight*=1.1;
            q.displayWidth*=1.1;
            q.input.enabled= true;
            q.on("pointerdown", function(){
                if(!gamestate.soundPlaying && gamestate.finishedExplanation){
                    let current= gamestate.edges[gamestate.pressed[0]][elem];
                    let sound= current.sound;
                    gamestate.allAudios[sound].play();
                    gamestate.soundPlaying= true;
                    (current.children).forEach(child=>{
                        gamestate.move[child.name]= [child, q.x, q.y, child.x, child.y, true] //get the question location (the items will move from there)
                        child.x= q.x;
                        child.y= q.y;
                        child.setVisible(true);
                    })
                }
            });
        })
        gamestate.firstItem= true; 
        let concepts=network[gamestate.world]["concepts"];
        Object.keys(concepts).forEach((elem)=> {
            let concept= concepts[elem];
            let pos= concept["pos"].split(", ");
            let size= concept["size"].split(", ");
            let img= this.add.image(screenWidth*Number(pos[0]),screenHeight*(1-Number(pos[1])), elem);
            img.displayWidth= screenWidth*Number(size[0])*0.8;
            img.displayHeight= screenHeight*Number(size[1])*0.8;
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

        //the code for the individual into audios (before combining them)
/*         gamestate.introSounds.forEach(elem=>{
            gamestate.introAudios.push(this.sound.add(elem.split(".")[0]));
        });
         */
/*         gamestate.introAudios[0].play();
        for(let i=0; i<gamestate.introAudios.length-1; i++){
            gamestate.introAudios[i].on("complete", ()=>{
                gamestate.introAudios[i+1].play();
            });
            gamestate.introAudios[gamestate.introAudios.length-1].on("complete", ()=>{
                this.finishedIntros= true;
            })
        } */

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
