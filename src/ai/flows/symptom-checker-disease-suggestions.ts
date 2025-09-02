'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting potential diseases or conditions based on user-provided symptoms,
 * and provides recommendations on what to do next.
 *
 * - symptomCheckerDiseaseSuggestions - The function that initiates the symptom checking process.
 * - SymptomCheckerDiseaseSuggestionsInput - The input type for the symptomCheckerDiseaseSuggestions function.
 * - SymptomCheckerDiseaseSuggestionsOutput - The output type for the symptomCheckerDiseaseSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomCheckerDiseaseSuggestionsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A comma-separated list of symptoms the user is experiencing.'),
});
export type SymptomCheckerDiseaseSuggestionsInput = z.infer<
  typeof SymptomCheckerDiseaseSuggestionsInputSchema
>;

const SymptomCheckerDiseaseSuggestionsOutputSchema = z.object({
  suggestedConditions: z
    .string()
    .describe(
      'A list of potential diseases or conditions that could be causing the symptoms.'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations on what the user should do next, based on the suggested conditions.'
    ),
});
export type SymptomCheckerDiseaseSuggestionsOutput = z.infer<
  typeof SymptomCheckerDiseaseSuggestionsOutputSchema
>;

export async function symptomCheckerDiseaseSuggestions(
  input: SymptomCheckerDiseaseSuggestionsInput
): Promise<SymptomCheckerDiseaseSuggestionsOutput> {
  return symptomCheckerDiseaseSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomCheckerDiseaseSuggestionsPrompt',
  input: {schema: SymptomCheckerDiseaseSuggestionsInputSchema},
  output: {schema: SymptomCheckerDiseaseSuggestionsOutputSchema},
  prompt: `You are a medical expert. Given the following symptoms, suggest potential diseases or conditions that could be causing them, and provide recommendations on what the user should do next.

Symptoms: {{{symptoms}}}

Respond in a clear and concise manner.
`,
});

const symptomCheckerDiseaseSuggestionsFlow = ai.defineFlow(
  {
    name: 'symptomCheckerDiseaseSuggestionsFlow',
    inputSchema: SymptomCheckerDiseaseSuggestionsInputSchema,
    outputSchema: SymptomCheckerDiseaseSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
