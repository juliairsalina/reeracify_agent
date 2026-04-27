from __future__ import annotations

import json
from pathlib import Path
from pprint import pprint

from app.rule_scoring import run_rule_based_scoring


def load_sample_resume() -> dict:
    sample_path = Path("examples/examples.json")

    if not sample_path.exists():
        raise FileNotFoundError(
            "Missing examples/file. "
            "Please create the sample resume file first."
        )

    with open(sample_path, "r", encoding="utf-8") as file:
        return json.load(file)


def main() -> None:
    resume = load_sample_resume()

    target_role = resume["target_role"]
    target_level = resume["target_level"]

    languagetool_url = "https://api.languagetool.org/v2/check"

    result = run_rule_based_scoring(
        resume=resume,
        target_role=target_role,
        target_level=target_level,
        languagetool_url=languagetool_url,
    )

    print("\n==============================")
    print("ATS SCORE")
    print("==============================")
    print(result["ats_score"])

    print("\n==============================")
    print("RUBRIC USED")
    print("==============================")
    pprint(result["rubric_used"])

    print("\n==============================")
    print("SECTION PRESENCE")
    print("==============================")
    pprint(result["section_presence"])

    print("\n==============================")
    print("BULLET COUNTS")
    print("==============================")
    print("Experience bullet count:", result["experience_bullet_count"])
    print("Project count:", result["project_count"])
    print("Project bullet count:", result["project_bullet_count"])

    print("\n==============================")
    print("KEYWORD RESULT")
    print("==============================")
    pprint(result["keyword_result"])

    print("\n==============================")
    print("MEASURABLE EVIDENCE")
    print("==============================")
    pprint(result["measurable_evidence"])

    print("\n==============================")
    print("WEAK PHRASE FLAGS")
    print("==============================")
    pprint(result["weak_phrase_flags"])

    print("\n==============================")
    print("GRAMMAR FLAGS FROM LANGUAGETOOL")
    print("==============================")
    pprint(result["grammar_flags"])


if __name__ == "__main__":
    main()