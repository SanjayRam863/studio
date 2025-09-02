'use server';
/**
 * @fileOverview This file defines a function for suggesting potential diseases or conditions based on user-provided symptoms,
 * and provides recommendations on what to do next, including a simulated prescription.
 *
 * - symptomCheckerDiseaseSuggestions - The function that initiates the symptom checking process.
 * - SymptomCheckerDiseaseSuggestionsInput - The input type for the function.
 * - SymptomCheckerDiseaseSuggestionsOutput - The output type for the function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  return symptomCheckerFlow(input);
}

const symptomCheckerPrompt = ai.definePrompt({
  name: 'symptomCheckerPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: SymptomCheckerDiseaseSuggestionsInputSchema },
  output: { schema: SymptomCheckerDiseaseSuggestionsOutputSchema },
  prompt: `You are an AI medical assistant. A user has provided a list of their symptoms. Your task is to suggest potential conditions, provide recommendations, and generate a simulated prescription for OTC medication.

User's symptoms: {{{symptoms}}}

1.  **Suggested Conditions**:
    -   Based on the user's symptoms, list 3-5 potential, common medical conditions.
    -   Phrase the output carefully, starting with: "Based on your symptoms of '{{{symptoms}}}', some possibilities include: [list of conditions]".
    -   Explicitly state that this is not a diagnosis.

2.  **Recommendations**:
    -   Provide general, safe recommendations for the user.
    -   Start by acknowledging their symptoms: "Given that you're experiencing '{{{symptoms}}}', it's important to...".
    -   Include advice like resting and hydrating.
    -   Crucially, advise them to seek immediate medical attention if symptoms worsen or if they experience severe symptoms (e.g., chest pain, difficulty breathing).

3.  **Simulated Prescription**:
    -   Generate a plausible, simulated prescription for an over-the-counter (OTC) medication that could alleviate the user's symptoms.
    -   Format it to look like a simple prescription note. Include:
        - Patient Name: (use "User")
        - Date: (use today's date)
        - Medication: (e.g., Ibuprofen 200mg, Acetaminophen 500mg)
        - Dosage: (e.g., 1-2 tablets every 4-6 hours as needed)
        - Reason: (e.g., For relief of headache and fever)
        - Doctor: Dr. AI Assistant (Simulated)
    -   If the symptoms are severe or warrant a doctor's visit, the prescription should state "See a doctor for a proper diagnosis and prescription."
    -   Conclude with a clear disclaimer: "Disclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan."
`,
});

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerDiseaseSuggestionsInputSchema,
    outputSchema: SymptomCheckerDiseaseSuggestionsOutputSchema,
  },
  async (input: SymptomCheckerDiseaseSuggestionsInput) => {
    const { output } = await symptomCheckerPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid suggestion.');
    }
    return output;
  }
);
