# Lumera React Native Wireframes

These are low-fidelity mobile wireframes for the Expo React Native app. They focus on structure, navigation, and core user flows rather than final colors, spacing, or typography.

## Design Direction

### Visual Thesis

Lumera should feel calm, private, and clinically trustworthy, with warm human touches rather than a loud medical dashboard.

### Content Plan

- First-run setup: understand the user's goal and collect only necessary data.
- Daily workspace: show today's status, next useful action, and upcoming reminders.
- Tracking flows: make period, symptom, appointment, and pregnancy logs fast to add.
- Learning: keep pregnancy and cycle education accessible without overwhelming the main workspace.

### Interaction Thesis

- Use bottom sheets for quick logging.
- Use a swipeable calendar for cycle review.
- Use a vertical pregnancy timeline to make progress feel clear and steady.

## App Navigation

```txt
Bottom Tabs

Today        Calendar        Pregnancy        Learn        Profile
```

The app should adapt based on the user's mode:

- Cycle users see cycle-focused cards on Today.
- Trying-to-conceive users see fertile-window and cycle insights.
- Pregnant users see pregnancy week, appointments, and trimester tasks.
- Postpartum users can be added later as a separate mode.

## 1. Welcome

```txt
+----------------------------------+
|                                  |
|  Lumera                          |
|                                  |
|  Cycle and pregnancy support     |
|  that keeps your data private.   |
|                                  |
|                                  |
|        [ Create account ]        |
|        [ Log in         ]        |
|                                  |
|  By continuing, you agree to     |
|  the privacy and safety terms.   |
|                                  |
+----------------------------------+
```

## 2. Goal Setup

```txt
+----------------------------------+
|  Setup                       1/4  |
|----------------------------------|
|                                  |
|  What brings you to Lumera?      |
|                                  |
|  [ Track my cycle          > ]   |
|  [ Trying to conceive      > ]   |
|  [ I am pregnant           > ]   |
|  [ Postpartum support      > ]   |
|                                  |
|                                  |
|        [ Continue ]              |
|                                  |
+----------------------------------+
```

## 3. Consent And Privacy

```txt
+----------------------------------+
|  Privacy                     2/4  |
|----------------------------------|
|                                  |
|  Your health data is sensitive.  |
|                                  |
|  [x] Store cycle and pregnancy   |
|      logs for my account         |
|                                  |
|  [ ] Send reminder notifications |
|                                  |
|  [ ] Share anonymous product     |
|      usage events                |
|                                  |
|  You can export or delete your   |
|  data from Profile.              |
|                                  |
|        [ Continue ]              |
|                                  |
+----------------------------------+
```

## 4. Cycle Setup

```txt
+----------------------------------+
|  Cycle setup                 3/4  |
|----------------------------------|
|                                  |
|  Last period started             |
|  [  Apr 12, 2026           v ]   |
|                                  |
|  Period usually lasts            |
|  [ - ]        5 days       [ + ] |
|                                  |
|  Cycle usually lasts             |
|  [ - ]       28 days       [ + ] |
|                                  |
|        [ Continue ]              |
|                                  |
+----------------------------------+
```

## 5. Pregnancy Setup

```txt
+----------------------------------+
|  Pregnancy setup             3/4  |
|----------------------------------|
|                                  |
|  How should we calculate?        |
|                                  |
|  (o) Last menstrual period       |
|  ( ) Due date                    |
|  ( ) Conception date             |
|                                  |
|  Date                            |
|  [  Apr 12, 2026           v ]   |
|                                  |
|  Care provider                   |
|  [ Optional name             ]   |
|                                  |
|        [ Continue ]              |
|                                  |
+----------------------------------+
```

## 6. Today: Cycle Mode

```txt
+----------------------------------+
|  Today                    bell   |
|----------------------------------|
|                                  |
|  Cycle day 18                    |
|  Fertile window likely ended     |
|                                  |
|  Next period estimate            |
|  Apr 30 - May 2                  |
|                                  |
|  Quick log                       |
|  [ Period ] [ Symptom ] [ Note ] |
|                                  |
|  Today's check-in                |
|  Mood        [ Calm       v ]    |
|  Pain        [ None       v ]    |
|  Sleep       [ 7h         v ]    |
|                                  |
|  Upcoming                        |
|  Period reminder       Apr 30    |
|                                  |
|----------------------------------|
| Today Calendar Pregnancy Learn Me|
+----------------------------------+
```

## 7. Today: Pregnancy Mode

```txt
+----------------------------------+
|  Today                    bell   |
|----------------------------------|
|                                  |
|  Week 14                         |
|  Second trimester                |
|                                  |
|  Baby this week                  |
|  Growth, movement, and energy    |
|  changes may become noticeable.  |
|                                  |
|  Quick actions                   |
|  [ Symptom ] [ Appointment ]     |
|  [ Question ] [ Reminder    ]    |
|                                  |
|  Next appointment                |
|  Midwife check-in      May 8     |
|                                  |
|  This week                       |
|  [ ] Ask about screening results |
|  [ ] Refill prenatal vitamins    |
|                                  |
|----------------------------------|
| Today Calendar Pregnancy Learn Me|
+----------------------------------+
```

## 8. Calendar

