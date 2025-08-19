(function(){
  const mount = document.getElementById('brain-badge');
  if(!mount) return;

  function ready(fn){ if(document.readyState!=='loading'){fn()} else {document.addEventListener('DOMContentLoaded',fn)} }
  ready(() => {
    if(typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      console.error("Three.js or GLTFLoader library not loaded.");
      return;
    }
    if (mount.clientWidth === 0 || mount.clientHeight === 0) {
      console.error("#brain-badge has no size. Please check your CSS.");
      return;
    }

    const w = mount.clientWidth, h = mount.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w/h, 0.1, 100);
    camera.position.set(0, 0, 3);

    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:false });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x14181d);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 5, 5);
    scene.add(directionalLight);

    const loader = new THREE.GLTFLoader();
    let brainModel;

    loader.load(
      'assets/brain.glb',
      function (gltf) {
        brainModel = gltf.scene;
        brainModel.scale.set(1.5, 1.5, 1.5);
        brainModel.position.y = -0.5;
        scene.add(brainModel);
      },
      undefined,
      function (error) {
        console.error('An error happened while loading the model:', error);
      }
    );

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animate(){
      requestAnimationFrame(animate);
      if (brainModel && !reduceMotion) {
        brainModel.rotation.y += 0.005;
      }
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      const W = mount.clientWidth, H = mount.clientHeight;
       if (W > 0 && H > 0) {
          camera.aspect = W/H;
          camera.updateProjectionMatrix();
          renderer.setSize(W,H);
      }
    });
  });
})();