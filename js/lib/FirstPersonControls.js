THREE.FirstPersonControls = function ( object, domElement ) {

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.movementSpeed = 2.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;

	this.headHeight = 50;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = true;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.lat = 0;
	this.lon = 0;
	this.phi = 0;
	this.theta = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	this.rotateLeft = false;
	this.rotateRight = false;

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		// if ( this.domElement !== document ) {

		// 	this.domElement.focus();

		// }

		//event.preventDefault();
		//event.stopPropagation();

		// if ( this.activeLook ) {

		// 	switch ( event.button ) {

		// 		case 0: this.moveForward = true; break;
		// 		case 2: this.moveBackward = true; break;

		// 	}

		// }

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		//event.preventDefault();
		//event.stopPropagation();

		// if ( this.activeLook ) {

		// 	switch ( event.button ) {

		// 		case 0: this.moveForward = false; break;
		// 		case 2: this.moveBackward = false; break;

		// 	}

		// }

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}

	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();
		console.log("Key pressed:" + event.keyCode);

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

		}

	};

	this.move = function (direction) {
		console.log("Movement changed " + direction);
		switch(direction) {
			case 1: this.moveForward = true; break; //Forward
			case -1: this.moveForward = false; break; //Stop forward

			case 2: this.moveLeft = true; break;
			case -2: this.moveLeft = false; break;

			case 3: this.moveBackward = true; break;
			case -3: this.moveBackward = false; break;

			case 4: this.moveRight = true; break;
			case -4: this.moveRight = false; break;
		}
	}

	this.rotate = function (direction) {
		switch(direction) {
			case 1: this.rotateLeft = true; break;
			case -1: this.rotateLeft = false; break;
			case 2: this.rotateRight = true; break;
			case -2: this.rotateRight = false; break;
		}
	}

	//Event listeners for button movement GUI
	// document.getElementById("button-forward").addEventListener("mousedown", this.move(1));
	// document.getElementById("button-forward").addEventListener("mouseup", this.move(-1));
	// document.getElementById("button-forward").addEventListener("click", alert("btn"));

	this.update = function( delta, model ) {
		//console.log("x " + this.object.position.x + ", y " + this.object.position.y + ", z " + this.object.position.z);

		if ( this.enabled === false ) return;

		if ( this.heightSpeed ) {

			var y = THREE.Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
			var heightDelta = y - this.heightMin;

			this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

		} else {

			this.autoSpeedFactor = 0.0;

		}

		//collision raycast
		// var collisionDistance = 1;
		// var cameraForwardDirection = new THREE.Vector3(0, 0, -1).applyMatrix4(this.object.matrixWorld);
		// var ray = new THREE.Raycaster(this.object.position, cameraForwardDirection, this.object.position, collisionDistance);
		// var intersects = ray.intersectObject(model, true);
		// if (intersects.length > 0) {
		// 	console.log("COLLISION")
		// }

		var actualMoveSpeed = delta * this.movementSpeed;
		//console.log("actualMoveSpeed = " + actualMoveSpeed + ", this.autoSpeedFactor = " + this.autoSpeedFactor + ", this.movementSpeed = " + this.movementSpeed + ", delta = " + delta);
		//new "slide" code for camera movement
		//if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.position = THREE.Vector3( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		if ( this.moveForward ) this.object.translateZ( -1 * actualMoveSpeed );
		if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

		//reset height to default so no vertical movement occurs
		this.object.position.y = this.headHeight;

		if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		//old "fly" code for camera movement
		// if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
		// if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );
    //
		// if ( this.moveLeft ) this.object.translateX( - actualMoveSpeed );
		// if ( this.moveRight ) this.object.translateX( actualMoveSpeed );

		//move on Y plane, disabled because it's not required.
		// if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
		// if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

		//button rotation
		if(this.rotateLeft){
			this.object.rotation.y += 3 * Math.PI / 180;
		}

		if (this.rotateRight) {
			this.object.rotation.y -= 3 * Math.PI / 180;
		}

		//mouse drag rotation
		if(this.mouseDragOn == true){
			var actualLookSpeed = delta * this.lookSpeed;

			if (!this.activeLook) {

				actualLookSpeed = 0;

			}

			var verticalLookRatio = 1;

			if (this.constrainVertical) {

				verticalLookRatio = Math.PI / (this.verticalMax - this.verticalMin);

			}

			this.lon += this.mouseX * actualLookSpeed;
			if (this.lookVertical) this.lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

			this.lat = Math.max(- 85, Math.min(85, this.lat));
			this.phi = THREE.Math.degToRad(90 - this.lat);

			this.theta = THREE.Math.degToRad(this.lon);

			if (this.constrainVertical) {

				this.phi = THREE.Math.mapLinear(this.phi, 0, Math.PI, this.verticalMin, this.verticalMax);

			}

			var targetPosition = this.target,
				position = this.object.position;

			targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
			targetPosition.y = position.y + 100 * Math.cos(this.phi);
			targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

			this.object.lookAt(targetPosition);

		};

	}
	
	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function() {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );
	};

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	this.handleResize();

};
