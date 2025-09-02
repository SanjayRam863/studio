'use server';

/**
 * @fileOverview This flow provides explanations for risk predictions related to Heart Disease, Diabetes, and Stroke.
 *
 * - riskPredictionExplanation - A function that generates explanations for risk scores.
 * - RiskPredictionExplanationInput - The input type for the riskPredictionExplanation function.
 * - RiskPredictionExplanationOutput - The return type for the riskPredictionExplanation function.
 */

import {z} from 'genkit';

const RiskPredictionExplanationInputSchema = z.object({
  condition:
    z.enum(['Heart Disease', 'Diabetes', 'Stroke'])
      .describe('The health condition to explain the risk for.'),
  riskScore: z.number().describe('The calculated risk score for the condition.'),
  factors:
    z.string()
      .describe(
        'A comma-separated list of factors contributing to the risk score.'
      ),
});
export type RiskPredictionExplanationInput = z.infer<
  typeof RiskPredictionExplanationInputSchema
>;

const RiskPredictionExplanationOutputSchema = z.object({
  explanation:
    z.string()
      .describe(
        'A detailed explanation of the risk score and contributing factors for the specified health condition.'
      ),
  recommendations:
    z.string()
      .describe(
        'Specific recommendations for managing and reducing the risk associated with the condition.'
      ),
});
export type RiskPredictionExplanationOutput = z.infer<
  typeof RiskPredictionExplanationOutputSchema
>;

const getExplanation = (condition: string, riskScore: number, factors: string) => {
    let riskLevel = 'low';
    if (riskScore > 70) {
        riskLevel = 'high';
    } else if (riskScore > 40) {
        riskLevel = 'moderate';
    }

    let explanation = `Your simulated risk score for ${condition} is ${riskScore}%, which is considered ${riskLevel}. This is a simulated score and not a real medical diagnosis.\n\n`;
    explanation += `The calculation considered the following factors: ${factors}. `;

    if (factors.includes('Smoker')) {
        explanation += `Smoking is a major contributor to ${condition} risk. `;
    }
    if (factors.includes('Family history')) {
        explanation += `A family history can increase your predisposition to the condition. `;
    }
    if (factors.match(/Age: (\d+)/) && parseInt(factors.match(/Age: (\d+)/)![1]) > 50) {
        explanation += `Advanced age is also a known risk factor. `;
    }

    return explanation;
}

const getRecommendations = (condition: string, riskScore: number) => {
    let recommendations = 'General recommendations include maintaining a healthy lifestyle. Please consult a healthcare professional for personalized advice.\n\n';
    if (riskScore > 40) {
        recommendations += `- **Diet**: Focus on a balanced diet rich in fruits, vegetables, and whole grains. Reduce intake of processed foods, sugar, and saturated fats.\n`;
        recommendations += `- **Exercise**: Aim for at least 150 minutes of moderate-intensity exercise per week.\n`;
    }
    if (riskScore > 70) {
        recommendations += `- **Regular Check-ups**: It is highly recommended to schedule regular check-ups with your doctor to monitor your health status.\n`;
    }
     recommendations += `- **Quit Smoking**: If you smoke, quitting is one of the most effective ways to reduce your risk.\n`;

    return recommendations;
}


export async function riskPredictionExplanation(
  input: RiskPredictionExplanationInput
): Promise<RiskPredictionExplanationOutput> {
    // Simulate a delay to mimic an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { condition, riskScore, factors } = input;

    const explanation = getExplanation(condition, riskScore, factors);
    const recommendations = getRecommendations(condition, riskScore);

    return {
        explanation,
        recommendations,
    };
}
