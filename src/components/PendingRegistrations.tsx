import type { AdminRegistrationRecord } from "$functions/backend.ts";

interface PendingRegistrationsProps {
  registrations: AdminRegistrationRecord[];
  onResume?: (reg: AdminRegistrationRecord) => void;
  loading?: boolean;
}

function registrationStatus(reg: AdminRegistrationRecord): string {
  if (reg.accepted && reg.signup_active) return "Signup active";
  if (reg.accepted) return "Accepted";
  return "Pending";
}

export default function PendingRegistrations({
  registrations,
  onResume,
  loading,
}: PendingRegistrationsProps) {
  if (registrations.length === 0) {
    return <p className="pending-registrations-empty">No pending registrations.</p>;
  }

  return (
    <table className="pending-registrations">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Status</th>
          <th>Bondsnummer</th>
          {onResume && <th></th>}
        </tr>
      </thead>
      <tbody>
        {registrations.map((reg) => (
          <tr key={reg.registration_id}>
            <td>{reg.email}</td>
            <td>
              {reg.firstname} {reg.lastname}
            </td>
            <td>{registrationStatus(reg)}</td>
            <td>{reg.bondsnummer ?? "\u2014"}</td>
            {onResume && (
              <td>
                <button onClick={() => onResume(reg)} disabled={loading}>
                  Resume
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
