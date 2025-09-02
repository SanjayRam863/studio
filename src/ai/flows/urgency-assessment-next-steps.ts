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


const urgencyPrompt = ai.definePrompt({
    name: 'urgencyAssessmentPrompt',
    input: { schema: UrgencyAssessmentInputSchema },
    output: { schema: UrgencyAssessmentOutputSchema },
    prompt: `You are an expert medical triage AI. Your role is to assess the urgency of a patient's situation based on their vital signs and symptoms.

    Analyze the following data:
    - Heart Rate: {{{heartRate}}} BPM
    - Blood Pressure: {{{bloodPressureSystolic}}}/{{{bloodPressureDiastolic}}} mmHg
    - Oxygen Saturation: {{{oxygenSaturation}}}%
    - Symptoms: "{{{symptoms}}}"

    Based on this information, determine the urgency level (High, Medium, or Low). Provide a clear explanation for your assessment, referencing the specific data points that led to your conclusion. Finally, give specific, actionable next steps for the user.

    High Urgency examples: chest pain, difficulty breathing, fainting, very high/low vitals.
    Medium Urgency examples: severe headache, dizziness, abdominal pain, moderately abnormal vitals.
    Low Urgency examples: stable vitals with mild or non-acute symptoms.

    Always include a disclaimer that this is not a substitute for professional medical advice.`,
});


const assessUrgencyFlow = ai.defineFlow(
    {
        name: 'assessUrgencyFlow',
        inputSchema: UrgencyAssessmentInputSchema,
        outputSchema: UrgencyAssessmentOutputSchema,
    },
    async (input) => {
        const { output } = await urgencyPrompt(input);
        if (!output) {
            throw new Error('The AI model did not return a valid assessment.');
        }

        // Ensure the disclaimer is always present
        const disclaimer = '\n\nDisclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan.';
        
        return {
            ...output,
            nextSteps: output.nextSteps + disclaimer,
        };
    }
);
