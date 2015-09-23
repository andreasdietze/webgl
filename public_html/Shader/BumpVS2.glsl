// init Attributes
attribute vec3 position;
attribute vec2 texCoords;
attribute vec3 normal;
attribute vec3 tangent;

// init Uniforms
uniform mat4 transformation;
uniform mat4 modelViewMat;
uniform mat4 normalMat;
uniform mat4 viewMat;

varying vec2 vTexCoords;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vEyeVec;
varying vec3 vLightVec;
varying vec3 vHalfVec;

void main() {
	vPosition = (modelViewMat * vec4(position, 1.0)).xyz;
	vNormal   = (normalMat * vec4(normal, 0.0)).xyz;
	vTexCoords = texCoords;

	// http://www.ozone3d.net/smf/index.php?topic=80.0
	vec3 t;
	vec3 b;
	vec3 n;

	vec3 c1 = cross(normal, vec3(0.0, 0.0, 1.0) );
	vec3 c2 = cross(normal, vec3(0.0, 1.0, 0.0) );

	if( length(c1)>length(c2) )
	{
		t = c1;	
	}
	else
	{
		t = c2;	
	}

	t = normalize(tangent);  // tangent
	n = normalize(normal);
	b = cross(n, t);
	b = normalize(b);
	
	//t = tangent;  // tangent
	//n = normal;
	//b = cross(n, t);
	
	vec3 tmpVec = normalize((viewMat * vec4(-1.0, 0.0, -1.0, 1.0)).xyz);  // viewMat
	vLightVec.x = dot(tmpVec, t);
	vLightVec.y = dot(tmpVec, b);
	vLightVec.z = dot(tmpVec, n);

	tmpVec = -vPosition;
	vEyeVec.x = dot(tmpVec, t);
	vEyeVec.y = dot(tmpVec, b);
	vEyeVec.z = dot(tmpVec, n);

	tmpVec = (vLightVec + vEyeVec);
	vHalfVec.x = dot(tmpVec, t);
	vHalfVec.y = dot(tmpVec, b);
	vHalfVec.z = dot(tmpVec, n);
   
	// Set the position of the current vertex
	gl_Position = transformation * vec4(position, 1.0);
}