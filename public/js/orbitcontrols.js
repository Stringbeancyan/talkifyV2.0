/**
 * @fileOverview OrbitControls for Three.js
 * @see https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/OrbitControls.js
 */

( function () {

    var OrbitControls = function ( object, domElement ) {

        this.object = object;
        this.domElement = ( domElement !== undefined ) ? domElement : document;

        this.enabled = true;

        this.target = new THREE.Vector3();

        this.center = new THREE.Vector3();
        this.position = new THREE.Vector3();

        this.spherical = new THREE.Spherical();
        this.sphericalDelta = new THREE.Spherical();

        this.scale = 1;
        this.zoomChanged = false;

        this.enableDamping = false;
        this.dampingFactor = 0.25;
        this.enableZoom = true;
        this.zoomSpeed = 1.0;
        this.enableRotate = true;
        this.rotateSpeed = 1.0;
        this.enablePan = true;
        this.panSpeed = 1.0;
        this.screenSpacePanning = true;
        this.keyPanSpeed = 7.0;

        this.autoRotate = false;
        this.autoRotateSpeed = 2.0;

        this.keys = {
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            BOTTOM: 40
        };

        this.touch = {
            one: true,
            two: false
        };

        this.update = function () {

            if ( this.enabled === false ) return;

            var offset = new THREE.Vector3();

            // so camera.up is the orbit up vector
            var quat = new THREE.Quaternion().setFromUnitVectors( this.object.up, new THREE.Vector3( 0, 1, 0 ) );
            var lastPosition = new THREE.Vector3();
            var lastQuaternion = new THREE.Quaternion();

            var position = this.object.position;

            // angle between object and target
            var targetDistance = this.spherical.radius;

            // only check the target if it changed
            if ( !this.zoomChanged && ( this.object.position.distanceToSquared( lastPosition ) > 0 || this.object.rotation.equals( lastQuaternion ) === false ) ) {

                this.spherical.setFromVector3( position.sub( this.target ) );
                this.spherical.radius = targetDistance;

                // rotate the camera to match the rotation of the target
                this.object.lookAt( this.target );

                lastPosition.copy( this.object.position );
                lastQuaternion.copy( this.object.rotation );
            }

            if ( this.enableDamping === true ) {
                this.sphericalDelta.theta *= ( 1 - this.dampingFactor );
                this.sphericalDelta.phi *= ( 1 - this.dampingFactor );
            }

            // update the camera position and rotation
            this.spherical.theta += this.sphericalDelta.theta;
            this.spherical.phi += this.sphericalDelta.phi;

            this.spherical.makeSafe();
            this.spherical.radius *= this.scale;

            this.object.position.setFromSpherical( this.spherical );

            this.object.lookAt( this.target );

            if ( this.zoomChanged ) {
                this.object.position.sub( this.target );
                this.object.position.multiplyScalar( this.scale );
                this.object.position.add( this.target );
                this.zoomChanged = false;
            }

            if ( this.enableDamping === true ) {
                this.sphericalDelta.theta *= ( 1 - this.dampingFactor );
                this.sphericalDelta.phi *= ( 1 - this.dampingFactor );
            }

            this.object.updateMatrix();
            this.object.updateMatrixWorld( true );

        };

        // additional methods like `rotate`, `zoom`, `pan`, etc. should be implemented here

    };

    if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = OrbitControls;
    }

} )();