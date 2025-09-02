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

const symptomMap: { [key: string]: string[] } = {
  fever: ['Common Cold', 'Flu', 'Infection'],
  cough: ['Common Cold', 'Flu', 'Bronchitis', 'Allergies'],
  headache: ['Tension Headache', 'Migraine', 'Dehydration', 'Common Cold'],
  'sore throat': ['Common Cold', 'Strep Throat', 'Flu'],
  'runny nose': ['Common Cold', 'Allergies'],
  'chest pain': ['Heart Attack (Emergency!)', 'Angina', 'Costochondritis', 'Acid Reflux'],
  'shortness of breath': ['Asthma', 'Pneumonia', 'Heart Failure (Emergency!)'],
};

const symptomCheckerFlow = ai.defineFlow(
  {
    name: 'symptomCheckerFlow',
    inputSchema: SymptomCheckerDiseaseSuggestionsInputSchema,
    outputSchema: SymptomCheckerDiseaseSuggestionsOutputSchema,
  },
  async (input: SymptomCheckerDiseaseSuggestionsInput) => {
    const userSymptoms = input.symptoms.toLowerCase().split(',').map(s => s.trim());
    const suggestions = new Set<string>();

    userSymptoms.forEach(symptom => {
      Object.keys(symptomMap).forEach(key => {
        if (symptom.includes(key)) {
          symptomMap[key].forEach(condition => suggestions.add(condition));
        }
      });
    });

    if (suggestions.size === 0) {
      suggestions.add('General malaise');
    }

    const suggestedConditions = `Based on your symptoms of "${input.symptoms}", some possibilities include: ${Array.from(suggestions).join(', ')}. This is not a diagnosis.`;
    const recommendations = `Given that you're experiencing "${input.symptoms}", it's important to rest and stay hydrated. If your symptoms worsen, or if you experience severe symptoms like chest pain or difficulty breathing, please seek medical attention immediately.`;
    
    const disclaimer = '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';

    return {
      suggestedConditions,
      recommendations: recommendations + disclaimer,
    };
  }
);
