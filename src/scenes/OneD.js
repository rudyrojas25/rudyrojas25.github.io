class OneD extends Phaser.Scene {
    constructor() {
        super("OneDscene");
        this.my = {sprite: {}};  // Create an object to hold sprite bindings
        this.Akey = null;
        this.Dkey = null;
        this.Spacekey = null;
        this.ufoX = 700;
        this.ufoY = 250;
        //this.laserX = 300;
        //this.laserY = 100;
        //this.emitted = false;

        this.bulletCooldown = 20;        // Number of update() calls to wait before making a new bullet
        this.bulletCooldownCounter = 0;

        this.missileCooldown = 20;        // Number of update() calls to wait before making a new bullet
        this.missileCooldownCounter = 0;

        this.wave = 1;
        this.waveCooldown = 240; //update calls to make before next wave
        this.waveCooldownCounter = 0;
        this.waveCalled = false;
        this.enemiesDefeated = 0;
        this.testFlag = false;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image('bg', 'backgroundEmpty.png');
        this.load.image('ufo', 'shipGreen_manned.png');
        this.load.image('laser', 'laserBlue1.png');
        this.load.image('van', 'van.png');
        this.load.image('ground', 'castleMid.png');
        this.load.image('m_truck', 'truckdark.png');
        this.load.image('missile', 'spaceMissiles_037.png');
        this.load.image('plane1', 'planeGreen1.png');
        this.load.image('plane2', 'planeGreen2.png');
        this.load.image('plane3', 'planeGreen3.png');

    }

    create() {
        //console.log("create\n");

        this.Akey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.Dkey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //let Skey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.bg = this.add.tileSprite(0, 0, 1200, 600, "bg");
        this.bg.setOrigin(0, 0);

        this.ground = this.add.tileSprite(0, 565, 1200, 100, "ground");
        this.ground.setOrigin(0, 0);

        let my = this.my;

        my.sprite.bulletGroup = this.add.group({
            defaultKey: "laser",
            maxSize: 2
            }
        )

        my.sprite.missileGroup = this.add.group({
            defaultKey: "missile",
            maxSize: 5
            }
        )

        my.sprite.propGroup = this.add.group({
            defaultKey: "van",
            maxSize: 8
            }
        )

        my.sprite.planeGroup = this.add.group({
            defaultKey: "plane1",
            maxSize: 2
            }
        )

        my.sprite.m_truckGroup = this.add.group({
            defaultKey: "m_truck",
            maxSize: 8
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

        my.sprite.missileGroup.createMultiple({
            active: false,
            visible: false,
            key: my.sprite.missileGroup.defaultKey,
            repeat: my.sprite.missileGroup.maxSize-1
        });

        my.sprite.propGroup.createMultiple({ //i need to access an array of sprites for the props to randomly choose from
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

        my.sprite.ufo = this.add.sprite(this.ufoX, this.ufoY, "ufo");
        my.sprite.ufo.setScale(0.65);
        //my.sprite.laser = this.add.sprite(this.laserX, this.laserY, "laser");
        //my.sprite.van = this.add.sprite(this.vanX, this.vanY, "van");
        //my.sprite.van.setScale(2);

        this.bulletSpeed = 400;
        this.missileSpeed = 500;

        //for (let laser of my.sprite.bulletGroup.getChildren()) { //this seems to get rid of rogue laser on startup
        //    laser.active = false;
        ///    laser.visible = false;
        //}

        for (let prop of my.sprite.propGroup.getChildren()) {
            //prop.active = true;
            //prop.visible = true;
            prop.x = Math.random()*config.width;
            prop.y = 550;
            prop.setScale(2);
        }

        for (let laser of my.sprite.bulletGroup.getChildren()) {
            laser.x = -500;
        }
    }

    update(time, delta) {
        let dt = delta / 1000;
        let my = this.my;    // create an alias to this.my for readability

        this.bg.tilePositionX += 50 * dt; //0.25
        this.ground.tilePositionX += 75 * dt; //1,25
        
        //may have to rewrite to work with dt
        
        //truck movement
        for (let truck of my.sprite.m_truckGroup.getChildren()) {
            if (truck.x < 1250) {
                truck.x += 25 * dt;
            } else {
                truck.x = -10;
            }
        }

        //plane movement 
        for (let plane of my.sprite.planeGroup.getChildren()) {
            if (plane.x < 1250) {
                plane.x += 125 * dt;
            } else {
                plane.x = Math.random()*config.width - 1200;
            }
        }
        
        //handle randomly appearing props
        for (let prop of my.sprite.propGroup.getChildren()) {
            if (prop.x > 0) {
                prop.x -= 75 * dt;
            } else { //if offscreen
                prop.x = Math.random()*config.width + 1200;
                //also assign new random sprite
            }
        }


        //handle wave spawns
        if ((this.wave == 1) && (this.waveCalled == false)) {
            let m_truck1 = my.sprite.m_truckGroup.getFirstDead()
            m_truck1.active = true;
            let m_truck2 = my.sprite.m_truckGroup.getFirstDead()
            m_truck2.active = true;
            let m_truck3 = my.sprite.m_truckGroup.getFirstDead()
            m_truck3.active = true;

            let plane1 = my.sprite.planeGroup.getFirstDead()
            plane1.active = true;

            //console.log(my.sprite.m_truckGroup.getTotalUsed());

            m_truck1.visible = true;
            this.position(m_truck1, 200, 550);
            m_truck1.setScale(2);

            m_truck2.visible = true;
            this.position(m_truck2, 600, 550);
            m_truck2.setScale(2);

            m_truck3.visible = true;
            this.position(m_truck3, 1000, 550);
            m_truck3.setScale(2);

            plane1.visible = true;
            plane1.x = -200;
            plane1.y = 80;
            plane1.setScale(1, 0.5);

            this.waveCalled = true;
        } else if ((this.wave == 2) && (this.waveCalled == false)) {
            let m_truck1 = my.sprite.m_truckGroup.getFirstDead()
            m_truck1.active = true;
            let m_truck2 = my.sprite.m_truckGroup.getFirstDead()
            m_truck2.active = true;
            let m_truck3 = my.sprite.m_truckGroup.getFirstDead()
            m_truck3.active = true;
            let m_truck4 = my.sprite.m_truckGroup.getFirstDead()
            m_truck4.active = true;

            let plane1 = my.sprite.planeGroup.getFirstDead()
            plane1.active = true;

            m_truck1.visible = true;
            this.position(m_truck1, 200, 550);
            m_truck1.setScale(2);

            m_truck2.visible = true;
            this.position(m_truck2, 500, 550);
            m_truck2.setScale(2);

            m_truck3.visible = true;
            this.position(m_truck3, 800, 550);
            m_truck3.setScale(2);

            m_truck4.visible = true;
            this.position(m_truck4, 1100, 550);
            m_truck4.setScale(2);

            plane1.visible = true;
            plane1.x = -200;
            plane1.y = 80;
            plane1.setScale(1, 0.5);

            this.waveCalled = true;
        } else if ((this.wave == 3) && (this.waveCalled == false)){
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
            this.position(m_truck4, 1100, 550);
            m_truck5.setScale(2);

            plane1.visible = true;
            plane1.x = -200;
            plane1.y = 80;
            plane1.setScale(1, 0.5);

            this.waveCalled = true;
        }

            
        

        //when all enemies defeated, this.wave += 1;
        if ((this.enemiesDefeated >= 3) && (this.testFlag == false)) { //short term fix for bugged +2 at start of game
            this.wave = 2;
            this.waveCalled = false;
            this.testFlag = true;
        } else if ((this.enemiesDefeated >= 6) && (this.testFlag == false)) {
            this.wave = 3;
            this.waveCalled = false;
            this.testFlag = true;
        }
        
        //else if ... next wave conditions

        this.bulletCooldownCounter--;
        this.missileCooldownCounter--;

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
            let ufo = my.sprite.ufo
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
                
                //console.log("laser time"); //be sure to implement a cooldown!!
            }
        }


        // check for bullet going offscreen
        for (let laser of my.sprite.bulletGroup.getChildren()) {
            if (laser.y > 525) {
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

        

        // move bullets
        my.sprite.bulletGroup.incY(this.bulletSpeed*dt);
        my.sprite.missileGroup.incY(-this.missileSpeed*dt);

        //check laser collision
        for (let laser of my.sprite.bulletGroup.getChildren()) { //I may be able to use another for loop inside
            //for(let enemy of my.sprite.enemies.getChildren())
            for (let prop of my.sprite.propGroup.getChildren()) {
                if (this.collides(prop, laser)) { //collides(enemy, laser) maybe it works??
                laser.y = 700;
                prop.x = Math.random()*config.width + 1200;
                prop.y = 550;
                //also assign new random sprite
                }
            }
            for (let m_truck of my.sprite.m_truckGroup.getChildren()) {
                if (this.collides(m_truck, laser)) {
                    this.tweens.killTweensOf(m_truck); 
                    laser.y = 700;
                    m_truck.active = false;
                    m_truck.visible = false;
                    m_truck.x = -200;
                    this.enemiesDefeated += 1;
                    m_truck.destroy();
                }
            }   
        }
        //console.log("laserX:" + laser.x);
        //console.log("laserY:" + laser.y);
        //console.log("truckX:" + m_truck.x);
        //console.log("truckY:" + m_truck.y);
        //console.log(my.sprite.m_truckGroup.getTotalUsed());
        //console.log(this.enemiesDefeated);
        //console.log(m_truck.active);
        //console.log(m_truck.visible);

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
            ease: 'Sine.easeInOut',
            yoyo: false,
            repeat: 0
        });
    }
}