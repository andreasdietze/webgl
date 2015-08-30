
/* global VecMath, MathHelper, result */

"use strict";

// Globals 
var // GL
    gl = null, 
    // Rotation for world objects
    angle = 0.0,
    // Texture
    tex = null, 
    // Instance: access to Renderer from inside other functions
    that = this, 
    // View matrix (camera)
    viewMat = VecMath.SFMatrix4f.identity(),
    // Matrix for perspective or orthogonal projection
    projectionMat = VecMath.SFMatrix4f.identity(); 
    
// GL Extensions
var // unsigned int indices GL extension
    INDEX_UINT_EXT = null,
    // Floating point GL extension
    FP_TEXTURES_EXT = null,
    FPL_TEXTURES_EXT = null;

// Gametime
var // Framecount
    count = 0,
    // Frames per second
    fps = 0,
    // Time since last update for fps (seperate)
    lastTime,
    // Time since last update
    lastFrameTime = new Date().getTime(),
    // Delta time
    dT = null;

// Camera
var // Camera position
    camPos = new VecMath.SFVec3f(0.0, 0.0, 0.0),
    // Camera mode:
    // - 0: First person view
    // - 1: Orbit camera
    cameraMode = 0,
    // Movement
    forward = false,
    strafe = false,
    // Zoom
    zoom = 1.0,
    // Switch scene
    scene = 0;
    
    

// Controls Mouse
var // Mouse pressed ?
    mouseDown = false,
    // Last mouse position
    lastMouseX = null, lastMouseY = null,
    // mouse position
    mouseX = null, mouseY = null;
    
// Controls KB
var // Array for multiple key press
    currentlyPressedKeys = {},
    // Pitch (up/down)
    pitch = 0, pitchRate = 0,
    // Yaw (left/right)
    yaw = 0, yawRate = 0,
    // Move direction 
    xPos = 0, yPos = 0.4, zPos = 0,
    // Move speed
    speed = 0;

// Lighting properties
var // lightindex:
    // - 0: Directional light
    // - 1: Point light
    // - 2: Spot light
    // - 3: Head light
    lighting = 0,
    // Shininess -> Refelection power
    shininess = 128.0,
    // Diffuse light color intensity
    intDiff = 1.0,
    // Specular light color intensity
    intSpec = 1.0;

// Deform properties
var // Deform intensity
    intDef = 0.05,
    // Deform amount
    amtDef = 4.0;

// Blur properties
var // Blur technique:
    // - 0: Horizontal blur
    // - 1: Vertical blur
    // - 2: H/V combined passes blur
    // - 3: H/V single pass 
    // - 4: Radial blur
    blurTechnique = 0,
    // Amount of iterations at startup
    blurIterations = 5,
    // De/Activate post processing
    blurActive = false;

// Render target program
var // VS 
    vertexShader = null,
    // FS
    fragmentShader = null,
    // SP
    shaderProgram = null,
    // MD
    meshData = null,
    // Size of the render target
    size = 1024,
    // Frame buffer
    fbo = null,
    // Render buffer
    rb = null,
    // Frame buffer texture 
    fbTex = null;

// Scenegraph
var drawables = new Array();

// make sure browser knows requestAnimationFrame method
if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {
        return  window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback, element) {
                    window.setTimeout(callback, 16);
                };
    })();
}

// Create meshHandler object
var mh = new MeshHandler();

// ------------------------------------------------------ //
// ----------------- Init colorDrawables ---------------- //
// ------------------------------------------------------ //
// Create secondPointer
var secondPointer = new Drawable();

// Create minutePointer
var minutePointer = new Drawable();

// Create hourPointer
var hourPointer = new Drawable();

// Create clockTex
var clockTex = new Drawable();

// Create box
var box = new Drawable();

// ------------------------------------------------------ //
//  -------------------- ColorScenes -------------------- // 
// ------------------------------------------------------ //

var sceneOne;  // TODO Refactor shaderobject
//var orientationScene;

// ------------------------------------------------------ //
// --------------- Init texturedDrawables --------------- //
// ------------------------------------------------------ //

// Create textured house
var houseTex = new Drawable();

// Create textured Box
var boxTex = new Drawable();

// Textured box
var boxTex2 = new Drawable();

// Textured sphere
var sphereTex = new Drawable();

// Textured sphere
var sphereTex2 = new Drawable();

// ------------------------------------------------------ //
// --------------- Init lightinhgDrawables -------------- //
// ------------------------------------------------------ //

// Test
//var boxDiffuseShader = new DiffuseLightingShader();
//var boxDiffuse = new LightingTextureDrawable();

// Diffuse-Cow
var objCow = new Drawable("difCow", 0);

// Diffuse-Spec-Cow
var objCowSpec = new Drawable("difSpecCow", 1); 

// Diffuse-Spec-Sphere
var lightSphere = new Drawable("lightSphere", 2);

// Diffuse-Spec-Tex-Sphere
var lightTexSphere = new Drawable("lightTexSphere", 3);

// Diffuse-Spec-(Tex)-A10
var a10 = new Drawable("asteroid", 4);

// Bumped quad
var bumpQuad = new Drawable(),
    bumpQuad1 = new Drawable();
var bumpSphere = new Drawable(),
    bumpSphere1 = new Drawable();
var bumpBox = new Drawable();
var bumpSphere2 = new Drawable();


// Deform-objects
var defWaveSphere = new Drawable();
var defWavePlane = new Drawable();

// MAIN ------------------------------------------------------------------------
function main() {
    console.log("Init program - main call");
    // Get canvas
    var canvas = document.getElementById("glCanvas");
    // Set context attributes
    var ctxAttribs = {alpha: true, depth: true, antialias: true, premultipliedAlpha: false};
    // Create GL-Oject 
    gl = canvas.getContext("webgl", ctxAttribs) ||
            canvas.getContext("experimental-webgl", ctxAttribs);
    
    // check for 32 bit indices extension (not avail. on all platforms)
    INDEX_UINT_EXT = gl.getExtension("OES_element_index_uint");
    console.log((INDEX_UINT_EXT ? "" : "No ") + "32 bit indices available.");

    // check for floating point texture extension (not avail. on all platforms)
    FP_TEXTURES_EXT  = gl.getExtension("OES_texture_float");
    FPL_TEXTURES_EXT = gl.getExtension("OES_texture_float_linear");
    console.log((FP_TEXTURES_EXT  ? "" : "No ") + "FLOAT textures available " +
                (FPL_TEXTURES_EXT ? "with" : "without") + " linear filtering.");
    
    // Key events for multiple key array
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    
    // Set values for gui properties
    setGUIValues();
    
    // Init projection
    initProjection();

    // Initialize texture
    //initTexture();
    
    // Initialize all drawables
    initializeObjects();
           
    // --------- Rendertarget ---------
    // Init VS / FS
    initShaders();

    // Setup qaud for render target
    setupMeshData();         
    
    // Initialize the render target
    initRT(gl);         
    // --------- Rendertarget ---------
    
    // Show info about the objects in the scene
    getSceneGraphInfo();
                                 
    // Draw-loop
    (function mainLoop() {

        // Transformation and controls (like update)
        animate(canvas);

        // Clear backBuffer
        clearBackBuffer(canvas);
        
        // Draw all objects
        drawAll();
        
        // Draw inside the render target
        draw(canvas);
        
        // Renderloop 
        window.requestAnimationFrame(mainLoop);
    })();
}

