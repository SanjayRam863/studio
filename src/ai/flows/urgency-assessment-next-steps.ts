'use server';
/**
 * @fileOverview Assesses the urgency of a medical situation based on health metrics and provides actionable next steps using an AI bot.
 *
 * - assessUrgencyAndSuggestNextSteps - A function that assesses urgency and suggests next steps.
 */
import {ai} from '@/ai/genkit';
import {generate} from '@genkit-ai/ai';
import {
  UrgencyAssessmentInputSchema,
  UrgencyAssessmentOutputSchema,
  type UrgencyAssessmentInput,
  type UrgencyAssessmentOutput,
} from '@/ai/schemas/urgency-assessment-schemas';

export async function assessUrgencyAndSuggestNextSteps(
  input: UrgencyAssessmentInput
): Promise<UrgencyAssessmentOutput> {
  const llmResponse = await generate({
    model: 'gemini-1.5-flash-latest',
    prompt: `Assess the urgency of a medical situation based on the following health metrics and symptoms:
    - Heart Rate: ${input.heartRate} bpm
    - Blood Pressure: ${input.bloodPressureSystolic}/${input.bloodPressureDiastolic} mmHg
    - Oxygen Saturation: ${input.oxygenSaturation}%
    - Symptoms: ${input.symptoms}

    Determine if the urgency level is High, Medium, or Low. Provide a clear explanation for the assessment and suggest specific next steps. Include a disclaimer that this is not a substitute for professional medical advice.`,
    output: {
      schema: UrgencyAssessmentOutputSchema,
    },
  });
  return llmResponse.output()!;
}
