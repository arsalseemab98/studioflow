"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getIntakeFormByToken, submitIntakeResponse } from "@/actions/intake-forms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import type { IntakeFormField } from "@/types/database";

export default function PublicIntakeFormPage() {
  const { token } = useParams<{ token: string }>();
  const [form, setForm] = useState<{ name: string; fields: IntakeFormField[] } | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForm();
  }, [token]);

  async function loadForm() {
    const response = await getIntakeFormByToken(token);
    if (response) {
      if (response.submitted_at) {
        setAlreadySubmitted(true);
      }
      const intakeForm = response.intake_forms as Record<string, unknown>;
      setForm({
        name: intakeForm.name as string,
        fields: intakeForm.fields as IntakeFormField[],
      });
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await submitIntakeResponse(token, answers);
    if (result.success) setSubmitted(true);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (submitted || alreadySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">
              {alreadySubmitted ? "Already Submitted" : "Form Submitted!"}
            </h2>
            <p className="text-zinc-500 text-sm">
              {alreadySubmitted
                ? "This form has already been completed. Thank you!"
                : "Thank you for completing the questionnaire. We'll be in touch!"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-500">Form not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <CardTitle>{form.name}</CardTitle>
          <CardDescription>
            Please fill out this questionnaire so we can prepare for your event.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {form.fields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={answers[field.id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [field.id]: e.target.value })
                    }
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={answers[field.id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [field.id]: e.target.value })
                    }
                    required={field.required}
                    className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={answers[field.id] === "true"}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [field.id]: e.target.checked.toString(),
                      })
                    }
                  />
                ) : field.type === "radio" ? (
                  <div className="space-y-2">
                    {field.options?.map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm">
                        <input
                          type="radio"
                          name={field.id}
                          value={opt}
                          checked={answers[field.id] === opt}
                          onChange={(e) =>
                            setAnswers({ ...answers, [field.id]: e.target.value })
                          }
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <Input
                    type={field.type === "date" ? "date" : "text"}
                    value={answers[field.id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [field.id]: e.target.value })
                    }
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