function initializeObjects(){
    // Colored -------------------------------------------
    // Setup meshData for secondPointer
    mh.setupSecPointer();
    secondPointer.initGL(gl, mh.vss, mh.fss);
    secondPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.tangents,
            mh.mesh.indices,
            mh.mesh.trans);

    // Setup meshData for secondPointer
    mh.setupMinPointer();
    minutePointer.initGL(gl, mh.vss, mh.fss);
    minutePointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.tangents,
            mh.mesh.indices,
            mh.mesh.trans);

    // Setup meshData for hourPointer
    mh.setupHourPointer();
    hourPointer.initGL(gl, mh.vss, mh.fss);
    hourPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.tangents,
            mh.mesh.indices,
            mh.mesh.trans);
            
    // Setup meshDate for clockTex  
    mh.setupQuad();
    clockTex.initGL(gl, mh.vss, mh.fss);
    clockTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    clockTex.initTexture("models/clock.png");

    mh.setupBox(0.25);
    box.initGL(gl, mh.vss, mh.fss);
    box.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.tangents,
            mh.mesh.indices,
            mh.mesh.trans);    
            
    sceneOne = new MultipleObjects(gl, mh);
    //orientationScene = new OrientationScene(gl, mh);
            
    // Textured --------------------------------------------
    mh.setupTexturedHouse();
    houseTex.initGL(gl, mh.vss, mh.fss);
    houseTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    houseTex.initTexture("models/tex2.png");
    
    mh.setupTexturedBox6f(0.25);
    boxTex.initGL(gl, mh.vss, mh.fss);
    boxTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    boxTex.initTexture("models/tex2.png");
    
    mh.setupTexturedBox6f(0.25);
    boxTex2.initGL(gl, mh.vss, mh.fss);
    boxTex2.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    boxTex2.initTexture("models/crazyCube.png");
    
    mh.setupTexturedSphere(0.4);
    sphereTex.initGL(gl, mh.vss, mh.fss);
    sphereTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    sphereTex.initTexture("models/tex2.png");
    
    mh.setupTexturedSphere(0.4);
    sphereTex2.initGL(gl, mh.vss, mh.fss);
    sphereTex2.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    sphereTex2.initTexture("models/crazyCube.png");
    
    // Lighting ---------------------------------------
    
  /* mh.setupDiffusedBox();
    boxDiffuseShader.initGL(gl);
    boxDiffuseShader.initShader(mh.vss, mh.fss);
    boxDiffuse.initGL(gl);
    boxDiffuse.setBufferData(mh.mesh.vertices,
            //mh.mesh.col, // auskommentieren
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    boxDiffuse.initTexture("models/crazyCube.png");*/
    
    mh.loadOBJ("models/cow.obj", 0.175);
    objCow.initGL(gl, mh.vss, mh.fss);
    objCow.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
                         mh.mesh.tangents,
                         mh.mesh.indices,
                         mh.mesh.trans);
    // Add to scenegraph
    drawables.push(objCow);                     
                         
    mh.loadOBJSpec("models/cow.obj", 0.175, 0);
    objCowSpec.initGL(gl, mh.vss, mh.fss);
    objCowSpec.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
                         mh.mesh.tangents,
                         mh.mesh.indices,
                         mh.mesh.trans); 
    // Add to scenegraph
    drawables.push(objCowSpec);  

    mh.loadOBJSpec("models/sphere.obj", 0.425, 0);
    lightSphere.initGL(gl, mh.vss, mh.fss);
    lightSphere.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
                         mh.mesh.tangents,
                         mh.mesh.indices,
                         mh.mesh.trans); 
    // Add to scenegraph
    drawables.push(lightSphere); 
    
    var light0 = new Light(),
        light1 = new Light();
    
    
    mh.setupTexturedLightSphere(0.4);
    lightTexSphere.initGL(gl, mh.vss, mh.fss);
    lightTexSphere.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    lightTexSphere.initTexture("models/tex2.png");
    lightTexSphere.lights.push(light0);
    lightTexSphere.lights.push(light1);
    
     // Add to scenegraph
    drawables.push(lightTexSphere);   

    mh.loadOBJSpec("models/A10/A-10_Thunderbolt_II.obj", 0.2, 0);
    a10.initGL(gl, mh.vss, mh.fss);
    a10.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
                         mh.mesh.tangents,
                         mh.mesh.indices,
                         mh.mesh.trans); 
    //a10.initTexture("models/A10/A-10_Thunderbolt_II_P01.png"); 
     // Add to scenegraph
    drawables.push(a10);
    
    // Deform --------------------------------------- 
    mh.loadOBJSpec("models/sphere.obj", 0.425, 1);
    defWaveSphere.initGL(gl, mh.vss, mh.fss);
    defWaveSphere.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
                         mh.mesh.tangents,
                         mh.mesh.indices,
                         mh.mesh.trans); 
    // Add to scenegraph
    drawables.push(defWaveSphere); 
    
    mh.loadOBJSpec("models/plane16x16.obj", 0.425, 0);
    defWavePlane.initGL(gl, mh.vss, mh.fss);
    defWavePlane.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
                         mh.mesh.tangents,
                         mh.mesh.indices,
                         mh.mesh.trans);
    // Add to scenegraph
    drawables.push(defWavePlane); 
    
    // Bumped quad
    //mh.setupTexturedLightSphere(0.4);
    mh.setupQuad();
    bumpQuad.initGL(gl, mh.vss, mh.fss);
    bumpQuad.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    bumpQuad.initTexture("models/BrickDiff0.jpg");
    bumpQuad.initBumpMap("models/BrickBump0.jpg");
    
    mh.setupQuad();
    bumpQuad1.initGL(gl, mh.vss, mh.fss);
    bumpQuad1.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    bumpQuad1.initTexture("models/BrickDiff.jpg");
    bumpQuad1.initBumpMap("models/BrickBump.jpg");
    
    mh.setupTangetSphere(0.4, 1);
    bumpSphere.initGL(gl, mh.vss, mh.fss);
    bumpSphere.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    bumpSphere.initTexture("models/BrickDiff0.jpg");
    bumpSphere.initBumpMap("models/BrickBump0.jpg");
    
    mh.setupTangetSphere(0.4, 1);
    bumpSphere1.initGL(gl, mh.vss, mh.fss);
    bumpSphere1.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    bumpSphere1.initTexture("models/BrickDiff.jpg");
    bumpSphere1.initBumpMap("models/BrickBump.jpg");
    
    mh.setupBumpBox();
    bumpBox.initGL(gl, mh.vss, mh.fss);
    bumpBox.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    bumpBox.initTexture("models/BrickDiff0.jpg");
    bumpBox.initBumpMap("models/BrickBump0.jpg");
    
    mh.setupTangetSphere(0.4, 0);
    bumpSphere2.initGL(gl, mh.vss, mh.fss);
    bumpSphere2.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.tangents,
             mh.mesh.indices,
             mh.mesh.trans);
    bumpSphere2.initTexture("models/BrickDiff0.jpg");
    bumpSphere2.initBumpMap("models/BrickBump0.jpg");
}

