/**
 * @fileOverview This file defines the Zod schemas and TypeScript types for the urgency assessment feature.
 * It is used to ensure type safety and validation for the inputs and outputs of the urgency assessment flow.
 */
import {z} from 'zod';

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