class OneD extends Phaser.Scene {
    constructor() {
        super("OneDscene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings

        this.ufoX = 700;
        this.ufoY = 250;

        this.hotdogX = -200;
        this.hotdogY = 535;
    }

    preload() {
        this.load.setPath("./assets/");

        //player
        this.load.image('ufo', 'shipGreen_manned.png');
        this.load.image('ufo_b', 'shipBlue_manned.png')

        //background
        this.load.image('bg', 'backgroundEmpty.png');
        this.load.image('ground', 'castleMid.png');

        //props
        this.load.image('van', 'van.png');
        this.load.image('police', 'police.png');
        this.load.image('suv', 'suv_military.png');
        this.load.image('truck', 'truck.png');
        this.load.image('light', 'light.png');
        this.load.image('sign', 'highway.png');
        this.load.image('barrier', 'barrier.png');

        //bullets
        this.load.image('laser', 'laserBlue1.png');
        this.load.image('missile', 'spaceMissiles_037.png');
        this.load.image('rocket', 'spaceMissiles_040.png');


        //enemies
        this.load.image('m_truck', 'truckdark.png');
        this.load.image('r_truck', 'suv_closed.png');
        this.load.image('hotdog', 'hotdog.png');

        //plane anim
        this.load.image('plane1', 'planeGreen1.png');
        this.load.image('plane2', 'planeGreen2.png');
        this.load.image('plane3', 'planeGreen3.png');

        //exposion anim
        this.load.image('explosion1', 'explosion01.png');
        this.load.image('explosion2', 'explosion02.png');

        //audio
        this.load.audio('laser_a', 'laserSmall_000.ogg');
        this.load.audio('boom1', 'explosionCrunch_000.ogg');
        this.load.audio('boom2', 'explosionCrunch_001.ogg');
        this.load.audio('boom3', 'explosionCrunch_002.ogg');

        
    }

    create() {
        //console.log("create\n");

        this.Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.Rkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        this.bg = this.add.tileSprite(0, 0, 1200, 600, "bg");
        this.bg.setOrigin(0, 0);

        this.ground = this.add.tileSprite(0, 565, 1200, 100, "ground");
        this.ground.setOrigin(0, 0);

        let my = this.my;

        this.hotdogActive = false;

        this.bulletCooldown = 20;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        this.missileCooldown = 20;
        this.missileCooldownCounter = 0;

        this.rocketCooldown = 60;
        this.rocketCooldownCounter = 0;

        this.dropCooldown = 20;
        this.dropCooldownCounter = 0;

        this.hotdogCooldown = 2000;
        this.hotdogCooldownCounter = 0;

        this.wave = 1;
        this.waveCooldown = 240; //update calls to make before next wave
        this.waveCooldownCounter = 0;
        this.waveCalled = false;

        this.enemiesDefeated = 0;
        this.testFlag1 = false;
        this.testFlag2 = false;
        this.animStarted = false;

        this.hitCooldown = 2000;
        this.hitCooldownCounter = 0;



        this.propAssets = ['van', 'police', 'suv', 'truck', 'light', 'sign', 'barrier'];

        my.sprite.bulletGroup = this.add.group({
            defaultKey: "laser",
            maxSize: 1 //2
            }
        )

        my.sprite.missileGroup = this.add.group({
            defaultKey: "missile",
            maxSize: 5
            }
        )

        my.sprite.rocketGroup = this.add.group({
            defaultKey: "rocket",
            maxSize: 5
            }
        )

        my.sprite.h_laserGroup = this.add.group({
            defaultKey: "laser",
            maxSize: 1
            }
        )
        my.sprite.dropGroup = this.add.group({
            defaultKey: "rocket",
            maxSize: 2
            }
        )

        my.sprite.propGroup = this.add.group({
            defaultKey: "van",
            maxSize: 8
            }
        )

        my.sprite.planeGroup = this.add.group({
            defaultKey: "plane1",
            maxSize: 10
            }
        )

        my.sprite.m_truckGroup = this.add.group({
            defaultKey: "m_truck",
            maxSize: 15
        });

        my.sprite.r_truckGroup = this.add.group({
            defaultKey: "r_truck",
            maxSize: 15
        });

        // Create all of the bullets at once, and set them to inactive
        // See more configuration options here:
        // https://rexrainbow.github.io/phaser3-rex-notes/docs/site/group/
        my.sprite.bulletGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize-1
        });