function setGUIValues(){
    // Lighting
    document.getElementById("intDiffLabel").innerHTML = "Diff intensity: " + intDiff;
    document.getElementById("intSpecLabel").innerHTML = "Spec intensity: " + intSpec;
    document.getElementById("shininessLabel").innerHTML = "Shininess: " + shininess;
    
    // Deform
    document.getElementById("deformIntensityLabel").innerHTML = "Intensity: " + intDef;
    document.getElementById("deformAmountLabel").innerHTML = "Amount: " + amtDef;
    
    // Blur
    document.getElementById("blurIterationsLabel").innerHTML = "Iterations: " + blurIterations;
}

// Clear color, depth and set viewport
function clearBackBuffer(canvas) {
    // Clear color to black
    gl.clearColor(0.3, 0.5, 0.2, 0.6); // 0.3 0.5 0.2 0.3/6
    // Clear color or depth bit
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Clear depth to max (1.0) min(0.0)
    gl.clearDepth(1.0);
    // Init viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Enable depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // Cullmode
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    // Blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // gl.ONE)
    //gl.colorMask(true, true, true, false);  ???
}

// Update ----------------------------------------------------------------------
function animate(canvas) {
    var currentTime = Date.now(); //new Date().getTime();
    dT = currentTime - lastFrameTime;
    dT /= 1000;
    //console.log("DeltaTime: " + dT.toFixed(2));

    if (!lastTime) {
        lastTime = new Date().getTime();
        count = 1;
    }
    else
    {
        var curTime = new Date().getTime();
        var dif = curTime - lastTime;
        if (dif > 1000) {
            lastTime = curTime;
            fps = count;
            //console.log("FPS: " + fps);
            count = 0;
        }
        else {
            count++;
        }
    }
    
    // Handle user input
    updateCamera(dT);
    handleKeyboard(window, dT);    // window
    handleKeys();
    
    
    updateClock();
    updateColorScene();
    updateLightScene();
    updateDeformScene();
    updateBumpScene();

    lastFrameTime = currentTime;
}

function updateClock(){
    // Update second pointer       
    secondPointer.md.transformMatrix = VecMath.SFMatrix4f.identity();
    secondPointer.md.transformMatrix = secondPointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.2, 2.2, 0.0)));
    secondPointer.md.transformMatrix = secondPointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(-6 * new Date().getSeconds())));
    secondPointer.md.transformMatrix = secondPointer.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2.25, 2.25, 2.25))); 

    // Update minute pointer
    minutePointer.md.transformMatrix = VecMath.SFMatrix4f.identity();
    minutePointer.md.transformMatrix = minutePointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.2, 2.2, 0.0)));
    minutePointer.md.transformMatrix = minutePointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(-6 * new Date().getMinutes())));
    minutePointer.md.transformMatrix = minutePointer.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2.25, 2.25, 2.25))); 
   
    // Update hours 
    var hours = new Date().getHours();
    if (hours > 12)
        hours -= 12;

    // Update hour pointer
    hourPointer.md.transformMatrix = VecMath.SFMatrix4f.identity();
    hourPointer.md.transformMatrix = hourPointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.2, 2.2, 0.0)));
    hourPointer.md.transformMatrix = hourPointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(-30 * hours)));
    hourPointer.md.transformMatrix = hourPointer.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2.25, 2.25, 2.25))); 
    
    // Update clock texture
    clockTex.md.transformMatrix = VecMath.SFMatrix4f.identity();
    clockTex.md.transformMatrix = clockTex.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.2, 2.2, -0.01)));
    clockTex.md.transformMatrix = clockTex.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(90)));
    clockTex.md.transformMatrix = clockTex.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
    
}

function updateColorScene(){
    box.md.transformMatrix._03 = -11;
    box.md.transformMatrix._13 = 2.0;
    box.md.transformMatrix._23 = 0.0;
    var rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    box.md.transformMatrix = box.md.transformMatrix.mult(rotMat);
    
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    sceneOne.update(rotMat);
    
    // Textured -------------------------------------------------------------------
    angle -= 1; //* dT;
    sphereTex.md.transformMatrix._03 = -14;
    sphereTex.md.transformMatrix._13 = 0.0;
    sphereTex.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    sphereTex.md.transformMatrix = sphereTex.md.transformMatrix.mult(rotMat);
    
    sphereTex2.md.transformMatrix._03 = -13;
    sphereTex2.md.transformMatrix._13 = 0.0;
    sphereTex2.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    sphereTex2.md.transformMatrix = sphereTex2.md.transformMatrix.mult(rotMat);
    
    houseTex.md.transformMatrix._03 = -11.0;
    houseTex.md.transformMatrix._13 = 0.5;
    houseTex.md.transformMatrix._23 = 0.0;
    
    
    boxTex.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxTex.md.transformMatrix = boxTex.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-8, 0.0, 0.0)));
    boxTex.md.transformMatrix = boxTex.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationX(MathHelper.DTR(angle)));
    boxTex.md.transformMatrix = boxTex.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
    
    
    boxTex2.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-9, 0.0, 0.0)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
}

