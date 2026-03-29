import { providerStatus } from "@/lib/env";
import { SettingsPage } from "@/features/settings/settings-page";

export default function SettingsRoute() {
  return <SettingsPage providerSummary={providerStatus} />;
}
