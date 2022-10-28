

var uiControls = new function() {
  this.numberOfBranches = 3;
  this.recursionDepth = 2;
}

var gui = new dat.GUI();
let slider1 = gui.add(uiControls, 'numberOfBranches', 1, 20, 1);
let slider2 = gui.add(uiControls, 'recursionDepth', 0, 5, 1);


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(120);
camera.position.setY(120);
camera.lookAt(0,0,0);
const controls = new OrbitControls( camera, renderer.domElement );

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);
const ambiantLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight,ambiantLight);
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

////////////////////////////////////////////////////////////////

class Makebranch {

  constructor(n){
    this.n = n
    this.h = (n+1)*(n+1)
    const material = new THREE.LineBasicMaterial({color: 0x0000ff});
    const points = [new THREE.Vector3( 0, 0, 0 ),new THREE.Vector3( 0, this.h, 0 )];
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.LineSegments( geometry, material );
    this.b = line
  }
}

function recursive(root,n) {
  let a = []
  for (let i = 0; i < uiControls.numberOfBranches; i++){
    const r = new Makebranch(n)
    a[i] = r.b
    root.b.add(a[i])
    a[i].translateY((r.h)*(i+1))
    
    const b = new Makebranch(n)
    const branch = b.b
    a[i].add(branch)
    branch.rotateY(i * Math.PI/180 * 60)
    branch.rotateZ(Math.PI/180 * 60)
    
    if (b.n != 0) {
      b.n = b.n-1;
      recursive(b,b.n)
    }
  }
}

let r = new Makebranch(uiControls.recursionDepth)
scene.add(r.b)
recursive(r,uiControls.recursionDepth)

////////////////////////////////////////////////////////////////////////
/*
const raycaster = new THREE.Raycaster();
raycaster.params.Line.threshold = 3;
const pointer = new THREE.Vector2();

function onPointerDown( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // update the picking ray with the camera and pointer position
	raycaster.setFromCamera( pointer, camera );
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( r.b.children );
	if (0 < intersects.length) {
    let newbranch = new Makebranch(0)
		intersects[ 0 ].object.add(newbranch.b)
    newbranch.b.position.copy( intersects[ 0 ].point )
    newbranch.b.rotateY(Math.PI/180 * 60)
    newbranch.b.rotateZ(Math.PI/180 * 60)
	}

}
*/
////////////////////////////////////////////////////////////////////////

slider1.onChange(() => {
  scene.remove(r.b)
  r = new Makebranch(uiControls.recursionDepth)
  scene.add(r.b)
  recursive(r,uiControls.recursionDepth)
})

slider2.onChange(() => {
  scene.remove(r.b)
  r = new Makebranch(uiControls.recursionDepth)
  scene.add(r.b)
  recursive(r,uiControls.recursionDepth)
})



const animate = () => {
  requestAnimationFrame( animate );

  ////////////////////////////////////////////////////////////////

  r.b.traverse((object) => {
    object.rotation.y += 0.005
  })

  ////////////////////////////////////////////////////////////////
  
  //window.addEventListener( 'pointerdown', onPointerDown );
  controls.update()
  renderer.render(scene, camera);
}

animate()



