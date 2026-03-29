import Link from "next/link";
import { ArrowLeft, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <p className="eyebrow">Not found</p>
          <CardTitle>This page does not exist</CardTitle>
          <CardDescription>
            The link may be old, the session may not be in local history, or the page
            was never created.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/app/demo">
              <PlayCircle className="size-4" />
              Open sample demo
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="size-4" />
              Back to home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
