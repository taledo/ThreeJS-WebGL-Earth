

var Earth = Earth || {};


Earth = function (options) {
	var x;

	//Default options
	this.options = {
		disableZoom: false,
	};


	for (i in options) {
		this.options[i] = options[i];
	}

	this.container = document.querySelectorAll( this.options.container )[0];

	if (!this.options.container) {
		console.error('No "container" element is defined');
		return;
	}

	this.init(options);

};


Earth.prototype.init = function(options) {
	if (!Detector.webgl) {
		Detector.addGetWebGLMessage(this.container);
		return;
	}


	this.allowRotate = (this.options.rotate!=undefined) ? this.options.rotate : true;

	var width  = window.innerWidth,
		height = window.innerHeight;

	// Earth params
	var radius   = 0.5,
		segments = 32,
		rotation = 2.3,
		delta = -100;

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);

		this.camera.position.z = 2;

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(width, height);

		//Lights
		this.light	= new THREE.AmbientLight( 0x888888 )
		this.scene.add( this.light );

		this.light	= new THREE.DirectionalLight( 0xcccccc, 1 )
		this.light.position.set(5,3,5)
		this.scene.add( this.light );

		//Earth
	    this.sphere = this.createEarth(radius, segments);
		this.sphere.rotation.y = rotation; 
		this.sphere.rotation.x = -0.4; 
		this.scene.add( this.sphere );


		//Clouds
	    this.clouds = this.createClouds(radius, segments);
		this.clouds.rotation.y = rotation;
		this.scene.add( this.clouds );


		//Add camera control
		this.controls = new THREE.TrackballControls( this.camera );
		this.container.appendChild( this.renderer.domElement );


		this.render();

};


Earth.prototype.render = function() {

	var self = this;

	this.controls.update();


	if(this.allowRotate) {
		this.sphere.rotation.y += 0.0002; //Spin the earth
		this.clouds.rotation.y += 0.0003; //Spin clouds a fraction faster than the earth
	}
	


	//RequestAnimationFrame
	this.animationFrame = requestAnimationFrame(function(){
		self.render();
	});


	this.renderer.render( this.scene, this.camera);
};





Earth.prototype.createEarth = function(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map:         THREE.ImageUtils.loadTexture('images/earth.jpg'),
			bumpMap:     THREE.ImageUtils.loadTexture('images/high-bump.jpg'),
			bumpScale:   0.1,
			specularMap	: THREE.ImageUtils.loadTexture('images/earthspec1k.jpg'),
			specular:    new THREE.Color('grey')								
		})
	);
};


Earth.prototype.createClouds = function(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius + 0.003, segments, segments),			
		new THREE.MeshPhongMaterial({
			map:         THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
			transparent: true
		})
	);		
};



Earth.prototype.createStars = function(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments), 
		new THREE.MeshBasicMaterial({
			map:  THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'), 
			side: THREE.DoubleSide
		})
	);
};

