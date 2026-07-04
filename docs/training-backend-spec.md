# Backend Specification: Training Sign-up ("Inschrijven trainingen")

This document specifies the backend for the training sign-up feature of the
D.S.A.V. Dodeka website. It is written so an implementer (human or AI) can
build it without access to the frontend conversation. The frontend already
exists at `src/pages/leden/inschrijven-training/` in the `dodekafrontend`
repository and currently runs on mock data; its TypeScript types in
`src/pages/leden/inschrijven-training/types.ts` mirror the response shapes
below and must stay in sync.

## 1. Context and architecture

The Dodeka stack consists of:

- **tiauth-faroe** (port 12770) — Go auth server handling signup/signin.
- **dodeka/backend** (port 12780) — Python API server (hfree). This is where
  the endpoints below are implemented.
- **dodekafrontend** — React (React Router 7) SPA, talks to the backend with
  `credentials: include` cookie sessions.

Authentication/identity is already in place: `GET /auth/session_info/`
returns the session, including
`user: { user_id, email, firstname, lastname, permissions: string[] }`.

**Authorization model:** flat permission strings on the user, no hierarchy.
Relevant permissions (all already exist in the admin panel):

| Permission | Meaning for this feature |
|---|---|
| `member` | May view trainings, see schedules and trainer assignments, sign up/out. |
| `trainers` | Everything a member may, plus: create/edit/delete/cancel trainings, edit groups (schedule, comment, trainer, T1/T2 event), remove attendees, import schedules. |
| `bestuur` | Same rights as `trainers`, plus: view the trainingscompetitie standings. |
| `admin` | Superset of everything above. |

**Every endpoint must enforce its permission server-side** (the frontend
check is cosmetic). A user with `trainers` OR `bestuur` OR `admin` is a
"manager" below. Requests without a valid session get `401`; with a session
but missing permission get `403`.

## 2. Domain model

A **training day** always has the same five groups ("slots"):

| slot | name | schedule? | notes |
|---|---|---|---|
| `sprint` | fixed: "Sprint" | yes | trainers work from a prepared schedule |
| `mila` | fixed: "MiLa" | yes | idem |
| `loopgroep` | fixed: "Loopgroep" | yes | idem |
| `t1` | variable, e.g. "Kogel" | **never** | technical slot 1; may be unused (name null) |
| `t2` | variable, e.g. "Discus" | **never** | technical slot 2; may be unused (name null) |

Members sign up for exactly one slot per day. There is no location field
anywhere — trainings are always at the club's track.

**Every training is staffed by five trainers.** Trainers are stored at the
day level (never per slot): `trainers` is a comma-separated list of the
five names, where **the first name is the contact point** of the day.
`warmup_trainers` holds who leads the joint warming-up. All trainer names
are visible to all members.

### Suggested tables

**training_days**
| column | type | notes |
|---|---|---|
| training_id | text, PK | e.g. `training_2026-07-06` or uuid |
| date | date, unique | one training day per calendar date |
| start_time | text "HH:MM" | default by weekday: Sat "10:15", else "18:15" |
| end_time | text "HH:MM", nullable | default: Sat "11:45", else "19:45" |
| cancelled_reason | text, nullable | non-null ⇒ the day is cancelled |
| cancelled_by | text (user_id), nullable | audit |
| trainers | text, nullable | comma-separated five names; first = contact point |
| warmup_trainers | text, nullable | who leads the joint warming-up |
| created_at / updated_at | timestamps | |

**training_events** (one row per slot, five per day)
| column | type | notes |
|---|---|---|
| event_id | text, PK | |
| training_id | FK → training_days, cascade delete | |
| slot | enum: sprint/mila/loopgroep/t1/t2 | unique per (training_id, slot) |
| name | text, nullable | fixed for the three groups; event name for t1/t2, null = slot unused |
| schedule | text, nullable | multiline; must be null for t1/t2 |
| comment | text, nullable | short trainer note, e.g. "Neem spikes mee" |

