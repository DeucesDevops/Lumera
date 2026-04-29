# Lumera Product And Engineering Plan

## 1. Product Vision

Lumera is a privacy-first mobile application for cycle tracking, conception planning, and pregnancy support. The app helps users understand their cycle patterns, follow their pregnancy week by week, prepare for appointments, and recognize when they should contact a healthcare professional.

Lumera should feel calm, trustworthy, and supportive. It should not try to replace a doctor, midwife, or emergency care.

## 2. Target Users

- People tracking menstrual cycles.
- People trying to conceive.
- Pregnant women following their pregnancy journey.
- Postpartum users who want recovery and newborn-care support.
- Partners or support people in a later phase.

## 3. Core Product Modes

### Cycle Mode

- Track period start and end dates.
- Predict next period.
- Estimate fertile window and ovulation.
- Log symptoms, mood, discharge, spotting, sleep, libido, pain, medication, and notes.
- View calendar and cycle history.
- Export a doctor-ready summary.

### Pregnancy Mode

- Calculate pregnancy week and trimester.
- Show week-by-week pregnancy guidance.
- Track body changes, symptoms, appointments, supplements, and questions for providers.
- Provide trimester checklists.
- Support birth preparation.
- Add safety prompts for urgent symptoms.

### Postpartum Mode

This can come after the MVP.

- Recovery check-ins.
- Mood and mental health prompts.
- Feeding, sleep, and newborn-care trackers.
- Postpartum appointment reminders.

## 4. MVP Scope

The first version should focus on the few workflows users will return to every week.

### MVP Features

- Account creation and login.
- Consent-first onboarding.
- User profile and health preferences.
- Cycle calendar.
- Period logging.
- Cycle predictions.
- Symptom logging.
- Pregnancy due date setup.
- Pregnancy week timeline.
- Appointment reminders.
- Supplement reminders.
- Learn/content section.
- Basic red-flag symptom guidance.
- Account deletion.
- Data export.

### Out Of Scope For MVP

- AI medical advice.
- Provider portal.
- Insurance integrations.
- Wearable integrations.
- In-app community.
- Paid subscriptions.
- Lab result interpretation.
- Diagnosis or treatment recommendations.

## 5. Tech Stack

### Mobile App

- React Native with Expo.
- TypeScript.
- Expo Router for file-based navigation.
- NativeWind for styling.
- TanStack Query for API data fetching and caching.
- React Hook Form for forms.
- Zod for validation.
- Expo SecureStore for sensitive local token storage.
- Expo Notifications for reminders and pregnancy updates.
- Sentry for error tracking.

### Backend

- Node.js.
- Express.js.
- TypeScript.
- Modular architecture organized by feature/domain modules.
- Zod for request validation.
- JWT access tokens.
- Refresh-token sessions.
- Rate limiting for auth endpoints.
- Background jobs for reminders and emails.

### Database

- Postgres hosted on Neon.
- Drizzle ORM.
- Drizzle migrations.
- Hashed refresh tokens stored in Postgres.
- Audit-friendly health data tables.

### Infrastructure

- API hosting: Render, Railway, Fly.io, or AWS.
- Database: Neon Postgres.
- Mobile builds: Expo EAS Build and Submit.
- Email: Resend or Postmark.
- CI/CD: GitHub Actions.
- Error monitoring: Sentry.

## 6. Proposed Monorepo Structure

```txt
Lumera/
  apps/
    mobile/
      app/
      assets/
      src/
        components/
        features/
        hooks/
        lib/
        screens/
        styles/
    api/
      src/
        app.ts
        server.ts
        config/
        db/
        lib/
        modules/
          auth/
            auth.routes.ts
            auth.controller.ts
            auth.service.ts
            auth.repository.ts
            auth.schemas.ts
            auth.types.ts
            auth.test.ts
          users/
          cycle/
          pregnancy/
          reminders/
          content/
          data-rights/
        shared/
          errors/
          middleware/
          validation/
          security/
        jobs/
        utils/
  packages/
    db/
      src/
        schema/
        migrations/
        client.ts
    shared/
      src/
        schemas/
        types/
        constants/
    config/
      eslint/
      tsconfig/
      prettier/
```

