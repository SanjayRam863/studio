'use server';

/**
 * @fileOverview This flow provides explanations for risk predictions related to Heart Disease, Diabetes, and Stroke.
 *
 * - riskPredictionExplanation - A function that generates explanations for risk scores.
 * - RiskPredictionExplanationInput - The input type for the riskPredictionExplanation function.
 * - RiskPredictionExplanationOutput - The return type for the riskPredictionExplanation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const RiskPredictionExplanationInputSchema = z.object({
  condition: z
    .enum(['Heart Disease', 'Diabetes', 'Stroke'])
    .describe('The health condition to explain the risk for.'),
  riskScore: z
    .number()
    .describe('The calculated risk score for the condition.'),
  factors: z
    .string()
    .describe(
      'A comma-separated list of factors contributing to the risk score.'
    ),
});
export type RiskPredictionExplanationInput = z.infer<
  typeof RiskPredictionExplanationInputSchema
>;

const RiskPredictionExplanationOutputSchema = z.object({
  explanation: z
    .string()
    .describe(
      'A detailed explanation of the risk score and contributing factors for the specified health condition. Explain how each factor contributes to the risk.'
    ),
  recommendations: z
    .string()
    .describe(
      'Specific, actionable recommendations for managing and reducing the risk associated with the condition. Provide detailed, condition-specific dietary and lifestyle advice formatted with markdown using "###" for headings and "-" for list items.'
    ),
});
export type RiskPredictionExplanationOutput = z.infer<
  typeof RiskPredictionExplanationOutputSchema
>;

export async function riskPredictionExplanation(
  input: RiskPredictionExplanationInput
): Promise<RiskPredictionExplanationOutput> {
    console.log("Generating risk explanation for:", input);
    
    const llmResponse = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: `A user has a simulated risk score of ${input.riskScore}% for ${input.condition}. The contributing factors are: ${input.factors}.
        1.  Provide a clear, easy-to-understand explanation of what this risk score means and briefly explain how the listed factors contribute to the risk for this specific condition.
        2.  Provide a set of actionable recommendations to help manage and reduce this risk. Structure the recommendations with markdown, using "###" for headings (e.g., "Dietary Changes", "Lifestyle Modifications") and "-" for list items under each heading.
        3.  Include a final, bolded disclaimer: "**Disclaimer**: This is a simulation and not a substitute for professional medical advice. Always consult a healthcare provider for an accurate diagnosis and treatment plan."`,
        output: {
            schema: RiskPredictionExplanationOutputSchema,
        }
    });

    return llmResponse.output!;
}
