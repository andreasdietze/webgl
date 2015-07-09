
/* global VecMath, MathHelper */

"use strict";

// Globals 
var gl = null, // GL
    angle = 0.0, // Rotation
    tex = null, // Texture
    viewMat = VecMath.SFMatrix4f.identity(), // View matrix (camera)
    projectionMat = VecMath.SFMatrix4f.identity(); // Matrix for perspective or orthogonal projection
        
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
var secondPointerShader = new ColorShader();
var secondPointer = new ColorDrawable();

// Create minutePointer
var minutePointerShader = new ColorShader();
var minutePointer = new ColorDrawable();

// Create hourPointer
var hourPointerShader = new ColorShader();
var hourPointer = new ColorDrawable();

// Create box
var boxShader = new ColorShader();
var box = new ColorDrawable();

// Create sphere
var sphereShader = new ColorShader();
var sphere = new ColorDrawable();

// Another sphere
var sphereShader1 = new ColorShader();
var sphere1 = new ColorDrawable();

// ------------------------------------------------------ //
//  -------------------- ColorScenes -------------------- // 
// ------------------------------------------------------ //
var sceneOne;
var orientationScene;


// ------------------------------------------------------ //
// --------------- Init texturedDrawables --------------- //
// ------------------------------------------------------ //

// Create textured house
var houseShaderTex = new TextureShader();
var houseTex = new TextureDrawable("crazyCube.png");

// Create textured Box
var boxShaderTex = new TextureShader();
var boxTex = new TextureDrawable("crazyCube.png");

// Textured box
var boxTex2 = new TextureDrawable();

// Textured sphere
var sphereTexShader = new TextureShader();
var sphereTex = new TextureDrawable();

// ------------------------------------------------------ //
// --------------- Init lightinhgDrawables -------------- //
// ------------------------------------------------------ //


var boxDiffuseShader = new DiffuseLightingShader();
var boxDiffuse = new LightingTextureDrawable();

var objCowShader = new ColorShader();
var objCow = new ColorDrawable();

var objCowShaderSpec = new ColorShader();//LightingShader();
var objCowSpec = new ColorDrawable(); 