function updateLightScene(){
  /*  boxDiffuse.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-4.5, 0.0, 0.0)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); */
 
    objCow.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.0, 0.0, 0.0)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    objCowSpec.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, 0.0, 0.0)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    lightSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    lightSphere.md.transformMatrix = lightSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(2.0, 0.0, 0.0)));
    lightSphere.md.transformMatrix = lightSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(0.0)));
    lightSphere.md.transformMatrix = lightSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1,1,1))); 
   
    lightTexSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    lightTexSphere.md.transformMatrix = lightTexSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(4.0, 0.0, 0.0)));
    lightTexSphere.md.transformMatrix = lightTexSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    lightTexSphere.md.transformMatrix = lightTexSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1)));
   
    a10.md.transformMatrix = VecMath.SFMatrix4f.identity();
    a10.md.transformMatrix = a10.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(8.0, 0.5, 0.0)));
    a10.md.transformMatrix = a10.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    a10.md.transformMatrix = a10.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
}

// DEFORM 
function updateDeformScene(){
    defWaveSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    defWaveSphere.md.transformMatrix = defWaveSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(20.0, 0.0, 0.0)));
    defWaveSphere.md.transformMatrix = defWaveSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(3, 3, 3))); 
   
    defWavePlane.md.transformMatrix = VecMath.SFMatrix4f.identity();
    defWavePlane.md.transformMatrix = defWavePlane.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(20.0, -2.0, 0.0)));
    defWavePlane.md.transformMatrix = defWavePlane.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2, 1, 2))); 
    
}

// BUMP
function updateBumpScene(){
    bumpQuad.md.transformMatrix = VecMath.SFMatrix4f.identity();
    bumpQuad.md.transformMatrix = bumpQuad.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(36.0, 0.0, 0.0)));
    bumpQuad.md.transformMatrix = bumpQuad.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(90.0)));
    bumpQuad.md.transformMatrix = bumpQuad.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2, 2, 2))); 
   
    bumpQuad1.md.transformMatrix = VecMath.SFMatrix4f.identity();
    bumpQuad1.md.transformMatrix = bumpQuad1.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(39.0, 0.0, 0.0)));
    bumpQuad1.md.transformMatrix = bumpQuad1.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(90.0)));
    bumpQuad1.md.transformMatrix = bumpQuad1.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2, 2, 2))); 
   
    bumpSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    bumpSphere.md.transformMatrix = bumpSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(33.0, 0.0, 0.0)));
    bumpSphere.md.transformMatrix = bumpSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(0.0)));
    bumpSphere.md.transformMatrix = bumpSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1,1,1))); 
   
    bumpSphere1.md.transformMatrix = VecMath.SFMatrix4f.identity();
    bumpSphere1.md.transformMatrix = bumpSphere1.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(34.0, 0.0, 0.0)));
    bumpSphere1.md.transformMatrix = bumpSphere1.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(0.0)));
    bumpSphere1.md.transformMatrix = bumpSphere1.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1,1,1))); 
   
    bumpBox.md.transformMatrix = VecMath.SFMatrix4f.identity();
    bumpBox.md.transformMatrix = bumpBox.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(42.0, 0.0, 0.0)));
    bumpBox.md.transformMatrix = bumpBox.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(0.0)));
    bumpBox.md.transformMatrix = bumpBox.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1,1,1))); 
   
    bumpSphere2.md.transformMatrix = VecMath.SFMatrix4f.identity();
    bumpSphere2.md.transformMatrix = bumpSphere2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(44.0, 0.0, 0.0)));
    bumpSphere2.md.transformMatrix = bumpSphere2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(0.0)));
    bumpSphere2.md.transformMatrix = bumpSphere2.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1,1,1))); 
    
}

