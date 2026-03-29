import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ExportMenu } from "@/components/export-menu";
import { DEMO_SESSION } from "@/lib/demo-data";

describe("ExportMenu", () => {
  it("copies the Slack export to the clipboard", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText,
      },
    });

    render(<ExportMenu session={DEMO_SESSION} />);

    await user.click(screen.getByRole("button", { name: /Export/i }));
    await user.click(screen.getByRole("menuitem", { name: /Copy for Slack/i }));

    expect(writeText).toHaveBeenCalled();
    expect(writeText.mock.calls[0][0]).toContain(DEMO_SESSION.title);
  });
});
