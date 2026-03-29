import { render, screen } from "@testing-library/react";

import { LandingPage } from "@/features/landing/landing-page";

describe("LandingPage", () => {
  it("renders the core value proposition and primary actions", () => {
    render(<LandingPage />);

    expect(
      screen.getByRole("heading", {
        name: /Speak once\. Meet people where they are\./i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Try sample demo/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /Start live session/i }).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText(/Audience adaptation/i).length).toBeGreaterThan(0);
  });
});