var lightSphereShader = new ColorShader();
var lightSphere = new ColorDrawable();



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

    // Init projection
    initProjection();

    initTexture();
    
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    // Colored -------------------------------------------
    // Setup meshData for secondPointer
    mh.setupSecPointer();
    secondPointerShader.initGL(gl);
    secondPointerShader.initShader(mh.vss, mh.fss);
    secondPointer.initGL(gl);
    secondPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);

    // Setup meshData for secondPointer
    mh.setupMinPointer();
    minutePointerShader.initGL(gl);
    minutePointerShader.initShader(mh.vss, mh.fss);
    minutePointer.initGL(gl);
    minutePointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);

    // Setup meshData for hourPointer
    mh.setupHourPointer();
    hourPointerShader.initGL(gl);
    hourPointerShader.initShader(mh.vss, mh.fss);
    hourPointer.initGL(gl);
    hourPointer.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);

    mh.setupBox(0.25);
    boxShader.initGL(gl);
    boxShader.initShader(mh.vss, mh.fss);
    box.initGL(gl);
    box.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);    
         
    mh.setupSphere(0.4, 2);
    sphereShader.initGL(gl);
    sphereShader.initShader(mh.vss, mh.fss);
    sphere.initGL(gl);
    sphere.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);

    mh.setupSphere(0.4, 1);
    sphereShader1.initGL(gl);
    sphereShader1.initShader(mh.vss, mh.fss);
    sphere1.initGL(gl);
    sphere1.setBufferData(mh.mesh.vertices,
            mh.mesh.col,
            mh.mesh.normals,
            mh.mesh.indices,
            mh.mesh.trans);
            
    sceneOne = new MultipleObjects(gl, mh);
    orientationScene = new OrientationScene(gl, mh);
            
    // Textured --------------------------------------------
    mh.setupTexturedHouse();
    houseShaderTex.initGL(gl);
    houseShaderTex.initShader(mh.vss, mh.fss);
    houseTex.initGL(gl);
    houseTex.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    //houseTex.initTexture("crazyCube.png");
    console.log(houseTex.tex);
    
    mh.setupTexturedBox(0.25);
    boxShaderTex.initGL(gl);
    boxShaderTex.initShader(mh.vss, mh.fss);
    boxTex.initGL(gl);
    boxTex.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    //boxTex.initTexture("crazyCube.png");
    
    mh.setupTexturedBox6f();
    boxTex2.initGL(gl);
    boxTex2.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    //boxTex2.initTexture("crazyCube.png");
    
    mh.setupTexturedSphere(0.4);
    sphereTexShader.initGL(gl);
    sphereTexShader.initShader(mh.vss, mh.fss);
    sphereTex.initGL(gl);
    sphereTex.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    //sphereTex.initTexture("crazyCube.png");
    
    // Lighting ---------------------------------------
    
    mh.setupDiffusedBox();
    boxDiffuseShader.initGL(gl);
    boxDiffuseShader.initShader(mh.vss, mh.fss);
    boxDiffuse.initGL(gl);
    boxDiffuse.setBufferData(mh.mesh.vertices,
            mh.mesh.tex,
            mh.mesh.indices,
            mh.mesh.trans);
    boxDiffuse.initTexture("crazyCube.png");
    
    
    mh.loadOBJ("Models/cow.obj", 0.175);
    objCowShader.initGL(gl);
    objCowShader.initShader(mh.vss, mh.fss);
    objCow.initGL(gl);
    objCow.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.normals,
                         mh.mesh.indices,
                         mh.mesh.trans);
                         
    mh.loadOBJSpec("Models/cow.obj", 0.175);
    objCowShaderSpec.initGL(gl);
    objCowShaderSpec.initShader(mh.vss, mh.fss);
    objCowSpec.initGL(gl);
    objCowSpec.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.normals,
                         mh.mesh.indices,
                         mh.mesh.trans); 
                         
    mh.loadOBJSpec("Models/sphere.obj", 0.425);
    lightSphereShader.initGL(gl);
    lightSphereShader.initShader(mh.vss, mh.fss);
    lightSphere.initGL(gl);
    lightSphere.setBufferData(mh.mesh.vertices,
                         mh.mesh.colors,
                         mh.mesh.normals,
                         mh.mesh.indices,
                         mh.mesh.trans); 
                                 
    // Draw-loop
    (function mainLoop() {

        // Transformation
        animate(canvas);

        // Clear backBuffer
        clearBackBuffer(canvas);

        // Colored
        secondPointer.draw(secondPointerShader.sp, viewMat, projectionMat);
        minutePointer.draw(minutePointerShader.sp, viewMat, projectionMat);
        hourPointer.draw(hourPointerShader.sp, viewMat, projectionMat);
        box.draw(boxShader.sp, viewMat, projectionMat);
        sphere.draw(sphereShader.sp, viewMat, projectionMat);
        sphere1.draw(sphereShader.sp, viewMat, projectionMat);
        
        // Color scenes
        sceneOne.draw(boxShader, sphereShader, viewMat, projectionMat);
        orientationScene.draw(boxShader, viewMat, projectionMat);
        
        // Textured
        houseTex.draw(houseShaderTex.sp, viewMat, projectionMat);
        boxTex.draw(boxShaderTex.sp, viewMat, projectionMat);
        boxTex2.draw(boxShaderTex.sp, viewMat, projectionMat);
        sphereTex.draw(sphereTexShader.sp, viewMat, projectionMat);
       
        // Lighting
        boxDiffuse.draw(boxDiffuseShader.sp, viewMat, projectionMat);
        objCow.draw(objCowShader.sp, viewMat, projectionMat);
        objCowSpec.draw(objCowShaderSpec.sp, viewMat, projectionMat);
        lightSphere.draw(lightSphereShader.sp, viewMat, projectionMat);
        
        // Renderloop 
        window.requestAnimationFrame(mainLoop);
    })();

}

// Clear color, depth and set viewport
function clearBackBuffer(canvas) {
    // Clear color to black
    gl.clearColor(0.3, 0.5, 0.2, 0.3);
    // Clear depth to max (1.0) min(0.0)
    gl.clearDepth(1.0);
    // Init viewport
    gl.viewport(0, 0, canvas.width, canvas.height);
    // Clear color or depth bit
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // Enable depth test
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    // Cullmode
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    // Blending
    //gl.enable(gl.BLEND);
    //gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
}

