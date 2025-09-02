'use server';
/**
 * @fileOverview A flow to find medical attenders for senior citizens.
 *
 * This file defines a function that uses a tool to find nearby medical attenders
 * based on a user-provided location.
 *
 * @exports {
 *   findMedicalAttenders - Function to trigger the medical attender search.
 *   MedicalAttenderInput - Input type for the search.
 *   MedicalAttenderOutput - Output type for the search.
 * }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MedicalAttenderInputSchema = z.object({
  location: z.string().describe('The city and state to search for medical attenders (e.g., "Chennai, TN").'),
});
export type MedicalAttenderInput = z.infer<typeof MedicalAttenderInputSchema>;

const AttenderSchema = z.object({
    name: z.string().describe("The name of the doctor or specialist."),
    address: z.string().describe("The clinic or hospital address."),
    contact: z.string().describe("The phone number for the clinic/hospital."),
    services: z.array(z.string()).describe("A list of specializations (e.g., 'Cardiologist', 'General Physician')."),
});

const MedicalAttenderOutputSchema = z.object({
  attenders: z.array(AttenderSchema).describe("A list of doctors found."),
  response: z.string().describe("A summary of the search results or a message if no results were found.")
});
export type MedicalAttenderOutput = z.infer<typeof MedicalAttenderOutputSchema>;


const findAttendersTool = ai.defineTool(
    {
        name: 'findAttendersTool',
        description: 'Finds doctors and specialists in a specific location. Returns a list of doctors or an empty list if none are found.',
        inputSchema: MedicalAttenderInputSchema,
        outputSchema: z.object({
            attenders: z.array(AttenderSchema),
        }),
    },
    async (input) => {
        // This is a mock implementation. In a real application, this would
        // call a real API or database to find doctors.
        console.log(`Searching for doctors in ${input.location}...`);

        // Simulate a database of doctors
        const mockDatabase: { [key: string]: z.infer<typeof AttenderSchema>[] } = {
            "chennai, tn": [
                { name: "Dr. Priya Sharma", address: "Apollo Hospital, Greams Road, Chennai", contact: "044-28293333", services: ["Cardiologist"] },
                { name: "Dr. Arjun Reddy", address: "Fortis Malar Hospital, Adyar, Chennai", contact: "044-42892222", services: ["Orthopedic Surgeon"] },
                { name: "Dr. Anjali Mehta", address: "MGM Healthcare, Aminjikarai, Chennai", contact: "044-45242424", services: ["Neurologist", "General Physician"] },
            ],
            "coimbatore, tn": [
                { name: "Dr. Suresh Kumar", address: "PSG Hospitals, Peelamedu, Coimbatore", contact: "0422-2570170", services: ["Pediatrician"] },
                { name: "Dr. Kavitha Nair", address: "G. Kuppuswamy Naidu Memorial Hospital, Pappanaickenpalayam, Coimbatore", contact: "0422-2245000", services: ["Dermatologist"] },
            ],
        };

        const key = input.location.toLowerCase().trim();
        return {
            attenders: mockDatabase[key] || [],
        };
    }
);

export async function findMedicalAttenders(
  input: MedicalAttenderInput
): Promise<MedicalAttenderOutput> {
    const key = input.location.toLowerCase().trim();
    const result = await findAttendersTool({ location: key });
    
    if (result.attenders.length > 0) {
        return {
            attenders: result.attenders,
            response: `Found ${result.attenders.length} doctors.`
        };
    } else {
        return {
            attenders: [],
            response: `Sorry, no doctors were found for "${input.location}". Please try a different city in Tamil Nadu.`
        };
    }
}
