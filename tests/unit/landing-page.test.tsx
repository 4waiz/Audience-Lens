import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppProviders } from "@/components/providers/app-providers";
import { LandingPage } from "@/features/landing/landing-page";

describe("LandingPage", () => {
  it("renders the workspace-first product experience", async () => {
    const user = userEvent.setup();

    render(
      <AppProviders>
        <LandingPage />
      </AppProviders>,
    );

    expect(
      screen.getByRole("heading", {
        name: /Speak once\. Meet people where they are\./i,
      }),
    ).toBeInTheDocument();

    const sourceBox = screen.getByRole("textbox", {
      name: /What was said/i,
    }) as HTMLTextAreaElement;

    expect(sourceBox.value).toMatch(/Ravi Nair: The event pipeline is deduping/i);
    expect(
      screen.getByRole("button", { name: /Generate recap|Refresh recap/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Status update/i }));

    expect(sourceBox.value).toMatch(/Samir Khan: The ingestion worker caught up overnight/i);
  });
});
