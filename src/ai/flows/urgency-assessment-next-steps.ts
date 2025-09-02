'use server';
/**
 * @fileOverview Assesses the urgency of a medical situation based on health metrics and provides actionable next steps using an AI bot.
 *
 * - assessUrgencyAndSuggestNextSteps - A function that assesses urgency and suggests next steps.
 */

import {
  UrgencyAssessmentInputSchema,
  UrgencyAssessmentOutputSchema,
  type UrgencyAssessmentInput,
  type UrgencyAssessmentOutput,
} from '@/ai/schemas/urgency-assessment-schemas';


const highUrgencySymptoms = [
    'chest pain', 'difficulty breathing', 'fainting', 'loss of consciousness',
    'uncontrolled bleeding', 'seizure', 'sudden numbness', 'sudden weakness',
    'trouble speaking', 'vision loss'
];

const mediumUrgencySymptoms = [
    'severe headache', 'dizziness', 'abdominal pain', 'high fever',
    'persistent vomiting', 'persistent diarrhea', 'confusion'
];


export async function assessUrgencyAndSuggestNextSteps(
  input: UrgencyAssessmentInput
): Promise<UrgencyAssessmentOutput> {
    
    let urgencyLevel: 'High' | 'Medium' | 'Low' = 'Low';
    let explanation = 'The vital signs are within a relatively stable range.';

    // Process symptoms
    const userSymptoms = input.symptoms.toLowerCase().split(',').map(s => s.trim());
    const hasHighUrgencySymptom = userSymptoms.some(s => highUrgencySymptoms.includes(s));
    const hasMediumUrgencySymptom = userSymptoms.some(s => mediumUrgencySymptoms.includes(s));

    // Urgency Logic
    if (input.bloodPressureSystolic >= 180 || input.bloodPressureDiastolic >= 120) {
        urgencyLevel = 'High';
        explanation = 'Hypertensive crisis detected based on very high blood pressure.';
    } else if (input.bloodPressureSystolic < 90 || input.bloodPressureDiastolic < 60) {
        urgencyLevel = 'High';
        explanation = 'Dangerously low blood pressure (potential shock) detected.';
    } else if (input.heartRate > 130 || input.heartRate < 40) {
        urgencyLevel = 'High';
        explanation = 'Critical heart rate (tachycardia or bradycardia) detected.';
    } else if (input.oxygenSaturation < 90) {
        urgencyLevel = 'High';
        explanation = 'Severe low oxygen saturation (hypoxia) detected.';
    } else if (hasHighUrgencySymptom) {
        urgencyLevel = 'High';
        explanation = `High urgency symptoms reported, such as ${userSymptoms.find(s => highUrgencySymptoms.includes(s))}.`;
    } else if (input.bloodPressureSystolic >= 160 || input.bloodPressureDiastolic >= 100) {
        urgencyLevel = 'Medium';
        explanation = 'Significantly high blood pressure detected.';
    } else if (input.heartRate > 100 || input.heartRate < 50) {
        urgencyLevel = 'Medium';
        explanation = 'Abnormal heart rate detected.';
    } else if (input.oxygenSaturation < 94) {
        urgencyLevel = 'Medium';
        explanation = 'Low oxygen saturation detected.';
    } else if (hasMediumUrgencySymptom) {
        urgencyLevel = 'Medium';
        explanation = `Medium urgency symptoms reported, such as ${userSymptoms.find(s => mediumUrgencySymptoms.includes(s))}.`;
    }
    
    let nextSteps = '';
    const disclaimer = '\n\n**Disclaimer**: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';
    
    switch (urgencyLevel) {
        case 'High':
            nextSteps = "Call emergency services (e.g., 911) immediately or go to the nearest emergency room.";
            break;
        case 'Medium':
            nextSteps = "You should contact your doctor promptly or consider visiting an urgent care center today. Do not delay seeking medical advice.";
            break;
        case 'Low':
            nextSteps = "Monitor your symptoms at home. If they persist or worsen, schedule an appointment with your primary care physician for a follow-up.";
            if (input.bloodPressureSystolic > 130 || input.bloodPressureDiastolic > 85) {
                nextSteps += " Your blood pressure is slightly elevated; it's recommended to discuss this with your doctor during your next visit.";
            }
            break;
    }

    return {
        urgencyLevel,
        explanation,
        nextSteps: nextSteps + disclaimer,
    };
}
