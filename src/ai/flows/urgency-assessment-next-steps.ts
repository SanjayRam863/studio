'use server';
/**
 * @fileOverview Assesses the urgency of a medical situation based on health metrics and provides actionable next steps using an AI bot.
 *
 * - assessUrgencyAndSuggestNextSteps - A function that assesses urgency and suggests next steps.
 * - UrgencyAssessmentInput - The input type for the assessUrgencyAndSuggestNextSteps function.
 * - UrgencyAssessmentOutput - The return type for the assessUrgencyAndSuggestNextSteps function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const UrgencyAssessmentInputSchema = z.object({
  heartRate: z.number().describe('Heart rate in beats per minute.'),
  bloodPressureSystolic: z
    .number()
    .describe('Systolic blood pressure in mmHg.'),
  bloodPressureDiastolic: z
    .number()
    .describe('Diastolic blood pressure in mmHg.'),
  oxygenSaturation: z.number().describe('Oxygen saturation percentage.'),
  symptoms: z.string().describe('Description of symptoms experienced by the user.'),
});
export type UrgencyAssessmentInput = z.infer<typeof UrgencyAssessmentInputSchema>;

export const UrgencyAssessmentOutputSchema = z.object({
  urgencyLevel: z
    .enum(['High', 'Medium', 'Low'])
    .describe('The assessed urgency level. Use High for life-threatening situations, Medium for conditions needing prompt attention, and Low for stable conditions.'),
  nextSteps: z.string().describe('Recommended next steps for the user based on the assessment. Be very specific, e.g., "Call emergency services (e.g., 911) or go to the nearest emergency room." for high urgency.'),
  explanation: z.string().describe('A detailed explanation of why the urgency level was assigned, referencing the specific vitals and symptoms provided.'),
});
export type UrgencyAssessmentOutput = z.infer<typeof UrgencyAssessmentOutputSchema>;

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
