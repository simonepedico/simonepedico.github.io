/* Isolated presentation layer. No academic content or layout is stored here.
   One shared indexed geometry: points → triangular wireframe → shaded surface.
   Parametric positions morph on the CPU; normals update only when needed. */
(() => {
  'use strict';
  const host=document.querySelector('#scene');
  let renderer,frame=0;
  function fallback(){if(frame)cancelAnimationFrame(frame);frame=0;renderer?.dispose();renderer?.domElement.remove();document.body.classList.remove('webgl-ready');}
  if(!window.THREE){fallback();return;}
  const T=window.THREE,config=window.SITE_DATA.scene;
  const mobile=matchMedia('(max-width: 700px)').matches;
  const low=mobile||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4);
  const segments=low?config.mobileSegments:config.desktopSegments, rings=low?24:42;
  let copyBottom=0,hidden=document.hidden,progress=0,target=0,manual=null,manualY=0;
  let mx=0,my=0,rx=0,ry=0,last=0,elapsed=0,qualityFrames=0,slowFrames=0;
  try{renderer=new T.WebGLRenderer({alpha:true,antialias:!low,powerPreference:'low-power'});}catch{fallback();return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,low?1.25:config.maxPixelRatio));
  renderer.setSize(innerWidth,innerHeight);renderer.setClearColor(0x000000,0);
  host.append(renderer.domElement);document.body.classList.add('webgl-ready');
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(37,innerWidth/innerHeight,.1,60);
  camera.position.z=10;
  const group=new T.Group();scene.add(group);
  const positions=new Float32Array((segments+1)*(rings+1)*3),indices=[];
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));
  for(let i=0;i<segments;i++)for(let j=0;j<rings;j++){const a=i*(rings+1)+j,b=(i+1)*(rings+1)+j;indices.push(a,b,a+1,b,b+1,a+1);}
  geometry.setIndex(indices);
  let previousMorph = -1;
  function deform(morph){
    if (Math.abs(morph - previousMorph) < 0.00015) return;
    previousMorph = morph;
    for(let i=0;i<=segments;i++)for(let j=0;j<=rings;j++){
      const u=i/segments*Math.PI*2,v=j/rings*Math.PI*2;
      const wave=.11*Math.sin(3*u)+morph*.18*Math.cos(5*u);
      const tube=.58+wave, radius=1.46+morph*.16*Math.cos(3*u);
      const twist=v+u+morph*.5*Math.sin(3*u),idx=(i*(rings+1)+j)*3;
      positions[idx]=(radius+tube*Math.cos(twist))*Math.cos(u);
      positions[idx+1]=(radius+tube*Math.cos(twist))*Math.sin(u);
      positions[idx+2]=tube*Math.sin(twist)+.24*Math.sin(3*u)*(1-morph*.5);
    }
    geometry.attributes.position.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
  }
  deform(0);
  const pointsMaterial=new T.PointsMaterial({color:0x9dffed,size:low?.026:.018,transparent:true,opacity:1,depthWrite:false});
  const wireMaterial=new T.MeshBasicMaterial({color:0x64dbca,wireframe:true,transparent:true,opacity:.13,depthWrite:false});
  // Standard physical lighting uses the continuously recomputed surface normals.
  const surfaceMaterial=new T.MeshStandardMaterial({color:0x269c91,metalness:.58,roughness:.29,transparent:true,opacity:0,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1});
  group.add(new T.Mesh(geometry,surfaceMaterial),new T.Mesh(geometry,wireMaterial),new T.Points(geometry,pointsMaterial));
  scene.add(new T.AmbientLight(0x91c5c0,1.7));
  const key=new T.DirectionalLight(0xbaffee,4);key.position.set(3,4,5);scene.add(key);
  const rim=new T.DirectionalLight(0x9e7aff,3);rim.position.set(-4,-1,-2);scene.add(rim);
  function measure(){
    const end=document.querySelector('#publications').offsetTop;
    const copy=document.querySelector('.hero-copy');copyBottom=copy.offsetTop+copy.offsetHeight;
    target=Math.max(0,Math.min(1,scrollY/Math.max(end,1)));
    if(manual!==null&&Math.abs(scrollY-manualY)>innerHeight*.65)manual=null;
  }
  function render(now){
    frame=0;if(hidden)return;
    const dt=Math.min((now-last)/1000||.016,.06);last=now;
    elapsed+=dt;
    const desired=manual===null?target:manual/2;
    progress=T.MathUtils.lerp(progress,desired,1-Math.exp(-dt*5));
    rx=T.MathUtils.lerp(rx,mx,1-Math.exp(-dt*3));ry=T.MathUtils.lerp(ry,my,1-Math.exp(-dt*3));
    deform(progress);
    const isMobile=innerWidth<=700;
    const viewHeight=2*Math.tan(T.MathUtils.degToRad(camera.fov/2))*camera.position.z;
    group.position.x=isMobile?0:viewHeight*camera.aspect*.255;
    // Mobile sculpture sits just below the hero copy and scrolls with it, fading out.
    group.position.y=isMobile?viewHeight*(.5-(copyBottom+190-scrollY)/innerHeight):.13;
    group.scale.setScalar(isMobile?.62:Math.min(1.1,innerWidth/1250));
    group.rotation.set(.62+progress*.7+ry*.12,.24+rx*.18,-.4+progress*.8+elapsed*.045);
    const fade=isMobile?Math.max(0,1-scrollY/650):Math.max(.15,1-target*.8);
    pointsMaterial.opacity=(1-progress*.94)*fade;
    wireMaterial.opacity=(.12+Math.sin(progress*Math.PI)*.7)*fade;
    surfaceMaterial.opacity=Math.max(0,(progress-.4)/.6)*.96*fade;
    renderer.render(scene,camera);
    // Reduce resolution once if sustained frame times are high. No 60fps guarantee.
    if(++qualityFrames<180&&dt>.028)slowFrames++;
    if(qualityFrames===180&&slowFrames>65)renderer.setPixelRatio(Math.min(1,renderer.getPixelRatio()));
    frame=requestAnimationFrame(render);
  }
  function requestRender(){if(!frame&&!hidden){last=performance.now();frame=requestAnimationFrame(render);}}
  addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;}},{passive:true});
  addEventListener('scroll',()=>{measure();requestRender();},{passive:true});
  addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);measure();requestRender();});
  document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden){cancelAnimationFrame(frame);frame=0;}else requestRender();});
  addEventListener('geometry-mode',e=>{manual=e.detail;manualY=0;requestRender();});
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fallback();});
  addEventListener('pagehide',()=>{cancelAnimationFrame(frame);geometry.dispose();pointsMaterial.dispose();wireMaterial.dispose();surfaceMaterial.dispose();renderer.dispose();},{once:true});
  measure();requestRender();
})();
