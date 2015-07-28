// init Attributes
attribute vec3 position;
attribute vec2 texCoords;
attribute vec3 normal;

// init Uniforms
uniform vec3 translation;
uniform mat4 transformation;
uniform mat4 normalMat;
uniform mat4 modelViewMat;
uniform float time;
uniform int deformStyle;

// init Varyings
varying vec3 vPosition;
varying vec2 vTexCoords;
varying vec3 vNormal;

void main() {

	
	float s, c, z;
	vec3 v, n;
	if(deformStyle == 0){
		// calculate a scale factor.
		s = sin( (time+3.0*position.y)*4.0 );
		c = cos( (time+5.0*position.z)*4.0 );
		z = 0.05 * s * c;
		// offset the position along the normal.
		v = vec3(position) + normal * z;
		n = vec3(normal) + position * z;
		
		vPosition = (modelViewMat * vec4(v, 1.0)).xyz;
		vNormal   = (normalMat * vec4(n, 0.0)).xyz;
		vTexCoords = texCoords;
		gl_Position = transformation * vec4(v, 1.0);
	}
	
	float angle, freqx, freqy, freqz, amp, f;
	float posX, posY, posZ;
	if(deformStyle == 1){
		// Just some random sin/cos equation to make things look random 
		angle = time; //(time % 360) * 2;
		//float freqx = 0.4+sin(time)*1.0;
		freqx = 0.4+sin(time)*0.1;
		//float freqy = 1.0+sin(time*1.3)*2.0;
		freqy = 1.0+sin(time*1.3)*0.2;
		//float freqz = 1.1+sin(time*1.1)*3.0;
		freqz = 1.1+sin(time*1.1)*0.3;
		//float amp = 1.0+sin(time*1.4)*10.0;
		amp = 1.0+sin(time*1.4)*0.10;
		
		f = sin(normal.x*freqx + time) * sin(normal.y*freqy + time) * sin(normal.z*freqz + time);
		posZ = position.z;
		posZ += normal.z * freqz * amp * f;
		posX = position.x; 
		posX += normal.x * freqx * amp * f;
		posY = position.y;
		posY += normal.y * freqy * amp * f;
		
		vPosition = (modelViewMat * vec4(posX, posY, posZ, 1.0)).xyz;
		vNormal   = (normalMat * vec4(normal, 0.0)).xyz;
		vTexCoords = texCoords;
		gl_Position = transformation * vec4(posX, posY, posZ, 1.0);
	}
}