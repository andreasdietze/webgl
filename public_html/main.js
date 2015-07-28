
/* global VecMath, MathHelper, result */

"use strict";

// Globals 
var gl = null, // GL
    angle = 0.0, // Rotation
    tex = null, // Texture
    viewMat = VecMath.SFMatrix4f.identity(), // View matrix (camera)
    projectionMat = VecMath.SFMatrix4f.identity(); // Matrix for perspective or orthogonal projection
    
// access to Renderer from inside other functions
var that = this;

// unsigned int indices GL extension
var INDEX_UINT_EXT = null;
var FP_TEXTURES_EXT = null;
var FPL_TEXTURES_EXT = null;
        
var angleX = 0;
var angleY = 0;
var radY = 0;
var radX = 0;
var camPos = new VecMath.SFVec3f(0.0, 0.0, 7.5);
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;
var mouseX = null, mouseY = null;
var moveVecNF = new VecMath.SFVec3f(0.0, 0.0, 0.0),
    moveVecLR = new VecMath.SFVec3f(0.0, 0.0, 0.0);
    
var direction;

var count = 0;
var fps = 0;
var lastTime;

var pitch = 0;
var pitchRate = 0;
var yaw = 0;
var yawRate = 0;
var xPos = 0;
var yPos = 0.4;
var zPos = 0;
var speed = 0;
var addVec = new VecMath.SFVec3f(0.0, 0.0, -5.0);

// Controls KB
var currentlyPressedKeys = {};

var lighting = 0;
var shininess = 128.0;
var intDiff = 1.0;
var intSpec = 1.0;

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

var lastFrameTime = new Date().getTime();
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

// Create sphere
var sphere = new Drawable();

// Another sphere
var sphere1 = new Drawable();

// ------------------------------------------------------ //
//  -------------------- ColorScenes -------------------- // 
// ------------------------------------------------------ //

//var sceneOne;  // TODO Refactor shaderobject
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

// ------------------------------------------------------ //
// --------------- Init lightinhgDrawables -------------- //
// ------------------------------------------------------ //

// Test
var boxDiffuseShader = new DiffuseLightingShader();
var boxDiffuse = new LightingTextureDrawable();

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
var bumpQuad = new Drawable();

// Deform-objects
var defWaveSphere = new Drawable();
var defWavePlane = new Drawable();

var dT = null;

