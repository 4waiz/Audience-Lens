import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DEFAULT_PREFERENCES } from "@/lib/constants";
import { DEMO_SESSION } from "@/lib/demo-data";
import { SessionDetailPage } from "@/features/sessions/session-detail-page";

vi.mock("@/components/providers/preferences-provider", () => ({
  usePreferences: () => ({
    preferences: DEFAULT_PREFERENCES,
  }),
}));

vi.mock("@/components/providers/session-provider", () => ({
  useSessions: () => ({
    hydrated: true,
    getSessionById: (id: string) => (id === DEMO_SESSION.id ? DEMO_SESSION : undefined),
  }),
}));

describe("SessionDetailPage", () => {
  it("renders the summary and transcript content", async () => {
    const user = userEvent.setup();

    render(<SessionDetailPage sessionId={DEMO_SESSION.id} />);

    expect(screen.getByTestId("summary-overview")).toHaveTextContent(
      /The team aligned on a cautious staged rollout/i,
    );
    expect(screen.getByRole("tab", { name: /Full transcript/i })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: /Full transcript/i }));
    expect(screen.getByText(DEMO_SESSION.transcript[0].text)).toBeInTheDocument();
  });
});
