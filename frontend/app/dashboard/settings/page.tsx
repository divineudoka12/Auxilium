"use client";

import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Settings" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-mist">Officer profile and workspace preferences.</p>
      </div>

      <Card className="max-w-lg p-6">
        <div className="flex flex-col gap-4">
          <Input label="Full name" defaultValue="S. Alaba" />
          <Input label="Officer ID" defaultValue="LO-0192" disabled />
          <Input label="Risk threshold for auto-review" defaultValue="Score ≥ 45" />
          <div className="pt-2">
            <Button size="sm">Save changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
