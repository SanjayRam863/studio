'use server';
/**
 * @fileOverview This file defines a function for suggesting potential diseases or conditions based on user-provided symptoms,
 * and provides recommendations on what to do next.
 *
 * - symptomCheckerDiseaseSuggestions - The function that initiates the symptom checking process.
 * - SymptomCheckerDiseaseSuggestionsInput - The input type for the symptomCheckerDiseaseSuggestions function.
 * - SymptomCheckerDiseaseSuggestionsOutput - The output type for the symptomCheckerDiseaseSuggestions function.
 */

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

const symptomMap: { [key: string]: { conditions: string[], recommendations: string } } = {
    'headache': {
        conditions: ['Migraine', 'Tension Headache', 'Dehydration'],
        recommendations: 'Rest in a quiet, dark room. Drink plenty of water. If the headache is severe or persistent, consult a doctor.'
    },
    'fever': {
        conditions: ['Common Cold', 'Flu', 'Infection'],
        recommendations: 'Rest, drink fluids, and take over-the-counter fever reducers. If the fever is high or lasts more than a few days, see a doctor.'
    },
    'cough': {
        conditions: ['Common Cold', 'Bronchitis', 'Allergies'],
        recommendations: 'Stay hydrated. Use a humidifier. If the cough is severe or you have trouble breathing, seek medical attention.'
    },
     'sore throat': {
        conditions: ['Common Cold', 'Strep Throat', 'Tonsillitis'],
        recommendations: 'Gargle with salt water and drink warm liquids. If you have a fever and difficulty swallowing, consult a doctor to rule out strep throat.'
    }
};

export async function symptomCheckerDiseaseSuggestions(
  input: SymptomCheckerDiseaseSuggestionsInput
): Promise<SymptomCheckerDiseaseSuggestionsOutput> {
    // Simulate a delay to mimic an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userSymptoms = input.symptoms.toLowerCase().split(',').map(s => s.trim());
    
    let suggestedConditions: string[] = [];
    let recommendations: string[] = [];

    userSymptoms.forEach(symptom => {
        for (const key in symptomMap) {
            if (symptom.includes(key)) {
                suggestedConditions.push(...symptomMap[key].conditions);
                if (!recommendations.includes(symptomMap[key].recommendations)) {
                  recommendations.push(symptomMap[key].recommendations);
                }
            }
        }
    });

    if (suggestedConditions.length === 0) {
        suggestedConditions.push('General Malaise');
        recommendations.push('Based on your symptoms, it\'s hard to determine the cause. It is recommended to monitor your symptoms and consult a doctor if they worsen or do not improve.');
    }
    
    const uniqueConditions = [...new Set(suggestedConditions)];

    return {
        suggestedConditions: `Based on your symptoms, some possibilities include: ${uniqueConditions.join(', ')}. This is not a diagnosis.`,
        recommendations: recommendations.join('\n') + '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.'
    };
}
