'use server';
/**
 * @fileOverview Assesses the urgency of a medical situation based on health metrics and provides actionable next steps.
 *
 * - assessUrgencyAndSuggestNextSteps - A function that assesses urgency and suggests next steps.
 * - UrgencyAssessmentInput - The input type for the assessUrgencyAndSuggestNextSteps function.
 * - UrgencyAssessmentOutput - The return type for the assessUrgencyAndSuggestNextSteps function.
 */

import {z} from 'genkit';

const UrgencyAssessmentInputSchema = z.object({
  heartRate: z.number().describe('Heart rate in beats per minute.'),
  bloodPressureSystolic: z
    .number()
    .describe('Systolic blood pressure in mmHg.'),
  bloodPressureDiastolic: z
    .number()
    .describe('Diastolic blood pressure in mmHg.'),
  oxygenSaturation: z.number().describe('Oxygen saturation percentage.'),
  symptoms: z.string().describe('Description of symptoms experienced.'),
});
export type UrgencyAssessmentInput = z.infer<typeof UrgencyAssessmentInputSchema>;

const UrgencyAssessmentOutputSchema = z.object({
  urgencyLevel: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The assessed urgency level.'),
  nextSteps: z.string().describe('Recommended next steps based on the assessment.'),
  explanation: z.string().describe('Explanation of the urgency assessment.'),
});
export type UrgencyAssessmentOutput = z.infer<typeof UrgencyAssessmentOutputSchema>;

export async function assessUrgencyAndSuggestNextSteps(
  input: UrgencyAssessmentInput
): Promise<UrgencyAssessmentOutput> {
  // Simulate a delay to mimic an API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { heartRate, bloodPressureSystolic, bloodPressureDiastolic, oxygenSaturation, symptoms } = input;
  let urgencyLevel: 'High' | 'Medium' | 'Low' = 'Low';
  let explanation = '';

  const lowercasedSymptoms = symptoms.toLowerCase();
  
  // High urgency checks
  if (
    heartRate > 130 || heartRate < 40 ||
    bloodPressureSystolic > 180 || bloodPressureSystolic < 90 ||
    bloodPressureDiastolic > 120 || bloodPressureDiastolic < 60 ||
    oxygenSaturation < 90 ||
    lowercasedSymptoms.includes('chest pain') || lowercasedSymptoms.includes('shortness of breath') || lowercasedSymptoms.includes('difficulty breathing') || lowercasedSymptoms.includes('fainting') || lowercasedSymptoms.includes('sudden numbness')
  ) {
    urgencyLevel = 'High';
    explanation = 'The provided vitals or symptoms (e.g., very high/low heart rate or blood pressure, low oxygen, chest pain, or breathing difficulty) indicate a potentially life-threatening situation that requires immediate medical attention.';
  } 
  // Medium urgency checks
  else if (
    heartRate > 100 || heartRate < 50 ||
    bloodPressureSystolic > 140 || bloodPressureSystolic < 100 ||
    bloodPressureDiastolic > 90 || bloodPressureDiastolic < 70 ||
    oxygenSaturation < 95 ||
    lowercasedSymptoms.includes('dizziness') || lowercasedSymptoms.includes('severe headache') || lowercasedSymptoms.includes('abdominal pain')
  ) {
    urgencyLevel = 'Medium';
    explanation = 'The provided vitals or symptoms are outside the normal range and warrant medical consultation within the next 24 hours to prevent potential complications.';
  }
  // Low urgency 
  else {
    urgencyLevel = 'Low';
    explanation = 'The provided vitals and symptoms appear to be within a relatively stable range. However, you should continue to monitor for any changes.';
  }

  let nextSteps = '';
  if (urgencyLevel === 'High') {
    nextSteps = 'Immediate medical attention is required. Call emergency services (e.g., 911) or go to the nearest emergency room.';
  } else if (urgencyLevel === 'Medium') {
    nextSteps = 'Medical consultation is recommended within 24 hours. Contact your healthcare provider or visit an urgent care clinic.';
  } else {
    nextSteps = 'Monitor symptoms and consult with your healthcare provider for further evaluation during a regular appointment. Follow any existing treatment plans.';
  }
  
  nextSteps += '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';

  return {
    urgencyLevel,
    nextSteps,
    explanation,
  };
}