```txt
+----------------------------------+
|  Calendar                  + Log |
|----------------------------------|
|  Apr 2026                         |
|  <                         >      |
|                                  |
|  M   T   W   T   F   S   S       |
|      1   2   3   4   5           |
|  6   7   8   9  10  11 [12]      |
| [13][14][15][16]17  18  19       |
| 20  21  22  23  24  25  26       |
| 27  28  29  30                  |
|                                  |
|  Legend                          |
|  Period   Fertile   Logged       |
|                                  |
|  Selected day                    |
|  Apr 16: period, cramps, tired   |
|                                  |
|----------------------------------|
| Today Calendar Pregnancy Learn Me|
+----------------------------------+
```

## 9. Add Symptom Bottom Sheet

```txt
+----------------------------------+
|                                  |
|  Calendar screen behind overlay  |
|                                  |
|----------------------------------|
|  Add symptom                     |
|                                  |
|  Date                            |
|  [ Apr 28, 2026            v ]   |
|                                  |
|  Symptoms                        |
|  [ Cramps ] [ Nausea ] [ Mood ]  |
|  [ Tired  ] [ Spotting ] [ + ]   |
|                                  |
|  Intensity                       |
|  None ----|--------- Severe      |
|                                  |
|  Notes                           |
|  [ Optional private note      ]  |
|                                  |
|        [ Save log ]              |
+----------------------------------+
```

## 10. Pregnancy Timeline

```txt
+----------------------------------+
|  Pregnancy                       |
|----------------------------------|
|                                  |
|  Week 14 of 40                   |
|  Due date: Jan 17, 2027          |
|                                  |
|  Trimester progress              |
|  [=========-----]                |
|                                  |
|  Timeline                        |
|  [Week 13] Completed             |
|  [Week 14] Current       >       |
|  [Week 15] Coming up     >       |
|  [Week 16] Coming up     >       |
|                                  |
|  Appointments                    |
|  May 8   Midwife check-in        |
|                                  |
|----------------------------------|
| Today Calendar Pregnancy Learn Me|
+----------------------------------+
```

## 11. Pregnancy Week Detail

```txt
+----------------------------------+
|  < Week 14                       |
|----------------------------------|
|                                  |
|  What is happening this week     |
|  Short, reviewed guidance about  |
|  baby growth and body changes.   |
|                                  |
|  Common symptoms                 |
|  - More energy                   |
|  - Round ligament discomfort     |
|  - Appetite changes              |
|                                  |
|  To ask your provider            |
|  [ Add a question            + ] |
|                                  |
|  Safety                          |
|  [ When to seek care        > ]  |
|                                  |
+----------------------------------+
```

## 12. Appointments

```txt
+----------------------------------+
|  Appointments               +    |
|----------------------------------|
|                                  |
|  Upcoming                        |
|                                  |
|  May 8                           |
|  Midwife check-in                |
|  10:30 AM                        |
|  [ Questions ] [ Reminder on ]   |
|                                  |
|  Jun 4                           |
|  Scan appointment                |
|  2:00 PM                         |
|  [ Questions ] [ Reminder on ]   |
|                                  |
|  Past                            |
|  Apr 3   First appointment       |
|                                  |
+----------------------------------+
```

## 13. Learn

```txt
+----------------------------------+
|  Learn                    search |
|----------------------------------|
|                                  |
|  [ Pregnancy ] [ Cycle ] [ TTC ] |
|                                  |
|  For you                         |
|  Week 14: what to expect      >  |
|  Questions for appointments   >  |
|  Prenatal vitamins basics     >  |
|                                  |
|  Safety                          |
|  When to seek urgent care     >  |
|                                  |
|  Recently updated                |
|  Sleep during pregnancy       >  |
|                                  |
|----------------------------------|
| Today Calendar Pregnancy Learn Me|
+----------------------------------+
```

## 14. Profile And Privacy

```txt
+----------------------------------+
|  Profile                         |
|----------------------------------|
|                                  |
|  Account                         |
|  bernard@example.com             |
|                                  |
|  Health profile              >   |
|  Notification settings       >   |
|  Privacy and consent         >   |
|  Export my data              >   |
|  Delete account              >   |
|                                  |
|  App                             |
|  Medical disclaimer          >   |
|  Help and support            >   |
|  Log out                     >   |
|                                  |
|----------------------------------|
| Today Calendar Pregnancy Learn Me|
+----------------------------------+
```

## 15. Red-Flag Safety Prompt

```txt
+----------------------------------+
|  Symptom safety                  |
|----------------------------------|
|                                  |
|  This symptom may need urgent    |
|  medical attention.              |
|                                  |
|  Contact your care provider,     |
|  local urgent care service, or   |
|  emergency services now if you   |
|  feel unsafe or symptoms are     |
|  severe.                         |
|                                  |
|        [ Call emergency ]        |
|        [ Call provider  ]        |
|        [ Close          ]        |
|                                  |
+----------------------------------+
```

## 16. First React Native Screen Build Order

Build the UI in this order:

1. Welcome and auth screens.
2. Goal, consent, cycle setup, and pregnancy setup.
3. Tab navigation shell.
4. Today dashboard.
5. Calendar and quick log bottom sheet.
6. Pregnancy timeline and week detail.
7. Learn list and article detail.
8. Profile, export, and delete account screens.

## 17. Suggested Component Names

```txt
Screen
AppHeader
BottomTabBar
PrimaryButton
SecondaryButton
IconButton
FormField
DateField
SegmentedControl
ConsentToggle
CalendarMonth
CalendarDay
QuickActionGrid
SymptomChip
LogBottomSheet
TimelineList
TimelineItem
AppointmentRow
ArticleRow
SafetyPrompt
EmptyState
ErrorState
LoadingState
```
