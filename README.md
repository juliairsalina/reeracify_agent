## Repo Structure

```text
reeracify_agent/
└── backend/
    ├── app/
    │   ├── main.py              # FastAPI app, Pydantic schemas, API endpoints
    │   ├── rule_scoring.py      # Rule-based ATS scoring and LanguageTool checks
    │   ├── evaluation_agent.py  # LLM-based competitiveness evaluation agent
    │   ├── rewrite_agent.py     # LLM-based bullet rewrite agent
    │   └── .env                 # Local environment variables, not pushed to GitHub
    ├── config/
    │   ├── role_level_rubrics.csv # Editable role/level scoring rubric
    │   └── weak_phrases.csv       # Editable weak phrase list
    ├── examples/
    │   └── sample_resume.json   # Example input for testing /evaluate
    ├── .gitignore               # Ignored files such as .env and .venv
    └── README.md                # Project setup and usage instructions
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