// MAIN
function main() {
    console.log("Init program");
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
    
    document.getElementById("intDiffLabel").innerHTML = "Diff intensity: " + intDiff;
    document.getElementById("intSpecLabel").innerHTML = "Spec intensity: " + intSpec;
    document.getElementById("shininessLabel").innerHTML = "Shininess: " + shininess;

    // Init projection
    initProjection();

    //initTexture();
    
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // Colored -------------------------------------------
    // Setup meshData for secondPointer
    mh.setupSecPointer();
    secondPointer.initGL(gl, mh.vss, mh.fss);
    secondPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);

    // Setup meshData for secondPointer
    mh.setupMinPointer();
    minutePointer.initGL(gl, mh.vss, mh.fss);
    minutePointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);

    // Setup meshData for hourPointer
    mh.setupHourPointer();
    hourPointer.initGL(gl, mh.vss, mh.fss);
    hourPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);
            
    // Setup meshDate for clockTex  
    mh.setupQuad();
    clockTex.initGL(gl, mh.vss, mh.fss);
    clockTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.indices,
             mh.mesh.trans);
    clockTex.initTexture("models/clock.png");

    mh.setupBox(0.25);
    box.initGL(gl, mh.vss, mh.fss);
    box.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);    
         
    mh.setupSphere(0.4, 2);
    sphere.initGL(gl, mh.vss, mh.fss);
    sphere.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);

    mh.setupSphere(0.4, 1);
    sphere1.initGL(gl, mh.vss, mh.fss);
    sphere1.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.tex,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);
            
   // sceneOne = new MultipleObjects(gl, mh);
    //orientationScene = new OrientationScene(gl, mh);
            
    // Textured --------------------------------------------
    mh.setupTexturedHouse();
    houseTex.initGL(gl, mh.vss, mh.fss);
    houseTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.indices,
             mh.mesh.trans);
    houseTex.initTexture("models/tex2.png");
    
    mh.setupTexturedBox(0.25);
    boxTex.initGL(gl, mh.vss, mh.fss);
    boxTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.indices,
             mh.mesh.trans);
    boxTex.initTexture("models/tex2.png");
    
    mh.setupTexturedBox6f();
    boxTex2.initGL(gl, mh.vss, mh.fss);
    boxTex2.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.indices,
             mh.mesh.trans);
    boxTex2.initTexture("models/crazyCube.png");
    
    mh.setupTexturedSphere(0.4);
    sphereTex.initGL(gl, mh.vss, mh.fss);
    sphereTex.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.indices,
             mh.mesh.trans);
    sphereTex.initTexture("models/tex2.png");
    
    // Lighting ---------------------------------------
    
   mh.setupDiffusedBox();
    boxDiffuseShader.initGL(gl);
    boxDiffuseShader.initShader(mh.vss, mh.fss);
    boxDiffuse.initGL(gl);
    boxDiffuse.setBufferData(mh.mesh.vertices,
            //mh.mesh.col, // auskommentieren
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    boxDiffuse.initTexture("models/crazyCube.png");
    
    mh.loadOBJ("models/cow.obj", 0.175);
    objCow.initGL(gl, mh.vss, mh.fss);
    objCow.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
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
                         mh.mesh.indices,
                         mh.mesh.trans); 
    // Add to scenegraph
    drawables.push(lightSphere); 
    
    mh.setupTexturedLightSphere(0.4);
    lightTexSphere.initGL(gl, mh.vss, mh.fss);
    lightTexSphere.setBufferData(mh.mesh.vertices,
             mh.mesh.col,
             mh.mesh.tex,
             mh.mesh.normals,
             mh.mesh.indices,
             mh.mesh.trans);
    lightTexSphere.initTexture("models/tex2.png");
     // Add to scenegraph
    drawables.push(lightTexSphere);   

    mh.loadOBJSpec("models/A10/A-10_Thunderbolt_II.obj", 0.2, 0);
    a10.initGL(gl, mh.vss, mh.fss);
    a10.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
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
                         mh.mesh.indices,
                         mh.mesh.trans); 
    // Add to scenegraph
    drawables.push(defWaveSphere); 
    
    mh.loadOBJSpec("models/plane16x16.obj", 0.425, 1);
    defWavePlane.initGL(gl, mh.vss, mh.fss);
    defWavePlane.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.tex,
                         mh.mesh.normals,
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
             mh.mesh.indices,
             mh.mesh.trans);
    bumpQuad.initTexture("models/BrickDiff0.jpg");
    bumpQuad.initBumpMap("models/BrickBump0.jpg");
    
    getSceneGraphInfo();
                                 
    // Draw-loop
    (function mainLoop() {

        // Transformation
        animate(canvas);

        // Clear backBuffer
        clearBackBuffer(canvas);

        // Colored
        secondPointer.draw(secondPointer.shader.sp, viewMat, projectionMat, lighting);
        minutePointer.draw(minutePointer.shader.sp, viewMat, projectionMat, lighting);
        hourPointer.draw(hourPointer.shader.sp, viewMat, projectionMat, lighting);
        clockTex.draw(clockTex.shader.sp, viewMat, projectionMat, lighting);
        box.draw(box.shader.sp, viewMat, projectionMat, lighting);
        sphere.draw(sphere.shader.sp, viewMat, projectionMat, lighting);
        sphere1.draw(sphere1.shader.sp, viewMat, projectionMat, lighting);
        
        // Color scenes
        //sceneOne.draw(box.shader.sp, sphere.shader.sp, viewMat, projectionMat);
        //orientationScene.draw(boxShader, viewMat, projectionMat);
        
        // Textured
        houseTex.draw(houseTex.shader.sp, viewMat, projectionMat, lighting);
        boxTex.draw(boxTex.shader.sp, viewMat, projectionMat, lighting);
        boxTex2.draw(boxTex2.shader.sp, viewMat, projectionMat, lighting);
        sphereTex.draw(sphereTex.shader.sp, viewMat, projectionMat, lighting);
       
        // Lighting
        boxDiffuse.draw(boxDiffuseShader.sp, viewMat, projectionMat);
        
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
        
        
        lightSphere.draw(lightSphere.shader.sp, viewMat, projectionMat, lighting);
        lightSphere.light.lightColor = getColor();
        lightSphere.light.specularColor = getSpecColor();
        lightSphere.light.ambientColor = getAmbiColor();
        lightSphere.light.shininess = shininess;
        lightSphere.light.diffIntensity = intDiff;
        lightSphere.light.specIntensity = intSpec;
        
        lightTexSphere.draw(lightTexSphere.shader.sp, viewMat, projectionMat, lighting);
        lightTexSphere.light.lightColor = getColor();
        lightTexSphere.light.specularColor = getSpecColor();
        lightTexSphere.light.ambientColor = getAmbiColor();
        lightTexSphere.light.shininess = shininess;
        lightTexSphere.light.diffIntensity = intDiff;
        lightTexSphere.light.specIntensity = intSpec;
        
        a10.draw(a10.shader.sp, viewMat, projectionMat, lighting);
        a10.light.lightColor = getColor();
        a10.light.specularColor = getSpecColor();
        a10.light.ambientColor = getAmbiColor();
        a10.light.shininess = shininess; 
        a10.light.diffIntensity = intDiff;
        a10.light.specIntensity = intSpec;
        
        // DEFORM
        defWaveSphere.draw(defWaveSphere.shader.sp, viewMat, projectionMat, lighting);
        defWaveSphere.light.lightColor = getColor();
        defWaveSphere.light.specularColor = getSpecColor();
        defWaveSphere.light.ambientColor = getAmbiColor();
        defWaveSphere.light.shininess = shininess; 
        defWaveSphere.light.diffIntensity = intDiff;
        defWaveSphere.light.specIntensity = intSpec;
        defWaveSphere.deformStyle = 0;
        
        defWavePlane.draw(defWavePlane.shader.sp, viewMat, projectionMat, lighting);
        defWavePlane.light.lightColor = getColor();
        defWavePlane.light.specularColor = getSpecColor();
        defWavePlane.light.ambientColor = getAmbiColor();
        defWavePlane.light.shininess = shininess; 
        defWavePlane.light.diffIntensity = intDiff;
        defWavePlane.light.specIntensity = intSpec;
        defWavePlane.deformStyle = 0;
        
        // BUMP
        bumpQuad.draw(bumpQuad.shader.sp, viewMat, projectionMat, lighting);
        bumpQuad.light.lightColor = getColor();
        bumpQuad.light.specularColor = getSpecColor();
        bumpQuad.light.ambientColor = getAmbiColor();
        bumpQuad.light.shininess = shininess; 
        bumpQuad.light.diffIntensity = intDiff;
        bumpQuad.light.specIntensity = intSpec;
        
        
        
        //var foo = new Date().getUTCMilliseconds();
        //console.log(foo);
        
        // Renderloop 
        window.requestAnimationFrame(mainLoop);
    })();

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

