import React, { useState, useEffect,useContext } from "react";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
// Import additional languages for Prism
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-go";

import Editor from "react-simple-code-editor";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/night-owl.css";
import axios from "axios";
import Markdown from "react-markdown";
import { CodeIcon, CheckCircleIcon, PlayIcon, Terminal } from "lucide-react";
import { AuthDataContext } from "./AuthContext";

// Mapping for JDoodle API
const jdoodleLanguageMap = {
  javascript: { name: "nodejs", version: "4" },
  python: { name: "python3", version: "4" },
  java: { name: "java", version: "4" },
  c: { name: "c", version: "5" },
  cpp: { name: "cpp17", version: "1" },
  go: { name: "go", version: "4" },
};

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [aiResponse, setAiResponse] = useState("");
  const [output, setOutput] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const { serverUrl } = useContext(AuthDataContext);
  // Set default code snippet when language changes
  useEffect(() => {
    const defaultCode = {
      javascript: `// You can use console.log() to print the output\nconsole.log("Hello from JavaScript!");`,
      python: `# You can use print() to show output\nprint("Hello from Python!")`,
      c: `#include <stdio.h>\n\nint main() {\n    printf("Hello from C!");\n    return 0;\n}`,
      cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!";\n    return 0;\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
      go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}`,
    };
    setCode(defaultCode[language] || "");
    setOutput("");
    setAiResponse("");
  }, [language]);

  useEffect(() => {
    prism.highlightAll();
  }, [code, language]);

  const runCode = async () => {
    setIsExecuting(true);
    setOutput("Executing code...");

    // For JavaScript, run directly in the browser
    if (language === "javascript") {
      try {
        let capturedOutput = "";
        const originalLog = console.log;
        console.log = (...args) => {
          capturedOutput += args.map((arg) => JSON.stringify(arg, null, 2)).join(" ") + "\n";
        };
        new Function(code)();
        console.log = originalLog;
        setOutput(capturedOutput || "Code executed successfully with no output.");
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsExecuting(false);
      }
      return;
    }

    // --- FIXED: Call your own backend proxy to avoid CORS errors ---
    const langDetails = jdoodleLanguageMap[language];

    try {
      // The backend endpoint now securely handles the API call
      const response = await axios.post(
        `${serverUrl}/ai/execute-code`,
        {
          script: code,
          language: langDetails.name,
          version: langDetails.version,
        }
      );

      if (response.data.output) {
        setOutput(response.data.output);
      } else {
        setOutput("Code executed with no output.");
      }
    } catch (error) {
      if (error.response) {
        setOutput(`Error: ${error.response.data.error || 'Failed to execute code.'}`);
      } else {
        setOutput("Failed to connect to the execution service. Check your network and backend server.");
      }
      console.error(error);
    } finally {
      setIsExecuting(false);
    }
  };

  const reviewCode = async () => {
    setIsReviewing(true);
    setAiResponse("AI is reviewing your code...");
    try {
      const res = await axios.post(`${serverUrl}/ai/get-response`, {
        prompt: `You are an expert code reviewer. Analyze the following ${language} code for bugs, improvements, and best practices. Provide clear, concise, and actionable feedback in Markdown format.\n\n\`\`\`${language}\n${code}\n\`\`\``,
      });
      setAiResponse(res.data);
    } catch (error) {
      console.error(error);
      setAiResponse("Failed to get AI review. Please check if the backend server is running.");
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-white text-white p-4 gap-4">
      <div className="w-full lg:w-1/2 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 flex flex-col">
        <div className="flex items-center justify-between bg-zinc-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <CodeIcon size={20} className="text-blue-400" />
            <h2 className="font-medium">Code Editor</h2>
          </div>
          <select
            className="bg-zinc-800 text-white px-2 py-1.5 rounded-md border border-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="go">Go</option>
          </select>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1 overflow-auto rounded-lg" style={{ minHeight: "400px" }}>
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(
                  code,
                  prism.languages[language] || prism.languages.javascript,
                  language
                )
              }
              padding={16}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 16,
                backgroundColor: "#1E1E1E",
                color: "#D4D4D4",
                borderRadius: "8px",
                height: "100%",
                width: "100%",
              }}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              className={`w-1/2 flex items-center justify-center gap-2 py-2.5 px-6 rounded-md font-medium transition-all ${
                isExecuting
                  ? "bg-gray-500 cursor-wait"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={runCode}
              disabled={isExecuting || isReviewing}
            >
              <PlayIcon size={18} />
              {isExecuting ? "Running..." : "Run Code"}
            </button>
            <button
              className={`w-1/2 flex items-center justify-center gap-2 py-2.5 px-6 rounded-md font-medium transition-all ${
                isReviewing
                  ? "bg-orange-400 cursor-wait"
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
              onClick={reviewCode}
              disabled={isReviewing || isExecuting}
            >
              <CheckCircleIcon size={18} />
              {isReviewing ? "Reviewing..." : "Review Code"}
            </button>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        <div className="bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 flex flex-col flex-1">
          <div className="bg-zinc-700 px-4 py-3 flex items-center gap-2">
            <Terminal size={20} className="text-green-400" />
            <h2 className="font-medium">Output</h2>
          </div>
          <pre className="p-5 overflow-auto flex-1 text-sm whitespace-pre-wrap">
            {output || <span className="text-zinc-500">Run code to see the output here.</span>}
          </pre>
        </div>
        <div className="bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 flex flex-col flex-1">
          <div className="bg-zinc-700 px-4 py-3">
            <h2 className="font-medium">AI Review</h2>
          </div>
          <div className="p-5 overflow-auto flex-1">
            <div className="prose prose-invert prose-sm max-w-none">
              <Markdown rehypePlugins={[rehypeHighlight]}>{aiResponse}</Markdown>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CodeEditor;