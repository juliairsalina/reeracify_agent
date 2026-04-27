## Repo Structure

```text
backend/
├── requirements.txt                        # Python packages needed to run the backend
├── test_rule_scoring.py                    # Test script for original rule scoring + public LanguageTool API
├── test_rule_scoring_language_tool.py      # Test script for rule scoring + local language-tool-python
├── app/
│   ├── main.py                             # FastAPI endpoints: /evaluate, /rewrite, /reevaluate
│   ├── rule_scoring.py                     # Rule-based ATS scoring using CSV rubric + public LanguageTool API
│   ├── rule_scoring_language_tool.py       # Rule-based ATS scoring using local language-tool-python
│   ├── evaluation_agent.py                 # LLM Evaluation Agent for competitiveness category and weak areas
│   ├── rewrite_agent.py                    # LLM Rewrite Agent for selected bullet improvement
│   └── .env                                # Azure OpenAI keys and optional LanguageTool URL, not pushed to GitHub
├── config/
│   ├── role_level_rubrics.csv              # Editable role/level ATS rubric, keywords, and scoring thresholds
│   └── weak_phrases.csv                    # Editable weak/vague phrases to flag in resume bullets
└── examples/
    └── sample_resume.json                  # Dummy structured resume used for local testing
    └── sample_resume_wrong_grammar.json    # Dummy incorrect grammar structured resume used for local testing
```

## Install Package

```bash
pip install fastapi uvicorn python-dotenv requests openai
```

## Run

```bash
uvicorn app.main:app --reload
```

## Experiment 1: Rule based scoring using public API Language Tool

- Using https://dev.languagetool.org/public-http-api

```bash
{
  "rewrite_suggestions": [
    {
      "suggestion": "Coordinated student communication and community updates to improve information sharing across international student groups.",
      "why_it_is_better": "Uses a stronger action verb and clearer professional wording.",
      "caution": "Add real metrics only if you can verify them."
    }
  ]
}
```
## Supported Target Roles and Levels

```bash
# Data / Software
Data Analyst:
  - Entry-level
  - Experienced

Backend Developer:
  - Entry-level
  - Experienced

# Marketing
Marketing Associate:
  - Entry-level
  - Experienced

Digital Marketing Specialist:
  - Entry-level
  - Experienced

# IT
IT Support Specialist:
  - Entry-level
  - Experienced

System Administrator:
  - Entry-level
  - Experienced

# Admin / Operations
Administrative Assistant:
  - Entry-level
  - Experienced

Operations Coordinator:
  - Entry-level
  - Experienced

Human Resources Assistant:
  - Entry-level
  - Experienced

Project Coordinator:
  - Entry-level
  - Experienced

Customer Success Associate:
  - Entry-level
  - Experienced

```

## Sample Resume Rule-Scoring Test Output

```bash
==============================
ATS SCORE
==============================
68

==============================
RUBRIC USED
==============================
{'expected_keywords': ['python',
                       'sql',
                       'excel',
                       'tableau',
                       'power bi',
                       'data analysis',
                       'visualization',
                       'statistics',
                       'dashboard',
                       'pandas'],
 'expected_skills': ['python', 'sql', 'excel', 'tableau', 'power bi'],
 'notes': 'Entry-level data analyst resumes should show tools, projects, '
          'dashboards, and measurable analysis outcomes.',
 'preferred_min_experience_bullets': 3,
 'preferred_min_project_bullets': 2,
 'preferred_min_projects': 2,
 'target_level': 'Entry-level',
 'target_role': 'Data Analyst'}

==============================
SECTION PRESENCE
==============================
{'education': True, 'experience': True, 'projects': True, 'skills': True}

==============================
BULLET COUNTS
==============================
Experience bullet count: 7
Project count: 3
Project bullet count: 9

==============================
KEYWORD RESULT
==============================
{'missing_keywords': [],
 'present_keywords': ['python',
                      'sql',
                      'excel',
                      'tableau',
                      'power bi',
                      'data analysis',
                      'visualization',
                      'statistics',
                      'dashboard',
                      'pandas']}

==============================
MEASURABLE EVIDENCE
==============================
{'bullets_with_metrics': ['exp_1_b1',
                          'exp_1_b3',
                          'exp_2_b1',
                          'exp_2_b2',
                          'proj_1_b1',
                          'proj_3_b1'],
 'bullets_without_metrics': ['exp_1_b2',
                             'exp_1_b4',
                             'exp_2_b3',
                             'proj_1_b2',
                             'proj_1_b3',
                             'proj_2_b1',
                             'proj_2_b2',
                             'proj_2_b3',
                             'proj_3_b2',
                             'proj_3_b3'],
 'metric_bullet_count': 6}

==============================
WEAK PHRASE FLAGS
==============================
[{'id': 'exp_1_b4',
  'reason': "Uses weak phrase: 'helped manage'",
  'text': 'Prepared weekly data summaries that helped managers track '
          'slow-moving inventory and seasonal demand patterns.',
  'weak_phrase': 'helped manage'},
 {'id': 'exp_2_b2',
  'reason': "Uses weak phrase: 'used'",
  'text': 'Used Excel pivot tables to compare attendance trends across 8 '
          'career events.',
  'weak_phrase': 'used'},
 {'id': 'exp_2_b3',
  'reason': "Uses weak phrase: 'helped with'",
  'text': 'Helped with preparing monthly reports for staff meetings.',
  'weak_phrase': 'helped with'},
 {'id': 'proj_3_b1',
  'reason': "Uses weak phrase: 'handled'",
  'text': 'Cleaned survey data from 300+ student responses and handled missing '
          'values before analysis.',
  'weak_phrase': 'handled'}]

==============================
GRAMMAR FLAGS FROM LANGUAGETOOL
==============================
[]

```