// Update
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
    handleKeyboard(window, dT);    // window
    handleKeys();
    
    // Colored ---------------------------------------------------------------------
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
   
    clockTex.md.transformMatrix = VecMath.SFMatrix4f.identity();
    clockTex.md.transformMatrix = clockTex.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.2, 2.2, -0.01)));
    clockTex.md.transformMatrix = clockTex.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(90)));
    clockTex.md.transformMatrix = clockTex.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
    
   
    box.md.transformMatrix._03 = -3.5;
    box.md.transformMatrix._13 = 1.0;
    box.md.transformMatrix._23 = 0.0;
    var rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    box.md.transformMatrix = box.md.transformMatrix.mult(rotMat);

    sphere.md.transformMatrix._03 = -4.5;
    sphere.md.transformMatrix._13 = -1.0;
    sphere.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    sphere.md.transformMatrix = sphere.md.transformMatrix.mult(rotMat);
    //sphere.updateT(dT, sphere.md.transformMatrix); 

    sphere1.md.transformMatrix._03 = -3.5;
    sphere1.md.transformMatrix._13 = -1.0;
    sphere1.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    sphere1.md.transformMatrix = sphere1.md.transformMatrix.mult(rotMat);
    
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    //sceneOne.update(rotMat);
    
    // Textured -------------------------------------------------------------------
    sphereTex.md.transformMatrix._03 = 1.5;
    sphereTex.md.transformMatrix._13 = 0.0;
    sphereTex.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    sphereTex.md.transformMatrix = sphereTex.md.transformMatrix.mult(rotMat);
    
    houseTex.md.transformMatrix._03 = 0.0;
    houseTex.md.transformMatrix._13 = 2.0;
    houseTex.md.transformMatrix._23 = 0.0;
    
    boxTex.md.transformMatrix._03 = -4.5;
    boxTex.md.transformMatrix._13 = 1.0;
    boxTex.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    boxTex.md.transformMatrix = boxTex.md.transformMatrix.mult(rotMat);
    
    angle -= 1; //* dT;
    boxTex2.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-3.5, 0.0, 0.0)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
   
    // Lighting -------------------------------------------------------------------
    boxDiffuse.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-4.5, 0.0, 0.0)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
 
    objCow.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-1.75, 0.75, 0.0)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    objCowSpec.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-1.75, -0.75, 0.0)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
 
    lightSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    lightSphere.md.transformMatrix = lightSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(1.5, -1.0, 0.0)));
    lightSphere.md.transformMatrix = lightSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    lightTexSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    lightTexSphere.md.transformMatrix = lightTexSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(1.5, 1.0, 0.0)));
    lightTexSphere.md.transformMatrix = lightTexSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    lightTexSphere.md.transformMatrix = lightTexSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1)));
   
    a10.md.transformMatrix = VecMath.SFMatrix4f.identity();
    a10.md.transformMatrix = a10.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(5.0, 0.5, 0.0)));
    a10.md.transformMatrix = a10.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    a10.md.transformMatrix = a10.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
   // DEFORM 
    defWaveSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    defWaveSphere.md.transformMatrix = defWaveSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(2.5, -1.0, 0.0)));
    defWaveSphere.md.transformMatrix = defWaveSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    defWavePlane.md.transformMatrix = VecMath.SFMatrix4f.identity();
    defWavePlane.md.transformMatrix = defWavePlane.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(1.5, -2.0, 0.0)));
    defWavePlane.md.transformMatrix = defWavePlane.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2, 1, 2))); 
     
   // BUMP
    bumpQuad.md.transformMatrix = VecMath.SFMatrix4f.identity();
    bumpQuad.md.transformMatrix = bumpQuad.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, 0.0, 0.0)));
    bumpQuad.md.transformMatrix = bumpQuad.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(90.0)));
    bumpQuad.md.transformMatrix = bumpQuad.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(2, 2, 2))); 
    
    lastFrameTime = currentTime;
}

