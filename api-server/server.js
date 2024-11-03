const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(bodyParser.json());

const OLLAMA_API_URL = "http://localhost:11434";

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
