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
    name: 'urgencyPrompt',
    model: 'googleai/gemini-1.5-flash',
    input: { schema: UrgencyAssessmentInputSchema },
    output: { schema: UrgencyAssessmentOutputSchema },
    prompt: `You are an AI medical assistant designed to assess the urgency of a situation based on vital signs and symptoms.
Analyze the following user data to determine the urgency level and provide next steps.

User's Vitals:
- Heart Rate: {{{heartRate}}} BPM
- Blood Pressure: {{{bloodPressureSystolic}}}/{{{bloodPressureDiastolic}}} mmHg
- Oxygen Saturation: {{{oxygenSaturation}}}%
- Symptoms: {{{symptoms}}}

Follow these medical standards for your assessment:

1.  **Urgency Level Assignment**:
    -   **High Urgency**: Assign this level if any of the following are met:
        -   Blood Pressure: Systolic ≥ 180 or Diastolic ≥ 120 (Hypertensive Crisis)
        -   Blood Pressure: Systolic < 90 or Diastolic < 60 (Potential Shock)
        -   Heart Rate: > 130 bpm or < 40 bpm (Critical Tachycardia/Bradycardia)
        -   Oxygen Saturation: < 90% (Severe Hypoxia)
        -   Symptoms include any of: chest pain, difficulty breathing, fainting, loss of consciousness, uncontrolled bleeding, seizure, sudden numbness or weakness, trouble speaking, vision loss.
    -   **Medium Urgency**: Assign this level if none of the High Urgency criteria are met, but any of the following are:
        -   Blood Pressure: Systolic 160-179 or Diastolic 100-119
        -   Heart Rate: 101-130 bpm or 40-49 bpm
        -   Oxygen Saturation: 90-94%
        -   Symptoms include any of: severe headache, dizziness, abdominal pain, high fever, persistent vomiting or diarrhea, confusion.
    -   **Low Urgency**: If neither High nor Medium criteria are met.

2.  **Explanation**:
    -   Provide a clear, concise explanation for the assigned urgency level.
    -   Reference the specific vital signs or symptoms that led to your conclusion. For example, "The assessment is High Urgency due to a heart rate of... and reports of chest pain."

3.  **Next Steps**:
    -   Provide direct, unambiguous next steps based on the urgency level.
    -   **High Urgency**: "Call emergency services (e.g., 911) immediately or go to the nearest emergency room."
    -   **Medium Urgency**: "You should contact your doctor promptly or consider visiting an urgent care center today. Do not delay seeking medical advice."
    -   **Low Urgency**: "Monitor your symptoms at home. If they persist or worsen, schedule an appointment with your primary care physician for a follow-up." If blood pressure is elevated (Systolic > 130 or Diastolic > 85), add a note to discuss it with their doctor.
    -   Finally, add the disclaimer: "Disclaimer: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan."
`
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
        return output;
    }
);
