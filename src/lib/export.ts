import type { SessionRecord } from "@/lib/types";
import { slugify } from "@/lib/utils";

function listItems(items: string[]) {
  return items.map((item) => `- ${item}`).join("\n");
}

export function buildPlainSummary(session: SessionRecord) {
  return [
    `${session.title}`,
    session.subtitle,
    "",
    "Overview",
    session.overview,
    "",
    "Decisions",
    listItems(session.decisions.map((item) => item.title)),
    "",
    "Action items",
    listItems(
      session.actionItems.map(
        (item) => `${item.owner}: ${item.title} (${item.dueDate})`,
      ),
    ),
    "",
    "Risks",
    listItems(session.risks.map((item) => item.title)),
  ].join("\n");
}

export function buildSlackSummary(session: SessionRecord) {
  return [
    `*${session.title}*`,
    session.overview,
    "",
    "*Decisions*",
    ...session.decisions.map((item) => `- ${item.title}`),
    "",
    "*Action items*",
    ...session.actionItems.map(
      (item) => `- ${item.owner} -> ${item.title} (${item.dueDate})`,
    ),
    "",
    "*Risk*",
    ...session.risks.map((item) => `- ${item.title}`),
  ].join("\n");
}

export function buildEmailSummary(session: SessionRecord) {
  return [
    `Subject: ${session.title} recap`,
    "",
    "Team,",
    "",
    session.overview,
    "",
    "Decisions:",
    ...session.decisions.map((item) => `- ${item.title}: ${item.body}`),
    "",
    "Action items:",
    ...session.actionItems.map(
      (item) => `- ${item.owner}: ${item.title} by ${item.dueDate}`,
    ),
    "",
    "Risks / blockers:",
    ...session.risks.map((item) => `- ${item.title}`),
  ].join("\n");
}

export function buildMarkdownSummary(session: SessionRecord) {
  return [
    `# ${session.title}`,
    "",
    session.subtitle,
    "",
    "## Overview",
    session.overview,
    "",
    "## Key points",
    ...session.keyPoints.map((item) => `- **${item.title}**: ${item.body}`),
    "",
    "## Decisions",
    ...session.decisions.map((item) => `- **${item.title}**: ${item.body}`),
    "",
    "## Action items",
    ...session.actionItems.map(
      (item) =>
        `- **${item.owner}**: ${item.title} (${item.dueDate})${item.status ? ` - ${item.status}` : ""}`,
    ),
    "",
    "## Risks",
    ...session.risks.map((item) => `- **${item.title}**: ${item.body}`),
    "",
    "## Follow-ups",
    ...session.followUps.map((item) => `- **${item.owner}**: ${item.title}`),
  ].join("\n");
}

export function buildJsonSummary(session: SessionRecord) {
  return JSON.stringify(session, null, 2);
}

export function getExportFileName(session: SessionRecord, extension: string) {
  return `${slugify(session.title)}.${extension}`;
}
