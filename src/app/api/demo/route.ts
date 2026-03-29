import { NextResponse } from "next/server";

import { DEMO_SESSION } from "@/lib/demo-data";
import { getProviderStatus } from "@/services/relay-service";

export function GET() {
  return NextResponse.json({
    session: DEMO_SESSION,
    providers: getProviderStatus(),
  });
}
