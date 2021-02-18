console.log("Looking for me? {..}");

Array.prototype.forEach.call(document.getElementsByClassName("render-fs"), canvas => {
  fetch(canvas.dataset.fsSrc).then(response => {
    response.text().then(fsSrc => {
      console.log("Initializing fragment shader");
      const startTime = new Date().getTime();
      let width = 720;
      let height = 480;

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
      const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
      const material = new THREE.RawShaderMaterial({
        uniforms: {
          timeSec: {value: (new Date().getTime() - startTime) / 1000},
          canvasSize: {value: new THREE.Vector2(width, height)}
        },
        vertexShader: `
          attribute vec3 position;
          varying vec2 uv;

          void main() {
            gl_Position = vec4(position, 1.0);
            uv = position.xy;
          }
        `,
        fragmentShader: fsSrc
      });
      const plane = new THREE.Mesh(geometry, material);
      scene.add(plane);

      const renderer = new THREE.WebGLRenderer({
        canvas,
        stencil: false,
        depth: false,
        alpha: true,
      });

      function resize() {
        const rect = canvas.getBoundingClientRect();
        width = rect.width;
        console.log(width);
        height = rect.height;
        renderer.setSize(width, height, false);
      }

      function animate() {
        material.uniforms.timeSec.value = (new Date().getTime() - startTime) / 1000;
        material.uniforms.canvasSize.value = new THREE.Vector2(width, height);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      resize();
      window.addEventListener("resize", resize);
      animate();
    });
  });
});
