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

## Expected Rewrite Suggestion

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



