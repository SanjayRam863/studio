'use server';
/**
 * @fileOverview This file defines a function for suggesting potential diseases or conditions based on user-provided symptoms,
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
      'A list of potential diseases or conditions that could be causing the symptoms. This should be a comma-separated string.'
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
  return symptomCheckerFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  input: {schema: SymptomCheckerDiseaseSuggestionsInputSchema},
  output: {schema: SymptomCheckerDiseaseSuggestionsOutputSchema},
  prompt: `You are an AI medical assistant. A user has provided the following symptoms: "{{{symptoms}}}".

Based on these symptoms, please provide:
1.  A list of potential, common conditions that could cause these symptoms. Do not provide a definitive diagnosis.
2.  General, safe recommendations for what the user could do next (e.g., rest, hydrate, when to see a doctor).

Acknowledge the user's symptoms in your recommendations.`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerDiseaseSuggestionsInputSchema,
    outputSchema: SymptomCheckerDiseaseSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await symptomCheckerPrompt(input);
    if (!output) {
      throw new Error('Failed to generate symptom suggestions.');
    }
    const disclaimer =
      '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';

    return {
      suggestedConditions: `Based on your symptoms, some possibilities include: ${output.suggestedConditions}. This is not a diagnosis.`,
      recommendations: output.recommendations + disclaimer,
    };
  }
);
