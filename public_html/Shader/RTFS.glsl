varying vec2 vTexCoords;
uniform sampler2D tex;

void main() {
    vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
	
	// i legt anzahl der umliegenden Pixel fest die betrachtet werden sollen 
	for(int i = -5; i < 5; i++)
	{
		// Vertikal
		color += texture2D(tex, vTexCoords + vec2(i, 0.0) / 512.0);
	}
	// Durch die Gesamtanzahl der Pixel teilen um Mittelwert zu erhalten
	color /= 10.0;
	
	for(int i = -5; i < 5; i++)
	{
		// Horizontal 
		color += texture2D(tex, vTexCoords + vec2(0.0, i) / 512.0);
	}
	color /= 10.0;
	
	gl_FragColor = color;
}