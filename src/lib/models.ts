import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  email: string;
  credentials: string;
  clinicId: string;
  region: string;
  pin: string;
  contact: string;
  createdAt: Date;
}

const DoctorSchema = new Schema<IDoctor>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  credentials: { type: String, required: true },
  clinicId: { type: String, required: true },
  region: { type: String, required: true },
  pin: { type: String, required: true },
  contact: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const Doctor: Model<IDoctor> =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);

export interface IPatient extends Document {
  name: string;
  age: number;
  sex: string;
  mrn: string;
  dob: string;
  conditions: string[];
  status: string;
  doctorId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const PatientSchema = new Schema<IPatient>({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  mrn: { type: String, required: true, unique: true },
  dob: { type: String, default: "" },
  conditions: { type: [String], default: [] },
  status: { type: String, default: "Stable" },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
  createdAt: { type: Date, default: Date.now },
});

export const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

export interface IVitals {
  bp: string;
  hr: string;
  spo2: string;
  temp: string;
}

export interface IConsultation extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  vitals: IVitals;
  soapNotes: string;
  transcript: string;
  orders: string[];
  visitType: string;
  summary: string;
  startedAt: Date;
  endedAt: Date | null;
}

const ConsultationSchema = new Schema<IConsultation>({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
  vitals: {
    bp: { type: String, default: "" },
    hr: { type: String, default: "" },
    spo2: { type: String, default: "" },
    temp: { type: String, default: "" },
  },
  soapNotes: { type: String, default: "" },
  transcript: { type: String, default: "" },
  orders: { type: [String], default: [] },
  visitType: { type: String, default: "CONSULTATION" },
  summary: { type: String, default: "" },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: null },
});

export const Consultation: Model<IConsultation> =
  mongoose.models.Consultation || mongoose.model<IConsultation>("Consultation", ConsultationSchema);

export interface IBlindSpotFlag extends Document {
  consultationId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  suggestion: string;
  confidence: number;
  severity: string;
  triggeredBy: string[];
  clinicalLogic: string;
  recommendedAction: string;
  status: string;
  dismissReason: string;
  createdAt: Date;
}

const BlindSpotFlagSchema = new Schema<IBlindSpotFlag>({
  consultationId: { type: Schema.Types.ObjectId, ref: "Consultation", required: true },
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  suggestion: { type: String, required: true },
  confidence: { type: Number, required: true },
  severity: { type: String, default: "medium" },
  triggeredBy: { type: [String], default: [] },
  clinicalLogic: { type: String, default: "" },
  recommendedAction: { type: String, default: "" },
  status: { type: String, default: "pending" },
  dismissReason: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const BlindSpotFlag: Model<IBlindSpotFlag> =
  mongoose.models.BlindSpotFlag || mongoose.model<IBlindSpotFlag>("BlindSpotFlag", BlindSpotFlagSchema);

export interface IReferral extends Document {
  consultationId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  severity: string;
  condition: string;
  confidence: number;
  findings: { finding: string; value: string; abnormal: boolean }[];
  destination: string;
  distance: string;
  eta: string;
  specialties: string[];
  reasonForReferral: string;
  status: string;
  createdAt: Date;
}

const ReferralSchema = new Schema<IReferral>({
  consultationId: { type: Schema.Types.ObjectId, ref: "Consultation" },
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  severity: { type: String, required: true },
  condition: { type: String, required: true },
  confidence: { type: Number, required: true },
  findings: [{
    finding: String,
    value: String,
    abnormal: { type: Boolean, default: false },
  }],
  destination: { type: String, required: true },
  distance: { type: String, default: "" },
  eta: { type: String, default: "" },
  specialties: { type: [String], default: [] },
  reasonForReferral: { type: String, default: "" },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const Referral: Model<IReferral> =
  mongoose.models.Referral || mongoose.model<IReferral>("Referral", ReferralSchema);

export interface IEndemicContext extends Document {
  region: string;
  activeOutbreaks: { disease: string; adjustmentPercent: number }[];
  updatedAt: Date;
}

const EndemicContextSchema = new Schema<IEndemicContext>({
  region: { type: String, required: true, unique: true },
  activeOutbreaks: [{
    disease: String,
    adjustmentPercent: Number,
  }],
  updatedAt: { type: Date, default: Date.now },
});

export const EndemicContext: Model<IEndemicContext> =
  mongoose.models.EndemicContext || mongoose.model<IEndemicContext>("EndemicContext", EndemicContextSchema);

export interface IDiagnostic {
  panel: string;
  date: string;
  result: string;
  refRange: string;
  abnormal: boolean;
}

export interface ILabResult extends Document {
  patientId: mongoose.Types.ObjectId;
  diagnostics: IDiagnostic[];
}

const LabResultSchema = new Schema<ILabResult>({
  patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
  diagnostics: [{
    panel: String,
    date: String,
    result: String,
    refRange: String,
    abnormal: { type: Boolean, default: false },
  }],
});

export const LabResult: Model<ILabResult> =
  mongoose.models.LabResult || mongoose.model<ILabResult>("LabResult", LabResultSchema);