## 7. Backend Architecture

The backend should use a modular architecture. Each product domain should own its routes, validation schemas, business logic, database access, types, and tests. This keeps the API easier to maintain as Lumera grows.

### Architecture Style

- Feature-first modules, not one global folder for all controllers and one global folder for all services.
- Each module exposes routes through a module router.
- Controllers handle HTTP request and response concerns only.
- Services contain business logic.
- Repositories contain database queries.
- Zod schemas validate request bodies, params, query strings, and response contracts where useful.
- Shared middleware, error handling, security helpers, and utilities live outside feature modules.
- Modules should communicate through service interfaces instead of reaching directly into another module's repository.
- Database schema can live in `packages/db`, while module repositories consume the shared database client.

### Example Module Shape

```txt
modules/
  cycle/
    cycle.routes.ts
    cycle.controller.ts
    cycle.service.ts
    cycle.repository.ts
    cycle.schemas.ts
    cycle.types.ts
    cycle.test.ts
```

### Module Boundaries

- `auth` owns registration, login, refresh sessions, logout, password reset, and email verification.
- `users` owns profile, preferences, consent records, and account settings.
- `cycle` owns cycle profiles, period logs, symptom logs, and cycle predictions.
- `pregnancy` owns pregnancy profiles, pregnancy week calculations, pregnancy logs, and trimester guidance.
- `reminders` owns appointments, supplement reminders, push tokens, and notification scheduling.
- `content` owns articles, pregnancy week content, review status, and safety guidance.
- `data-rights` owns export requests, deletion requests, and privacy-related account operations.

## 8. App Navigation

### Main Tabs

- Today
- Calendar
- Pregnancy
- Learn
- Profile

### Important Screens

- Welcome
- Sign up
- Login
- Forgot password
- Consent and privacy setup
- Goal setup
- Cycle setup
- Pregnancy setup
- Today dashboard
- Calendar
- Add period
- Add symptom log
- Pregnancy week detail
- Appointment list
- Add appointment
- Reminder settings
- Learn article detail
- Data export
- Delete account

## 9. Backend Modules

### Auth

- Register.
- Login.
- Refresh session.
- Logout current device.
- Logout all devices.
- Password reset.
- Email verification.

### Users

- Profile.
- Preferences.
- Consent records.
- Account deletion.

### Cycle Tracking

- Cycle settings.
- Period logs.
- Symptom logs.
- Prediction summaries.

### Pregnancy

- Pregnancy profile.
- Due date.
- Pregnancy week calculation.
- Weekly content.
- Pregnancy symptom logs.

### Reminders

- Appointments.
- Supplements.
- Period reminders.
- Pregnancy week reminders.
- Push notification tokens.

### Content

- Articles.
- Weekly pregnancy entries.
- Safety guidance.
- Content review status.

### Data Rights

- Export user data.
- Delete user data.
- Download account archive.

## 10. Initial Database Tables

```txt
users
sessions
email_verification_tokens
password_reset_tokens
user_consents
user_preferences
cycle_profiles
period_logs
symptom_logs
pregnancy_profiles
pregnancy_symptom_logs
appointments
reminders
push_tokens
content_articles
pregnancy_week_content
data_export_requests
account_deletion_requests
audit_events
```

## 11. Auth And Session Design

- Access tokens should be short-lived.
- Refresh tokens should be long-lived, rotated, and stored hashed in Postgres.
- The mobile app should keep access tokens in memory where possible.
- Refresh tokens should be stored in Expo SecureStore.
- Users should be able to log out of one device or all devices.
- Login, registration, and password reset endpoints should use rate limiting.
- All auth responses should avoid exposing whether sensitive records exist when possible.

