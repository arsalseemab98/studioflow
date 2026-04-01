"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getIntakeForm, updateIntakeForm } from "@/actions/intake-forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { IntakeFormField } from "@/types/database";

const fieldTypes = ["text", "textarea", "select", "date", "checkbox", "radio"] as const;

export default function FormBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [fields, setFields] = useState<IntakeFormField[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadForm();
  }, [id]);

  async function loadForm() {
    const form = await getIntakeForm(id);
    if (form) {
      setName(form.name);
      setFields(form.fields as IntakeFormField[]);
    }
  }

  function addField() {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        type: "text",
        label: "",
        required: false,
      },
    ]);
  }

  function updateField(index: number, updates: Partial<IntakeFormField>) {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...updates };
    setFields(updated);
  }

  function removeField(index: number) {
    setFields(fields.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    await updateIntakeForm(id, name, fields);
    setSaving(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Form</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Form"}
        </Button>
      </div>

      <div className="space-y-2">
        <Label>Form Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Wedding Questionnaire"
        />
      </div>

      <div className="space-y-3">
        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <GripVertical className="h-5 w-5 text-zinc-300 mt-2 cursor-grab" />
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    placeholder="Field label"
                    value={field.label}
                    onChange={(e) =>
                      updateField(index, { label: e.target.value })
                    }
                  />
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(index, {
                        type: e.target.value as IntakeFormField["type"],
                      })
                    }
                    className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    {fieldTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          updateField(index, { required: e.target.checked })
                        }
                      />
                      Required
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
              {(field.type === "select" || field.type === "radio") && (
                <div className="mt-3 ml-8">
                  <Input
                    placeholder="Options (comma separated)"
                    value={field.options?.join(", ") || ""}
                    onChange={(e) =>
                      updateField(index, {
                        options: e.target.value.split(",").map((s) => s.trim()),
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button variant="outline" onClick={addField} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Field
      </Button>
    </div>
  );
}
