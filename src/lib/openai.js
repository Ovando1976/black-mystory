import axios from 'axios';

const OPENAI_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; // Make sure you've set this in your `.env.local` file.

export const OpenAI = async (prompt) => {
    const headers = {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
    };

    const data = {
        prompt: prompt,
        max_tokens: 150 // or any other parameters you'd like to set
    };

    const response = await axios.post(OPENAI_ENDPOINT, data, { headers });

    if (response.data && response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].text.trim();
    } else {
        throw new Error('Failed to get a valid response from OpenAI.');
    }
};
