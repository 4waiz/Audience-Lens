import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DEMO_SESSION } from "@/lib/demo-data";
import type { AudienceMode } from "@/lib/types";
import { ClarityStudio } from "@/features/workspace/clarity-studio";

function Wrapper() {
  const [audience, setAudience] = useState<AudienceMode>("client");

  return (
    <ClarityStudio
      activeSegment={DEMO_SESSION.transcript[1]}
      audience={audience}
      onAudienceChange={setAudience}
      outputLanguage="en"
      visibleSession={DEMO_SESSION}
    />
  );
}

describe("ClarityStudio", () => {
  it("updates the rewrite when the audience mode changes", async () => {
    const user = userEvent.setup();

    render(<Wrapper />);

    await user.click(screen.getByRole("tab", { name: /Audience mode/i }));

    expect(
      screen.getByText(DEMO_SESSION.transcript[1].audienceVersions.client),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /Executive/i }));

    expect(
      screen.getByText(DEMO_SESSION.transcript[1].audienceVersions.executive),
    ).toBeInTheDocument();
  });
});
