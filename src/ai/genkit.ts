import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';
config();

// This is a placeholder configuration.
// To enable GenAI features, configure a plugin and model.
// See: https://genkit.dev/docs/plugins
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