## 12. Health And Safety Boundaries

Lumera should provide education, tracking, and preparation support. It should not diagnose, treat, or replace professional care.

### Red-Flag Guidance

The app should encourage users to contact a healthcare professional or emergency services for urgent symptoms, including:

- Heavy bleeding.
- Severe abdominal pain.
- Chest pain.
- Trouble breathing.
- Severe headache.
- Vision changes.
- Fainting.
- Fever.
- Swelling of face or hands.
- Reduced or no fetal movement after the relevant pregnancy stage.
- Thoughts of self-harm.

Clinical safety copy should be reviewed by a qualified healthcare professional before launch.

## 13. Privacy Requirements

Cycle and pregnancy data is highly sensitive. Privacy should be designed into the product from the beginning.

### Required Privacy Features

- Clear consent during onboarding.
- Privacy policy before launch.
- Data export.
- Account deletion.
- Delete health data.
- Minimal analytics.
- No sensitive health data in logs.
- No sensitive health data in analytics event names or payloads.
- Encryption in transit.
- Encrypted database backups where supported by provider infrastructure.
- Role-based admin access before adding internal tools.

### Compliance Notes

- HIPAA may apply if Lumera works with covered entities such as clinics, providers, or health plans.
- The FTC Health Breach Notification Rule may apply to consumer health apps that maintain personal health records.
- FDA oversight depends on the app's functionality. Wellness tracking is lower risk than diagnostic or treatment software.

## 14. Design Direction

Lumera should look warm, calm, and mature. It should avoid noisy medical dashboards and overly playful visuals.

### Interface Principles

- Mobile-first.
- Clear daily dashboard.
- Fast logging flow.
- Plain language.
- Gentle color palette with strong accessibility contrast.
- Large touch targets.
- Low-friction navigation.
- No shame-based language.
- No alarming copy unless escalation is clinically appropriate.

### Component System

- Button.
- Icon button.
- Text input.
- Select field.
- Date picker wrapper.
- Form field wrapper.
- Card.
- Modal.
- Bottom sheet.
- Tabs.
- Calendar day cell.
- Symptom chip.
- Reminder row.
- Article card.
- Empty state.
- Loading state.
- Error state.

## 15. Content Strategy

All health content should be structured, versioned, and reviewable.

### Content Types

- Weekly pregnancy guidance.
- Cycle education.
- Fertility basics.
- Nutrition basics.
- Exercise and movement.
- Mental health.
- Appointment preparation.
- Birth preparation.
- Postpartum recovery.
- Safety guidance.

### Content Fields

- Title.
- Slug.
- Category.
- Body.
- Trimester or cycle phase.
- Reading time.
- Medical review status.
- Reviewer name or role.
- Last reviewed date.
- Source references.

## 16. API Design

Use REST for the MVP. Keep endpoints simple and versioned.

```txt
/api/v1/auth/register
/api/v1/auth/login
/api/v1/auth/refresh
/api/v1/auth/logout
/api/v1/auth/logout-all
/api/v1/auth/password-reset/request
/api/v1/auth/password-reset/confirm

/api/v1/me
/api/v1/me/preferences
/api/v1/me/consents
/api/v1/me/export
/api/v1/me/delete

/api/v1/cycle/profile
/api/v1/cycle/periods
/api/v1/cycle/symptoms
/api/v1/cycle/predictions

/api/v1/pregnancy/profile
/api/v1/pregnancy/weeks
/api/v1/pregnancy/symptoms

/api/v1/appointments
/api/v1/reminders
/api/v1/content/articles
```

## 17. Development Phases

### Phase 0: Project Setup

- Create monorepo.
- Set up Expo app.
- Set up Express API.
- Configure TypeScript.
- Configure ESLint and Prettier.
- Configure NativeWind.
- Configure Drizzle and Neon.
- Add environment variable management.
- Add GitHub Actions basics.

### Phase 1: Auth And Foundations