// Draw main scene
function drawAll(){
    gl.viewport(0, 0, 1024, 1024);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Colored
    secondPointer.draw(secondPointer.shader.sp, viewMat, projectionMat, lighting);
    minutePointer.draw(minutePointer.shader.sp, viewMat, projectionMat, lighting);
    hourPointer.draw(hourPointer.shader.sp, viewMat, projectionMat, lighting);
    clockTex.draw(clockTex.shader.sp, viewMat, projectionMat, lighting);
    box.draw(box.shader.sp, viewMat, projectionMat, lighting);

    // Color scenes
    sceneOne.draw(viewMat, projectionMat);
    //orientationScene.draw(boxShader, viewMat, projectionMat);

    // Textured
    houseTex.draw(houseTex.shader.sp, viewMat, projectionMat, lighting);
    boxTex.draw(boxTex.shader.sp, viewMat, projectionMat, lighting);
    boxTex2.draw(boxTex2.shader.sp, viewMat, projectionMat, lighting);
    sphereTex.draw(sphereTex.shader.sp, viewMat, projectionMat, lighting);
    sphereTex2.draw(sphereTex2.shader.sp, viewMat, projectionMat, lighting);
    // Lighting
    //boxDiffuse.draw(boxDiffuseShader.sp, viewMat, projectionMat);

    // TODO: implement shaderobject into drawable
    //for(var i = 0; i < drawables.length; i++)
        //drawables[i].draw(objCowShaderSpec.sp, viewMat, projectionMat, lighting, shininess);

    objCow.draw(objCow.shader.sp, viewMat, projectionMat, lighting);

    objCowSpec.draw(objCowSpec.shader.sp, viewMat, projectionMat, lighting);
    objCowSpec.light.lightColor = getColor();
    objCowSpec.light.specularColor = getSpecColor();
    objCowSpec.light.ambientColor = getAmbiColor();
    objCowSpec.light.shininess = shininess;
    objCowSpec.light.diffIntensity = intDiff;
    objCowSpec.light.specIntensity = intSpec;
    objCowSpec.light.position = new VecMath.SFVec4f(0.0, 0.0, 1.0, 0.0);
    objCowSpec.light.direction = new VecMath.SFVec4f(-1.0, 0.0, -1.0, 0.0);


    lightSphere.draw(lightSphere.shader.sp, viewMat, projectionMat, lighting);
    lightSphere.light.lightColor = getColor();
    lightSphere.light.specularColor = getSpecColor();
    lightSphere.light.ambientColor = getAmbiColor();
    lightSphere.light.shininess = shininess;
    lightSphere.light.diffIntensity = intDiff;
    lightSphere.light.specIntensity = intSpec;
    lightSphere.light.position = new VecMath.SFVec4f(0.0, 0.0, 1.0, 0.0);
    lightSphere.light.direction = new VecMath.SFVec4f(-1.0, 0.0, -1.0, 0.0);

    lightSphere.light0.lightColor = getColor();
    lightSphere.light0.specularColor = getSpecColor();
    lightSphere.light0.ambientColor = getAmbiColor();
    lightSphere.light0.shininess = shininess;
    lightSphere.light0.diffIntensity = intDiff;
    lightSphere.light0.specIntensity = intSpec;
    lightSphere.light0.position = new VecMath.SFVec4f(1.0, 0.0, 0.0, 1.0);
    lightSphere.light0.direction = new VecMath.SFVec4f(-1.0, 0.0, -1.0, 0.0);



    lightTexSphere.draw(lightTexSphere.shader.sp, viewMat, projectionMat, lighting);
    lightTexSphere.light.lightColor = getColor();
    lightTexSphere.light.specularColor = getSpecColor();
    lightTexSphere.light.ambientColor = getAmbiColor();
    lightTexSphere.light.shininess = shininess;
    lightTexSphere.light.diffIntensity = intDiff;
    lightTexSphere.light.specIntensity = intSpec;
    lightTexSphere.light.position = new VecMath.SFVec4f(0.0, 0.0, 1.0, 1.0);
    lightTexSphere.light.direction = new VecMath.SFVec4f(-1.0, 0.0, -1.0, 0.0);


   /* lightTexSphere.lights[0].lightColor = getColor();
    lightTexSphere.lights[0].specularColor = getSpecColor();
    lightTexSphere.lights[0].ambientColor = getAmbiColor();
    lightTexSphere.lights[0].shininess = shininess;
    lightTexSphere.lights[0].diffIntensity = intDiff;
    lightTexSphere.lights[0].specIntensity = intSpec;
    lightTexSphere.lights[0].position = new VecMath.SFVec4f(0.0, 0.0, 1.0, 0.0);
    lightTexSphere.lights[0].direction = new VecMath.SFVec4f(-1.0, 0.0, -1.0, 0.0);

    lightTexSphere.lights[1].lightColor = getColor();
    lightTexSphere.lights[1].specularColor = getSpecColor();
    lightTexSphere.lights[1].ambientColor = getAmbiColor();
    lightTexSphere.lights[1].shininess = shininess;
    lightTexSphere.lights[1].diffIntensity = intDiff;
    lightTexSphere.lights[1].specIntensity = intSpec;
    lightTexSphere.lights[1].position = new VecMath.SFVec4f(0.0, 1.0, 1.0, 0.0);
    lightTexSphere.lights[1].direction = new VecMath.SFVec4f(1.0, 0.0, -1.0, 0.0);*/

    //a10
    a10.draw(a10.shader.sp, viewMat, projectionMat, lighting);
    a10.light.lightColor = getColor();
    a10.light.specularColor = getSpecColor();
    a10.light.ambientColor = getAmbiColor();
    a10.light.shininess = shininess;
    a10.light.diffIntensity = intDiff;
    a10.light.specIntensity = intSpec;
    a10.light.position = new VecMath.SFVec4f(0.0, 0.0, 1.0, 1.0);
    a10.light.direction = new VecMath.SFVec4f(-1.0, 0.0, -1.0, 0.0);

    // DEFORM
    defWaveSphere.draw(defWaveSphere.shader.sp, viewMat, projectionMat, lighting);
    defWaveSphere.light.lightColor = getColor();
    defWaveSphere.light.specularColor = getSpecColor();
    defWaveSphere.light.ambientColor = getAmbiColor();
    defWaveSphere.light.shininess = shininess; 
    defWaveSphere.light.diffIntensity = intDiff;
    defWaveSphere.light.specIntensity = intSpec;
    defWaveSphere.deformStyle = 0;
    defWaveSphere.defInt = intDef;
    defWaveSphere.defAmt = amtDef;

    defWavePlane.draw(defWavePlane.shader.sp, viewMat, projectionMat, lighting);
    defWavePlane.light.lightColor = getColor();
    defWavePlane.light.specularColor = getSpecColor();
    defWavePlane.light.ambientColor = getAmbiColor();
    defWavePlane.light.shininess = shininess; 
    defWavePlane.light.diffIntensity = intDiff;
    defWavePlane.light.specIntensity = intSpec;
    defWavePlane.deformStyle = 0;
    defWavePlane.defInt = intDef;
    defWavePlane.defAmt = amtDef;

    // BUMP
    bumpQuad.draw(bumpQuad.shader.sp, viewMat, projectionMat, lighting);
    bumpQuad.light.lightColor = getColor();
    bumpQuad.light.specularColor = getSpecColor();
    bumpQuad.light.ambientColor = getAmbiColor();
    bumpQuad.light.shininess = shininess; 
    bumpQuad.light.diffIntensity = intDiff;
    bumpQuad.light.specIntensity = intSpec;
    
    bumpQuad1.draw(bumpQuad.shader.sp, viewMat, projectionMat, lighting);
    bumpQuad1.light.lightColor = getColor();
    bumpQuad1.light.specularColor = getSpecColor();
    bumpQuad1.light.ambientColor = getAmbiColor();
    bumpQuad1.light.shininess = shininess; 
    bumpQuad1.light.diffIntensity = intDiff;
    bumpQuad1.light.specIntensity = intSpec;

    bumpSphere.draw(bumpSphere.shader.sp, viewMat, projectionMat, lighting);
    bumpSphere.light.lightColor = getColor();
    bumpSphere.light.specularColor = getSpecColor();
    bumpSphere.light.ambientColor = getAmbiColor();
    bumpSphere.light.shininess = shininess; 
    bumpSphere.light.diffIntensity = intDiff;
    bumpSphere.light.specIntensity = intSpec;
    
    bumpSphere1.draw(bumpSphere1.shader.sp, viewMat, projectionMat, lighting);
    bumpSphere1.light.lightColor = getColor();
    bumpSphere1.light.specularColor = getSpecColor();
    bumpSphere1.light.ambientColor = getAmbiColor();
    bumpSphere1.light.shininess = shininess; 
    bumpSphere1.light.diffIntensity = intDiff;
    bumpSphere1.light.specIntensity = intSpec;
    
    bumpSphere2.draw(bumpSphere2.shader.sp, viewMat, projectionMat, lighting);
    bumpSphere2.light.lightColor = getColor();
    bumpSphere2.light.specularColor = getSpecColor();
    bumpSphere2.light.ambientColor = getAmbiColor();
    bumpSphere2.light.shininess = shininess; 
    bumpSphere2.light.diffIntensity = intDiff;
    bumpSphere2.light.specIntensity = intSpec;
    
    bumpBox.draw(bumpBox.shader.sp, viewMat, projectionMat, 0);
    bumpBox.light.lightColor = getColor();
    bumpBox.light.specularColor = getSpecColor();
    bumpBox.light.ambientColor = getAmbiColor();
    bumpBox.light.shininess = shininess; 
    bumpBox.light.diffIntensity = intDiff;
    bumpBox.light.specIntensity = intSpec;
}