**training_signups**
| column | type | notes |
|---|---|---|
| event_id | FK → training_events, cascade delete | |
| user_id | text | |
| created_at | timestamp | |
| removed_by | text (user_id), nullable | set when a manager removes a no-show (audit) |

Constraint: **a user may have at most one active signup per training day.**
Enforce in the signup endpoint (move semantics, §5.1), not just the UI.

### Competition

Points are **derived**, not stored per mutation: a user's score = number of
distinct non-cancelled training days (in the current season) where they have
an active signup. Compute with a query; do not maintain a counter that can
drift. A season is a date range (configurable; default: the academic year,
1 Sep – 31 Aug).

## 3. Common conventions

- All endpoints under a `/trainings/` prefix.
- JSON in/out; snake_case keys.
- Dates as `"YYYY-MM-DD"`, times as `"HH:MM"` (24h).
- Attendee objects are `{ "user_id": "...", "name": "Firstname Lastname" }` —
  the backend resolves names so the frontend never needs a separate lookup.
- Errors: `{ "error": "machine_code", "message": "human readable" }` with an
  appropriate 4xx status.

## 4. Endpoints — read

### 4.1 GET /trainings/
Permission: `member`.
Query params: `from` (date, default today), `to` (date, default today + 21
days).
Returns the training days in range, ascending by date:

```json
{
  "trainings": [
    {
      "training_id": "training_2026-07-06",
      "date": "2026-07-06",
      "start_time": "18:15",
      "end_time": "19:45",
      "cancelled": null,
      "trainers": "Jasmijn, Karel, Roos, Sven, Nina",
      "warmup_trainers": "Jasmijn",
      "events": [
        {
          "event_id": "ev_123",
          "slot": "sprint",
          "name": "Sprint",
          "schedule": "Warming-up: 2 rondjes...\nKern: 3× 3×60m vliegend",
          "comment": "Neem je spikes mee!",
          "attendees": [
            { "user_id": "abc", "name": "Koers Klaproos" }
          ]
        },
        {
          "event_id": "ev_124",
          "slot": "t1",
          "name": "Kogel",
          "schedule": null,
          "comment": null,
          "attendees": []
        }
      ]
    }
  ]
}
```

- Always all five slot objects per day, in order sprint, mila, loopgroep,
  t1, t2. An unused technical slot has `"name": null`.
- `trainers` (comma-separated, first name = contact point) and
  `warmup_trainers` are day-level and visible to all members.
- A cancelled day has `"cancelled": { "reason": "NSK Teams" }` and keeps its
  events (signups on it don't count for the competition).

### 4.2 GET /trainings/competition/
Permission: `bestuur` or `admin` only. Regular members and trainers must get
`403` — the standings are not public.
Query params: `season` (optional, e.g. `2025-2026`; default current).

```json
{
  "season": "2025-2026",
  "standings": [
    { "user_id": "abc", "name": "Koers Klaproos", "points": 24 }
  ]
}
```
Sorted by points descending.

## 5. Endpoints — member actions

### 5.1 POST /trainings/{training_id}/signup/
Permission: `member`. Body: `{ "event_id": "ev_123" }`.

Rules:
- `404` if training or event doesn't exist; `409` (`training_cancelled`) if
  the day is cancelled; `409` (`slot_unused`) if the slot's name is null.
- If the user already has a signup on **another slot of the same day**, the
  signup **moves** (delete old, create new) — one slot per day.
- If the user is already signed up for this exact slot, respond `200`
  idempotently.
- Optional (recommended): reject signups for dates in the past
  (`409 signup_closed`).

Returns the updated training day (same shape as in §4.1).

Competition effect: automatic — the derived score now counts this day.

### 5.2 DELETE /trainings/{training_id}/signup/
Permission: `member`. Removes the caller's signup on that day (whichever
slot). `200` even if there was none. Returns the updated training day.

## 6. Endpoints — manager actions

All require `trainers`, `bestuur` or `admin`.

### 6.1 POST /trainings/
Create a training day. All five slot rows are created automatically. Body
(everything except `date` optional):

