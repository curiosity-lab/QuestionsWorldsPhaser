class CloseScreen extends WorldClass {
	constructor(){
		super({ key: 'CloseScreen' });
	};

	preload(){
    };

    create(){
        var text1="\n\nהמשחק נגמר";
        var text2= "!כל הכבוד\n";   
        this.add.text(window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, text1, {fontSize: 150, fontStyle: 'bold', color: 'black'}).setOrigin(0.5);
        this.add.text(window.innerWidth * window.devicePixelRatio / 2,
            window.innerHeight * window.devicePixelRatio / 2, text2, {fontSize: 130, fontStyle: 'bold', color: 'black'}).setOrigin(0.5);

    };
    update()
    {};
}