// Setup texture
/*function initTexture() {
    tex = gl.createTexture();
    tex.image = new Image();
    tex.image.crossOrigin = ''; // ?
    tex.image.src = "models/tex2.png";  
    tex.image.onload = function () {
        handleLoadedTexture(tex);
    };
}

// Handle texture
function handleLoadedTexture(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
}*/

// Dispose all buffers and shaderProgram
function cleanUp() {

    // Free shader of drawables
    // Colors - Shaders
    //secondPointerShader.dispose();
    secondPointer.shader.dispose();
    minutePointer.shader.dispose();
    hourPointer.shader.dispose();
    box.shader.dispose();
    
    // Scenes
    sceneOne.dispose();
    //orientationScene.dispose();

    // Textured - Shaders
    /*boxTex.shader.dispose();
    houseTex.shader.dispose();
    sphere.shader.dispose();
    sphere1.shader.dispose();
    
    // Lighting
    boxDiffuseShader.dispose();
    objCow.shader.dispose();
    objCowSpec.shader.dispose();
    lightSphere.shader.dispose();
    lightTexSphere.shader.dispose();
    a10.shader.dispose(); */
    
    // Free buffers of drawable
    // Colors - Drawables
    secondPointer.dispose();
    minutePointer.dispose();
    hourPointer.dispose();
    box.dispose();

    // Textured - Drawables
    boxTex.dispose();
    boxTex2.dispose();
    houseTex.dispose();
    sphereTex.dispose();
    sphereTex2.dispose();
    
    // Lighting
   // boxDiffuse.dispose();
    objCow.dispose();
    objCowSpec.dispose();
    lightSphere.dispose();
    lightTexSphere.dispose();
    a10.dispose();
    
    bumpQuad.dispose();
    bumpQuad1.dispose();
    bumpSphere.dispose();
    bumpSphere1.dispose();
    bumpBox.dispose();
    bumpSphere2.dispose();

    // Free textures
    gl.deleteTexture(tex);
}

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}

function handleKeys() {
    if (currentlyPressedKeys[33]) {
        // Page Up
        pitchRate = 30.0;
    } else if (currentlyPressedKeys[34]) {
        // Page Down
        pitchRate = -30.0;
    } else {
        pitchRate = 0;
    }

    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        yawRate = 30.0;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        yawRate = -30.0;
    } else {
        yawRate = 0;
    }
    
    if (currentlyPressedKeys[69]) {
        // E
        if(cameraMode === 0){
            speed = -5.0;
            strafe = true;
        }
    } else if (currentlyPressedKeys[81]) {
        // Q
        if(cameraMode === 0){
            speed = 5.0;
            strafe = true;
        }
    } else {
        speed = 0;
        strafe = false;
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        if(cameraMode === 0){
            speed = 5.0;
            forward = true;
        }
        if(cameraMode === 1)
            zoom += 2.5 * dT;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        if(cameraMode === 0){
            speed = -5.0;
            forward = true;
        }
        if(cameraMode === 1)
            zoom -= 2.5 * dT;
    } else {
       // speed = 0;
        forward = false;
    }
    //console.log("forward: " + forward);
    //console.log("strafe : " + strafe);
}

function handleKeyboard(canvas, dT) {

    //canvas.setAttribute("tabindex", "0");
    canvas.addEventListener('keypress', function (evt) {
        switch (evt.charCode) {
            case 43: /* + */
                break;
            case 45: /* - */
                break;
        }
    }, true);
    canvas.addEventListener('keydown', function (evt) {
        switch (evt.keyCode) {
            // Move
            case 37: /* left */
                break;
            case 38: /* up */
                break;
            case 39: /* right */
                break;
            case 40: /* down */
                break;

                // Rotate
            case 65: /* a */
                break;
            case 87: /* w */
                break;
            case 68: /* d */
                break;
            case 83: /* s */
                break;
        } 
    }, true);
   
    canvas.addEventListener('mousedown', handleMouseDown, true);
    canvas.addEventListener('mouseup', handleMouseUp, true);
    canvas.addEventListener('mousemove', handleMouseMove, true);
   
}


function updateCamera(dT){
    yPos = 0.0;
    if(cameraMode === 0){
        if(forward && speed !== 0){
            // rotate x-axis
            xPos -= Math.sin(MathHelper.DTR(yaw)) * speed * dT;
            // rotate z-axis
            zPos -= Math.cos(MathHelper.DTR(yaw)) * speed * dT;
            // dont need y-axis for now -> height
            yPos = 0.0;
            //console.log("Fordward");
        }

        if(strafe && speed !== 0){
            // rotate x-axis
            xPos -= Math.sin(MathHelper.DTR(yaw + 90)) * speed * dT;
            // rotate z-axis
            zPos -= Math.cos(MathHelper.DTR(yaw + 90)) * speed * dT;
            // dont need y-axis for now -> height
            yPos = 0.0;
           // console.log("Strafe");
        }
    }
    
    // increase pitch/yaw
    yaw += yawRate * dT;
    pitch += pitchRate * dT;

    // set new camera position
    camPos.x = -xPos;
    camPos.y = -yPos;
    camPos.z = -zPos - 5;
    //console.log("xPos: " + (-xPos) + " yPos: " + (-yPos) + " zPos: " + (-zPos));
    
    // Reset view matrix
    viewMat = VecMath.SFMatrix4f.identity();
    
    // Add offset from scene to camera position
    var scenePosition;
    
    switch(scene){
        // Colored
        case 0: scenePosition = new VecMath.SFVec3f(11.0, 0.0, 0.0); break; 
        // Lighting, cow diffuse
        case 1: scenePosition = new VecMath.SFVec3f(2.0, 0.0, 0.0); break;
        // Lighting, cow dif-spec
        case 2: scenePosition = new VecMath.SFVec3f(0.0, 0.0, 0.0); break;
        // Lighting, a-10
        case 3: scenePosition = new VecMath.SFVec3f(-8.0, 0.0, 0.0); break; 
        // Deform
        case 4: scenePosition = new VecMath.SFVec3f(-20.0, 0.0, 0.0); break;
        // Bump1
        case 5: scenePosition = new VecMath.SFVec3f(-33.0, 0.0, 0.0); break;
        // Bump2
        case 6: scenePosition = new VecMath.SFVec3f(-36.0, 0.0, 0.0); break;
        // Bump2
        case 7: scenePosition = new VecMath.SFVec3f(-42.0, 0.0, 0.0);break;
        default: scene = 2;
    }
    
    switch(cameraMode){
        case 0:
            // First person view
            viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(MathHelper.DTR(-pitch)));
            viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-yaw)));
            viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos.add(scenePosition)));
            break;
        case 1:
            // Orbit view
            viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, 0.0, -5.0 + zoom)));
            viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(MathHelper.DTR(pitch)));
            viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(MathHelper.DTR(yaw)));
            viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(scenePosition));
            break;
        default: cameraMode = 0;
    }
}


