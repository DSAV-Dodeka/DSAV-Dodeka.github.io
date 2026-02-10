import type { NewUser } from "$functions/backend.ts";

interface PendingRegistrationsProps {
  users: NewUser[];
  onResume?: (user: NewUser) => void;
  loading?: boolean;
}

function userStatus(user: NewUser): string {
  if (user.is_registered && !user.accepted) return "Pending acceptance";
  if (user.has_signup_token && !user.is_registered) return "Pending verification";
  if (!user.has_signup_token && !user.is_registered) return "No signup yet";
  if (user.is_registered && user.accepted) return "Complete";
  return "Unknown";
}

export default function PendingRegistrations({
  users,
  onResume,
  loading,
}: PendingRegistrationsProps) {
  if (users.length === 0) {
    return <p className="pending-registrations-empty">No pending registrations.</p>;
  }

  return (
    <table className="pending-registrations">
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Status</th>
          <th>Emails sent</th>
          {onResume && <th></th>}
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.email}>
            <td>{user.email}</td>
            <td>
              {user.firstname} {user.lastname}
            </td>
            <td>{userStatus(user)}</td>
            <td>{user.email_send_count}</td>
            {onResume && (
              <td>
                <button onClick={() => onResume(user)} disabled={loading}>
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
