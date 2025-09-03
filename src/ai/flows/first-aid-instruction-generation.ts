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
import { generate } from '@genkit-ai/ai';
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
  console.log('Generating first aid for:', input);

  const llmResponse = await generate({
    model: 'gemini-1.5-flash-latest',
    prompt: `Generate a detailed, step-by-step first aid guide for the following medical problem: "${input.problem}".
    Structure the instructions with markdown, using "###" for main headings (like "Assess the Scene", "For a [Problem]", "When to Call for Help") and "- " for list items under each heading.
    Also, provide a clear and prominent disclaimer stating that this is a first aid guide and not a substitute for professional medical evaluation, and to call a local emergency number for any serious injury.`,
    output: {
      schema: FirstAidOutputSchema,
    },
  });

  return llmResponse.output()!;
}