function handleMouseDown(event){
    mouseDown = true;
    lastMouseX = event.layerX;
    lastMouseY = event.layerY;
}

function handleMouseUp(){
    mouseDown = false;
}

// http://learningwebgl.com/blog/?p=1253
function handleMouseMove(event){
    if(!mouseDown){
        yawRate = 0.0;
        pitchRate = 0.0;
        return;
    }
     
    var newX = event.clientX;
    var newY = event.clientY;
    
    // check mouse is inside canvas
    var isCanvas = document.elementFromPoint(newX, newY).id;
    //console.log(isCanvas);
    
    if(isCanvas === "glCanvas"){
        var turnSpeed = 30.0;

        var deltaX; 
        var deltaY;
        deltaX = (newX - lastMouseX) * turnSpeed;
        deltaY = (newY - lastMouseY) * turnSpeed;
        //console.log(deltaX + " " + deltaY);

        mouseX = deltaX; mouseY = deltaY;
        
        yawRate = -mouseX; 
        pitchRate = -mouseY;
    }
    
    lastMouseX = newX;
    lastMouseY = newY;  
}


// Setup perspective projection and invert viewMat
function initProjection() {
    //viewMat = VecMath.SFMatrix4f.translation(camPos); // .inverse();
    viewMat = VecMath.SFMatrix4f.lookAt(camPos, new VecMath.SFVec3f(0.0, 0.0, 0.0), new VecMath.SFVec3f(0.0, 1.0, 0.0));
    projectionMat = VecMath.SFMatrix4f.perspective(Math.PI / 4, 1.0, 0.1, 1000.0);
}

// ----------------------------------------------------------------- 
// ------------------------- Lighting-Menue ------------------------ 
// -----------------------------------------------------------------

// Change between different light techniques
function changeLighting(){
    var lightStyle = document.getElementById("lighting").selectedIndex;
    switch(lightStyle){
        case 0: // Directional light
            lighting = 0;
            console.log("Lightsourc: Directional light");
            break;
        case 1: // Point light
            lighting = 2;
            console.log("Lightsourc: Point light");
            break;
        case 2: // Spot light
            lighting = 3;
            console.log("Lightsourc: Spot light");
            break;
        case 3: // Head light
            lighting = 1;
            console.log("Lightsourc: Head light");
            break;
        default: lighting = 0;
    }
}

// Set shininess by gui
function setShininess(newValue){
    //console.log("Shininess " + newValue);
    shininess = newValue;
    document.getElementById("shininessLabel").innerHTML = "Shininess: " + shininess;
}

// Set diffuse color intensity by gui
function setIntDiff(newValue){
    //console.log("Diff intensity " + newValue);
    intDiff = newValue;
    document.getElementById("intDiffLabel").innerHTML = "Inten. Diff: " + intDiff;
}

// Set specular color intensity by gui
function setIntSpec(newValue){
    //console.log("Spec intensity " + newValue);
    intSpec = newValue;
    document.getElementById("intSpecLabel").innerHTML = "Inten. Spec: " + intSpec;
}

// Get diffuse color by gui
function getColor(){
    var color = hexToRgb(document.getElementById("lightColor").value);
    //console.log("Lightcolor r:" + color.r + " g:" + color.g + " b:" + color.b);
    return new VecMath.SFVec3f(color.r, color.g, color.b);
}

// get ambient color by gui
function getAmbiColor(){
    var ambiColor = hexToRgb(document.getElementById("ambiColor").value);
    //console.log(new VecMath.SFVec3f(ambiColor.r / 255, ambiColor.g / 255, ambiColor.b / 255));
    //console.log("Ambientcolor r:" + ambiColor.r + " g:" + ambiColor.g + " b:" + ambiColor.b);
    return new VecMath.SFVec3f(ambiColor.r / 255 , ambiColor.g / 255, ambiColor.b / 255);
}

// Get specular color by gui
function getSpecColor(){
    var specColor = hexToRgb(document.getElementById("specColor").value);
    //console.log("Specularcolor r:" + specColor.r + " g:" + specColor.g + " b:" + specColor.b);
    return new VecMath.SFVec3f(specColor.r, specColor.g, specColor.b);
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// ----------------------------------------------------------------- 
// -------------------------- Deform-Menue ------------------------- 
// -----------------------------------------------------------------

// First parameter for deformshader (intensity)
function setDefInt(newValue){
    intDef = newValue;
    document.getElementById("deformIntensityLabel").innerHTML = "Intensity: " + intDef;
}

// Second paramter for deformshader (abmount)
function setDefAmt(newValue){
    amtDef = newValue;
    document.getElementById("deformAmountLabel").innerHTML = "Amount: " + amtDef;
}

// ----------------------------------------------------------------- 
// --------------------------- Blur-Menue -------------------------- 
// -----------------------------------------------------------------

// Change between different blur techniques
function changeBlurTechnique(){
    var style = document.getElementById("blurTechnique").selectedIndex;
    switch(style){
        case 0: // Horizontal blur
            blurTechnique = 0;
            console.log("BlurTechnique: Horizontal blur");
            break;
        case 1: // Vertical blur
            blurTechnique = 1;
            console.log("BlurTechnique: Vertical blur");
            break;
        case 2: // Horizontal and vertical blur
            blurTechnique = 2;
            console.log("BlurTechnique: H/V blur1");
            break;
        case 3: // HV2 blur
            blurTechnique = 3;
            console.log("BlurTechnique: H/V blur2");
            break;
        case 4: // Radial blur
            blurTechnique = 4;
            console.log("BlurTechnique: Radial blur");
            break;
        default:blurTechnique = 0;
    }
}

// Set iterations for blur
function setBlurIterations(newValue){
    blurIterations = newValue;
    document.getElementById("blurIterationsLabel").innerHTML = "Iterations: " + blurIterations;
}

// Activate or deactivate post processing
function setPP(value){
    if(value.checked)
        blurActive = true;
    else
        blurActive = false;
}


// ----------------------------------------------------------------- 
// -------------------------- Camera-Menue ------------------------- 
// -----------------------------------------------------------------

// Change between different camera techniques
function changeCamStyle(){
    var style = document.getElementById("camTechnique").selectedIndex;
    switch(style){
        case 0: // Fist person view
            cameraMode = 0;
            console.log("Camera: First Person View");
            break;
        case 1: // Orbit view
            cameraMode = 1;
            console.log("Camera: Orbit");
            break;
        default:cameraMode = 0;
    }
}

function changeScene(){
    var style = document.getElementById("camScene").selectedIndex;
    switch(style){
        // Scene0 -> Colored
        case 0: scene = 0; break;
        // Scene1 -> Lit, dif cow
        case 1: scene = 1; break;
        // Scene2 -> Lit, dif spec cow
        case 2: scene = 2; break;
        // Scene3 -> Lit, a-10
        case 3: scene = 3; break;
        // Scene4 -> Deform
        case 4: scene = 4; break;
        // Scene5 -> Bump1
        case 5: scene = 5; break;
        // Scene6 -> Bump2
        case 6: scene = 6; break;
        // Scene7 -> Bump3
        case 7: scene = 7; break;
        default: scene = 2;
    }
}

// TODO: 
// - implement shaderobject into drawable - done
// - html element to choose object - Menue and seperate object properties
function getSceneGraphInfo(){
    console.log("Objects in scene: " + drawables.length);
    for(var i = 0; i < drawables.length; i++){
        console.log("ID: " + drawables[i].id);
        console.log("Tag: " + drawables[i].tag);
    }  
}


/// Helper: synchronously loads text file
function loadStringFromFile(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(url), false);
    xhr.send();
    return xhr.responseText;
}

