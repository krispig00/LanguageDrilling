Japanese Practice Drill Web App - Project Overview
Problem Statement
You're learning Japanese at A1 level using Busuu as your primary curriculum. While Busuu provides structured lessons and Anki handles spaced repetition vocabulary, there's a gap: you can't easily drill specific topics on-demand when you feel rusty.
Current workflow:

Busuu = linear curriculum (keeps moving forward)
Claude = sentence building practice and grammar explanations
Anki = vocabulary review (but on Anki's schedule, not yours)

The missing piece:
A flexible, on-demand practice tool where you can choose "I want to drill time frequency words for 10 minutes right now" without daily obligations or streak pressure.

Solution: Topic-Based Drill Web App
A simple Vue.js web application that lets you:

Select a topic you want to practice (time frequency words, family members, particles, etc.)
Choose practice direction (Japanese → English or English → Japanese)
Choose number of questions (10 or 20)
Complete a quiz with all questions visible at once
See results with correct/incorrect answers highlighted


Technical Specifications
Tech Stack

Frontend: Vue 3 + TypeScript + Vite
Styling: Tailwind CSS
Data: Static JSON files (one per topic)
Hosting: GitHub Pages (auto-deployed via GitHub Actions)
Backend: None (client-side only)
Database: None

Live URL: https://krispig00.github.io/LanguageDrilling/
Repository: https://github.com/krispig00/LanguageDrilling

Data Structure
topics.json (master list):
json{
  "topics": [
    {
      "name": "Time Frequency Words",
      "file": "time-frequency.json"
    },
    {
      "name": "Family Members",
      "file": "family.json"
    },
    {
      "name": "Particles",
      "file": "particles.json"
    }
  ]
}
Individual topic file (e.g., time-frequency.json):
json{
  "questions": [
    { "question": "always", "answer": "itsumo" },
    { "question": "often", "answer": "yoku" },
    { 
      "question": "never", 
      "answer": "zenzen",
      "alternatives": ["zen zen"]
    }
  ]
}
```

**Notes on data structure:**
- No IDs needed for questions (use array index)
- `alternatives` array is optional - only add for common misspellings/variations
- Keep it simple: most questions just have `question` and `answer`
- Each topic file should contain 20+ questions to support the "20 questions" option
- Duplicate Japanese answers are handled automatically in JP→EN mode (e.g., if "evening" and "night" both map to "yoru", either English answer is accepted)

---

## User Flow

### Screen 1: Homepage (Topic Selection)

**Layout:**
- Grid of topic cards
- Clean, simple card design

**Interaction:**
1. Click a topic card
2. Selected card shows options (direction choice + question count)
3. Other cards dim to 50% opacity
4. Click outside selected card (on dimmed area) to deselect
5. Can select a different card to switch topics

**Selected card displays:**
- Direction: ( ) JP → EN  (•) EN → JP (radio buttons, EN→JP default)
- Number of questions: (•) 10  ( ) 20 (radio buttons, 10 default)
- [Start Quiz] button (enabled immediately with defaults)

### Screen 2: Quiz Page

**Layout:**
```
[← Back to Home]                    Time Frequency Words (JP → EN)


Question 1
itsumo
_________________________
[Your answer]


Question 2
tokidoki
_________________________
[Your answer]


Question 3
yoku
_________________________
[Your answer]

...

[Finish Quiz]
Features:

Clean, focused interface
All questions visible at once (scrollable list)
Topic name and direction displayed at top
"Back to Home" button in top-right (no warning about losing progress)
"Finish Quiz" button at bottom

Disabled (grayed out) until all questions have answers
Enabled when every input field has text



Question selection logic:
javascript// When starting quiz:
// 1. Load all questions from topic JSON
// 2. Shuffle the array (randomize order)
// 3. Take first N questions (10 or 20 based on user choice)
// 4. Display those questions

function shuffleQuestions(questions, count) {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
Answer validation:

Case insensitive - "Itsumo", "itsumo", "ITSUMO" all accepted
Trim whitespace
Check against main answer + alternatives (if provided)

Screen 3: Results Page
Display:

Full list of questions with answers:

✓ Correct answers (highlighted green)
✗ Wrong answers (highlighted red)

Show: "Your answer: [what you typed]"
Show: "Correct answer: [actual answer]"

Overall score at bottom (e.g., "8/10 correct")


Actions:

"Return to Home" button
"Quiz Again" button (restarts same topic/direction/count with fresh shuffle)


Answer Checking Logic
javascriptfunction checkAnswer(userAnswer, question) {
  // Normalize user input
  const normalized = userAnswer.toLowerCase().trim();
  const correctAnswer = question.answer.toLowerCase();
  
  // Check main answer
  if (normalized === correctAnswer) return true;
  
  // Check alternatives if they exist
  if (question.alternatives) {
    return question.alternatives.some(alt => 
      alt.toLowerCase() === normalized
    );
  }
  
  return false;
}
```

---

## Vue Component Structure (Suggested)
```
App.vue
├── HomePage.vue
│   └── TopicCard.vue (used in v-for loop)
├── QuizPage.vue
│   └── QuestionInput.vue (optional, or keep inline)
└── ResultsPage.vue
State management:

Can use simple props/emits for V1
Consider Vuex/Pinia later if complexity grows

Router:

Use Vue Router for navigation between pages
Routes: /, /quiz, /results


Out of Scope for V1
The following features are explicitly not included in the first version:

❌ Audio/pronunciation practice
❌ User accounts/login
❌ Progress tracking or analytics
❌ Score history
❌ Spaced repetition algorithm
❌ Mobile app version
❌ Multiple choice questions (free text only)
❌ Timed quizzes
❌ Difficulty levels
❌ Hints or explanations
❌ Subtopic filtering

These can be considered for future iterations.

Content Strategy
Adding content:

Manually add questions to JSON files as you progress through Busuu
Start with 3-5 topics you need most right now
Each topic should have at least 20 questions to support the "20 questions" option
Suggested starting topics:

Time Frequency Words
Family Members
Particles
Transportation vocabulary
Months/Days



Content guidelines:

Keep questions at A1 beginner level
Use romaji (romanized Japanese) for now
Can add hiragana/katakana later
No kanji in V1


Design Principles

Simple and focused - No unnecessary features or distractions
No pressure - No streaks, no daily goals, just practice when you want
Immediate feedback - See all results at the end of quiz
Flexible - Choose what to practice, when, and how many questions
Clean UI - Minimal, readable, focused on learning
Randomized practice - Questions shuffled each time for variety


Future Considerations
While out of scope for V1, these could be added later:

Multiple question types (multiple choice, fill-in-the-blank particles)
Difficulty levels (beginner, intermediate, advanced)
Progress tracking (which topics practiced, scores over time)
Custom topic creation (add your own topics via UI)
Audio support (hear pronunciations)
Hiragana/Katakana toggle (switch between romaji and Japanese scripts)
Timed challenge mode
Export/import functionality (share topic files)
Mobile-responsive design improvements
Dark mode
"Practice incorrect answers" feature


Development Phases
Phase 1: MVP Setup ✅

✅ Set up Vue 3 + TypeScript + Vite project
✅ Create basic routing (HomePage, QuizPage, ResultsPage)
✅ Design topics.json structure
✅ Create sample topic JSON files (20+ questions each)

Phase 2: Homepage ✅

✅ Load and display topic cards in grid
✅ Implement card selection interaction
✅ Add direction selection (JP→EN / EN→JP) with EN→JP default
✅ Add question count selection (10 / 20) with 10 default
✅ Enable "Start Quiz" button logic
✅ Add backdrop click to deselect

Phase 3: Quiz Page ✅

✅ Load questions based on selected topic
✅ Implement question shuffling and selection logic
✅ Reverse questions if EN→JP direction selected
✅ Display selected questions with input fields
✅ Track completion status (all fields filled)
✅ Enable/disable "Finish Quiz" button
✅ Implement answer checking logic
✅ Add "Back to Home" navigation
✅ Handle duplicate Japanese words in JP→EN mode (auto-detect and accept all valid translations)

Phase 4: Results Page ✅

✅ Calculate and display score (at bottom)
✅ Show correct/incorrect answers
✅ Highlight with green/red styling
✅ Display user's answer vs correct answer for wrong answers
✅ Add "Return to Home" button
✅ Add "Quiz Again" button

Phase 5: Polish & Deploy ✅

✅ Styling with Tailwind CSS
✅ Deploy to GitHub Pages
✅ Set up GitHub Actions for auto-deploy on push to main


Success Criteria
The app is successful if:

You can quickly drill any topic in under 3 clicks
You actually use it regularly (not just build it)
It fills the gap between Busuu's linear progression and Anki's scheduled reviews
It helps you retain vocabulary/grammar from earlier Busuu lessons
Questions feel fresh each time due to randomization


Design Decisions - Resolved

Should quiz questions be randomized each time?

✅ Yes - Questions will be shuffled on each quiz attempt


How many questions per topic is ideal?

✅ 10 or 20 questions - User selects before starting quiz


Should there be a way to filter topic by subtopic?

✅ No - Keep it simple, one level of topics only


Do you want to see your previous attempts/scores eventually?

✅ Not planned - No score history or tracking


Should "Back to Home" warn about losing progress?

✅ No - Simple navigation without warnings


Case sensitivity for answer checking?

✅ Not case sensitive - Accept any capitalization


Accept alternative spellings?

✅ Yes, but as exception - Only add alternatives when needed for common misspellings




Last Updated: January 2026
Current Status: V1 Complete and Live

Deployment:
- Live at: https://krispig00.github.io/LanguageDrilling/
- Auto-deploys via GitHub Actions when pushing to main branch
- Run `npm run dev` for local development