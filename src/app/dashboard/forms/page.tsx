"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getIntakeForms, createIntakeForm } from "@/actions/intake-forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ClipboardList } from "lucide-react";
import { format } from "date-fns";

export default function FormsPage() {
  const [forms, setForms] = useState<Record<string, unknown>[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    loadForms();
  }, []);

  async function loadForms() {
    const data = await getIntakeForms();
    setForms(data);
  }

  async function handleCreate() {
    if (!name.trim()) return;
    const result = await createIntakeForm(name, [
      { id: "1", type: "text", label: "Full Name", required: true },
      { id: "2", type: "text", label: "Email", required: true },
      { id: "3", type: "text", label: "Phone", required: false },
      { id: "4", type: "date", label: "Event Date", required: true },
      { id: "5", type: "text", label: "Event Location", required: true },
      { id: "6", type: "textarea", label: "Special Requests", required: false },
    ]);
    if (result.success) {
      setOpen(false);
      setName("");
      loadForms();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Intake Forms</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button type="button">
              <Plus className="h-4 w-4 mr-2" />
              New Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Intake Form</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Form name (e.g. Wedding Questionnaire)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="text-xs text-zinc-500">
                A default set of fields will be added. You can customize them after creation.
              </p>
              <Button onClick={handleCreate} className="w-full">
                Create Form
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {forms.map((form) => (
          <Link key={form.id as string} href={`/dashboard/forms/${form.id}`}>
            <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <ClipboardList className="h-5 w-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="font-medium">{form.name as string}</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {((form.fields as unknown[]) || []).length} fields &middot;{" "}
                      {format(new Date(form.created_at as string), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
        {forms.length === 0 && (
          <p className="text-sm text-zinc-500 col-span-full">
            No forms yet. Create one to start collecting client details.
          </p>
        )}
      </div>
    </div>
  );
}
