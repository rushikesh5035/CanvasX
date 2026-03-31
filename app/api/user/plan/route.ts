import { successResponse, unauthorizedResponse } from "@/lib/api-response";
import { auth } from "@/lib/auth";
import { getUserPlan } from "@/lib/subscription";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) return unauthorizedResponse();

  const plan = await getUserPlan(session.user.id);
  return successResponse(plan);
}
