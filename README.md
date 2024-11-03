# AI Remodeler

Homeowners often struggle to visualize remodeling ideas when meeting with contractors, with traditional methods taking over three weeks to deliver mockups. AI Remodeler changes the game by generating high-quality visualizations instantly. Using advanced AI, it transforms rooms based on user prompts—whether a full style change or specific object adjustments—making it easy for customers and contractors to align on the vision.

AI Remodeler brings dream homes to life faster and with greater clarity.

## Bridging the Gap Between Homeowners and Contractors

AI Remodeler transforms user prompts into high-quality, realistic remodel visualizations in minutes. Here’s how it works:

1. User Prompt: Homeowners simply describe their remodeling vision, such as “modernize the kitchen” or “replace sofa with a sectional.”

2. Intention Analysis: Our AI determines if the prompt requires a full-room style transformation or specific object changes (inpainting).

3. Enhanced Prompt Generation: Using Llama, AI Remodeler refines the prompt for optimal image generation, adding style details or specifying objects as needed.

4. Image Transformation: Leveraging advanced image-to-image and inpainting models, the AI remodels the image, capturing the homeowner’s vision accurately.

5. Instant Visualization: The transformed image is ready within minutes, giving homeowners and contractors a shared, clear visual to guide the project.

## Get Started

### Install Ollama API

```
curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3.2
```

### Install StableDiffusion-Webui

Followo [official documentation](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-NVidia-GPUs)

### Start React App

```
npm install
npm start
```

### Start Node server

```
cd api-server
node server.js
```

### Key components of our tech stack include:

1. Stable Diffusion & Custom Inpainting Models: These enable realistic style changes and object replacements within images, ensuring precision and lifelike detail.
2. Llama (NLP): Processes and enriches user prompts, intelligently guiding the AI to capture the desired remodeling style or specific adjustments.
3. React & Node.js: Form the backbone of our web application, providing a responsive, user-friendly interface for homeowners and contractors alike.
4. Docker: Facilitate seamless deployment and scaling of our AI models, ensuring reliability even under high demand.
