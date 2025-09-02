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

        const userSymptoms = symptoms.toLowerCase().split(',').map(s => s.trim()).filter(s => s);

        const highUrgencySymptoms = ['chest pain', 'difficulty breathing', 'fainting', 'loss of consciousness', 'uncontrolled bleeding', 'seizure', 'severe pain', 'sudden numbness or weakness', 'trouble speaking', 'vision loss'];
        const mediumUrgencySymptoms = ['severe headache', 'dizziness', 'abdominal pain', 'high fever', 'vomiting or diarrhea', 'rash', 'confusion', 'shortness of breath with exertion'];

        const hasHighUrgencySymptom = userSymptoms.some(userSymptom => highUrgencySymptoms.includes(userSymptom));
        const hasMediumUrgencySymptom = userSymptoms.some(userSymptom => mediumUrgencySymptoms.includes(userSymptom));

        // High Urgency checks (Hypertensive Crisis, Shock, Severe Hypoxia, Critical Tachy/Bradycardia)
        if (
            bloodPressureSystolic >= 180 || bloodPressureDiastolic >= 120 ||
            bloodPressureSystolic < 90 || bloodPressureDiastolic < 60 ||
            oxygenSaturation < 90 ||
            heartRate > 130 || heartRate < 40 ||
            hasHighUrgencySymptom
        ) {
            urgencyLevel = 'High';
            explanation = 'The assessment is High Urgency due to critical vital signs or the presence of life-threatening symptoms (such as chest pain, difficulty breathing, or fainting). These signs may indicate a severe medical emergency.';
            nextSteps = 'Call emergency services (e.g., 911) immediately or go to the nearest emergency room.';
        } 
        // Medium Urgency checks (Hypertensive Urgency, moderate vital sign deviation)
        else if (
            (bloodPressureSystolic >= 160 && bloodPressureSystolic < 180) || (bloodPressureDiastolic >= 100 && bloodPressureDiastolic < 120) ||
            (oxygenSaturation >= 90 && oxygenSaturation < 94) ||
            (heartRate > 100 && heartRate <= 130) || (heartRate >= 40 && heartRate < 50) ||
            hasMediumUrgencySymptom
        ) {
            urgencyLevel = 'Medium';
            explanation = 'The assessment is Medium Urgency because your vital signs are significantly outside the normal range or you are experiencing symptoms (like severe headache or dizziness) that require prompt medical evaluation.';
            nextSteps = 'You should contact your doctor promptly or consider visiting an urgent care center today. Do not delay seeking medical advice.';
        } 
        // Low Urgency checks (Prehypertension or mild symptoms)
        else {
            urgencyLevel = 'Low';
            explanation = 'The assessment is Low Urgency. Your vital signs are relatively stable, and the reported symptoms do not suggest an immediate, severe condition. However, you should continue to monitor your health.';
            nextSteps = 'Monitor your symptoms at home. If they persist or worsen, schedule an appointment with your primary care physician for a follow-up.';
            if (bloodPressureSystolic >= 130 || bloodPressureDiastolic >= 85) {
                explanation += ' Your blood pressure is elevated, which should be discussed with a doctor.';
            }
        }

        const disclaimer = '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';
        
        return {
            urgencyLevel,
            explanation,
            nextSteps: nextSteps + disclaimer,
        };
    }
);