```json
{
  "date": "2026-07-27",
  "start_time": "18:15",
  "end_time": "19:45",
  "sprint_schedule": null,
  "mila_schedule": null,
  "loopgroep_schedule": null,
  "t1_event": "Kogel",
  "t2_event": null,
  "available_trainers": "Jasmijn, Karel, Roos, Sven, Nina",
  "warmup_trainers": null
}
```
Times default by weekday (§2). `available_trainers` maps to the day's
`trainers` column (first name = contact point). `409` (`date_taken`) if a
training already exists on that date.

### 6.2 PATCH /trainings/{training_id}/
Partial update of `start_time`, `end_time`, `trainers`, `warmup_trainers`.

### 6.3 DELETE /trainings/{training_id}/
Deletes the day and its events/signups.

### 6.4 POST /trainings/{training_id}/cancel/
Body: `{ "reason": "Baan onbespeelbaar" }` — reason is required, non-empty.
Sets `cancelled_reason` + `cancelled_by`. Signups are kept but stop counting
for the competition.

### 6.5 POST /trainings/{training_id}/restore/
Clears the cancellation.

### 6.6 PATCH /trainings/{training_id}/events/{event_id}/
Partial update of a slot:
- `comment` — any slot.
- `schedule` — only sprint/mila/loopgroep; `422` (`no_schedule_slot`) for
  t1/t2.
- `name` — only t1/t2 (`422` `fixed_name_slot` for the three groups).
  Setting `name` to null/empty marks the slot unused and **deletes its
  signups**.

### 6.7 DELETE /trainings/{training_id}/events/{event_id}/attendees/{user_id}/
Remove a no-show. Record `removed_by` for audit. The user's competition
score drops accordingly (derived). Consider notifying the user (out of
scope for v1).

## 7. Schedule import

Trainers prepare schedules outside the website (typically a spreadsheet).
There are two import flows:

1. **Full import** — one file with everything for the period (days, T1/T2
   events, trainers, optionally schedules).
2. **Per-group import** — schedules are made per group: the Sprint trainer
   delivers all Sprint schedules, not the MiLa ones. Each of the three
   schedule groups can therefore be uploaded separately (§7.3).

### 7.1 Full-import file format

One row per training day. **Only the `date` column is required** — the file
may contain any subset of the remaining columns (dynamic width); missing or
empty cells mean "not set". Columns beyond the eight below are ignored.
T1/T2 never carry a schedule — the file only has a name column for them:

| column | maps to |
|---|---|
| `date` | training_days.date (YYYY-MM-DD) |
| `sprint schedule` | sprint slot schedule (may be multiline) |
| `mila schedule` | mila slot schedule |
| `loopgroep schedule` | loopgroep slot schedule |
| `t1 event` | t1 slot name (empty = unused) |
| `t2 event` | t2 slot name (empty = unused) |
| `available trainers` | the five trainers of the day, comma-separated → training_days.trainers; **the first name is the contact point** |
| `warmup trainers` | training_days.warmup_trainers |

CSV example (cells may be quoted and contain commas/newlines, standard
Excel/Sheets export):

```csv
date,sprint schedule,mila schedule,loopgroep schedule,t1 event,t2 event,available trainers,warm-up trainers
2026-07-06,"Kern: 3× 3×60m vliegend","6× 800m, rust 90""","40' duurloop D1/D2",Kogel,Discus,"Jasmijn, Karel, Roos, Sven, Nina",Jasmijn
2026-07-08,"4× starts uit blokken","8× 400m","35' duurloop",Ver,,"Karel, Roos, Jasmijn, Nina, Sven",Roos
```

JSON equivalent: an array of objects with keys `date`, `sprint_schedule`,
`mila_schedule`, `loopgroep_schedule`, `t1_event`, `t2_event`,
`available_trainers`, `warmup_trainers` (missing/empty ⇒ null).

Start/end times are not in the file; they default by weekday (§2).

### 7.2 POST /trainings/import/
Permission: manager. The frontend parses the file client-side and submits
the parsed JSON (canonical); accepting raw CSV `multipart/form-data` is
optional.

Body:

