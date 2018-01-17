
class roomGUI {
    constructor(index,  name, type=0, players=4, lock=0, time=30, hand=5, dTime=true, betType=0, money=500){
        this.index = index
        this.type = type
        this.name = name
        this.players = players
        this.lock = lock
        this.time = time
        this.hand = hand
        this.dTime = dTime
        this.betType = betType
        this.money = money
    }
    create(pos){
        this.prevPos = pos
        this.roomSprites = new Array()
        this.paramTexts = new Array()
        this.stars = new Array()
        this.graphics = game.add.graphics(0,0)
        this.graphics.beginFill(0x303030)
        this.graphics.drawRoundedRect(pos.x, pos.y, 483, 65, 7)
        this.graphics.beginFill(0x100f0f)
        this.graphics.drawRoundedRect(pos.x, pos.y+53, 483, 85, 7)
        this.graphics.drawRect(pos.x, pos.y+53, 483, 10, 7)

        this.paramTexts.push(game.add.text(pos.x+59, pos.y+16,this.name, {fontSize: '18px', fill: '#f5a623',fontWeight: 'normal' }))
        this.paramTexts.push(game.add.text(pos.x+426, pos.y+22,'0 / '+this.players, {fontSize: '16px', fill: '#9b9b9b',fontWeight: 'normal' }))
        this.paramTexts.push(game.add.text(pos.x+48, pos.y+87,this.time+' seg', {fontSize: '18px', fill: '#bdbdbd',fontWeight: 'normal' }))
        this.paramTexts.push(game.add.text(pos.x+390, pos.y+90,'$ '+this.money, {fontSize: '18px', fill: '#d0021b',fontWeight: 'normal' }))
        this.paramTexts.push(game.add.text(pos.x+18, pos.y+62,'GAME PARAMETERS', {fontSize: '11px', fill: '#9b9b9b',fontWeight: 'normal'}))
        this.paramTexts.push(game.add.text(pos.x+173, pos.y+89,this.hand, {fontSize: '18px', fill: '#bdbdbd',fontWeight: 'normal' }))

        this.roomSprites.push(game.add.sprite(pos.x+17, pos.y+11, 'people'))
        this.roomSprites.push(game.add.sprite(pos.x+19, pos.y+86, 'time'))
        this.roomSprites.push(game.add.sprite(pos.x+352, pos.y+88, 'initialBet'))
        this.roomSprites.push(game.add.sprite(pos.x+120, pos.y+85, this.hand+'hand'))
        this.roomSprites.push(game.add.sprite(pos.x+300, pos.y+83, 'rBet'+this.betType))
        if(this.dTime)
            this.roomSprites.push(game.add.sprite(pos.x+259, pos.y+83, 'dtime'))
        if(this.lock)
            this.roomSprites.push(game.add.sprite(pos.x+206, pos.y+13, 'lock'))
        this.roomSprites.push(game.add.sprite(pos.x, pos.y, ''))

        for(var i=0; i<5; i++){
            this.stars.push(new starGUI(pos.x+255+i*20, pos.y+19))
        }
        for(var i=0; i<3; i++){
            this.stars[i].update(true)
        }
    }
    move(pos){
        var i
        var step = {x:this.prevPos.x,y:this.prevPos.y}
        this.prevPos = pos
        this.graphics.x += - step.x+pos.x
        this.graphics.y += - step.y+pos.y
        for(i in this.roomSprites){
            this.roomSprites[i].x += - step.x + pos.x
            this.roomSprites[i].y += - step.y + pos.y
        }
        for(i in this.stars){
            this.stars[i].star.x += - step.x + pos.x
            this.stars[i].star.y += - step.y + pos.y
        }
        for(i in this.paramTexts){
            this.paramTexts[i].x += - step.x + pos.x 
            this.paramTexts[i].y += - step.y + pos.y 
        }
    }
}

var roomsStage = {
    preload: function(){
        game.stage.backgroundColor = 0x181818
        game.config.setForceTimeOut = true
        game.stage.disableVisibilityChange = true

        game.load.image('initialBet', 'assets_ico/monto_entrada_ico.png')
        game.load.image('mplayer2', 'assets_ico/room_player_ico.png')
        game.load.image('lock', 'assets_ico/lock_ico.png')
        game.load.image('people', 'assets_ico/room_player_ico.png')
        game.load.image('time', 'assets_ico/tiempo_ico.png')
        game.load.image('dtime', 'assets_ico/room_doubletime_ico.png')
        game.load.image('rBet0', 'assets_ico/room_apuesta_ico.png')
        game.load.image('5hand', 'assets_ico/mano_5_ico.png')
        game.load.image('9hand', 'assets_ico/mano_9_ico.png')
        game.load.image('starWin', 'assets_ico/star_ganador_ico.png')
        game.load.image('starLose', 'assets_ico/star_perdedor_ico.png')

        game.load.spritesheet('btnCreateRoom','assets_ico/btn_rooms.png',170,42,1)    
    },
    create: function(){
        this.allRooms = new Array()
        for(var i=0; i<5; i++){
            this.allRooms.push(new roomGUI(0,"Nombre_de_Prueba"+i))   
        }

        game.time.events.add(Phaser.Timer.SECOND*2, function(){
            this.allRooms[0].create(this.getPos(0))
        }, this)
        game.time.events.add(Phaser.Timer.SECOND*3, function(){
            //this.allRooms[1].create(this.getPos(1))
            this.allRooms[0].move(this.getPos(1))
        }, this)
        // game.time.events.add(Phaser.Timer.SECOND*4, function(){
        //     this.allRooms[2].create(this.getPos(2))
        // }, this)
        // game.time.events.add(Phaser.Timer.SECOND*5, function(){
        //     this.allRooms[3].create(this.getPos(3))
        // }, this)
        // game.time.events.add(Phaser.Timer.SECOND*6, function(){
        //     this.allRooms[4].create(this.getPos(4))
        // }, this)

        this.btnC = game.add.button(929, 10, 'btnCreateRoom', this.btnCreate_R, this, 0,0,0)
    },
    getPos: function(index){
        roomPos = new Array({x:61, y:150}, {x:564, y:150})
        roomStep = {x:503, y:153}
        return {x:roomPos[index%2].x,y:roomPos[index%2].y+parseInt(index/2)*roomStep.y}
    },
    btnCreate_R: function(){
        //socket.emit('join', "Room1")
        console.log("Create")
        game.state.start("waitRoom")
    },
    update: function(){
    }
}