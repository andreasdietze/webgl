/* global VecMath */

/*
var wallChain = new Array(6);

var OrientationScene = function (gl, mh) {
    //this.wallChain = new Array(6);
    createWallChain(gl, mh);
};

function createWallChain(gl, mh) {
    var shader = new Shader();
    var drawable;

    for (var i = 0; i < 6; i++) {
        drawable = new Drawable();
        mh.setupBox(1.0);//(0.25);
        shader.initGL(gl);
        shader.initShader(mh.vss, mh.fss);
        drawable.initGL(gl);

        switch (i) {
            case 0:  // Back
                // Set color
                var colors = new Array(
                        // front
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        // back
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6
                        );

                drawable.setBufferData(mh.mesh.vertices,
                        colors,
                        mh.mesh.tex,
                        mh.mesh.normals,
                        mh.mesh.indices,
                        mh.mesh.trans);

                // Position
                var vec = new VecMath.SFVec3f(0.0, 0.0, -60.0);  // -15
                var scale = new VecMath.SFVec3f(30, 30, 0.1);
                
                drawable.md.transformMatrix = drawable.md.transformMatrix.mult(
                        VecMath.SFMatrix4f.translation(vec));
                drawable.md.transformMatrix = drawable.md.transformMatrix.mult(
                        VecMath.SFMatrix4f.scale(scale));

                //drawable.md.transformMatrix._03 = vec.x;
                //drawable.md.transformMatrix._13 = vec.y;
                //drawable.md.transformMatrix._23 = vec.z;

                // Scale
                //vec = new VecMath.SFVec3f(10, 10, 0.1);
                //drawable.md.transformMatrix._00 = vec.x;
                //drawable.md.transformMatrix._11 = vec.y;
                //drawable.md.transformMatrix._22 = vec.z;

                // Add to array
                wallChain[i] = drawable;

                break;

            case 1: // Ground
                // Set color
                var colors = new Array(
                        // front
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        // back
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4
                        );

                drawable.setBufferData(mh.mesh.vertices,
                        colors,
                        mh.mesh.tex,
                        mh.mesh.normals,
                        mh.mesh.indices,
                        mh.mesh.trans);

                // Position
                var vec = new VecMath.SFVec3f(0.0, -30.0, 0.0);  // -7.5

                drawable.md.transformMatrix._03 = vec.x;
                drawable.md.transformMatrix._13 = vec.y;
                drawable.md.transformMatrix._23 = vec.z;

                // Scale
                vec = new VecMath.SFVec3f(30, 0.1, 60);
                drawable.md.transformMatrix._00 = vec.x;
                drawable.md.transformMatrix._11 = vec.y;
                drawable.md.transformMatrix._22 = vec.z;

                // Add to array
                wallChain[i] = drawable;
                break;

            case 2: // Left
                // Set color
                var colors = new Array(
                        // front
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        // back
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2
                        );

                drawable.setBufferData(mh.mesh.vertices,
                        colors,
                        mh.mesh.tex,
                        mh.mesh.normals,
                        mh.mesh.indices,
                        mh.mesh.trans);

                // Position
                var vec = new VecMath.SFVec3f(-30.0, 0.0, 0.0); // -7.5

                drawable.md.transformMatrix._03 = vec.x;
                drawable.md.transformMatrix._13 = vec.y;
                drawable.md.transformMatrix._23 = vec.z;

                // Scale
                vec = new VecMath.SFVec3f(0.1, 30, 60);
                drawable.md.transformMatrix._00 = vec.x;
                drawable.md.transformMatrix._11 = vec.y;
                drawable.md.transformMatrix._22 = vec.z;

                // Add to array
                wallChain[i] = drawable;
                break;

            case 3: // Right
                // Set color
                var colors = new Array(
                        // front
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        // back
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2,
                        0.2, 0.2, 0.2
                        );

                drawable.setBufferData(mh.mesh.vertices,
                        colors,
                        mh.mesh.tex,
                        mh.mesh.normals,
                        mh.mesh.indices,
                        mh.mesh.trans);

                // Position
                var vec = new VecMath.SFVec3f(30.0, 0.0, 0.0); // 7.5

                drawable.md.transformMatrix._03 = vec.x;
                drawable.md.transformMatrix._13 = vec.y;
                drawable.md.transformMatrix._23 = vec.z;

                // Scale
                vec = new VecMath.SFVec3f(0.1, 30, 60);
                drawable.md.transformMatrix._00 = vec.x;
                drawable.md.transformMatrix._11 = vec.y;
                drawable.md.transformMatrix._22 = vec.z;

                // Add to array
                wallChain[i] = drawable;
                break;

            case 4: // Top
                // Set color
                var colors = new Array(
                        // front
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        // back
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4,
                        0.4, 0.4, 0.4
                        );

                drawable.setBufferData(mh.mesh.vertices,
                        colors,
                        mh.mesh.tex,
                        mh.mesh.normals,
                        mh.mesh.indices,
                        mh.mesh.trans);

                // Position
                var vec = new VecMath.SFVec3f(0.0, 30.0, 0.0); // 7.5

                drawable.md.transformMatrix._03 = vec.x;
                drawable.md.transformMatrix._13 = vec.y;
                drawable.md.transformMatrix._23 = vec.z;

                // Scale
                vec = new VecMath.SFVec3f(30, 0.1, 60);
                drawable.md.transformMatrix._00 = vec.x;
                drawable.md.transformMatrix._11 = vec.y;
                drawable.md.transformMatrix._22 = vec.z;

                // Add to array
                wallChain[i] = drawable;
                break;

            case 5: // Top
                // Set color
                var colors = new Array(
                        // front
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        // back
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6,
                        0.6, 0.6, 0.6
                        );

                drawable.setBufferData(mh.mesh.vertices,
                        colors,
                        mh.mesh.tex,
                        mh.mesh.normals,
                        mh.mesh.indices,
                        mh.mesh.trans);

                // Position
                var vec = new VecMath.SFVec3f(0.0, 0.0, 60.0); // 15

                drawable.md.transformMatrix._03 = vec.x;
                drawable.md.transformMatrix._13 = vec.y;
                drawable.md.transformMatrix._23 = vec.z;

                // Scale
                vec = new VecMath.SFVec3f(30, 30, 0.1);
                drawable.md.transformMatrix._00 = vec.x;
                drawable.md.transformMatrix._11 = vec.y;
                drawable.md.transformMatrix._22 = vec.z;

                // Add to array
                wallChain[i] = drawable;
                break;
        }
    }
}

OrientationScene.prototype.draw = function (boxShader, viewMat, projectionMat) {
    for (var i = 0; i < wallChain.length; i++)
        wallChain[i].draw(boxShader.sp, viewMat, projectionMat);
};

OrientationScene.prototype.update = function (mat) {
    for (var i = 0; i < wallChain.length; i++)
    {
        //var foo = VecMath.SFMatrix4f.identity();
       // wallChain[i].md.transformMatrix = VecMath.SFMatrix4f.identity();
        wallChain[i].md.transformMatrix = wallChain[i].md.transformMatrix.mult(mat);
    }
};

OrientationScene.prototype.dispose = function () {
    for (var i = 0; i < wallChain.length; i++)
        wallChain[i].dispose();
};

*/