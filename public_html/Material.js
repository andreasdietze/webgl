/* global VecMath */

"use strict";

var Material = function(){
    this.Ka = new VecMath.SFVec3f(0.1, 0.1, 0.1);
    this.Kd = new VecMath.SFVec3f(0.6, 0.6, 0.6);
    this.Ks = new VecMath.SFVec3f(0.2, 0.2, 0.2);
    this.Ke = new VecMath.SFVec3f(0.0, 0.0, 0.0);
    this.diffuseMapPath = null;
    this.specularMapPath = null;
    this.normalMapPath = null;
};

Material.prototype.setAmbientColor = function(Ka){
    return this.Ka = Ka;
};

Material.prototype.getAmbientColor = function(){
    return this.Ka;
};

Material.prototype.setDiffuseColor = function(Kd){
    return this.Kd = Kd;
};

Material.prototype.getDiffuseColor = function(){
    return this.Kd;
};

Material.prototype.setSpecularColor = function(Ks){
    return this.Ks = Ks;
};

Material.prototype.getSpecularColor = function(){
    return this.Ks;
};

Material.prototype.setEmissiveColor = function(Ke){
    return this.Ke = Ke;
};

Material.prototype.getEmissiveColor = function(){
    return this.Ke;
};

// TODO : set Ka, Kd, Ks, diffTexPath
Material.prototype.readMaterialFromMTL = function(path){
};