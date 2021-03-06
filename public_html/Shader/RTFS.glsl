uniform sampler2D tex;
uniform int blurTech;
uniform int it;
uniform float numIt;
uniform vec2 resolution;
uniform float radDist;
varying vec2 vTexCoords;

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
	//const int it = 5; // -> Für Chrome
	
	if(blurTech == 0 || blurTech == 2){
		// i legt anzahl der umliegenden Pixel fest die betrachtet werden sollen 
		for(int i = -it; i < it; i++)
		{
			// Horizontal -> Durch Auflösung teilen um Mittelwert zu erhalten (mappen von 0-1)
			color += texture2D(tex, vTexCoords + vec2(i, 0.0) / (resolution.x / 1.0));
		}
		// Durch die Gesamtanzahl der Iterationen(Kernel) teilen um Mittelwert zu erhalten
		color /= numIt;
	}
	
	if(blurTech == 1 || blurTech == 2){
		for(int i = -it; i < it; i++)
		{
			// Vertikal 
			color += texture2D(tex, vTexCoords + vec2(0.0, i) / (resolution.y / 2.0));
		}
		color /= numIt;
	}
	
	if(blurTech == 3){
		for(int i = -it; i < it; i++)
		{
			// H/V
			color += texture2D(tex, vTexCoords + vec2(i, i) / (resolution.x / 2.0));
		}
		color /= numIt;
	}
	
	// Kernel for radial blur
	float samples[10];
		samples[0] = -0.08;
		samples[1] = -0.05;
		samples[2] = -0.03;
		samples[3] = -0.02;
		samples[4] = -0.01;
		samples[5] =  0.01;
		samples[6] =  0.02;
		samples[7] =  0.03;
		samples[8] =  0.05;
		samples[9] =  0.08;
	
	
	vec2 dir;
	float dist, t;
	vec4 sum;
	
	float sampleDist = 0.5;
    //float sampleStrength = 2.2; 
	
	if(blurTech == 4){
		dir = 0.5 - vTexCoords; 
		dist = sqrt(dir.x*dir.x + dir.y*dir.y); 
		dir = dir/dist; 

		color = texture2D(tex,vTexCoords); 
		sum = color;

		for (int i = 0; i < 10; i++)
			sum += texture2D( tex, vTexCoords + dir * samples[i] * sampleDist );

		sum *= 1.0/11.0;
		float t = dist * radDist; // sampleStrength
		t = clamp( t ,0.0,1.0);

		gl_FragColor = mix( color, sum, t );
	}
	
	
	if(blurTech != 4){
		gl_FragColor = color;
	}
}