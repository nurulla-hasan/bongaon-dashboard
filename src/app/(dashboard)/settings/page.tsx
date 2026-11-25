import type { Metadata } from "next";
import { SectionHeading } from "@/components/common/section-heading";
import { PasswordSettingsCard } from "./_components/password-settings-card";
import { ProfileSettingsCard } from "./_components/profile-settings-card";
import { StoreSettingsCard } from "./_components/store-settings-card";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h2"
        variant="brand"
        title="Settings"
        description="Manage your admin profile, password, and storefront configuration."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileSettingsCard />
        <PasswordSettingsCard />
        <StoreSettingsCard />
      </div>
    </div>
  );
}