- Register.
- Login.
- Refresh sessions.
- Logout.
- Secure token storage.
- API client.
- TanStack Query setup.
- Protected routes.
- Base component system.

### Phase 2: Onboarding

- Goal selection.
- Consent screen.
- Cycle setup.
- Pregnancy setup.
- Preferences.
- Initial dashboard routing.

### Phase 3: Cycle Tracking

- Period logging.
- Symptom logging.
- Calendar view.
- Prediction calculation.
- Cycle history.

### Phase 4: Pregnancy Experience

- Pregnancy profile.
- Due date calculation.
- Week-by-week timeline.
- Trimester checklists.
- Appointment planner.
- Supplement reminders.

### Phase 5: Content And Safety

- Content library.
- Weekly content.
- Red-flag guidance.
- Medical review workflow.

### Phase 6: Privacy And Launch Readiness

- Data export.
- Account deletion.
- Logging review.
- Analytics review.
- Security review.
- Beta testing.

### Phase 7: Public Launch

- App Store preparation.
- Play Store preparation.
- Production monitoring.
- Support workflow.
- Feedback loop.

## 18. Testing Plan

### Mobile

- Component tests with React Native Testing Library.
- Form validation tests.
- Navigation flow tests.
- Critical end-to-end tests with Maestro or Detox.

### API

- Unit tests with Vitest.
- Integration tests with Supertest.
- Auth session tests.
- Validation tests.
- Database migration tests.

### Product QA

- Onboarding flow.
- Period logging flow.
- Pregnancy setup flow.
- Reminder creation flow.
- Account deletion flow.
- Data export flow.
- Offline and poor-network states.

## 19. Analytics Plan

Analytics should be minimal and privacy-preserving.

### Safe Events

- onboarding_completed
- cycle_log_created
- pregnancy_profile_created
- reminder_created
- article_opened
- data_export_requested
- account_deleted

### Avoid

- Symptom names in event payloads.
- Period dates in analytics.
- Pregnancy due dates in analytics.
- Free-text notes in logs or analytics.
- Sharing reproductive health data with ad platforms.

## 20. Launch Checklist

- Privacy policy written.
- Terms written.
- Medical disclaimer written.
- Health content reviewed.
- Account deletion works.
- Data export works.
- Password reset works.
- Session rotation works.
- Push notifications tested.
- Error monitoring enabled.
- Production database migrations tested.
- App Store screenshots prepared.
- Play Store screenshots prepared.
- Beta feedback reviewed.

## 21. Future Features

- Partner mode.
- Kick counter.
- Contraction timer.
- Birth plan builder.
- Postpartum recovery tracker.
- Baby feeding and sleep tracker.
- Wearable integrations.
- Provider-ready PDF reports.
- Clinic/provider portal.
- Premium content or courses.
- AI assistant limited to reviewed content and strict safety escalation.

## 22. Open Decisions

- Final app name and brand direction.
- API hosting provider.
- Email provider.
- Background job system.
- Whether to support offline-first logging in the MVP.
- Whether cycle predictions should be fully local, server-side, or mixed.
- Whether pregnancy content is stored locally, server-side, or both.
- Whether to use Maestro or Detox for mobile end-to-end tests.
- Whether to add subscriptions in version 1 or wait.

## 23. Reference Sources

- ACOG prenatal care overview: https://www.acog.org/womens-health/faqs/prenatal-care
- CDC pregnancy resources: https://www.cdc.gov/pregnancy/
- CDC urgent maternal warning signs: https://www.cdc.gov/hearher/maternal-warning-signs/index.html
- HHS health app developer resources: https://www.hhs.gov/hipaa/for-professionals/special-topics/health-apps/index.html
- FTC Health Breach Notification Rule: https://www.ftc.gov/business-guidance/resources/complying-ftcs-health-breach-notification-rule-0
- FDA device software functions and mobile medical applications: https://www.fda.gov/medical-devices/digital-health-center-excellence/device-software-functions-including-mobile-medical-applications
