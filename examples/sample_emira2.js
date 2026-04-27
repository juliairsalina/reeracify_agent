const fs = require("fs");

// =========================
// LOAD AZURE OUTPUT
// =========================
const raw = JSON.parse(fs.readFileSync("azure-output.json", "utf-8"));
const text = raw.analyzeResult.content;

// =========================
// CLEAN TEXT
// =========================
function cleanText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\n+/g, "\n")
    .replace(/ +/g, " ")
    .trim();
}

const lines = cleanText(text)
  .split("\n")
  .map(l => l.trim())
  .filter(l => l.length > 1);

// =========================
// SECTION DETECTION
// =========================
let current = "summary";

const sections = {
  summary: [],
  education: [],
  experience: [],
  projects: [],
  skills: []
};

lines.forEach(line => {
  const upper = line.toUpperCase();

  if (upper.includes("SUMMARY")) current = "summary";
  else if (upper.includes("EDUCATION")) current = "education";
  else if (upper.includes("WORK EXPERIENCE")) current = "experience";
  else if (upper.includes("EXPERIENCE")) current = "experience";
  else if (upper.includes("PROJECT")) current = "projects";
  else if (upper.includes("SKILLS")) current = "skills";
  else sections[current].push(line);
});

// =========================
// BASIC EXTRACTION
// =========================
function extractName(text) {
  return text.split("\n")[0].split("|")[0].trim();
}

function cleanName(name) {
  return name.split(",")[0].trim();
}

function extractEmail(text) {
  const match = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return match ? match[0] : "";
}

function extractPhone(text) {
  const match = text.match(/\+?\d[\d -]{8,}\d/);
  return match ? match[0].replace(/\s+/g, "") : "";
}

// =========================
// BULLET DETECTOR
// =========================
function isBullet(line) {
  return line.startsWith("·") || line.startsWith("•") || line.startsWith("-");
}

// =========================
// EXPERIENCE PARSER
// =========================
function parseExperience(lines) {
  const results = [];
  let current = null;

  lines.forEach(line => {
    if (!isBullet(line) && line.length < 100) {

      // skip section noise
      if (/EXTRACURRICULAR|VOLUNTEERING/i.test(line)) return;

      if (current) results.push(current);

      current = {
        company: "",
        role: line,
        start_date: "",
        end_date: "",
        description: "",
        bullets: []
      };
    }
    else if (isBullet(line) && current) {
      current.bullets.push(line.replace(/^[·•-]\s*/, "").trim());
    }
    else if (current) {
      current.description += " " + line;
    }
  });

  if (current) results.push(current);

  return results;
}

// =========================
// PROJECT PARSER
// =========================
function parseProjects(lines) {
  const results = [];
  let current = null;

  lines.forEach(line => {

    // skip pure dates
    if (/^\w+\s?\d{4}/i.test(line)) return;

    if (!isBullet(line) && line.length < 100) {

      if (current) results.push(current);

      current = {
        name: line,
        description: "",
        technologies: [],
        bullets: []
      };
    }
    else if (isBullet(line) && current) {
      current.bullets.push(line.replace(/^[·•-]\s*/, "").trim());
    }
    else if (current) {
      current.description += " " + line;
    }
  });

  if (current) results.push(current);

  return results;
}

// =========================
// EDUCATION PARSER
// =========================
function parseEducation(lines) {
  const results = [];

  let buffer = "";

  lines.forEach(line => {

    // skip date-only lines
    if (/^\w+\s?\d{4}/i.test(line)) return;

    buffer += " " + line;

    if (line.includes("CGPA") || line.includes("GPA")) {

      const schoolMatch = buffer.match(/([A-Z][a-zA-Z\s]+University|College|Institute)/);
      const gpaMatch = buffer.match(/(\d\.\d{1,2})/);

      results.push({
        school: schoolMatch ? schoolMatch[0] : buffer.trim(),
        degree: "",
        field: "",
        start_date: "",
        end_date: "",
        gpa: gpaMatch ? gpaMatch[0] : ""
      });

      buffer = "";
    }
  });

  return results;
}

// =========================
// SKILLS PARSER
// =========================
function parseSkills(lines) {
  return lines
    .join(" ")
    .split(/,|\./)
    .map(s => s.trim().toLowerCase())
    .filter(s =>
      s.length > 2 &&
      s.length < 30 &&
      !s.includes("volunteer") &&
      !s.includes("responsibilities") &&
      !s.includes("election")
    );
}

// =========================
// BUILD FINAL JSON
// =========================
let name = cleanName(extractName(text));

const result = {
  target_role: "Data Analyst",
  target_level: "Entry-level",

  name,
  email: extractEmail(text),
  phone: extractPhone(text),
  address: null,

  summary: sections.summary.join(" "),

  education: parseEducation(sections.education),

  experience: parseExperience(sections.experience),

  projects: parseProjects(sections.projects),

  skills: parseSkills(sections.skills),

  awards: []
};

// =========================
// SAVE OUTPUT
// =========================
fs.writeFileSync("final.json", JSON.stringify(result, null, 2));

console.log("\n✅ FINAL CLEAN JSON CREATED\n");