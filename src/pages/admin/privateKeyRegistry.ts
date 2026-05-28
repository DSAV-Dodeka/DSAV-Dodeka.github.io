// Catalogue of private-store keys the frontend knows about. Used by the admin
// "Private" tab to:
//   - surface unset known keys so admins can create them with one click,
//   - prefill the JSON editor with a useful template,
//   - show the recommended role + a short description of what the key is for.
//
// This is a *hint* — the backend doesn't enforce anything from here. Adding a
// new well-known key starts with appending to this list; the actual record
// still has to be saved through the admin endpoint like any other key.

export interface ExpectedPrivateKey {
  key: string;
  description: string;
  recommendedRole: string;
  placeholder: unknown;
}

export const EXPECTED_PRIVATE_KEYS: ExpectedPrivateKey[] = [
  {
    key: "hordes_join",
    description:
      "Map of horde name → invite/join URL (WhatsApp, Signal, …). Used by /leden/hordes to render the 'Join deze horde' button per card. Names must match the 'naam' field in src/content/Hordes.json.",
    recommendedRole: "member",
    placeholder: {
      Koers: "https://chat.whatsapp.com/REPLACE_ME",
    },
  },
];

export function findExpectedKey(key: string): ExpectedPrivateKey | undefined {
  return EXPECTED_PRIVATE_KEYS.find((k) => k.key === key);
}
