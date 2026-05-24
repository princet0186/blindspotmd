import { connectDB } from "./db";
import { Doctor, Patient, Consultation, BlindSpotFlag, LabResult, EndemicContext, Referral } from "./models";

export async function seedDatabase() {
  await connectDB();

  const existingDoctor = await Doctor.findOne({ email: "s.jenkins@blindspotmd.org" });
  if (existingDoctor) return { message: "Database already seeded" };

  const doctor = await Doctor.create({
    name: "Dr. Sarah Jenkins",
    email: "s.jenkins@blindspotmd.org",
    credentials: "MD, Internal Medicine",
    clinicId: "CL-9942-X",
    region: "Sector 7G",
    pin: "1234",
    contact: "s.jenkins@blindspotmd.org",
  });

  const patients = await Patient.insertMany([
    {
      name: "Ananya Sharma",
      age: 42,
      sex: "Female",
      mrn: "9482-104",
      dob: "03/15/1984",
      conditions: ["Hypothyroidism suspected"],
      status: "In-Review",
      doctorId: doctor._id,
    },
    {
      name: "Marcus Vance",
      age: 65,
      sex: "Male",
      mrn: "882-94A",
      dob: "11/04/1958",
      conditions: ["Type 2 DM", "HTN"],
      status: "Stable",
      doctorId: doctor._id,
    },
    {
      name: "Ramesh Kumar",
      age: 54,
      sex: "Male",
      mrn: "7731-22B",
      dob: "07/22/1972",
      conditions: ["CKD Stage 3"],
      status: "Flagged",
      doctorId: doctor._id,
    },
    {
      name: "Priya Devi",
      age: 28,
      sex: "Female",
      mrn: "5519-81C",
      dob: "01/09/1998",
      conditions: ["Anemia"],
      status: "Stable",
      doctorId: doctor._id,
    },
    {
      name: "Suresh Khanna",
      age: 71,
      sex: "Male",
      mrn: "3310-45D",
      dob: "05/18/1955",
      conditions: ["COPD", "IHD"],
      status: "Critical",
      doctorId: doctor._id,
    },
  ]);

  const marcusVance = patients[1];

  const consultations = await Consultation.insertMany([
    {
      patientId: marcusVance._id,
      doctorId: doctor._id,
      vitals: { bp: "142/88", hr: "78", spo2: "97", temp: "98.4" },
      soapNotes: "Routine check. All vitals stable. Labs ordered.",
      visitType: "ANNUAL PHYSICAL",
      summary: "Routine check. All vitals stable. Labs ordered.",
      startedAt: new Date("2023-06-04"),
      endedAt: new Date("2023-06-04"),
    },
    {
      patientId: marcusVance._id,
      doctorId: doctor._id,
      vitals: { bp: "155/95", hr: "82", spo2: "96", temp: "98.6" },
      soapNotes: "Patient presented with rising creatinine levels. eGFR trending down over 6 months. Referred for nephrology consult.",
      visitType: "ACUTE VISIT",
      summary: "System identified diverging eGFR trend pre-symptomatically. Referred for nephrology consult.",
      startedAt: new Date("2023-10-12"),
      endedAt: new Date("2023-10-12"),
    },
    {
      patientId: marcusVance._id,
      doctorId: doctor._id,
      vitals: { bp: "148/90", hr: "76", spo2: "97", temp: "98.2" },
      soapNotes: "Increased Metformin dosage based on recent elevated HbA1c. Patient reports good tolerance.",
      visitType: "FOLLOW-UP",
      summary: "Increased Metformin dosage based on recent elevated HbA1c. Patient reports good tolerance.",
      startedAt: new Date("2023-11-15"),
      endedAt: new Date("2023-11-15"),
    },
  ]);

  await BlindSpotFlag.insertMany([
    {
      consultationId: consultations[1]._id,
      patientId: marcusVance._id,
      suggestion: "Early CKD Indication",
      confidence: 88,
      severity: "high",
      triggeredBy: ["eGFR Drop", "Rising Creatinine", "HTN History"],
      clinicalLogic: "Diverging eGFR trend detected pre-symptomatically alongside persistent hypertension. Early-stage chronic kidney disease should be evaluated.",
      recommendedAction: "Order comprehensive metabolic panel and refer to nephrology.",
      status: "accepted",
      createdAt: new Date("2023-10-12"),
    },
    {
      consultationId: consultations[0]._id,
      patientId: marcusVance._id,
      suggestion: "Statin Interaction",
      confidence: 62,
      severity: "low",
      triggeredBy: ["Statin + Metformin combination", "Age > 60"],
      clinicalLogic: "Potential interaction between statin and metformin noted. Low clinical risk but monitoring recommended.",
      recommendedAction: "Monitor liver function tests at next visit.",
      status: "dismissed",
      dismissReason: "Already monitored, no clinical concern.",
      createdAt: new Date("2023-06-04"),
    },
    {
      consultationId: consultations[0]._id,
      patientId: marcusVance._id,
      suggestion: "Missed Retinopathy Screen",
      confidence: 91,
      severity: "medium",
      triggeredBy: ["Type 2 DM > 5 years", "No ophthalmology referral on record"],
      clinicalLogic: "Patient has had Type 2 DM for over 5 years without a documented retinopathy screen. ADA guidelines recommend annual dilated eye exams.",
      recommendedAction: "Schedule dilated eye exam with ophthalmology.",
      status: "accepted",
      createdAt: new Date("2023-01-15"),
    },
  ]);

  await LabResult.create({
    patientId: marcusVance._id,
    diagnostics: [
      { panel: "HbA1c", date: "11/12/23", result: "7.8%", refRange: "< 5.7%", abnormal: true },
      { panel: "Creatinine", date: "11/12/23", result: "1.1 mg/dL", refRange: "0.7-1.3", abnormal: false },
      { panel: "LDL Chol", date: "06/04/23", result: "110 mg/dL", refRange: "< 100", abnormal: true },
      { panel: "Potassium", date: "06/04/23", result: "4.2 mEq/L", refRange: "3.6-5.2", abnormal: false },
      { panel: "eGFR", date: "11/12/23", result: "68 mL/min", refRange: "> 90", abnormal: true },
      { panel: "TSH", date: "06/04/23", result: "2.1 mIU/L", refRange: "0.4-4.0", abnormal: false },
    ],
  });

  await EndemicContext.create({
    region: "Sector 7G",
    activeOutbreaks: [
      { disease: "Scrub Typhus", adjustmentPercent: 15 },
      { disease: "Dengue", adjustmentPercent: 8 },
    ],
  });

  await Referral.insertMany([
    {
      patientId: marcusVance._id,
      condition: "Impending Stroke Risk",
      confidence: 94,
      severity: "critical",
      destination: "St. Jude District Hospital",
      distance: "45km",
      eta: "40 mins",
      status: "pending",
    },
    {
      patientId: patients[0]._id,
      condition: "Severe Preeclampsia",
      confidence: 88,
      severity: "critical",
      destination: "Civil Hospital",
      distance: "62km",
      eta: "55 mins",
      status: "dispatched",
    },
    {
      patientId: patients[2]._id,
      condition: "Suspected Appendicitis",
      confidence: 76,
      severity: "high",
      destination: "PHC Referral Center",
      distance: "28km",
      eta: "25 mins",
      status: "completed",
    },
  ]);

  return { message: "Database seeded successfully" };
}
