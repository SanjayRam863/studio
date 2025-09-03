'use server';
/**
 * @fileOverview This file defines a function for suggesting potential diseases or conditions based on user-provided symptoms,
 * and provides recommendations on what to do next, including a simulated prescription.
 *
 * - symptomCheckerDiseaseSuggestions - The function that initiates the symptom checking process.
 * - SymptomCheckerDiseaseSuggestionsInput - The input type for the function.
 * - SymptomCheckerDiseaseSuggestionsOutput - The output type for the function.
 */
import {ai} from '@/ai/genkit';
import {generate} from '@genkit-ai/ai';
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
      'A list of potential diseases or conditions that could be causing the symptoms. This should be a comma-separated string.'
    ),
  recommendations: z
    .string()
    .describe(
      'Recommendations on what the user should do next, based on the suggested conditions.'
    ),
  prescription: z
    .string()
    .describe(
      'A simulated prescription for over-the-counter medication based on the symptoms. This should be formatted like a real prescription note.'
    ),
});
export type SymptomCheckerDiseaseSuggestionsOutput = z.infer<
  typeof SymptomCheckerDiseaseSuggestionsOutputSchema
>;

export async function symptomCheckerDiseaseSuggestions(
  input: SymptomCheckerDiseaseSuggestionsInput
): Promise<SymptomCheckerDiseaseSuggestionsOutput> {
  console.log('Checking symptoms for:', input);
  const llmResponse = await generate({
    model: 'gemini-1.5-flash-latest',
    prompt: `Based on the following symptoms: ${input.symptoms}, suggest potential conditions, provide recommendations, and generate a simulated prescription for over-the-counter medication. The prescription should include a disclaimer that it is not a substitute for professional medical advice.`,
    output: {
      schema: SymptomCheckerDiseaseSuggestionsOutputSchema,
    },
  });
  return llmResponse.output()!;
}
