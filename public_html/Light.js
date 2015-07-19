/* global VecMath */

/* Setup light object:
 * - Object can be set as a directional, point, spot or headlight */
var Light = function (direction, position, lightColor, lightStyle){
    
    // Properties
    this.direction = direction;
    this.position = position;
    
    // Default color or user spec
    this.ambientColor = new VecMath.SFVec3f(0.1, 0.1, 0.1);
    this.lightColor = lightColor ? lightColor : 
            new VecMath.SFVec3f(1.0, 1.0, 0.8);
    this.specularColor = new VecMath.SFVec3f(0.9, 0.9, 0.9);

    this.diffIntensity = 1.0;
    this.specIntensity = 1.0;
    this.shininess = 128.0;
        
    // Default style or user spec 
    this.lightStyle = lightStyle ? lightStyle : 0;
};

// Lightstyle
Light.prototype.setLightStyle = function(lightStyle){
    return this.lightStyle = lightStyle;   
};

Light.prototype.getLightStyle = function(){
    return this.lightStyle;   
};

// Lightcolor (Diffuse)
Light.prototype.setLightColor = function(color){
    return this.lightColor = color;
};

Light.prototype.getLightColor = function(){
    return this.lightColor;
};

// Spuecularcolor
Light.prototype.setSpecularColor = function(color){
    return this.specularColor = color;
};

Light.prototype.getSpecularColor = function(){
    return this.specularColor;
};

// Ambiencolor
Light.prototype.setAmbientColor = function(color){
    return this.ambientColor = color;
};

Light.prototype.getAmbientColor = function(){
    return this.ambientColor;
};

// Lightposition
Light.prototype.setPosition = function(position){
    return this.poition = position;
};

Light.prototype.getPosition = function(){
    return this.lightPosition;
};

// Lightdirection
Light.prototype.setDirection = function(direction){
    return this.direction = direction;
};

Light.prototype.getDirection = function(){
    return this.lightDirection;
};

// Shininess
Light.prototype.setShininess = function(shininess){
    return this.shininess = shininess;  
};

Light.prototype.getShininess = function(){
    return this.shininess;
};

// Intensity
Light.prototype.setIntensity = function(intensity){
    return this.intensity = intensity;  
};

Light.prototype.getIntensity = function(){
    return this.intensity;
};



// TODO
Light.prototype.initDirectionalLight = function(){
    
    return this.setLightStyle(0);
};

// TODO
Light.prototype.initPointLight = function(){
    
    return this.setLightStyle(2);
};

// TODO
Light.prototype.initSpotLight = function(){
    
    return this.setLightStyle(3);
};

// TODO
Light.prototype.initHeadLight = function(){
    
    return this.setLightStyle(1);
};