- Problem: 
```bash
    - free version does have limitation → only check spelling ??
    - i deliberately did grammar mistakes → to identifies but not detected
    - this Language Tool also use API calls ?? redundant 
    - so maybe its better to ask evaluation agent to check grammar checker 
```

## Experiment 2: Rule based scoring using local Python Language Tool

- https://pypi.org/project/language_tool_python/

```bash 
# Local LanguageTool grammar checker wrapper
# Requires Java installed on your machine
# Took a long time to Download LanguageTool 6.8-SNAPSHOT for the first time 259MB
language-tool-python
```

- Running the second time 
```bash
export LTP_PATH="$HOME/.cache/language_tool_python"
```

- Output
```bash
==============================
ATS SCORE
==============================
63

==============================
RUBRIC USED
==============================
{'expected_keywords': ['python',
                       'sql',
                       'excel',
                       'tableau',
                       'power bi',
                       'data analysis',
                       'visualization',
                       'statistics',
                       'dashboard',
                       'pandas'],
 'expected_skills': ['python', 'sql', 'excel', 'tableau', 'power bi'],
 'notes': 'Entry-level data analyst resumes should show tools, projects, '
          'dashboards, and measurable analysis outcomes.',
 'preferred_min_experience_bullets': 3,
 'preferred_min_project_bullets': 2,
 'preferred_min_projects': 2,
 'target_level': 'Entry-level',
 'target_role': 'Data Analyst'}

==============================
SECTION PRESENCE
==============================
{'education': True, 'experience': True, 'projects': True, 'skills': True}

==============================
BULLET COUNTS
==============================
Experience bullet count: 7
Project count: 3
Project bullet count: 9

==============================
KEYWORD RESULT
==============================
{'missing_keywords': ['sql'],
 'present_keywords': ['python',
                      'excel',
                      'tableau',
                      'power bi',
                      'data analysis',
                      'visualization',
                      'statistics',
                      'dashboard',
                      'pandas']}

==============================
MEASURABLE EVIDENCE
==============================
{'bullets_with_metrics': ['exp_1_b1',
                          'exp_1_b3',
                          'exp_2_b1',
                          'exp_2_b2',
                          'proj_1_b1',
                          'proj_3_b1'],
 'bullets_without_metrics': ['exp_1_b2',
                             'exp_1_b4',
                             'exp_2_b3',
                             'proj_1_b2',
                             'proj_1_b3',
                             'proj_2_b1',
                             'proj_2_b2',
                             'proj_2_b3',
                             'proj_3_b2',
                             'proj_3_b3'],
 'metric_bullet_count': 6}

==============================
WEAK PHRASE FLAGS
==============================
[{'id': 'exp_1_b4',
  'reason': "Uses weak phrase: 'helped manage'",
  'text': 'Prepared weekly data summaries that helped managers track '
          'slow-moving inventory and seasonal demand patterns.',
  'weak_phrase': 'helped manage'},
 {'id': 'exp_2_b2',
  'reason': "Uses weak phrase: 'used'",
  'text': 'Used Excel pivot tables to compare attendance trends across 8 '
          'career events.',
  'weak_phrase': 'used'},
 {'id': 'exp_2_b3',
  'reason': "Uses weak phrase: 'helped with'",
  'text': 'Helped with preparing monthly reports for staff meetings.',
  'weak_phrase': 'helped with'},
 {'id': 'proj_3_b1',
  'reason': "Uses weak phrase: 'handled'",
  'text': 'Cleaned survey data from 300+ student responses and handled missing '
          'values before analysis.',
  'weak_phrase': 'handled'}]

==============================
GRAMMAR FLAGS FROM LOCAL LANGUAGETOOL
==============================
[{'id': 'exp_1_b1',
  'issue_count': 2,
  'issues': [{'category': 'TYPOS',
              'message': 'Possible spelling mistake. ‘Analyse’ is British '
                         'English.',
              'rule_id': 'MORFOLOGIK_RULE_EN_US',
              'short_message': '',
              'suggestions': ['Analyze']},
             {'category': 'TYPOS',
              'message': 'Possible spelling mistake found.',
              'rule_id': 'MORFOLOGIK_RULE_EN_US',
              'short_message': '',
              'suggestions': ['weekly']}],
  'text': 'Analyse weeekly sale data using Excel to identifies category-level '
          'revenue trends across 12 store location.'}]
```

### Local Grammar/Spelling Check with language-tool-python

The backend can use language-tool-python as a local grammar checker.
It runs LanguageTool locally through Java, so it avoids paid public API calls.

What language-tool-python checks:
1) Spelling
   Example: "recieve" → "receive"

2) Grammar
   Example: "He have experience" → "He has experience"

3) Subject-verb agreement
   Example: "The reports was completed" → "The reports were completed"

4) Article usage
   Example: "built a API" → "built an API"

5) Word form / awkward grammar
   Example: "to identifies trends" may be flagged, but not always

6) Casing and punctuation
   Example: lowercase proper nouns, missing punctuation, repeated punctuation

7) Style suggestions
    - Picky mode enables more detailed or stricter suggestions.
    - Example:
      - tool.picky = True

Important note:
language-tool-python is used as a supporting grammar signal only.
It may not catch every grammar mistake, so the Evaluation Agent also checks bullet clarity,
professionalism, and awkward wording.