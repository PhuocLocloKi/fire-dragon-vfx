# 🔥 Ultimate Fire Dragon 🐉

A highly interactive and smooth fire dragon animation built with pure HTML, CSS, SVG, and Vanilla JavaScript.

## ✨ What makes this code special?

Instead of using heavy 3D libraries, this project combines SVG and Canvas creatively:

* **Kinetic Segmented Body (Math Physics):** The dragon consists of 40 independent SVG segments. Using `Math.atan2` and distance calculations, each segment smoothly tracks the one in front of it, creating a realistic slithering movement.
* **SVG Filters & Animated Gradients:** The intense magma heat and glowing eyes aren't just colors. The code uses advanced SVG filters (`feGaussianBlur`, `feColorMatrix`) and animated `<linearGradient>` to create a pulsating, breathing fire effect.
* **Canvas Fire Particle System:** A `<canvas>` layer runs a custom particle engine. As the dragon moves or flaps its wings, it spawns dynamic "sparks" with varying velocities, life-spans, and fading physics. 
* **Wing Flapping Simulation:** Specific segments (index 8 and 14) are coded to act as wings. Using Sine waves (`Math.sin(frame * 20)`), the wings naturally scale and rotate to simulate flying.
* **Auto-Idle Mode:** If the user doesn't touch the screen or mouse for 2 seconds, the dragon automatically goes into "idle mode," flying in a smooth, continuous pattern around the screen.

## 🚀 How to Run

It's completely vanilla! No npm, no servers, no dependencies.
Just download the files and open `index.html` in any modern web browser to see the dragon fly.
