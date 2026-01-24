import { z } from "zod";

export const AnalysisSchema = z.object({
  theme: z
    .string()
    .describe(
      "The specific visual theme ID (e.g., 'midnight', 'ocean-breeze', 'neo-brutalism').",
    ),
  screens: z
    .array(
      z.object({
        id: z
          .string()
          .describe(
            "Unique identifier for the screen (e.g., 'home-dashboard', 'profile-settings', 'transaction-history'). Use kebab-case.",
          ),
        name: z
          .string()
          .describe(
            "Short, descriptive name of the screen (e.g., 'Home Dashboard', 'Profile', 'Transaction History')",
          ),
        purpose: z
          .string()
          .describe(
            "One clear sentence explaining what this screen accomplishes for the user and its role in the app",
          ),
        visualDescription: z
          .string()
          .describe(
            "A dense, high-fidelity visual directive (like an image generation prompt). Describe the layout, specific data examples (e.g. 'Oct-Mar'), component hierarchy, and physical attributes (e.g. 'Chunky cards', 'Floating header','Floating action button', 'Bottom navigation',Header with user avatar).",
          ),
      }),
    )
    .min(1)
    .max(4),
});
