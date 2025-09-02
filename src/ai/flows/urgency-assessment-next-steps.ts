'use server';
/**
 * @fileOverview Assesses the urgency of a medical situation based on health metrics and provides actionable next steps.
 *
 * - assessUrgencyAndSuggestNextSteps - A function that assesses urgency and suggests next steps.
 * - UrgencyAssessmentInput - The input type for the assessUrgencyAndSuggestNextSteps function.
 * - UrgencyAssessmentOutput - The return type for the assessUrgencyAndSuggestNextSteps function.
 */

import {ai} from '@/ai/genkit';
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
  return assessUrgencyAndSuggestNextStepsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'urgencyAssessmentPrompt',
  input: {schema: UrgencyAssessmentInputSchema},
  output: {schema: UrgencyAssessmentOutputSchema},
  prompt: `You are an AI assistant specialized in assessing medical urgency based on provided health metrics and symptoms. Analyze the following information and determine the urgency level (High, Medium, or Low), provide actionable next steps, and explain your assessment.\n
Health Metrics:\n- Heart Rate: {{{heartRate}}} bpm\n- Blood Pressure: {{{bloodPressureSystolic}}}/{{{bloodPressureDiastolic}}} mmHg\n- Oxygen Saturation: {{{oxygenSaturation}}}%\n- Symptoms: {{{symptoms}}}\n\nBased on the urgency level, provide specific and actionable next steps. Consider the following:\n- High Urgency: Immediate medical attention is required. Call emergency services or go to the nearest emergency room.\n- Medium Urgency: Medical consultation is recommended within 24 hours. Contact your healthcare provider or visit an urgent care clinic.\n- Low Urgency: Monitor symptoms and consult with your healthcare provider for further evaluation. Follow any existing treatment plans.\n\nRespond in the following JSON format:\n{
  "urgencyLevel": "The assessed urgency level (High, Medium, or Low)",
  "nextSteps": "Specific and actionable next steps based on the assessment",
  "explanation": "A brief explanation of the assessment, justifying the assigned urgency level and recommended next steps"
}
`,
});

const assessUrgencyAndSuggestNextStepsFlow = ai.defineFlow(
  {
    name: 'assessUrgencyAndSuggestNextStepsFlow',
    inputSchema: UrgencyAssessmentInputSchema,
    outputSchema: UrgencyAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

