import { render, screen } from "@testing-library/react";

import { PreflightPanel } from "@/features/workspace/preflight-panel";

describe("PreflightPanel", () => {
  it("renders the permission denied fallback", () => {
    render(
      <PreflightPanel
        audience="client"
        inputLanguage="en-US"
        onAudienceChange={() => {}}
        onInputLanguageChange={() => {}}
        onOutputLanguageChange={() => {}}
        onStart={() => {}}
        onUseSampleDemo={() => {}}
        outputLanguage="en"
        permissionState="denied"
      />,
    );

    expect(screen.getByTestId("permission-fallback")).toBeInTheDocument();
    expect(screen.getByText(/Microphone access was denied/i)).toBeInTheDocument();
  });
});
