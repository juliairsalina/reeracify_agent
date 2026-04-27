Repo Structure:
backend/
├── app/
│   ├── main.py
│   ├── rule_scoring.py
│   ├── evaluation_agent.py
│   ├── rewrite_agent.py
│   └── .env
├── config/
│   ├── role_level_rubrics.csv
│   └── weak_phrases.csv
└── examples/
    └── sample_resume.json


Install Package: 
pip install fastapi uvicorn python-dotenv requests openai


