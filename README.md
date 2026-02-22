# Radio Stream Player

A sleek, modern, and feature-rich web-based radio stream player built with vanilla JavaScript and the Web Audio API. It provides a great listening experience with dynamic audio visualizations.

 
*(Note: This is a sample GIF. You can replace it with a real screenshot or GIF of your application.)*

**[🔴 Live Demo](http://radio.djay.ca/)**

*Note: The live demo is hosted via HTTP to support "Mixed Content" playback. Many radio streams still use HTTP, which modern browsers block if the site is loaded via HTTPS.*

## ✨ Features

- **Multiple Stations**: Comes pre-loaded with a selection of high-quality electronic music radio streams.
- **Dynamic Audio Visualization**: Real-time VU meters powered by the Web Audio API.
- **Multiple VU Meter Styles**: Cycle through six different visualizer styles:
  - Classic (Vertical Bars)
  - LED (Segmented Display)
  - Circular (Radial Progress)
  - Waveform (Oscilloscope)
  - Spectrum (Frequency Bars)
  - Retro (Analog Needle)
- **Light & Dark Themes**: Automatically detects the user's system preference and allows manual toggling.
- **Pop-out Player**: Open the player in a separate, compact window for easy multitasking.
- **Accessible**: Built with accessibility in mind, featuring screen reader support and full keyboard navigation.
- **Responsive Design**: Looks and works great on both desktop and mobile devices.
- **Session-Aware**: Remembers your selected theme across browser sessions using `localStorage`. Volume and station are maintained within the current session, including when using the pop-out player.

## 🛠️ Technologies Used

- **HTML5**: For the structure of the player.
- **CSS3**: For styling, including custom properties for theming and responsive design.
- **Vanilla JavaScript (ES6+)**: For all player logic, interactivity, and state management.
- **Web Audio API**: For audio processing and creating the dynamic visualizations.

## 🚀 Getting Started

This project is designed to be run directly in a web browser. No build step is required.

1.  Clone the repository:
    ```bash
    git clone https://github.com/BrainAV/Radio-Stream-Player.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd Radio-Stream-Player
    ```
3.  Open the `index.html` file in your favorite web browser.

Due to browser security policies (CORS) regarding audio streaming, you might need to run it from a local web server for all features to work correctly. A simple way to do this is using Python:

```bash
# For Python 3
python -m http.server

# For Python 2
python -m SimpleHTTPServer
```
Then, navigate to `http://localhost:8000` in your browser.