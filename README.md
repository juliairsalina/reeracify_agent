Repo Structure:
reeracify_agent/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │   └── FastAPI app, Pydantic schemas, and API endpoints
│   │   │
│   │   ├── rule_scoring.py
│   │   │   └── Rule-based ATS scoring, keyword checks, weak phrase checks,
│   │   │       measurable evidence detection, and LanguageTool grammar check
│   │   │
│   │   ├── evaluation_agent.py
│   │   │   └── LLM-based resume benchmark/evaluation agent
│   │   │
│   │   ├── rewrite_agent.py
│   │   │   └── LLM-based bullet rewrite suggestion agent
│   │   │
│   │   └── .env
│   │       └── Local Azure OpenAI and LanguageTool settings, ignored by Git
│   │
│   ├── config/
│   │   ├── role_level_rubrics.csv
│   │   │   └── Editable role/level rubric for expected keywords,
│   │   │       preferred project count, and bullet count thresholds
│   │   │
│   │   └── weak_phrases.csv
│   │       └── Editable weak phrase list used by rule_scoring.py
│   │
│   ├── examples/
│   │   └── sample_resume.json
│   │       └── Sample resume JSON for testing /evaluate and /reevaluate
│   │
│   ├── .gitignore
│   │   └── Prevents .env, .venv, cache files, and local files from being pushed
│   │
│   └── README.md
│       └── Project setup and usage guide

Install Package: 
pip install fastapi uvicorn python-dotenv requests openai