// ------------------------------- Rendertarget --------------------------------

// Init a single VS and FS
function initShaders() {

    var preamble = "#ifdef GL_FRAGMENT_PRECISION_HIGH\n" +
            "  precision highp float;\n" +
            "#else\n" +
            "  precision mediump float;\n" +
            "#endif\n\n";

    // Vertex shader string
    var vsSourceString = loadStringFromFile("Shader/RTVS.glsl");

    // Fragment shader string
    var vsFragmentString = preamble + loadStringFromFile("Shader/RTFS.glsl");

    // VS				
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSourceString);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.warn("VertexShader: " + gl.getShaderInfoLog(vertexShader));
    }

    // FS
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, vsFragmentString);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.warn("FragmentShader: " + gl.getShaderInfoLog(fragmentShader));
    }

    // Shader program object 
    shaderProgram = gl.createProgram();

    // Attach shaders
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);

    // Link shaders
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.warn("Could not link program: " + gl.getProgramInfoLog(shaderProgram));
    }

    shaderProgram.position = gl.getAttribLocation(shaderProgram, "position");
    shaderProgram.resolution = gl.getUniformLocation(shaderProgram, "resolution");
    shaderProgram.blurTechnique = gl.getUniformLocation(shaderProgram, "blurTech");
    shaderProgram.iterations = gl.getUniformLocation(shaderProgram, "it");
    shaderProgram.numIt = gl.getUniformLocation(shaderProgram, "numIt");
    shaderProgram.tex = gl.getUniformLocation(shaderProgram, "tex");
}

function draw(canvas) {
    // Clear backbuffer
    //clearBackBuffer(canvas);

    // Use the shader
    gl.useProgram(shaderProgram);
    
    // Set res
    gl.uniform2f(shaderProgram.resolution, 1024, 1024); // canvas.height
    
    // Set blur technique
    gl.uniform1i(shaderProgram.blurTechnique, blurTechnique);
    
    // Set blur iterations
    gl.uniform1i(shaderProgram.iterations, blurIterations);
    gl.uniform1f(shaderProgram.numIt, blurIterations * 2.0);
    
    // Rendertexture rdy
    if(fbTex && fbTex.ready){
        // Activate renderTargetTexture
        gl.uniform1i(shaderProgram.tex, 0);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fbTex);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);  // CLAMP_TO_EDGE, REPEATE
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
        
    // Bind indexBuffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshData.indexBuffer);

    // Bind vertexPositionBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.positionBuffer);
    gl.vertexAttribPointer(shaderProgram.position, // indes of attribute
            2, // three position components (x,y,z)
            gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    gl.enableVertexAttribArray(shaderProgram.position);
    
    //gl.bindBuffer(gl.ARRAY_BUFFER, meshData.texBuffer);
    gl.vertexAttribPointer(shaderProgram.texCoords, // index of attribute
            2, // two texCoords (u, v)
            gl.FLOAT, // provided data type is float
            false, // do not normalize values
            0, // stride (in bytes)
            0); // offset (in bytes)
    gl.enableVertexAttribArray(shaderProgram.texCoords);
    
    // deactivate offscreen target
    if(blurActive)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    else
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    
    // clear buffer properites
    gl.viewport(0, 0, 1024, 1024);
    gl.clearColor(0.0, 0.0, 0.5, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Draw call
    gl.drawElements(gl.TRIANGLES, // polyg type
            meshData.indices.length, // buffer length
            gl.UNSIGNED_SHORT, // buffer type
            0); // start index
      
    if(blurActive)
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    else
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    
    // Disable arributes
    gl.disableVertexAttribArray(shaderProgram.position); 
    gl.disableVertexAttribArray(shaderProgram.texCoords);
}

function setupMeshData() {
    // Setup triangle vertices
    meshData = {
         // Setup vetices
        vertices: [
            0, 0,
            0, size,
            size, size,
            size, 0
        ],
        // Setup texCoords
        tex: [
        1.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        0.0, 0.0
        ],
        // Setup indices
        indices: [
            // tris behind
            0, 1, 2,
            2, 3, 0
        ],
        // Setup translation
        trans: {x: 0, y: 0, z: 0}
    };

    // World-Space
    meshData.transformMatrix = VecMath.SFMatrix4f.identity();
    
    // Init Buffers for meshData
    initBuffers();
}

// Setup Buffer
function initBuffers() {
    // VertexPositionBuffer
    meshData.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshData.vertices), gl.STATIC_DRAW);
    
    // Texcoords
    meshData.texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, meshData.texBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshData.tex), gl.STATIC_DRAW);
    
    
    // IndexBuffer
    meshData.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, meshData.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(meshData.indices), gl.STATIC_DRAW);
}

function initRT(gl){
    fbTex = gl.createTexture();
    fbTex.width  =  size;
    fbTex.height =  size;
    fbTex.ready  = true;

    gl.bindTexture(gl.TEXTURE_2D, fbTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, fbTex.width, fbTex.height, 0, gl.RGBA, gl.FLOAT, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    fbo = gl.createFramebuffer();
    rb  = gl.createRenderbuffer();

    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, fbTex.width, fbTex.height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, rb);

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status != gl.FRAMEBUFFER_COMPLETE) {
        console.warn("FBO status: " + status);
    }
    else
        console.log("FBO initialized, status: " + status);
}

