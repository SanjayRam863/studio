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
        recommendations: 'For headaches, rest in a quiet, dark room and drink plenty of water. If it is severe or persistent, consult a doctor.'
    },
    'fever': {
        conditions: ['Common Cold', 'Flu', 'Infection'],
        recommendations: 'For a fever, rest, drink fluids, and consider over-the-counter fever reducers. If the fever is high or lasts more than a few days, see a doctor.'
    },
    'cough': {
        conditions: ['Common Cold', 'Bronchitis', 'Allergies'],
        recommendations: 'For a cough, stay hydrated and use a humidifier. If you have trouble breathing, seek medical attention.'
    },
     'sore throat': {
        conditions: ['Common Cold', 'Strep Throat', 'Tonsillitis'],
        recommendations: 'For a sore throat, gargle with salt water and drink warm liquids. If you have a fever and difficulty swallowing, consult a doctor.'
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

    const uniqueConditions = [...new Set(suggestedConditions)];

    let conditionsText: string;
    if (uniqueConditions.length > 0) {
      conditionsText = `Based on your symptoms, some possibilities include: ${uniqueConditions.join(', ')}.`;
    } else {
      conditionsText = "I couldn't identify a specific condition based on your symptoms.";
    }
    conditionsText += " This is not a diagnosis.";
    
    let recommendationsText = `You mentioned you are experiencing: ${input.symptoms}.\n\n`;
    if (recommendations.length > 0) {
      recommendationsText += recommendations.join('\n');
    } else {
      recommendationsText += 'It is recommended to monitor your symptoms and consult a doctor if they worsen or do not improve.';
    }

    recommendationsText += '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';

    return {
        suggestedConditions: conditionsText,
        recommendations: recommendationsText,
    };
}