// Setup texture
function initTexture() {
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
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

// Dispose all buffers and shaderProgram
function cleanUp() {

    // Free shader of drawables
    // Colors - Shaders
    //secondPointerShader.dispose();
    secondPointer.shader.dispose();
    minutePointer.shader.dispose();
    hourPointer.shader.dispose();
    box.shader.dispose();
    sphere.shader.dispose();
    sphere1.shader.dispose();
    
    // Scenes
    //sceneOne.dispose();
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
    sphere.dispose();
    sphere1.dispose();

    // Textured - Drawables
    boxTex.dispose();
    boxTex2.dispose();
    houseTex.dispose();
    sphereTex.dispose();
    
    // Lighting
    boxDiffuse.dispose();
    objCow.dispose();
    objCowSpec.dispose();
    lightSphere.dispose();
    lightTexSphere.dispose();
    a10.dispose();
    
    bumpQuad.dispose();

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
        pitchRate = 0.1;
    } else if (currentlyPressedKeys[34]) {
        // Page Down
        pitchRate = -0.1;
    } else {
        pitchRate = 0;
    }

    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
        // Left cursor key or A
        yawRate = -0.5;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        yawRate = 0.5;
    } else {
        yawRate = 0;
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
        // Up cursor key or W
        speed = 3.3;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
        // Down cursor key
        speed = -3.3;
    } else {
        speed = 0;
    }

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
                //angleY += -0.01 * dT;
                break;
            case 87: /* w */
                //angleX += 0.01 * dT;
                //addVec.z -= 0.1 *dT;
                break;
            case 68: /* d */
                //angleY += 0.01 * dT;
                break;
            case 83: /* s */
                //addVec.z += 0.1 *dT;
               // angleX += -0.01 * dT;
               //camPos.z += 0.1 *dT;
                break;

        } 
    }, true);
   
    canvas.addEventListener('mousedown', handleMouseDown, true);
    canvas.addEventListener('mouseup', handleMouseUp, true);
    canvas.addEventListener('mousemove', handleMouseMove, true);
    
    
    //if (speed !== 0) {
        xPos -= Math.sin(MathHelper.DTR(yaw)) * speed * dT;
        zPos -= Math.cos(MathHelper.DTR(yaw)) * speed * dT;
    //}
    yPos = 0.0;
    
    yaw += yawRate * dT;
    pitch += pitchRate * dT;

    camPos.x = -xPos;
    camPos.y = -yPos;
    camPos.z = -zPos;


    viewMat = VecMath.SFMatrix4f.identity();
    viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos.add(new VecMath.SFVec3f(0.0, 0.0, -3))));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(-yaw));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(-pitch));
    //viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos.add(new VecMath.SFVec3f(-xPos, 0.0, -7))));
    
   
    /*viewMat = VecMath.SFMatrix4f.identity();
    viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos).inverse());
    
    var rotMat = viewMat; 
    rotMat = rotMat.mult(VecMath.SFMatrix4f.rotationY(-yaw));
    rotMat = rotMat.mult(VecMath.SFMatrix4f.rotationX(-pitch));
    
    direction = rotMat.multMatrixPnt(camPos);
    var normalizedDirection = direction.normalize();
    camPos.add(normalizedDirection);
    console.log("CamPos: " + camPos);
    
    viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(-yaw));
    viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(-pitch));*/
    
    
    // addvec auf campos -> translate mit campos
    
    //console.log(pitch + " " + yaw + " " + camPos);
    //console.log(viewMat._03 + " " + viewMat._13 + " " +  viewMat._23);

    //console.log(moveVec);
    //console.log(viewMat);
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
        var turnSpeed = 0.9;

        var deltaX = (newX - lastMouseX) * turnSpeed;
        var deltaY = (newY - lastMouseY) * turnSpeed;
        //console.log(deltaX + " " + deltaY);

        mouseX = deltaX; mouseY = deltaY;

        yawRate = -mouseX; 
        pitchRate = -mouseY;

        // viewMat = viewMat.transpose();
        //viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationY(MathHelper.DTR(deltaX))); 
        //viewMat = viewMat.mult(VecMath.SFMatrix4f.rotationX(MathHelper.DTR(deltaY)));
    }
    
    lastMouseX = newX;
    lastMouseY = newY;  
}

