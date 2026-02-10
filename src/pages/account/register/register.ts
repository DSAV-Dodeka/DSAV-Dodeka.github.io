import { requestRegistration } from "$functions/backend.ts";

// Mode detection
export const isDemoMode = import.meta.env.MODE === "demo";
export const isDevMode = import.meta.env.DEV;
export const isBackendEnabled = import.meta.env.VITE_BACKEND_ENABLED !== "false";

// Volta toggle for demo mode
// - DEV mode: Volta always disabled, no toggle
// - Demo mode: Volta disabled by default, toggle available
// - Production: Volta always enabled, no toggle
let voltaEnabled = !isDevMode && !isDemoMode;

export function isVoltaEnabled(): boolean {
  return voltaEnabled;
}

export function setVoltaEnabled(enabled: boolean): void {
  voltaEnabled = enabled;
}

export type RegisterState = {
  firstname: string;
  nameinfix: string;
  lastname: string;
  initials: string;
  email: string;
  phone: string;
  zipcode: string;
  city: string;
  address: string;
  house_number: string;
  date_of_birth: string;
  enable_incasso: boolean;
  iban: string;
  iban_name: string;
  gender: string;
  photos: string;
  birthday_check: boolean;
  student: string;
  plan: string;
  language: string;
};

/// This matches (case-sensitive) the Volta backend that we call
interface VoltaRegistration {
  AddressInfo: {
    countryId: 528;
    zipcode: string;
    city: string;
    address1: string;
    houseNumber: number;
  };
  BillingInfoDto: {
    debtCollection: true;
    contributionTermId: 506;
    iban: string;
    bankAccountName: string;
  };
  PlanAssignment: Plan["PlanAssignment"];
  FirstName: string;
  NameInfix: string;
  LastName: string;
  Initials: string;
  Gender: 0 | 1 | 2;
  Birthdate: string;
  Email: {
    Email: string;
  };
  MobilePhone: {
    Number: string;
  };
  LanguageCode: "nl-NL" | "en-GB";
  selectedPlan: Plan["selectedPlan"];
  CustomFieldValues: { key: number; value: string }[];
}

interface PhotoCustomField {
  key: 1582;
  value: string;
}

interface StudentCustomField {
  key: 1583;
  value: string;
}

interface Plan {
  PlanAssignment: {
    startDate: string;
    planId: number;
  };
  selectedPlan: PlanDetails & { startDate: string; endDate: string };
}

interface PlanDetails {
  price: 214 | 188 | 176;
  planCode: string;
  registrationFee: 5;
  remittanceFee: null;
  transferFee: 0;
  discountFee: 0;
  administrationFee: null;
  remittanceDescription: null;
  fromAge: 0;
  toAge: 99;
  referenceDate: null; // ISO 8601 date string or null
  organisationTypeIds: [];
  id: number;
  name: string;
}

// IMPORTANT: these id's change every year, so every year has to be updated!

const wedstrijdlidPlan: PlanDetails = {
  price: 214,
  planCode: "12",
  registrationFee: 5,
  remittanceFee: null,
  transferFee: 0,
  discountFee: 0,
  administrationFee: null,
  remittanceDescription: null,
  fromAge: 0,
  toAge: 99,
  referenceDate: null,
  organisationTypeIds: [],
  id: 14616,
  name: "Wedstrijdlid",
};

const recreantPlan: PlanDetails = {
  price: 188,
  planCode: "13",
  registrationFee: 5,
  remittanceFee: null,
  transferFee: 0,
  discountFee: 0,
  administrationFee: null,
  remittanceDescription: null,
  fromAge: 0,
  toAge: 99,
  referenceDate: null,
  organisationTypeIds: [],
  id: 14617,
  name: "Recreantlid",
};

const gastPlan: PlanDetails = {
  price: 176,
  planCode: "14",
  registrationFee: 5,
  remittanceFee: null,
  transferFee: 0,
  discountFee: 0,
  administrationFee: null,
  remittanceDescription: null,
  fromAge: 0,
  toAge: 99,
  referenceDate: null,
  organisationTypeIds: [],
  id: 14618,
  name: "Gastlid",
};