// Update
function animate(canvas) {
    var currentTime = Date.now(); //new Date().getTime();
    var dT = currentTime - lastFrameTime;
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
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.0, 2.0, 0.0)));
    secondPointer.md.transformMatrix = secondPointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(-6 * new Date().getSeconds())));
    secondPointer.md.transformMatrix = secondPointer.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(3.25, 3.25, 3.25))); 

    // Update minute pointer
    minutePointer.md.transformMatrix = VecMath.SFMatrix4f.identity();
    minutePointer.md.transformMatrix = minutePointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.0, 2.0, 0.0)));
    minutePointer.md.transformMatrix = minutePointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(-6 * new Date().getMinutes())));
    minutePointer.md.transformMatrix = minutePointer.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(3.25, 3.25, 3.25))); 
   
    // Update hours 
    var hours = new Date().getHours();
    if (hours > 12)
        hours -= 12;

    // Update hour pointer
    hourPointer.md.transformMatrix = VecMath.SFMatrix4f.identity();
    hourPointer.md.transformMatrix = hourPointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.0, 2.0, 0.0)));
    hourPointer.md.transformMatrix = hourPointer.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationZ(MathHelper.DTR(-30 * hours)));
    hourPointer.md.transformMatrix = hourPointer.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(3.25, 3.25, 3.25))); 
   
    box.md.transformMatrix._03 = 1.5;
    box.md.transformMatrix._13 = 1.0;
    box.md.transformMatrix._23 = 0.0;
    var rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    box.md.transformMatrix = box.md.transformMatrix.mult(rotMat);

    sphere.md.transformMatrix._03 = -2.5;
    sphere.md.transformMatrix._13 = -1.0;
    sphere.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    sphere.md.transformMatrix = sphere.md.transformMatrix.mult(rotMat);
    //sphere.updateT(dT, sphere.md.transformMatrix); 

    sphere1.md.transformMatrix._03 = 1.5;
    sphere1.md.transformMatrix._13 = -1.0;
    sphere1.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    sphere1.md.transformMatrix = sphere1.md.transformMatrix.mult(rotMat);
    
    rotMat = VecMath.SFMatrix4f.rotationY(1 * dT);
    sceneOne.update(rotMat);
    
    // Textured -------------------------------------------------------------------
    sphereTex.md.transformMatrix._03 = 1.5;
    sphereTex.md.transformMatrix._13 = 0.0;
    sphereTex.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    sphereTex.md.transformMatrix = sphereTex.md.transformMatrix.mult(rotMat);
    
    houseTex.md.transformMatrix._03 = 0.0;
    houseTex.md.transformMatrix._13 = 2.0;
    houseTex.md.transformMatrix._23 = 0.0;
    
    boxTex.md.transformMatrix._03 = -1.5;
    boxTex.md.transformMatrix._13 = 1.0;
    boxTex.md.transformMatrix._23 = 0.0;
    rotMat = VecMath.SFMatrix4f.rotationX(1 * dT);
    boxTex.md.transformMatrix = boxTex.md.transformMatrix.mult(rotMat);
    
    angle -= 1; //* dT;
    boxTex2.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-1.5, 0.0, 0.0)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxTex2.md.transformMatrix = boxTex2.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
   
    // Lighting -------------------------------------------------------------------
    boxDiffuse.md.transformMatrix = VecMath.SFMatrix4f.identity();
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-2.5, 0.0, 0.0)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(angle)));
    boxDiffuse.md.transformMatrix = boxDiffuse.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(0.25, 0.25, 0.25))); 
 
    objCow.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, 0.75, 0.0)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    objCow.md.transformMatrix = objCow.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    objCowSpec.md.transformMatrix = VecMath.SFMatrix4f.identity();
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(0.0, -0.75, 0.0)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
            VecMath.SFMatrix4f.rotationY(MathHelper.DTR(-90.0 + angle / 2)));
    objCowSpec.md.transformMatrix = objCowSpec.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
   
    lightSphere.md.transformMatrix = VecMath.SFMatrix4f.identity();
    lightSphere.md.transformMatrix = lightSphere.md.transformMatrix.mult(
            VecMath.SFMatrix4f.translation(new VecMath.SFVec3f(-1.5, -1.0, 0.0)));
    lightSphere.md.transformMatrix = lightSphere.md.transformMatrix.mult(
           VecMath.SFMatrix4f.scale(new VecMath.SFVec3f(1, 1, 1))); 
    
   
    lastFrameTime = currentTime;
}


// Setup texture
function initTexture() {
    tex = gl.createTexture();
    tex.image = new Image();
    tex.image.crossOrigin = ''; // ?
    tex.image.src = "tex2.png";   // tex2.png
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
    secondPointerShader.dispose();
    minutePointerShader.dispose();
    hourPointerShader.dispose();
    boxShader.dispose();
    sphereShader.dispose();
    sphereShader1.dispose();
    
    // Scenes
    sceneOne.dispose();
    orientationScene.dispose();

    // Textured - Shaders
    boxShaderTex.dispose();
    houseShaderTex.dispose();
    sphereTexShader.dispose();
    
    // Lighting
    boxDiffuseShader.dispose();
    objCowShader.dispose();
    objCowShaderSpec.dispose();
    
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
        yawRate = 0.1;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
        // Right cursor key or D
        yawRate = -0.1;
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
    viewMat = viewMat.mult(VecMath.SFMatrix4f.translation(camPos.add(new VecMath.SFVec3f(0.0, 0.0, -7))));
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
        return;
    }
    
    var newX = event.clientX;
    var newY = event.clientY;
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
    
    lastMouseX = newX;
    lastMouseY = newY;  
}

// Setup perspective projection and invert viewMat
function initProjection() {
    viewMat = VecMath.SFMatrix4f.translation(camPos).inverse();
    projectionMat = VecMath.SFMatrix4f.perspective(Math.PI / 4, 1.0, 0.1, 1000.0);
}




