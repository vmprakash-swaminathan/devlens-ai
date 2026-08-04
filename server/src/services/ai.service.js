const { GoogleGenerativeAI } = require("@google/generative-ai");

const AIService = {};

const MODEL_PRIORITY = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];

const OPENROUTER_MODELS = [
  "openrouter/auto",
  "google/gemini-2.0-flash-001",
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct",
  "deepseek/deepseek-r1-distill-llama-70b"
];

const axios = require("axios");

/**
 * Universal Multi-Provider LLM Response Generator
 * Supports Google Gemini, OpenAI (sk-...), Groq (gsk_...), OpenRouter (sk-or-v1-), and Custom Endpoints
 */
async function generateLLMResponse(prompt, systemInstruction = "", customApiKey = null, providerHint = null) {
  const apiKey = customApiKey || process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("No API Key configured.");
  }

  // 1. OpenRouter Detection (Keys starting with sk-or-v1- or provider === 'openrouter')
  if (apiKey.startsWith("sk-or-v1-") || providerHint === "openrouter") {
    let lastErr = null;
    for (const modelName of OPENROUTER_MODELS) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model: modelName,
            messages: [
              { role: "system", content: systemInstruction || "You are DevLens AI software architect." },
              { role: "user", content: prompt }
            ],
            temperature: 0.7
          },
          {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
              "HTTP-Referer": "http://localhost:5000",
              "X-Title": "DevLens AI"
            }
          }
        );
        const text = response.data.choices[0]?.message?.content?.trim();
        if (text) return text;
      } catch (err) {
        console.warn(`OpenRouter API call failed for model '${modelName}':`, err.response?.data || err.message);
        lastErr = err;
      }
    }
    console.warn("All OpenRouter models attempted.");
  }

  // 2. OpenAI Detection (Keys starting with sk- standard but not sk-or- or provider === 'openai')
  if ((apiKey.startsWith("sk-") && !apiKey.startsWith("sk-or-")) || providerHint === "openai") {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemInstruction || "You are DevLens AI software architect." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      const text = response.data.choices[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.warn("OpenAI API call failed:", err.response?.data || err.message);
    }
  }

  // 2. Groq Detection (Keys starting with gsk_ or provider === 'groq')
  if (apiKey.startsWith("gsk_") || providerHint === "groq") {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemInstruction || "You are DevLens AI software architect." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );
      const text = response.data.choices[0]?.message?.content?.trim();
      if (text) return text;
    } catch (err) {
      console.warn("Groq API call failed:", err.response?.data || err.message);
    }
  }

  // 3. Google Gemini Engine
  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError = null;

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction || "You are DevLens AI. Provide clear, simple, confident, and highly readable answers for developers. Use clean markdown formatting, short bullet points, and direct code explanations."
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      if (text) return text;
    } catch (err) {
      console.warn(`Gemini Model ${modelName} error:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error("All Multi-Provider LLM calls failed.");
}

/**
 * Repository-Wide Chat Intelligence Fallback Engine
 */
function analyzeRepositoryDynamically(projectAnalysis = {}, projectMetrics = {}, userQuery = "") {
  const queryLower = (userQuery || "").toLowerCase();
  const lang = projectAnalysis.language || "JavaScript";
  const fw = projectAnalysis.framework || "Express / React";
  const files = projectMetrics.totalFiles || 0;
  const folders = projectMetrics.totalFolders || 0;

  if (queryLower.includes("how it works") || queryLower.includes("how does it work") || queryLower.includes("explain")) {
    return `### ⚙️ How This Repository Works:

This application is built with **${lang}** using **${fw}**. Here is how the project operates:

1. 📂 **Project Structure**: Organized across **${files} files** in **${folders} directories**.
2. 🔄 **Data & Logic Flow**:
   - ${projectAnalysis.frontend ? "Renders interactive React UI components." : "Parses incoming requests via REST controllers."}
   - ${projectAnalysis.backend ? "Processes business logic via Node.js/Express services and PostgreSQL." : "Renders modular UI views."}
3. 🛠️ **Build & Execution**: Managed using standard scripts (\`npm start\` for client, \`npm run dev\` for server).`;
  }

  if (queryLower.includes("tech") || queryLower.includes("stack") || queryLower.includes("framework")) {
    return `### ⚡ Repository Tech Stack Overview:

- 🚀 **Primary Language**: \`${lang}\`
- 💻 **Framework**: \`${fw}\`
- 📁 **Codebase Scale**: **${files} files** across **${folders} folders**
- 📄 **Documentation**: ${projectAnalysis.hasReadme ? "✅ README.md is present." : "ℹ️ No README.md file detected."}`;
  }

  if (queryLower.includes("entry") || queryLower.includes("start")) {
    return `### 🚀 Repository Entry Point & Execution:

1. **Backend Server**: Starts from \`server/src/app.js\` running on Node.js/Express.
2. **Frontend App**: Starts from \`client/src/index.js\` rendering React components.
3. **Execution**: Run \`npm run dev\` in the server folder and \`npm start\` in the client folder.`;
  }

  if (queryLower.includes("security") || queryLower.includes("auth")) {
    return `### 🔒 Repository Security Assessment:

- **Authentication System**: Utilizes JWT bearer token authorization and bcrypt password hashing.
- **Environment Management**: Configuration and secret keys are managed via \`.env\` files.
- **Repository Hygiene**: ${projectAnalysis.hasGitIgnore ? "✅ \`.gitignore\` configured to protect credentials." : "⚠️ Ensure \`.env\` files are added to \`.gitignore\`."}`;
  }

  return `### 💡 Repository Overview:

- **Technology Stack**: \`${lang}\` (${fw})
- **Scale**: **${files} files** in **${folders} folders**
- **Architecture**: Modular application design separating frontend views, API controllers, and database access logic.

*Regarding your question ("${userQuery}")*:
The repository operates as a modular ${lang} application. You can explore individual source code files in the **Repository Explorer** tab for line-by-line code inspection.`;
}

/**
 * File-Specific Conversational Code Intelligence Fallback Engine
 */
function analyzeCodeDynamically(filePath, content, userQuery) {
  const lines = content ? content.split("\n") : [];
  const queryLower = (userQuery || "").toLowerCase();
  const filename = filePath ? filePath.split("/").pop() : "file";

  const importMatches = (content || "").match(/(?:require\(['"]([^'"]+)['"]\)|from\s+['"]([^'"]+)['"])/g) || [];
  const cleanImports = Array.from(new Set(importMatches.map(i => i.replace(/(?:require|from|['"]|\(|\))/g, "").trim()).filter(Boolean)));

  const functionMatches = (content || "").match(/(?:function\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(|\.([a-zA-Z0-9_$]+)\s*=\s*async)/g) || [];
  const cleanFunctions = Array.from(new Set(functionMatches.map(f => f.replace(/(?:function|const|\s|=|\(|\.)/g, "").trim()).filter(Boolean)));

  if (queryLower.includes("stack") || queryLower.includes("tech") || queryLower.includes("framework") || queryLower.includes("library") || queryLower.includes("dependency")) {
    const detectedTech = [];
    if (content.includes("react") || content.includes("useState") || content.includes("jsx")) detectedTech.push("React.js");
    if (content.includes("express") || content.includes("res.status") || content.includes("router")) detectedTech.push("Express.js / Node.js");
    if (content.includes("pg") || content.includes("SELECT") || content.includes("INSERT")) detectedTech.push("PostgreSQL Database");
    if (content.includes("jwt") || content.includes("jsonwebtoken")) detectedTech.push("JWT Authentication");
    if (content.includes("bcrypt")) detectedTech.push("Bcrypt Password Hashing");

    return `Here is the **Tech Stack & Dependencies** for \`${filename}\`:

- 🚀 **Core Framework**: ${detectedTech.length > 0 ? detectedTech.map(t => `\`${t}\``).join(", ") : "Standard JavaScript / Node.js"}
- 📦 **Key Libraries Used**: ${cleanImports.length > 0 ? cleanImports.map(i => `\`${i}\``).join(", ") : "Native modules"}
- 🏗️ **Architecture Layer**: ${content.includes("res.status") ? "Backend REST API Controller" : content.includes("return (") ? "Frontend React UI Component" : "Core Service / Utility Module"}`;
  }

  if (queryLower.includes("entry") || queryLower.includes("start") || queryLower.includes("structure") || queryLower.includes("architecture")) {
    return `Here is the **Structure & Execution Flow** of \`${filename}\`:

1. 🎯 **Main Responsibilities**: Defines ${cleanFunctions.length > 0 ? cleanFunctions.map(f => `\`${f}()\``).join(", ") : "exports and modular handlers"}.
2. 📏 **Code Size**: ${lines.length} total lines of code.
3. ⚙️ **Execution Role**: ${content.includes("app.listen") || content.includes("ReactDOM") ? "Acts as the main application entry point starting servers or rendering root components." : "Provides modular helper methods consumed across the codebase."}`;
  }

  if (queryLower.includes("security") || queryLower.includes("bug") || queryLower.includes("auth") || queryLower.includes("password") || queryLower.includes("vulnerability") || queryLower.includes("token")) {
    const hasBcrypt = content.includes("bcrypt");
    const hasJwt = content.includes("jwt") || content.includes("Bearer");
    const hasBody = content.includes("req.body");

    return `### 🔒 Security Audit for \`${filename}\`

- **Password Encryption**: ${hasBcrypt ? "✅ Protected with \`bcrypt\` password hashing." : "ℹ️ No direct password hashing in this file."}
- **Authentication**: ${hasJwt ? "✅ Protected with \`JWT\` bearer token validation." : "ℹ️ No direct JWT verification logic in this file."}
- **Input Validation**: ${hasBody ? "⚠️ Processes \`req.body\` inputs. Ensure all incoming parameters are sanitized." : "✅ No raw HTTP payload processing."}`;
  }

  if (queryLower.includes("refactor") || queryLower.includes("improve") || queryLower.includes("clean") || queryLower.includes("test")) {
    return `### 🛠️ Refactoring Tips for \`${filename}\`

1. 🧩 **Component Split**: ${lines.length > 120 ? `\`${filename}\` is ${lines.length} lines. Consider splitting functions (${cleanFunctions.slice(0, 2).map(f => `\`${f}\``).join(", ")}) into smaller utility files.` : `File size is compact (${lines.length} lines).`}
2. 🛡️ **Error Handling**: Use explicit \`try { ... } catch (error)\` blocks around asynchronous requests.
3. 📝 **Type Safety**: Add JSDoc annotations or TypeScript definitions for function arguments in ${cleanFunctions.slice(0, 3).map(f => `\`${f}()\``).join(", ")}.`;
  }

  return `### 💡 How \`${filename}\` Works

- 📌 **Primary Purpose**: Manages ${cleanFunctions.slice(0, 3).join(", ") || "core logic"} across ${lines.length} lines of code.
- ⚙️ **Key Functions**: ${cleanFunctions.length > 0 ? cleanFunctions.map(f => `\`${f}()\``).join(", ") : "Module exports"}
- 📦 **Dependencies**: ${cleanImports.length > 0 ? cleanImports.map(i => `\`${i}\``).join(", ") : "Built-in language modules"}

**Summary**:
\`${filename}\` receives inputs, executes **${cleanFunctions[0] || "handlers"}**, and returns results cleanly.`;
}

AIService.generateProjectSummary = async (projectAnalysis = {}, projectMetrics = {}, repoInfo = {}, apiKey = null, providerHint = null) => {
  try {
    const prompt = `
Analyze the uploaded repository codebase "${repoInfo.name || "Project"}":

### 📂 File Tree (${projectMetrics.totalFiles || 0} total files):
\`\`\`
${repoInfo.fileTreeList || "File tree unavailable"}
\`\`\`

${repoInfo.keyCodeSnippets ? `### 📄 Uploaded Source Code Context:\n${repoInfo.keyCodeSnippets}\n` : ""}
### 📊 Project Metadata:
- Primary Language: ${projectAnalysis.language || "JavaScript"}
- Framework: ${projectAnalysis.framework || "Web Application"}

Generate a clean JSON object with the following structure:
{
  "projectPurpose": "Detailed 2-3 sentence explanation of WHAT THIS PROJECT DOES, what problem it solves, and its business/technical domain (e.g. AI-assisted repository analysis system, e-commerce REST API, real-time chat server).",
  "capabilities": [
    "Key capability 1 based on actual features in source code/package.json",
    "Key capability 2",
    "Key capability 3",
    "Key capability 4"
  ],
  "summary": "Executive summary of the application's overall purpose and codebase state.",
  "architecture": "Breakdown of the software architecture, modular layout, frontend/backend separation, and key tech stack components.",
  "strengths": ["3 clear bullet points of codebase strengths"],
  "improvements": ["3 actionable technical recommendations"],
  "overallScore": "Numeric score string e.g. 90/100"
}

Return ONLY raw valid JSON.
`;

    let text = await generateLLMResponse(prompt, "You are DevLens AI software architect. Analyze codebase context and generate accurate project summaries in valid JSON format.", apiKey, providerHint);
    if (text.startsWith("```")) {
      text = text.replace(/^```json/i, "").replace(/```$/, "").trim();
    }
    return JSON.parse(text);
  } catch (error) {
    const lang = projectAnalysis.language || "JavaScript";
    const fw = projectAnalysis.framework || "Web Application";
    return {
      projectPurpose: `This application is a ${lang} software project built using ${fw}. It is designed to process user workflows, execute domain logic, and manage application resources across ${projectMetrics.totalFiles || 0} files.`,
      capabilities: [
        `Modular application execution using ${lang}`,
        `Structured codebase architecture across ${projectMetrics.totalFolders || 0} directories`,
        `Integrated configuration and dependency management`,
        `Extensible component-based design pattern`
      ],
      summary: `This repository is a ${lang} codebase built using ${fw}. It comprises ${projectMetrics.totalFiles || 0} total files across ${projectMetrics.totalFolders || 0} directories.`,
      architecture: `Modular software architecture featuring ${projectAnalysis.frontend ? "Frontend UI rendering" : ""} ${projectAnalysis.backend ? "and Backend API request routing" : ""}. Uses standard directory structure conventions.`,
      strengths: [
        `Well-organized folder structure (${projectMetrics.totalFolders || 0} directories)`,
        projectAnalysis.hasReadme ? "Comprehensive documentation (README present)" : "Clean separation of components",
        projectAnalysis.hasGitIgnore ? "Proper version control hygiene (.gitignore configured)" : "Modular Javascript structure"
      ],
      improvements: [
        "Add automated unit and integration tests",
        "Configure CI/CD deployment pipelines",
        "Implement centralized error handling middleware"
      ],
      overallScore: "88/100"
    };
  }
};

AIService.chatWithRepository = async (userMessage, projectAnalysis = {}, projectMetrics = {}, repoInfo = {}, apiKey = null, providerHint = null) => {
  try {
    const prompt = `
You are DevLens AI assistant analyzing the uploaded repository codebase "${repoInfo.name || "Project"}".

### 📂 Uploaded Repository File Tree (${projectMetrics.totalFiles || 0} total files):
\`\`\`
${repoInfo.fileTreeList || "File tree unavailable"}
\`\`\`

${repoInfo.keyCodeSnippets ? `### 📄 Uploaded Source Code Context:\n${repoInfo.keyCodeSnippets}\n` : ""}
### 📊 Project Metadata:
- Primary Language: ${projectAnalysis.language || "JavaScript"}
- Framework: ${projectAnalysis.framework || "Express / React"}
- Total Files: ${projectMetrics.totalFiles || 0}

### ❓ User Question:
"${userMessage}"

INSTRUCTIONS:
Answer the question specifically using the uploaded codebase structure and source code snippets provided above.
Reference actual filenames, function names, routes, components, and line contents from the uploaded repository where applicable.
Use clean markdown formatting, short bullet points, and code blocks.
`;

    return await generateLLMResponse(prompt, "You are DevLens AI software architect. Always answer questions based specifically on the uploaded repository context and source code provided.", apiKey, providerHint);
  } catch (error) {
    return analyzeRepositoryDynamically(projectAnalysis, projectMetrics, userMessage);
  }
};

AIService.generateFileSummary = async (filePath, content, apiKey = null) => {
  try {
    const prompt = `
Audit file: "${filePath}"
Code preview:
\`\`\`
${content.slice(0, 4000)}
\`\`\`

Generate a clean JSON:
{
  "purpose": "Simple 2-sentence explanation of what this file does",
  "keyFunctions": ["2-3 main functions or components exported"],
  "dependencies": ["2-3 main libraries used"]
}
Return ONLY raw valid JSON.
`;

    let text = await generateLLMResponse(prompt, "You are DevLens AI. Keep answers simple, confident, and readable.", apiKey);
    if (text.startsWith("```")) {
      text = text.replace(/^```json/i, "").replace(/```$/, "").trim();
    }
    return JSON.parse(text);
  } catch (error) {
    const lines = content ? content.split("\n") : [];
    const functionMatches = (content || "").match(/(?:function\s+([a-zA-Z0-9_$]+)|const\s+([a-zA-Z0-9_$]+)\s*=\s*(?:async\s*)?\(|\.([a-zA-Z0-9_$]+)\s*=\s*async)/g) || [];
    const cleanFunctions = Array.from(new Set(functionMatches.map(f => f.replace(/(?:function|const|\s|=|\(|\.)/g, "").trim()).filter(Boolean)));
    const importMatches = (content || "").match(/(?:require\(['"]([^'"]+)['"]\)|from\s+['"]([^'"]+)['"])/g) || [];
    const cleanImports = Array.from(new Set(importMatches.map(i => i.replace(/(?:require|from|['"]|\(|\))/g, "").trim()).filter(Boolean)));

    return {
      purpose: `File '${filePath}' contains ${lines.length} lines of code handling modular logic.`,
      keyFunctions: cleanFunctions.length > 0 ? cleanFunctions.slice(0, 3) : ["Module exports"],
      dependencies: cleanImports.length > 0 ? cleanImports.slice(0, 3) : ["Built-in modules"]
    };
  }
};

AIService.chatWithFile = async (filePath, content, userMessage, apiKey = null) => {
  try {
    const prompt = `
File: "${filePath}"

Code:
\`\`\`
${content.slice(0, 4500)}
\`\`\`

Question:
"${userMessage}"

Provide a simple, confident, clear, and highly readable answer. Use bullet points and code snippets.
`;

    return await generateLLMResponse(prompt, "You are DevLens AI. Give simple, clear, confident, and highly readable answers.", apiKey);
  } catch (error) {
    return analyzeCodeDynamically(filePath, content, userMessage);
  }
};

module.exports = AIService;