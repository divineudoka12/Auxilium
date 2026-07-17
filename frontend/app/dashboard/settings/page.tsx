"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/dashboard/Topbar";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const STORAGE_KEY = "creditpilot.officerName";

export default function SettingsPage() {
  const [fullName, setFullName] = useState("S. Alaba");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setFullName(stored);
  }, []);

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, fullName);
    window.dispatchEvent(new Event("officerNameUpdated"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      <Topbar title="Settings" />
      <div>
        <h2 className="font-display text-2xl font-medium tracking-tight">Settings</h2>
        <p className="mt-1 text-sm text-mist">Officer profile and workspace preferences.</p>
      </div>

      <Card className="max-w-lg p-6">
        <div className="flex flex-col gap-4">
          <Input
            label="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input label="Officer ID" defaultValue="LO-0192" disabled />
          <Input label="Risk threshold for auto-review" defaultValue="Score ≥ 45" />
          <div className="flex items-center gap-3 pt-2">
            <Button size="sm" onClick={handleSave}>
              Save changes
            </Button>
            {saved && <span className="text-xs text-approved">Saved</span>}
          </div>
        </div>
      </Card>
    </div>
  );
}