```json
{
  "mode": "per_item",
  "trainings": [
    {
      "date": "2026-07-06",
      "sprint_schedule": "Kern: 3× 3×60m vliegend",
      "mila_schedule": "6× 800m, rust 90\"",
      "loopgroep_schedule": "40' duurloop D1/D2",
      "t1_event": "Kogel",
      "t2_event": "Discus",
      "available_trainers": "Jasmijn, Karel, Roos, Sven, Nina",
      "warmup_trainers": "Jasmijn"
    }
  ],
  "replace_dates": ["2026-07-06"]
}
```

Conflict semantics (a conflict = an imported `date` that already has a
training day):

| `mode` | behaviour |
|---|---|
| `overwrite_all` | every conflicting existing day is deleted and replaced |
| `skip_existing` | conflicting imported items are ignored, existing days stay |
| `per_item` | only dates listed in `replace_dates` are replaced; other conflicting imports are skipped |

The two-step UX the frontend implements: it first detects conflicts from the
already-loaded `GET /trainings/` data, asks the trainer to choose per date
(or "replace all" / "keep all"), then submits with `mode: "per_item"` and the
chosen `replace_dates`. A dry-run endpoint is therefore not required for v1,
but the import must be **transactional**: all or nothing.

Replacing a day deletes its signups (users signed up for a replaced future
training should ideally be notified — out of scope for v1, note it in the
response as `"replaced_with_signups": [dates]`).

Response: `{ "created": 12, "replaced": 2, "skipped": 1 }`.

### 7.3 POST /trainings/import/schedules/
Permission: manager. Per-group schedule import: one trainer uploads all
schedules for their own group in one go. File format: two columns,
`date, schedule` (CSV, quoted multiline cells allowed) or JSON
`[{ "date": "...", "schedule": "..." }]`.

Body:

```json
{
  "slot": "sprint",
  "mode": "per_item",
  "schedules": [
    { "date": "2026-07-06", "schedule": "Kern: 3× 3×60m vliegend" },
    { "date": "2026-07-08", "schedule": "4× starts uit blokken" }
  ],
  "replace_dates": ["2026-07-06"]
}
```

- `slot` must be `sprint`, `mila` or `loopgroep` — `422`
  (`no_schedule_slot`) for t1/t2.
- If the training day does not exist yet, it is **created** with default
  times (§2) and only this group's schedule set. Signups and other groups
  are never touched by this endpoint.
- If the day exists and the group's schedule is empty, it is filled in.
- If the day exists and the group already has a schedule, the conflict mode
  applies (same `overwrite_all` / `skip_existing` / `per_item` semantics as
  §7.2, where a conflict = date whose group schedule is already set).
- Transactional: all or nothing.

Response: `{ "days_created": 3, "schedules_set": 9, "skipped": 1 }`.

## 8. Business rules summary

1. One training day per date; five fixed slots per day; one active signup
   per user per day.
2. Every training is staffed by five trainers, stored at the day level
   (never per slot). The first name in the list is the contact point; the
   warming-up lead is stored separately. All trainer names are visible to
   members.
3. Signing up for another slot on the same day moves the signup.
4. Sprint/MiLa/Loopgroep have schedules; T1/T2 never do. T1/T2 names are
   editable, group names are not.
5. Cancelling requires a reason and is reversible; cancelled days count for
   nobody in the competition.
6. Competition points = count of distinct non-cancelled days with an active
   signup within the season. Removing a no-show retracts that day's point.
7. Standings are visible to `bestuur`/`admin` only.
8. All writes require manager permissions except signup/sign-out.
9. Imports are transactional and follow the conflict modes of §7.2/§7.3.
   Schedules are delivered per group (§7.3); the full import (§7.2) needs
   only a date column, all other columns are optional.

## 9. Out of scope for v1 (planned, don't block on these)

- Email/push notifications on cancellation or removal.
- Max capacity + waitlists per slot.
- Signup deadlines (e.g. closes 2h before start).
- Attendance check-in by trainers on the day itself (would make the
  competition reflect *attendance* instead of *signup*).
- iCal feed of the training calendar.
