const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
// app.use(
//   cors({
//     origin: "http://localhost:3000/design",
//   })
// );
// app.use(cors());
app.use(cors({ origin: "*" }));
// app.use(bodyParser.json());
// Increase the body size limit
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

const OLLAMA_API_URL = "http://localhost:11434";
const STABLE_DIFFUSION_URL = "http://127.0.0.1:7860";
const NEGATIVE_PROMPT =
  "unrelated objects, outdoor scenes, people, animals, vehicles, text or watermarks, blurry, distorted, low-resolution, overexposed, underexposed, noisy, cartoonish, unrealistic, clutter, messy, damaged furniture, poor lighting, uncoordinated colors, incomplete render, vintage, retro, outdated, gothic, medieval, fantasy";

app.post("/api/generate", async (req, res) => {
  const { model, messages, stream } = req.body;

  try {
    const response = await axios.post(`${OLLAMA_API_URL}/api/chat`, {
      model: model,
      messages: messages,
      stream: stream,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error communicating with Ollama API:", error.message);
    res.status(500).send("Error communicating with Ollama API.");
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});

app.post("/api/generate-image", async (req, res) => {
  const body = req.body;
  const inputImage = body.input_image;
  const runMode = body.run_mode || "inpaint";

  console.log("body: ", body);

  // Common payload for both inpaint and segment modes
  const commonPayload = {
    batch_size: body.batch_size || 1,
    cfg_scale: body.cfg_scale || 9,
    height: body.height || 640,
    width: body.width || 832,
    n_iter: body.n_iter || 1,
    steps: body.steps || 20,
    sampler_name: body.sampler_name || "Euler a",
    scheduler: body.scheduler || "Karras",
    prompt: `${body.prompt}, best quality, highres`,
    negative_prompt: body.negative_prompt || NEGATIVE_PROMPT,
    seed: body.seed || 42,
    seed_enable_extras: body.seed_enable_extras || false,
    seed_resize_from_h: body.seed_resize_from_h || 0,
    seed_resize_from_w: body.seed_resize_from_w || 0,
    subseed: body.subseed || -1,
    subseed_strength: body.subseed_strength || 0,
    override_settings: body.override_settings || {},
    override_settings_restore_afterwards:
      body.override_settings_restore_afterwards || false,
    s_churn: body.s_churn || 0,
    s_min_uncond: body.s_min_uncond || 0,
    s_noise: body.s_noise || 1,
    s_tmax: body.s_tmax || 0,
    s_tmin: body.s_tmin || 0,
    script_args: body.script_args || [],
    script_name: body.script_name || null,
    styles: body.styles || [],
    init_images: [inputImage],
    do_not_save_samples: true,
    do_not_save_grid: true,
    send_images: true,
    save_images: false,
    resize_mode: body.resize_mode || 0,
    image_cfg_scale: 0,
  };

  let img2imgPayload;

  if (runMode === "inpaint") {
    const maskImage = body.mask_image;
    img2imgPayload = {
      ...commonPayload,
      denoising_strength: body.denoising_strength || 0.95,
      initial_noise_multiplier: body.initial_noise_multiplier || 1,
      inpaint_full_res: body.inpaint_full_res || 1,
      inpaint_full_res_padding: body.inpaint_full_res_padding || 32,
      inpainting_fill: body.inpainting_fill || 2,
      inpainting_mask_invert: body.inpainting_mask_invert || 0,
      mask_blur_x: body.mask_blur_x || 4,
      mask_blur_y: body.mask_blur_y || 4,
      mask_blur: body.mask_blur || 6,
      mask: maskImage,
    };
  } else if (runMode === "segment") {
    img2imgPayload = {
      ...commonPayload,
      steps: body.steps || 15,
      denoising_strength: body.denoising_strength || 1.0,
      alwayson_scripts: {
        ControlNet: {
          args: [
            {
              control_mode: "Balanced",
              enabled: true,
              guidance_end: 1,
              guidance_start: 0,
              low_vram: false,
              model: "diffusion_pytorch_model.fp16 [f7f9e6c9]",
              module: "seg_ofade20k",
              pixel_perfect: true,
              processor_res: 640,
              resize_mode: "Crop and Resize",
            },
          ],
        },
      },
    };
  } else {
    return res.status(400).json({ error: "Invalid run_mode" });
  }

  try {
    // Make the request to the locally deployed Stable Diffusion API
    const response = await axios.post(
      `${STABLE_DIFFUSION_URL}/sdapi/v1/img2img`,
      img2imgPayload
    );
    const responseData = response.data;

    if (!responseData.images) {
      return res.status(500).json({ error: "Error in image generation" });
    } else {
      res.status(200).json({ image: responseData.images[0] });
    }
  } catch (error) {
    console.error(
      "Error communicating with Stable Diffusion API:",
      error.message
    );
    res
      .status(500)
      .json({ error: "Error communicating with Stable Diffusion API" });
  }
});
