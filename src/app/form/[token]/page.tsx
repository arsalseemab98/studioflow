"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getIntakeFormByToken, submitIntakeResponse } from "@/actions/intake-forms";
import { CheckCircle, Globe, Mail, Phone } from "lucide-react";
import type { IntakeFormField } from "@/types/database";

type OrgInfo = {
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  description?: string | null;
  primary_color?: string | null;
  logo_url?: string | null;
};

export default function PublicIntakeFormPage() {
  const { token } = useParams<{ token: string }>();
  const [form, setForm] = useState<{ name: string; fields: IntakeFormField[] } | null>(null);
  const [org, setOrg] = useState<OrgInfo | null>(null);
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
      if (response.submitted_at) setAlreadySubmitted(true);
      const intakeForm = response.intake_forms as Record<string, unknown>;
      setForm({
        name: intakeForm.name as string,
        fields: intakeForm.fields as IntakeFormField[],
      });
      const orgData = intakeForm.organizations as Record<string, unknown> | null;
      if (orgData) {
        setOrg({
          name: orgData.name as string,
          email: orgData.email as string | null,
          phone: orgData.phone as string | null,
          website: orgData.website as string | null,
          description: orgData.description as string | null,
          primary_color: orgData.primary_color as string | null,
          logo_url: orgData.logo_url as string | null,
        });
      }
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await submitIntakeResponse(token, answers);
    if (result.success) setSubmitted(true);
  }

  const brandColor = org?.primary_color || "#f97316";
  const gradient = `linear-gradient(135deg, ${brandColor}, #ec4899)`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <p className="text-zinc-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (submitted || alreadySubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7] p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-zinc-100 shadow-sm p-10 text-center">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--font-serif), serif" }}>
            {alreadySubmitted ? "Already Submitted" : "Thank You!"}
          </h2>
          <p className="text-zinc-500 text-sm">
            {alreadySubmitted
              ? "This form has already been completed."
              : "We've received your details and will be in touch shortly."}
          </p>
          {org ? (
            <p className="text-xs text-zinc-400 mt-4">{org.name}</p>
          ) : null}
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f7]">
        <p className="text-zinc-500">Form not found</p>
      </div>
    );
  }

  // Group fields into sections based on field ID prefixes
  const coupleFields = form.fields.filter((f) => f.id.startsWith("h"));
  const contactFields = form.fields.filter((f) => f.id.startsWith("c"));
  const event1Fields = form.fields.filter((f) => f.id.startsWith("e1"));
  const event2Fields = form.fields.filter((f) => f.id.startsWith("e2"));
  const event3Fields = form.fields.filter((f) => f.id.startsWith("e3"));
  const noteFields = form.fields.filter((f) => f.id === "notes");
  const hasSections = coupleFields.length > 0 || event1Fields.length > 0;

  // If fields don't match the wedding template structure, render generic
  const isWeddingTemplate = hasSections && coupleFields.length > 0;

  function renderField(field: IntakeFormField) {
    const inputClass =
      "w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 transition-all bg-white";
    const focusStyle = { "--tw-ring-color": `${brandColor}33` } as React.CSSProperties;

    if (field.type === "textarea") {
      return (
        <textarea
          rows={4}
          value={answers[field.id] || ""}
          onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
          required={field.required}
          placeholder={field.placeholder}
          className={`${inputClass} resize-none`}
          style={focusStyle}
        />
      );
    }
    return (
      <input
        type={field.type === "date" ? "date" : field.type === "text" ? "text" : "text"}
        value={answers[field.id] || ""}
        onChange={(e) => setAnswers({ ...answers, [field.id]: e.target.value })}
        required={field.required}
        placeholder={field.placeholder}
        className={inputClass}
        style={focusStyle}
      />
    );
  }

  function renderSection(
    title: string,
    subtitle: string,
    fields: IntakeFormField[],
    sectionLabel: string
  ) {
    if (fields.length === 0) return null;
    return (
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="px-8 pt-8 pb-2">
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: brandColor }}>
            {sectionLabel}
          </p>
          <h2 className="text-2xl text-zinc-900" style={{ fontFamily: "var(--font-serif), serif" }}>
            {title}
          </h2>
          {subtitle ? <p className="text-xs text-zinc-400 mt-1">{subtitle}</p> : null}
        </div>
        <div className="px-8 pb-8 pt-4 space-y-4">
          {fields.length === 2 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                    {field.label}
                    {field.required ? <span className="text-red-400 ml-0.5">*</span> : null}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
          ) : (
            fields.map((field) => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                  {field.label}
                  {field.required ? <span className="text-red-400 ml-0.5">*</span> : null}
                </label>
                {renderField(field)}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  function renderEventBlock(fields: IntakeFormField[], num: number, required: boolean) {
    if (fields.length === 0) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={required ? { background: gradient } : { background: "#e4e4e7", color: "#71717a" }}
          >
            {num}
          </div>
          <p className={`font-medium text-sm ${required ? "text-zinc-700" : "text-zinc-500"}`}>
            Event {num}
            {!required ? <span className="text-xs text-zinc-400 ml-1">(if applicable)</span> : null}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((field) => (
            <div key={field.id} className={field.label.includes("Name") && !field.label.includes("Venue") ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                {field.label.replace(/Event \d — /, "")}
                {field.required ? <span className="text-red-400 ml-0.5">*</span> : null}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-[#faf9f7]">
      <div className="max-w-2xl mx-auto">

        {/* Header with company branding */}
        <div className="text-center mb-10">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl" style={{ background: gradient }} />
          {org ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: brandColor }}>
                {org.name}
              </p>
            </>
          ) : null}
          <h1
            className="text-4xl font-semibold text-zinc-900 mb-2"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {form.name}
          </h1>
          <p className="text-zinc-500 text-sm">
            Please fill out all details below — we&apos;ll be in touch shortly
          </p>
          {org ? (
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-zinc-400">
              {org.email ? (
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {org.email}
                </span>
              ) : null}
              {org.phone ? (
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {org.phone}
                </span>
              ) : null}
              {org.website ? (
                <span className="flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {(org.website).replace(/https?:\/\//, "")}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {isWeddingTemplate ? (
            <>
              {/* The Couple */}
              {renderSection("Who's getting married?", "", coupleFields, "The Couple")}

              {/* Contact */}
              {renderSection("How can we reach you?", "Primary and additional contacts", contactFields, "Contact")}

              {/* Events */}
              {(event1Fields.length > 0 || event2Fields.length > 0 || event3Fields.length > 0) ? (
                <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
                  <div className="px-8 pt-8 pb-2">
                    <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: brandColor }}>
                      Events
                    </p>
                    <h2 className="text-2xl text-zinc-900" style={{ fontFamily: "var(--font-serif), serif" }}>
                      Tell us about your celebrations
                    </h2>
                  </div>
                  <div className="px-8 pb-8 pt-4 space-y-6">
                    {renderEventBlock(event1Fields, 1, true)}
                    {event2Fields.length > 0 ? <div className="border-t border-zinc-100" /> : null}
                    {renderEventBlock(event2Fields, 2, false)}
                    {event3Fields.length > 0 ? <div className="border-t border-zinc-100" /> : null}
                    {renderEventBlock(event3Fields, 3, false)}
                  </div>
                </div>
              ) : null}

              {/* Notes */}
              {renderSection("Anything else?", "", noteFields, "Additional")}
            </>
          ) : (
            /* Generic form rendering for non-wedding templates */
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
              <div className="px-8 py-8 space-y-4">
                {form.fields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                      {field.label}
                      {field.required ? <span className="text-red-400 ml-0.5">*</span> : null}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl text-white font-semibold text-base shadow-lg transition-opacity hover:opacity-90"
            style={{ background: gradient, boxShadow: `0 8px 24px ${brandColor}33` }}
          >
            Submit {form.name.includes("Wedding") ? "Wedding Details" : "Details"}
          </button>

          {/* Footer */}
          <div className="text-center pb-4">
            <p className="text-xs text-zinc-400">
              Your information is kept confidential and will only be used to prepare for your event.
            </p>
            <p className="text-xs text-zinc-300 mt-2">Powered by StudioFlow</p>
          </div>
        </form>
      </div>
    </div>
  );
}
