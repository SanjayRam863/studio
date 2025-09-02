'use server';
/**
 * @fileOverview This file defines a function for generating first aid instructions for a given medical problem.
 *
 * @exports {
 *   generateFirstAidInstructions - The function that initiates the instruction generation process.
 *   FirstAidInput - The input type for the function.
 *   FirstAidOutput - The output type for the function.
 * }
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FirstAidInputSchema = z.object({
  problem: z.string().describe('The medical problem or emergency requiring first aid.'),
});
export type FirstAidInput = z.infer<typeof FirstAidInputSchema>;

const FirstAidOutputSchema = z.object({
  instructions: z
    .string()
    .describe(
      'A detailed, step-by-step guide for administering first aid for the specified problem. Use markdown with "###" for headings and "- " for list items.'
    ),
  disclaimer: z
    .string()
    .describe(
      'A clear and prominent disclaimer stating that this is not a substitute for professional medical advice and to call emergency services.'
    ),
});
export type FirstAidOutput = z.infer<typeof FirstAidOutputSchema>;

export async function generateFirstAidInstructions(
  input: FirstAidInput
): Promise<FirstAidOutput> {
  return firstAidFlow(input);
}

const firstAidPrompt = ai.definePrompt({
  name: 'firstAidPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: FirstAidInputSchema },
  output: { schema: FirstAidOutputSchema },
  prompt: `You are an expert paramedic providing clear, calm, and accurate first aid instructions. A user needs help with a medical problem.

User's problem: {{{problem}}}

1.  **Instructions**:
    -   Generate a step-by-step guide for the specific problem.
    -   Structure the guide with clear headings using '###' for different stages (e.g., ### Assess the Scene, ### Stop the Bleeding, ### When to Call for Help).
    -   Under each heading, provide a numbered or bulleted list of actions.
    -   Be concise and use simple language that a layperson can understand in a stressful situation.
    -   If the problem is severe (e.g., chest pain, severe bleeding, choking, unresponsiveness), the VERY FIRST step should be to call emergency services.

2.  **Disclaimer**:
    -   Provide a strong, clear disclaimer. It should state: "This is a first aid guide and not a substitute for professional medical evaluation. For any serious injury, call your local emergency number (e.g., 911) immediately."
`,
});

const firstAidFlow = ai.defineFlow(
  {
    name: 'firstAidFlow',
    inputSchema: FirstAidInputSchema,
    outputSchema: FirstAidOutputSchema,
  },
  async (input: FirstAidInput) => {
    const { output } = await firstAidPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return valid first aid instructions.');
    }
    return output;
  }
);
