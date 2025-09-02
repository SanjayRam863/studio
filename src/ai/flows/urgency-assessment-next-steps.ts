'use server';
/**
 * @fileOverview Assesses the urgency of a medical situation based on health metrics and provides actionable next steps using an AI bot.
 *
 * - assessUrgencyAndSuggestNextSteps - A function that assesses urgency and suggests next steps.
 */

import {ai} from '@/ai/genkit';
import {
  UrgencyAssessmentInputSchema,
  UrgencyAssessmentOutputSchema,
  type UrgencyAssessmentInput,
  type UrgencyAssessmentOutput,
} from '@/ai/schemas/urgency-assessment-schemas';

export async function assessUrgencyAndSuggestNextSteps(
  input: UrgencyAssessmentInput
): Promise<UrgencyAssessmentOutput> {
  return assessUrgencyFlow(input);
}

const assessUrgencyFlow = ai.defineFlow(
    {
        name: 'assessUrgencyFlow',
        inputSchema: UrgencyAssessmentInputSchema,
        outputSchema: UrgencyAssessmentOutputSchema,
    },
    async (input) => {
        const { heartRate, bloodPressureSystolic, bloodPressureDiastolic, oxygenSaturation, symptoms } = input;

        let urgencyLevel: 'High' | 'Medium' | 'Low' = 'Low';
        let explanation = '';
        let nextSteps = '';

        const lowerSymptoms = symptoms.toLowerCase();

        if (
            heartRate > 120 || heartRate < 50 ||
            bloodPressureSystolic > 180 || bloodPressureSystolic < 90 ||
            bloodPressureDiastolic > 110 || bloodPressureDiastolic < 60 ||
            oxygenSaturation < 92 ||
            lowerSymptoms.includes('chest pain') || lowerSymptoms.includes('difficulty breathing') || lowerSymptoms.includes('fainting')
        ) {
            urgencyLevel = 'High';
            explanation = 'The assessment is High Urgency due to significantly abnormal vital signs or the presence of critical symptoms like chest pain or difficulty breathing. These may indicate a life-threatening condition.';
            nextSteps = 'Call emergency services (e.g., 911) or go to the nearest emergency room immediately.';
        } else if (
            heartRate > 100 || heartRate < 60 ||
            bloodPressureSystolic > 140 || bloodPressureSystolic < 100 ||
            bloodPressureDiastolic > 90 || bloodPressureDiastolic < 70 ||
            oxygenSaturation < 95 ||
            lowerSymptoms.includes('severe headache') || lowerSymptoms.includes('dizziness') || lowerSymptoms.includes('abdominal pain')
        ) {
            urgencyLevel = 'Medium';
            explanation = 'The assessment is Medium Urgency because your vital signs are moderately outside the normal range or you are experiencing significant symptoms. This requires prompt medical attention.';
            nextSteps = 'You should contact your doctor or visit an urgent care center within the next few hours. Do not delay seeking care.';
        } else {
            urgencyLevel = 'Low';
            explanation = 'The assessment is Low Urgency because your vital signs are stable and the reported symptoms are not indicative of an acute, severe condition.';
            nextSteps = 'Monitor your symptoms at home. You can schedule an appointment with your primary care physician to discuss your symptoms if they persist or worsen.';
        }

        const disclaimer = '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';
        
        return {
            urgencyLevel,
            explanation,
            nextSteps: nextSteps + disclaimer,
        };
    }
);