function registerStateToVolta(registerState: RegisterState): VoltaRegistration {
  let planDetails: PlanDetails;
  if (registerState.plan === "Wedstrijdlid") {
    planDetails = wedstrijdlidPlan;
  } else if (registerState.plan === "Recreantlid") {
    planDetails = recreantPlan;
  } else if (registerState.plan === "Gastlid") {
    planDetails = gastPlan;
  } else {
    throw new Error(`Unknown plan ${registerState.plan}!`);
  }

  const planAssignmentStartDate = "2025-09-01T00:00:00Z";
  const planStartDate = "2025-09-01T00:00:00";
  const planEndDate = "2026-08-31T00:00:00";

  const plan: Plan = {
    selectedPlan: {
      ...planDetails,
      startDate: planStartDate,
      endDate: planEndDate,
    },
    PlanAssignment: {
      planId: planDetails.id,
      startDate: planAssignmentStartDate,
    },
  };

  const genderParsed = parseInt(registerState.gender);
  let gender: VoltaRegistration["Gender"];
  if (genderParsed === 0 || genderParsed === 1 || genderParsed === 2) {
    gender = genderParsed;
  } else {
    throw new Error("Invalid gender!");
  }

  let language: VoltaRegistration["LanguageCode"];
  if (
    registerState.language === "nl-NL" ||
    registerState.language === "en-GB"
  ) {
    language = registerState.language;
  } else {
    throw new Error("Invalid language!");
  }

  const photos: PhotoCustomField = {
    key: 1582,
    value: registerState.photos,
  };

  const student: StudentCustomField = {
    key: 1583,
    value: registerState.student,
  };

  const CustomFieldValues: VoltaRegistration["CustomFieldValues"] = [
    photos,
    student,
  ];

  return {
    ...plan,
    AddressInfo: {
      countryId: 528,
      zipcode: registerState.zipcode,
      city: registerState.city,
      address1: registerState.address,
      houseNumber: parseInt(registerState.house_number),
    },
    BillingInfoDto: {
      debtCollection: true,
      contributionTermId: 506,
      iban: registerState.iban,
      bankAccountName: registerState.iban_name,
    },
    FirstName: registerState.firstname,
    NameInfix: registerState.nameinfix,
    LastName: registerState.lastname,
    Initials: registerState.initials,
    Gender: gender,
    Birthdate: `${registerState.date_of_birth}T00:00:00.000Z`,
    Email: {
      Email: registerState.email,
    },
    MobilePhone: {
      Number: registerState.phone,
    },
    LanguageCode: language,
    CustomFieldValues,
  };
}

export class VoltaError extends Error {
  constructor(detail: string) {
    super(`Volta returnedd error with detail: ${detail}`);
    this.voltaMessage = detail;
  }

  voltaMessage: string;
}

async function doVoltaRegister(voltaRegistration: VoltaRegistration) {
  let result: Response;
  try {
    result = await fetch(
      "https://prod.foys.tech/api/v2/pub/registration-forms/4717c5a6-5e49-4d4d-ca49-08dd2f2dfc8c/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(voltaRegistration),
      },
    );
    // This is to test without actually creating a person in Volta
    // await new Promise((resolve) => setTimeout(resolve, 20000));
    // result = new Response(null, { status: 200 });
  } catch (e) {
    throw new Error(`Failed to register with Volta: Network error? ${e}`);
  }

  console.log(
    `result.status=${result.status}\ncontent-type=${result.headers.get("Content-Type") ?? ""}`,
  );
  if (
    result.status === 400 &&
    (result.headers.get("Content-Type") ?? "").includes("json")
  ) {
    const jsonParsed = await result.json();
    // console.log(`jsonParsed=${JSON.stringify(jsonParsed)}.`);
    if (
      typeof jsonParsed === "object" &&
      jsonParsed !== null &&
      "detail" in jsonParsed
    ) {
      throw new VoltaError(String(jsonParsed.detail));
    }
  } else if (!result.ok) {
    throw new Error(
      `Volta registration failed with status=${result.status} and content:\n${await result.text()}`,
    );
  }
}

// Combine nameinfix with lastname for our backend (e.g., "van der Berg")
function getFullLastName(state: RegisterState): string {
  if (state.nameinfix) {
    return `${state.nameinfix} ${state.lastname}`;
  }
  return state.lastname;
}

// Simulate Volta API delay in DEV mode (2-3 seconds)
async function simulateVoltaDelay(): Promise<void> {
  const delay = 2000 + Math.random() * 1000; // 2-3 seconds
  await new Promise((resolve) => setTimeout(resolve, delay));
}

export async function clientRegister(
  registerState: RegisterState,
): Promise<string | null> {
  // Call Volta if enabled, otherwise simulate delay
  if (voltaEnabled) {
    const voltaRegistration = registerStateToVolta(registerState);
    await doVoltaRegister(voltaRegistration);
  } else {
    // Simulate Volta delay when disabled
    await simulateVoltaDelay();
  }

  // Skip backend call if backend is disabled (frontend deployed before backend)
  if (!isBackendEnabled) {
    return null;
  }

  // Then register with our backend (creates newuser entry + Faroe signup)
  try {
    const result = await requestRegistration(
      registerState.email,
      registerState.firstname,
      getFullLastName(registerState),
    );
    return result.registration_token;
  } catch (error) {
    // If Volta succeeded but our backend failed,
    // we still consider it a success (user is in Volta)
    // In dev mode or demo mode without Volta, we want to see the error
    if (!voltaEnabled) {
      throw error;
    }
    console.error("Backend registration failed (but Volta succeeded):", error);
    return null;
  }
}
