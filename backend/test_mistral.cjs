require('dotenv').config({ path: '../.env' });
const { callAI } = require('./src/utils/ai');

async function testMistralVision() {
  try {
    const prompt = "What color is the dot?";
    const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="; // 1x1 red pixel
    
    const messages = [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/png;base64,${base64Data}`
            }
          }
        ]
      }
    ];

    console.log("Calling Mistral...");
    const response = await callAI(null, messages, { jsonMode: false, model: 'pixtral-12b-2409' });
    console.log("Response:", response.choices[0].message.content);
  } catch (err) {
    console.error("Error:", err);
  }
}

testMistralVision();
