import { serve } from "inngest/next";

import { inngest } from "@/inngest/client";
import { generateScreen } from "@/inngest/functions/generateScreen";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateScreen],
});
