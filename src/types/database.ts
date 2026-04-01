export type Organization = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
};

export type OrgMember = {
  id: string;
  org_id: string;
  user_id: string;
  role: "owner" | "admin" | "member";
  created_at: string;
};

export type Client = {
  id: string;
  org_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  created_at: string;
};

export type InquiryStatus = "new" | "contacted" | "converted" | "archived";

export type Inquiry = {
  id: string;
  org_id: string;
  client_id: string | null;
  event_type: string;
  event_date: string | null;
  location: string | null;
  budget: number | null;
  message: string | null;
  status: InquiryStatus;
  source_url: string | null;
  created_at: string;
  clients?: Client;
};

export type IntakeFormField = {
  id: string;
  type: "text" | "textarea" | "select" | "date" | "checkbox" | "radio";
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
};

export type IntakeForm = {
  id: string;
  org_id: string;
  name: string;
  fields: IntakeFormField[];
  created_at: string;
};

export type IntakeResponse = {
  id: string;
  form_id: string;
  inquiry_id: string;
  client_id: string | null;
  answers: Record<string, string | string[] | boolean>;
  access_token: string;
  submitted_at: string | null;
};

export type ContractBlock = {
  id: string;
  type: "heading" | "paragraph" | "field" | "signature";
  content: string;
  fieldName?: string;
  fieldValue?: string;
};

export type ContractTemplate = {
  id: string;
  org_id: string;
  name: string;
  content: ContractBlock[];
  category: string | null;
  custom_fields: { name: string; label: string; type: string }[];
  created_at: string;
};

export type ContractStatus = "draft" | "sent" | "viewed" | "signed" | "expired";

export type Contract = {
  id: string;
  org_id: string;
  template_id: string | null;
  client_id: string;
  inquiry_id: string | null;
  content: ContractBlock[];
  status: ContractStatus;
  sent_at: string | null;
  viewed_at: string | null;
  signed_at: string | null;
  signature_data: string | null;
  pdf_url: string | null;
  access_token: string;
  created_at: string;
  clients?: Client;
};

export type BookingStatus = "tentative" | "confirmed" | "completed" | "cancelled";

export type Booking = {
  id: string;
  org_id: string;
  client_id: string;
  contract_id: string | null;
  inquiry_id: string | null;
  title: string;
  event_type: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  status: BookingStatus;
  notes: string | null;
  total_price: number;
  created_at: string;
  clients?: Client;
};

export type CrewRole = "photographer" | "videographer" | "assistant" | "other";

export type CrewMember = {
  id: string;
  org_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  role: CrewRole;
  type: "team" | "external";
  notes: string | null;
  created_at: string;
};

export type BookingAssignment = {
  id: string;
  booking_id: string;
  crew_member_id: string;
  role: CrewRole;
  notes: string | null;
  created_at: string;
  crew_members?: CrewMember;
};

export type WorkflowLog = {
  id: string;
  org_id: string;
  inquiry_id: string | null;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type Recommendation = {
  id: string;
  category: "location" | "pose";
  event_type: string;
  title: string;
  description: string | null;
  image_url: string | null;
  location_data: Record<string, unknown>;
};
