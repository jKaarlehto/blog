// Requires glfx.js and html2canvas to be loaded before this script
window.addEventListener('load', function() {
    var lines = new Image();
    lines.src = '/images/scanlines.png';

    lines.onload = function() {
        var wContent = document.querySelector('.w-content');
        var crtCanvas = document.getElementById('crt-canvas');
        var ctx = crtCanvas.getContext('2d');
        var renderCRT = function() {
            html2canvas(wContent, {backgroundColor: null}).then(function(canvas) {
                // Draw the content to the CRT canvas
                ctx.clearRect(0, 0, crtCanvas.width, crtCanvas.height);
                ctx.drawImage(canvas, 0, 0, crtCanvas.width, crtCanvas.height);

                // Now apply glfx.js effects
                try {
                    var glcanvas = fx.canvas();
                    var texture = glcanvas.texture(crtCanvas);
                    glcanvas.draw(texture)
                        .bulgePinch(crtCanvas.width/2, crtCanvas.height/2, crtCanvas.width*0.75, 0.12)
                        .vignette(0.25, 0.74)
                        .update();

                    // Draw the glfx-processed image back to the CRT canvas
                    ctx.clearRect(0, 0, crtCanvas.width, crtCanvas.height);
                    ctx.drawImage(glcanvas, 0, 0, crtCanvas.width, crtCanvas.height);
                } catch (e) {
                    // If glfx.js fails, just show the normal canvas
                }

                // Overlay scanlines
                ctx.globalAlpha = 0.5;
                ctx.drawImage(lines, 0, 0, crtCanvas.width, crtCanvas.height);
                ctx.globalAlpha = 1.0;

                // Only now hide the w-content
                wContent.style.visibility = 'hidden';
                wContent.style.pointerEvents = 'none';
                wContent.style.position = 'absolute';
                wContent.style.left = '0';
                wContent.style.top = '0';
                wContent.style.width = '100%';
                wContent.style.height = '100%';
            }).catch(function() {
                // If html2canvas fails, show the content as fallback
                wContent.style.visibility = 'visible';
                wContent.style.pointerEvents = '';
                wContent.style.position = '';
                wContent.style.left = '';
                wContent.style.top = '';
                wContent.style.width = '';
                wContent.style.height = '';
            });
        };

        // Initial render
        renderCRT();

        // Re-render on window resize (optional, for responsiveness)
        window.addEventListener('resize', function() {
            renderCRT();
        });
    };
}); 