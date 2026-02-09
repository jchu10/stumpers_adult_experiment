# Stumpers Adult Experiment

Adult riddle study ("Stumpers") built with jsPsych 8.2.2, hosted on GitHub Pages. Data is stored via DataPipe to OSF. Participants are recruited through Prolific.

## Tech Stack

All client-side JavaScript — no server. jsPsych 8.2.2 and plugins loaded from unpkg CDN. Cloudflare Turnstile for bot protection (client-side only, no server-side token validation). DataPipe (`jsPsychPipe`) for saving JSON data to OSF.

## File Structure

- `index.html` — Entry point. Loads all scripts/CSS from CDN. Contains the captcha-container overlay div and a honeypot email field for bot detection.
- `js/experiment.js` — Main experiment logic. The `setupGame()` function builds the full jsPsych timeline and calls `jsPsych.run()`.
- `js/game_settings.js` — Configuration object (`gs`): study metadata (num riddles, min response length/time, comprehension attempts), session info (condition), Prolific URL params, Cloudflare Turnstile site key.
- `js/stimuli.js` — Riddle stimuli (`stimuli` array: 9 riddles across 3 categories — quantity, viewing, common) and CRT items (`crt` array: 6 cognitive reflection test items).
- `css/style.css` — All custom styles including content boxes, sliders, riddle prompts, captcha overlay.
- `analysis/preprocessing/json_to_csv.R` — R script for converting JSON data to CSV.

## Experiment Flow (jsPsych Timeline)

1. **CAPTCHA trial** — Cloudflare Turnstile verification displayed as a fixed centered overlay. Uses explicit `turnstile.render()`. "Begin Study" button appears on successful verification.
2. **Consent** — IRB consent form (Harvard CoCoDev lab). Clicking "DECLINE" aborts the experiment. Clicking "CONSENT" enters fullscreen mode.
3. **Instructions** — Single page explaining the task: answer riddles, rate confidence, rate similarity to shown solution.
4. **Comprehension check** (looped) — 3 multiple-choice questions. Max 2 attempts (`gs.study_metadata.comprehension_max_attempts`). Previously correct answers are pre-filled on retry. Option to re-read instructions between attempts.
5. **Save checkpoint** — DataPipe save (`subjectID_part1.json`).
6. **Failed comprehension screen** (conditional) — If comprehension failed after max attempts, shows failure message and redirects to Prolific.
7. **Main experiment** (conditional on comprehension pass):
   - Pre-riddle message
   - 9 riddle trials, each consisting of: riddle question (with minimum time + character requirements) → confidence slider (0–100) → similarity rating (after revealing the correct answer)
   - Riddle ordering depends on `gs.session_info.condition`
8. **Save checkpoint** — DataPipe save (`subjectID_part2.json`).
9. **CRT trials** — Pre-CRT message, then 6 cognitive reflection test riddles (response only, no confidence/similarity ratings, minimum 4 characters).
10. **Save checkpoint** — DataPipe save (`subjectID_part3.json`).
11. **Exit survey** — 3-page survey: experience/effort/difficulty/external help, prior riddle familiarity checklist, optional demographics (age, gender, education, race, ethnicity).
12. **Final save** — DataPipe save (`subjectID.json` — complete dataset).
13. **Goodbye** — Thank you message, then redirect to Prolific completion URL.

## Conditions

The `gs.session_info.condition` field controls riddle presentation order:
- `"fixed"` — Stimuli presented in their array order.
- `"shuffled"` — Fully randomized order.
- `"grouped"` — Riddles grouped by category (quantity, viewing, common), each group internally shuffled, group order randomized.
- `"mixed"` — Interleaved categories drawn from one of 15 predefined category orderings, individual riddles shuffled within category.

## Anti-Bot Measures

- Cloudflare Turnstile widget (client-side challenge, token saved in trial data)
- Honeypot email field (hidden via CSS, value captured in `gs.session_info.pot1`)
- Copy/paste/right-click disabled via event listeners

## Prolific Integration

URL parameters `PROLIFIC_PID`, `STUDY_ID`, `SESSION_ID` are captured automatically on load and stored in jsPsych data properties. Completion and failure screens redirect to Prolific URLs.

## Data Saves

Data is saved incrementally via DataPipe at 4 checkpoints (after comprehension, after riddles, after CRT, and final). Each save uses the OSF experiment ID from `gs.study_metadata.experimentIdOSF`. Filenames use the generated `subjectID`.