// Setup perspective projection and invert viewMat
function initProjection() {
    viewMat = VecMath.SFMatrix4f.translation(camPos); // .inverse();
    projectionMat = VecMath.SFMatrix4f.perspective(Math.PI / 4, 1.0, 0.1, 1000.0);
}

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
    }
}

function setShininess(newValue){
    //console.log("Shininess " + newValue);
    shininess = newValue;
    document.getElementById("shininessLabel").innerHTML = "Shininess: " + shininess;
}

function setIntDiff(newValue){
    //console.log("Diff intensity " + newValue);
    intDiff = newValue;
    document.getElementById("intDiffLabel").innerHTML = "Inten. Diff: " + intDiff;
}

function setIntSpec(newValue){
    //console.log("Spec intensity " + newValue);
    intSpec = newValue;
    document.getElementById("intSpecLabel").innerHTML = "Inten. Spec: " + intSpec;
}

// TODO: 
// - implement shaderobject into drawable
// - html element to choose object
function getSceneGraphInfo(){
    console.log("Objects in scene: " + drawables.length);
    for(var i = 0; i < drawables.length; i++){
        console.log("ID: " + drawables[i].id);
        console.log("Tag: " + drawables[i].tag);
    }  
}

function getColor(){
    var color = hexToRgb(document.getElementById("lightColor").value);
    //console.log("Lightcolor r:" + color.r + " g:" + color.g + " b:" + color.b);
    return new VecMath.SFVec3f(color.r, color.g, color.b);
}

function getAmbiColor(){
    var ambiColor = hexToRgb(document.getElementById("ambiColor").value);
    //console.log(new VecMath.SFVec3f(ambiColor.r / 255, ambiColor.g / 255, ambiColor.b / 255));
    //console.log("Ambientcolor r:" + ambiColor.r + " g:" + ambiColor.g + " b:" + ambiColor.b);
    return new VecMath.SFVec3f(ambiColor.r / 255 , ambiColor.g / 255, ambiColor.b / 255);
}

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

/// Helper: synchronously loads text file
function loadStringFromFile(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", encodeURI(url), false);
    xhr.send();
    return xhr.responseText;
}

