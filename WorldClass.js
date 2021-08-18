class WorldClass extends Phaser.Scene {
	constructor(){
		super({ key: Math.random().toString(36).substring(7) });
    };

    preload_generic (network_str){
        gamestate.questionsButtons= [];
        gamestate.objects=[];
        gamestate.introAudios=[];
        gamestate.allAudios={};
        gamestate.pressed=[];
        gamestate.soundPlaying= false;
        gamestate.edges={};
        gamestate.timerUp= false;
        this.load.setBaseURL('http://localhost:3000');
        gamestate.world= network_str;
        this.num= "game"+ network_str[8] + ",";
        const backgroundImage= network[gamestate.world]["dir"]+network[gamestate.world]["background"];
        this.load.image(this.num+ "background",backgroundImage);
        Object.keys(network[gamestate.world]["concepts"]).forEach((elem)=> {
            let curr_img= network[gamestate.world]["concepts"][elem]["image"]
            if(curr_img.length==2){
                let img= network[gamestate.world]["dir"]+network[gamestate.world]["concepts"][elem]["image"][1];
                this.load.image(this.num+elem, img)
            }
            else{
                let img= network[gamestate.world]["dir"]+network[gamestate.world]["concepts"][elem]["image"][0];
                this.load.image(this.num+ elem, img)

            }
        });

        gamestate.allSounds=[];
        let story= gamestate.stories[gamestate.currentStory];
        Object.values(network[gamestate.world]["story"][story]).forEach(elem=>{
            let aud= elem[1][0];
            this.load.audio(this.num+ aud, network[gamestate.world]["dir"]+"sounds/"+aud)
            gamestate.allSounds.push(this.num+ aud);
        });

        Object.values(gamestate.questions).forEach((elem)=>{
            this.load.image(this.num+ elem, "items/"+elem+"_he.png");
        });
    };

    create_generic() {
        gamestate.firstItem= true;
        gamestate.firstItemAppeared= false; // for World1
        gamestate.items= 0; // for World3
        this.finishedIntros= false; // make true for debugging 

        const screenHeight= window.innerHeight * window.devicePixelRatio;
        const screenWidth= (window.innerWidth * window.devicePixelRatio)*1; //0.8; eighty percent leaves a black strip on the right but makes the images more proportionate
        this.add.image(screenWidth/2, screenHeight/2, this.num+ 'background')
            .setScale(screenWidth / 1068 ,screenHeight / 880);

        //not in networks.js. loading separately 
        this.intro= this.sound.add(this.num+ "introduction");
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
                if(gamestate.game3done){
                    game.scene.add('World4', World4, true);
                    this.scene.stop("World3");
                    this.scene.start("world4");
                    gamestate.game3done=false;
                    
                }
            })
        })

        let i=0.2;
        gamestate.move={};
        Object.values(gamestate.questions).forEach((elem)=> {
            let q=this.add.image(screenWidth*i,screenHeight*0.93,this.num+ elem);
            i+=0.2;
            q.setInteractive();
            q.setVisible(false);
            gamestate.questionsButtons.push(q);
            q.displayHeight*=1.2;
            q.displayWidth*=1.2;
            q.input.enabled= true;
            q.name= elem;
            const game_num= this.num;
            q.on("pointerdown", function(){
                if(!gamestate.soundPlaying && gamestate.finishedExplanation&& gamestate.pressed[0]!=null){
                    let current= gamestate.edges[gamestate.pressed[0]][elem];
                    let sound= current.sound;
                    gamestate.allAudios[game_num+sound].play();
                    gamestate.soundPlaying= true;
                    gamestate.items+=1; // for World3
                    (current.children).forEach(child=>{
                        child.setVisible(true);
                        const speedX= (child.x-q.x)/100;
                        const speedY= (child.y-q.y)/100;
                        var oldX= child.x;
                        var oldY= child.y;
                        child.x= q.x;
                        child.y= q.y;
                        gamestate.move[child.name]= [child, oldX, oldY, speedX, speedY]
                        if(gamestate.edges[child.name].what!= undefined){
                            gamestate.firstItemAppeared= true; // for World1
                        }
                    })
                }
            });
        })
        
        let concepts=network[gamestate.world]["concepts"];
        Object.keys(concepts).forEach((elem)=> {
            let concept= concepts[elem];
            let pos= concept["pos"].split(", ");
            let size= concept["size"].split(", ");
            let img= this.add.image(screenWidth*Number(pos[0]),screenHeight*(1-Number(pos[1])), this.num+ elem);          
            img.displayWidth= screenWidth*Number(size[0])*0.8;
            img.displayHeight= screenHeight*Number(size[1])*0.8;
            img.name= this.num+ elem; // this might not be necessary. check later 
            img.setInteractive();
            img.setVisible(concept["level"]==1);
            gamestate.objects[this.num+elem]= img;
            img.input.enabled= true;
            img.on("pointerdown", function(){          
                gamestate.pressed= [img.name];
                for(let i=0; i<Object.values(gamestate.objects).length; i++){
                    Object.values(gamestate.objects)[i].clearTint();
                };
                img.setTint(0xffff);

            });
        });
        console.log(gamestate.objects)


        let sources= [];
        let leafs= [];
        network["edges"].forEach(edge=>{
            sources.push(this.num+ edge["source"]);
        });
        // find the children of every edge
        network["edges"].forEach(edge=>{
            let question= gamestate.questions2[edge["edge"]];
            let source= edge["source"];
            // if edge is in form of "concept"- convert to reason/part/process
            if(!["alien","tech","plant"].includes(source)){
                source= gamestate.concept_names[gamestate.questions2["q"+source[8]]]+"_" +source[source.length-1];
            }
            if(!Object.keys(gamestate.edges).includes(this.num+source)){
                gamestate.edges[this.num+ source]={}; // if we didnt already create an edge with this name (for another question) create here 
            };
            let edge_parent= gamestate.objects[this.num+source];
            let story= gamestate.stories[gamestate.currentStory];
            let edge_audio= network[gamestate.world]["story"][story][source+","+question][1][0];
            let edge_children= [];
            edge["target"].forEach(target=>{
                let con= gamestate.concept_names[gamestate.questions2["q"+target[8]]]+"_" +target[target.length-1];
                if(Object.keys(network[gamestate.world]["concepts"]).includes(con)){
                    edge_children.push(gamestate.objects[this.num+ con]); // only add the edges that are relevant to the current world
                }
                // check if the target is a source itself (or if we saved it already). if not- create new edge with no children (leaf) or audio
                if(!sources.includes(this.num+target)&& !leafs.includes(this.num+target)){
                    let leaf= this.num+ gamestate.concept_names[gamestate.questions2["q"+target[8]]]+"_" +target[target.length-1]
                    gamestate.edges[leaf]=new Edge(gamestate.objects[this.num+ leaf]);
                    leafs.push(this.num+target);
                }
            })
            let edge_question= edge["edge"];
            gamestate.edges[this.num+source][question]=new Edge(edge_parent, edge_question, edge_children, edge_audio);
        });
    };

    update_generic() {
        if(Object.keys(gamestate.move).length!=0){
            Object.keys(gamestate.move).forEach(item=>{
                let curr= gamestate.move[item]
                if(curr[0].y>=curr[2]){
                    curr[0].x+=curr[3];//speedX;
                    curr[0].y+=curr[4]; //speedY;
                }
                else{
                    gamestate.move= remove(gamestate.move, item);
                }
            })
        }
    };
};
//gamestate.move= [child, oldX, oldY, speedX, speedY]
