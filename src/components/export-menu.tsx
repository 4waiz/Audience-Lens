"use client";

import { Download, FileJson2, Mail, MessageSquareText, NotebookText } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  buildEmailSummary,
  buildJsonSummary,
  buildMarkdownSummary,
  buildPlainSummary,
  buildSlackSummary,
  getExportFileName,
} from "@/lib/export";
import type { SessionRecord } from "@/lib/types";
import { downloadTextFile } from "@/lib/utils";

async function copyText(contents: string, successMessage: string) {
  try {
    await navigator.clipboard.writeText(contents);
    toast.success(successMessage);
  } catch {
    toast.error("Copy failed. Try again from a secure browser context.");
  }
}

export function ExportMenu({
  session,
  buttonLabel = "Export",
  buttonVariant = "outline",
  buttonSize = "default",
}: {
  session: SessionRecord;
  buttonLabel?: string;
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: ButtonProps["size"];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          <Download className="size-4" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() =>
            copyText(buildSlackSummary(session), "Slack update copied.")
          }
        >
          <MessageSquareText className="size-4" />
          Copy for Slack
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => copyText(buildEmailSummary(session), "Email recap copied.")}
        >
          <Mail className="size-4" />
          Copy for email
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            copyText(buildPlainSummary(session), "Plain summary copied.")
          }
        >
          <NotebookText className="size-4" />
          Copy plain summary
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            downloadTextFile(
              getExportFileName(session, "md"),
              buildMarkdownSummary(session),
              "text/markdown",
            )
          }
        >
          <Download className="size-4" />
          Download Markdown
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            downloadTextFile(
              getExportFileName(session, "json"),
              buildJsonSummary(session),
              "application/json",
            )
          }
        >
          <FileJson2 className="size-4" />
          Download JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