        my.sprite.h_laserGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.h_laserGroup.defaultKey,
            repeat: my.sprite.h_laserGroup.maxSize-1
        });

        my.sprite.missileGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.missileGroup.defaultKey,
            repeat: my.sprite.missileGroup.maxSize-1
        });

        my.sprite.rocketGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.rocketGroup.defaultKey,
            repeat: my.sprite.rocketGroup.maxSize-1
        });

        my.sprite.dropGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.dropGroup.defaultKey,
            repeat: my.sprite.dropGroup.maxSize-1
        })

        my.sprite.propGroup.createMultiple({ 
            active: true,
            visible: true,
            key: my.sprite.propGroup.defaultKey,
            repeat: my.sprite.propGroup.maxSize-1
        });

        my.sprite.planeGroup.createMultiple({ 
            active: false,
            visible: false,
            key: my.sprite.planeGroup.defaultKey,
            repeat: my.sprite.planeGroup.maxSize-1
        });

        my.sprite.m_truckGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.m_truckGroup.defaultKey,
            repeat: my.sprite.m_truckGroup.maxSize-1
        });

        my.sprite.r_truckGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.r_truckGroup.defaultKey,
            repeat: my.sprite.r_truckGroup.maxSize-1
        });
        my.sprite.ufo = this.add.sprite(this.ufoX, this.ufoY, "ufo");
        my.sprite.ufo.setScale(0.5); //0.65

        my.sprite.hotdog = this.add.sprite(this.hotdogX, this.hotdogY, "hotdog");
        my.sprite.hotdog.setScale(2.5);

        this.hotdogHealth = 4;
        this.playerHealth = 2;
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.gameOverText = this.add.text(300, 16, 'A (left), D (right), Space (fire)', { fontSize: '24px', fill: '#000' });
         //this.playerHealth = 1;
        this.playerHit = false;
        this.gameOver = false;
        this.hotdogSpeed = 75;

        this.bulletSpeed = 400;
        this.missileSpeed = 500;
        this.dropSpeed = 400;
        this.decelerate = 0.7;
        this.rocketSpeed = 175;
        this.h_laserSpeed = 400;
        this.truckSpeed = 150;
        this.truckSpeed2 = 180;

        //for (let laser of my.sprite.bulletGroup.getChildren()) { //this seems to get rid of rogue laser on startup
        //    laser.active = false;
        ///    laser.visible = false;
        //}

        for (let prop of my.sprite.propGroup.getChildren()) {
            //prop.active = true;
            //prop.visible = true;
            //prop.setTexture(this.propAssets[Math.random()*10]);
            prop.x = Math.random()*config.width;
            prop.y = 550;
            //prop.setTexture(this.propAssets[Phaser.Math.Between(0, 6)]);
            prop.setScale(2);
            let key = this.propAssets[Phaser.Math.Between(0, 6)];
                prop.setTexture(key);
                if (key == 'truck') {
                    prop.y = 542;
                    prop.setScale(2);
                    //prop.setDepth(1);
                } else if (key == 'barrier'){
                    prop.y = 557;
                    prop.setScale(2);
                } else if (key == 'light'){
                    prop.y = 523;
                    prop.setScale(2, 3);
                } else if (key == 'sign'){
                    prop.y = 517;
                    prop.setScale(3);
                }else if (key == 'van'){
                    prop.y = 546;
                    prop.setScale(2);
                } else {
                    prop.y = 552;
                    prop.setScale(2);
                }
        }

        //for debug
        for (let laser of my.sprite.bulletGroup.getChildren()) {
            laser.x = -500;
        }
        for (let missile of my.sprite.missileGroup.getChildren()) {
            missile.x = -500;
        }
        for (let plane of my.sprite.planeGroup.getChildren()) {
            plane.y = -200;
        }
        for (let rocket of my.sprite.rocketGroup.getChildren()) {
            rocket.y = -300;
        }
        for (let laser of my.sprite.h_laserGroup.getChildren()) {
            laser.x = -500;
        }
        for (let m_truck of my.sprite.m_truckGroup.getChildren()) {
            m_truck.y = -200;
        }
        for (let r_truck of my.sprite.r_truckGroup.getChildren()) {
            r_truck.y = -200;
        }

        this.anims.create({
            key: "plane_anim",
            frames: [
                {key: "plane1"},
                {key: "plane2"},
                {key: "plane3"},
                {key: "plane2"}
            ],
            frameRate: 30,
            repeat: -1,
            //duration: 1,
            hideOnComplete: true
        });

        this.anims.create({
            key: "explosion_anim",
            frames: [
                {key: "explosion1"},
                {key: "explosion2"}
            ],
            frameRate: 20,
            repeat: 5,
            hideOnComplete: true
        });
    }

    update(time, delta) {
        let dt = delta / 1000;
        let my = this.my;    // create an alias to this.my for readability

        this.bg.tilePositionX += 50 * dt; //0.25
        this.ground.tilePositionX += 75 * dt; //1,25
        
        if ((this.playerHealth == 1) && (this.playerHit == false)){
            my.sprite.ufo.setTexture('ufo_b').setScale(0.5, 0.45);
            this.playerHit = true;
        } else if ((this.playerHealth == 0) && (this.gameOver == false)){
            this.explosion_anim = this.add.sprite(my.sprite.ufo.x, my.sprite.ufo.y, "explosion1").setScale(0.1).play("explosion_anim");
            this.gameOver = true;
            this.gameOverText.setText('Game Over (press R to restart)');
            my.sprite.ufo.setVisible(false);
            my.sprite.ufo.x = 1300;
            //this.wave = 1;
            //this.waveCalled = false;
        } else if ((this.enemiesDefeated > 15) && (this.gameOver == false)) {
            this.gameOver = true;
            this.gameOverText.setText('enemy force depleted! (press R to restart)');

        }

        if ((this.gameOver == true) && ((this.Rkey.isDown))) {
            this.scene.restart();
        }

        //truck movement
        for (let truck of my.sprite.m_truckGroup.getChildren()) {
            if (truck.x < 1250) {
                truck.x += this.truckSpeed * dt; //25
            } else {
                truck.x = -10;
            }
        }
        for (let truck of my.sprite.r_truckGroup.getChildren()) {
            if (truck.x < 1250) {
                truck.x += this.truckSpeed2 * dt; //25
            } else {
                truck.x = -10;
            }
        }

        //hotdog boss movement
        if ((my.sprite.hotdog.x > my.sprite.ufo.x) && (this.hotdogActive == true)) {
            my.sprite.hotdog.x -= this.hotdogSpeed * dt; //alt is 90 for both
        } else if (this.hotdogActive == true) { //75
            my.sprite.hotdog.x += this.hotdogSpeed * dt;
        } else if (this.hotdogActive == false) {
            my.sprite.hotdog.x = -200;
        }
        if (this.hotdogHealth <= 2) {
            this.hotdogSpeed = 150;
        }

        //plane movement 
        for (let plane of my.sprite.planeGroup.getChildren()) {
            if ((plane.x < 1250) && (plane.active)) {
                plane.x += 250 * dt; //125
            } else if (plane.active){
                plane.x = Math.random()*config.width - 1200;
            } else {
                plane.y = -200;
            }
        }

        //handle randomly appearing props
        for (let prop of my.sprite.propGroup.getChildren()) {
            if (prop.x > 0) {
                prop.x -= 75 * dt;
            } else { //if offscreen
                prop.x = Math.random()*config.width + 1200;
                let key = this.propAssets[Phaser.Math.Between(0, 6)];
                prop.setTexture(key);
                if (key == 'truck') {
                    prop.y = 545;
                    prop.setScale(2);
                } else if (key == 'barrier'){
                    prop.y = 557;
                    prop.setScale(2)
                } else if (key == 'light'){
                    prop.y = 523;
                    prop.setScale(2, 3);
                } else if (key == 'sign'){
                    prop.y = 517;
                    prop.setScale(3);
                }else if (key == 'van'){
                    prop.y = 546;
                    prop.setScale(2)
                } else {
                    prop.y = 550;
                    prop.setScale(2)
                }
            }
        }

        //handle wave spawns
        if ((this.wave == 1) && (this.waveCalled == false)) {
            let m_truck1 = my.sprite.m_truckGroup.getFirstDead()
            m_truck1.active = true;

            let m_truck2 = my.sprite.m_truckGroup.getFirstDead()
            m_truck2.active = true;

            let r_truck1 = my.sprite.r_truckGroup.getFirstDead()
            r_truck1.active = true;

            let plane1 = my.sprite.planeGroup.getFirstDead()
            plane1.active = true;

            m_truck1.visible = true;
            this.position(m_truck1, 200, 550);
            m_truck1.setScale(2);

            r_truck1.visible = true;
            this.position(r_truck1, 400, 560);
            r_truck1.setScale(2.5);
            r_truck1.setDepth(1);

            m_truck2.visible = true;
            this.position(m_truck2, 600, 550);
            m_truck2.setScale(2);

            plane1.visible = true;
            plane1.x = -200;
            plane1.y = 80;
            plane1.setScale(1, 0.5);
            plane1.play('plane_anim');

            this.waveCalled = true;
        } else if ((this.wave == 2) && (this.waveCalled == false)) {
            this.truckSpeed = 190;
            let m_truck1 = my.sprite.m_truckGroup.getFirstDead()
            m_truck1.active = true;

            let m_truck2 = my.sprite.m_truckGroup.getFirstDead()
            m_truck2.active = true;

            let m_truck3 = my.sprite.m_truckGroup.getFirstDead()
            m_truck3.active = true;

            let r_truck1 = my.sprite.r_truckGroup.getFirstDead()
            r_truck1.active = true;

            //console.log(my.sprite.m_truckGroup.getTotalUsed());

            m_truck1.visible = true;
            this.position(m_truck1, 200, 550);
            m_truck1.setScale(2);

            r_truck1.visible = true;
            this.position(r_truck1, 350, 560);
            r_truck1.setScale(2.5);
            r_truck1.setDepth(1);

            m_truck2.visible = true;
            this.position(m_truck2, 500, 550);
            m_truck2.setScale(2);

            m_truck3.visible = true;
            this.position(m_truck3, 800, 550);
            m_truck3.setScale(2);

            this.waveCalled = true;
        } else if ((this.wave == 3) && (this.waveCalled == false)){
            this.truckSpeed = 240;
            let m_truck1 = my.sprite.m_truckGroup.getFirstDead()
            m_truck1.active = true;
            let m_truck2 = my.sprite.m_truckGroup.getFirstDead()
            m_truck2.active = true;
            let m_truck3 = my.sprite.m_truckGroup.getFirstDead()
            m_truck3.active = true;
            let m_truck4 = my.sprite.m_truckGroup.getFirstDead()
            m_truck4.active = true;
            let m_truck5 = my.sprite.m_truckGroup.getFirstDead()
            m_truck5.active = true;
            //console.log(my.sprite.m_truckGroup.getTotalUsed());

            let plane1 = my.sprite.planeGroup.getFirstDead()
            plane1.active = true;

            m_truck1.visible = true;
            this.position(m_truck1, 240, 550);
            m_truck1.setScale(2);

            m_truck2.visible = true;
            this.position(m_truck2, 480, 550);
            m_truck2.setScale(2);

            m_truck3.visible = true;
            this.position(m_truck3, 620, 550);
            m_truck3.setScale(2);

            m_truck4.visible = true;
            this.position(m_truck4, 860, 550);
            m_truck4.setScale(2);

            m_truck5.visible = true;
            this.position(m_truck5, 1100, 550);
            m_truck5.setScale(2);

            plane1.visible = true;
            plane1.x = -200;
            plane1.y = 80;
            plane1.setScale(1, 0.5);
            plane1.play('plane_anim');


            this.hotdogActive = true;
            this.position(my.sprite.hotdog, 600, 535);

            this.waveCalled = true;
        }

        //when all enemies defeated, this.wave += 1;
        if ((this.enemiesDefeated >= 6) && (this.testFlag2 == false)) { //short term fix for bugged +2 at start of game
            this.wave = 3;
            this.waveCalled = false;
            this.testFlag2 = true;
            //console.log(this.wave);
        } else if ((this.enemiesDefeated >= 2) && (this.testFlag1 == false)) {
            this.wave = 2;
            this.waveCalled = false;
            this.testFlag1 = true;
            //console.log(this.wave);
        }

        this.bulletCooldownCounter--;
        this.missileCooldownCounter--;
        this.rocketCooldownCounter--;
        this.hotdogCooldownCounter--;
        this.dropCooldownCounter--;
        this.hitCooldownCounter--;

        if (this.Akey.isDown) {
            this.move(my.sprite.ufo, -525, dt)
        }
        if (this.Dkey.isDown) {
            this.move(my.sprite.ufo, 525, dt)
        }

        // Check for bullet being fired
        if (this.space.isDown) {
            if (this.bulletCooldownCounter < 0) {
                // Get the first inactive bullet, and make it active
                let laser = my.sprite.bulletGroup.getFirstDead();
                // bullet will be null if there are no inactive (available) bullets
                if (laser != null) {
                    laser.active = true;
                    laser.visible = true;
                    laser.x = my.sprite.ufo.x;
                    laser.y = my.sprite.ufo.y + (my.sprite.ufo.displayHeight/2);
                    laser.setScale(0.5);
                    this.bulletCooldownCounter = this.bulletCooldown;

                }
            }
        }

        //check fire range
        for (let m_truck of my.sprite.m_truckGroup.getChildren()) {
            let ufo = my.sprite.ufo;
            if ((ufo.x < m_truck.x + 5) && (ufo.x > m_truck.x - 5)) {
                if (this.missileCooldownCounter < 0) {
                    let missile = my.sprite.missileGroup.getFirstDead();
                    if (missile != null) {
                        missile.active = true;
                        missile.visible = true;
                        missile.x = m_truck.x;
                        missile.y = m_truck.y - (m_truck.displayHeight/2);
                        missile.setScale(1);
                        this.missileCooldownCounter = this.missileCooldown;
                    }
                }
            }
        }

       for (let r_truck of my.sprite.r_truckGroup.getChildren()) {
            let ufo = my.sprite.ufo;
            if ((ufo.x < r_truck.x + 510) && (ufo.x > r_truck.x + 500)) { //offset
                if (this.rocketCooldownCounter < 0) {
                    let rocket = my.sprite.rocketGroup.getFirstDead();
                    if (rocket != null) {
                        rocket.active = true;
                        rocket.visible = true;
                        rocket.x = r_truck.x;
                        rocket.y = r_truck.y - (r_truck.displayHeight/2);
                        rocket.setScale(1);
                        rocket.setAngle(45);
                        this.rocketCooldownCounter = this.rocketCooldown;
                    }
                }
            }
        }

        for (let plane of my.sprite.planeGroup.getChildren()) {
            if (plane.active == true){
                let ufo = my.sprite.ufo;
                if ((ufo.x < plane.x + 310) && (ufo.x > plane.x + 300)) { //offset
                    if (this.dropCooldownCounter < 0) {
                        let drop = my.sprite.dropGroup.getFirstDead();
                        if (drop != null) {
                            drop.active = true;
                            drop.visible = true;
                            drop.x = plane.x;
                            drop.y = plane.y - (plane.displayHeight/2);
                            drop.setScale(1);
                            drop.setAngle(135);
                            this.dropCooldownCounter = this.dropCooldown;
                            //console.log(plane.y);
                        }
                    }
                }
            }
        }

        let ufo = my.sprite.ufo;
        let hotdog = my.sprite.hotdog;
        if ((ufo.x < hotdog.x + 5) && (ufo.x > hotdog.x - 5)) {
            if ((this.hotdogCooldownCounter < 0) && (this.hotdogActive == true)) {
                let h_laser = my.sprite.h_laserGroup.getFirstDead();
                if (h_laser != null) {
                    h_laser.active = true;
                    h_laser.visible = true;
                    h_laser.x = hotdog.x;
                    h_laser.y = hotdog.y - (hotdog.displayHeight/2);
                    h_laser.setScale(1);
                    this.h_laserCooldownCounter = this.h_laserCooldown;
                }
            }
        }


        // check for bullet going offscreen
        for (let laser of my.sprite.bulletGroup.getChildren()) {
            if (laser.y > 540) {
                laser.active = false;
                laser.visible = false;
            }
        }

        for (let missile of my.sprite.missileGroup.getChildren()) {
            if (missile.y < 0) {
                missile.active = false;
                missile.visible = false;
            }
        }
        for (let rocket of my.sprite.rocketGroup.getChildren()) {
            if (rocket.y < 0) {
                rocket.active = false;
                rocket.visible = false;
            }
        }

        for (let h_laser of my.sprite.h_laserGroup.getChildren()) {
            if (h_laser.y < 0) {
                h_laser.active = false;
                h_laser.visible = false;
            }
        }

        for (let drop of my.sprite.dropGroup.getChildren()) {
            if (drop.y > 560) {
                drop.active = false;
                drop.visible = false;
            }
        }
        

        // move bullets
        my.sprite.bulletGroup.incY(this.bulletSpeed*dt);

        my.sprite.missileGroup.incY(-this.missileSpeed*dt);

        my.sprite.rocketGroup.incY(-this.rocketSpeed*dt); //250
        my.sprite.rocketGroup.incX(300*dt); //600

        my.sprite.h_laserGroup.incY(-this.h_laserSpeed*dt);

        my.sprite.dropGroup.incY(this.dropSpeed*dt);
        my.sprite.dropGroup.incX(300*dt);

        //check laser collision
        for (let laser of my.sprite.bulletGroup.getChildren()) {
            for (let prop of my.sprite.propGroup.getChildren()) {
                if (this.collides(prop, laser)) { 
                    this.sound.play("boom1");
                    this.explosion_anim = this.add.sprite(prop.x, prop.y, "explosion1").setScale(0.1).play("explosion_anim");
                    laser.y = 700;
                    prop.x = Math.random()*config.width + 1200;
                    let key = this.propAssets[Phaser.Math.Between(0, 6)];
                    prop.setTexture(key);
                    if (key == 'truck') {
                        prop.y = 542;
                        prop.setScale(2)
                    } else if (key == 'barrier'){
                        prop.y = 557;
                        prop.setScale(2)
                    } else if (key == 'light'){
                        prop.y = 523;
                        prop.setScale(2, 3);
                    } else if (key == 'sign'){
                        prop.y = 517;
                        prop.setScale(3);
                    }else if (key == 'van'){
                        prop.y = 546;
                        prop.setScale(2)
                    } else {
                        prop.y = 552;
                        prop.setScale(2)
                    }
                    this.score += 100;
                    this.scoreText.setText('Score: ' + this.score);
                }
            }
            for (let m_truck of my.sprite.m_truckGroup.getChildren()) {
                if (this.collides(m_truck, laser)) {
                    this.sound.play("boom3");
                    this.explosion_anim = this.add.sprite(m_truck.x, m_truck.y, "explosion1").setScale(0.1).play("explosion_anim");
                    this.tweens.killTweensOf(m_truck); 
                    laser.y = 700;
                    m_truck.active = false;
                    m_truck.visible = false;
                    m_truck.x = -200;
                    this.enemiesDefeated += 1;
                    this.score += 200;
                    this.scoreText.setText('Score: ' + this.score);
                    m_truck.destroy();
                }
            }   
            for (let r_truck of my.sprite.r_truckGroup.getChildren()) {
                if (this.collides(r_truck, laser)) {
                    this.sound.play("boom3");
                    this.explosion_anim = this.add.sprite(r_truck.x, r_truck.y, "explosion1").setScale(0.1).play("explosion_anim");
                    this.tweens.killTweensOf(r_truck); 
                    laser.y = 700;
                    r_truck.active = false;
                    r_truck.visible = false;
                    r_truck.x = -200;
                    this.enemiesDefeated += 1;
                    this.score += 200;
                    this.scoreText.setText('Score: ' + this.score);
                    r_truck.destroy();
                }
            }
            let hotdog = my.sprite.hotdog;
            if (this.collides(hotdog, laser)) {
                    this.sound.play("boom3");
                    laser.y = 700;
                    this.hotdogHealth -= 1;
                    if (this.hotdogHealth == 0) {
                        this.explosion_anim = this.add.sprite(hotdog.x, hotdog.y, "explosion1").setScale(0.1).play("explosion_anim");
                        hotdog.visible = false;
                        this.hotdogActive = false;
                        this.score += 500;
                        this.scoreText.setText('Score: ' + this.score);
                    }
                    this.enemiesDefeated += 1;
                }
        }
        for (let missile of my.sprite.missileGroup.getChildren()) {
            for (let plane of my.sprite.planeGroup.getChildren()) {
                if (this.collides(missile, plane)) {
                    this.sound.play("boom2");
                    this.explosion_anim = this.add.sprite(plane.x, plane.y, "explosion1").setScale(0.1).play("explosion_anim");
                    missile.y = -500;
                    missile.active = false;
                    missile.visible = false;
                    plane.active = false;
                    plane.visible = false;
                    plane.y = -300;
                    this.score += 300;
                    this.scoreText.setText('Score: ' + this.score);
                }
            }
            let ufo = my.sprite.ufo;
            if ((this.collides(missile, ufo)) && (this.hitCooldownCounter < 0)){
                this.sound.play("boom2");
                console.log("hit!");
                missile.y = -100;
                missile.active = false;
                missile.visible = false;
                this.hitCooldown = this.hitCooldownCounter;
                this.playerHealth -= 1;
            }
        }
        for (let rocket of my.sprite.rocketGroup.getChildren()) {
            for (let plane of my.sprite.planeGroup.getChildren()) {
                if (this.collides(rocket, plane)) {
                    this.sound.play("boom2");
                    this.explosion_anim = this.add.sprite(plane.x, plane.y, "explosion1").setScale(0.1).play("explosion_anim");
                    rocket.y = -300;
                    rocket.active = false;
                    rocket.visible = false;
                    plane.active = false;
                    plane.visible = false;
                    plane.y = -200;
                    this.score += 300;
                    this.scoreText.setText('Score: ' + this.score);
                }
            }
            let ufo = my.sprite.ufo;
            if ((this.collides(rocket, ufo)) && (this.hitCooldownCounter < 0)){
                this.sound.play("boom2");
                console.log("hit!");
                rocket.y = -100;
                rocket.active = false;
                rocket.visible = false;
                this.hitCooldown = this.hitCooldownCounter;
                this.playerHealth -= 1;
            }
        }
        for (let drop of my.sprite.dropGroup.getChildren()) {
            let ufo = my.sprite.ufo;
            if ((this.collides(drop, ufo)) && (this.hitCooldownCounter < 0)){
                this.sound.play("boom2");
                console.log("hit!");
                drop.y = 700;
                drop.active = false;
                drop.visible = false;
                this.hitCooldown = this.hitCooldownCounter;
                this.playerHealth -= 1;
            }
        }
        for (let h_laser of my.sprite.h_laserGroup.getChildren()) {
            let ufo = my.sprite.ufo;
            if ((this.collides(h_laser, ufo)) && (this.hitCooldownCounter < 0)){
                this.sound.play("boom2");
                console.log("hit!");
                h_laser.y = -100;
                h_laser.active = false;
                h_laser.visible = false;
                this.hitCooldown = this.hitCooldownCounter;
                this.playerHealth -= 1;
            }
            for (let plane of my.sprite.planeGroup.getChildren()) {
                if (this.collides(h_laser, plane)) {
                    this.sound.play("boom2");
                    this.explosion_anim = this.add.sprite(plane.x, plane.y, "explosion1").setScale(0.1).play("explosion_anim");
                    h_laser.y = -100;
                    h_laser.active = false;
                    h_laser.visible = false;
                    plane.active = false;
                    plane.visible = false;
                    this.score += 300;
                    this.scoreText.setText('Score: ' + this.score);
                }
            }
        }
    }

    move(sprite, dist, dt) {
        if ((sprite.x > 0) && (dist < 0)) { //if trying to move left
            sprite.x += dist * dt;
        } else if ((sprite.x < 1200) && (dist > 0)) { //if trying to move right
            sprite.x += dist * dt;
        }
    }

        // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    position(sprite, x, y) {
        sprite.x = -100;
        sprite.y = 550;
        this.tweens.add({
            targets: sprite,
            x: x,
            y: y,
            duration: 2000,
            ease: 'Power2.easeIn',
            yoyo: false,
            repeat: 0
        });
    }
}