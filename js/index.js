const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(30);
camera.position.setY(20);
camera.lookAt(0.,0.,0.);

const geometry = new THREE.TorusGeometry(10,3,16,100);
const material = new THREE.MeshStandardMaterial( { color: 0xFF6347} )
const torus = new THREE.Mesh(geometry, material );

scene.add(torus)

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

const animate = () => {
  requestAnimationFrame( animate );

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  renderer.render(scene, camera);
}

animate()