import React, { useState, useEffect } from "react";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-c";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import Editor from "react-simple-code-editor";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/night-owl.css";
import axios from "axios";
import Markdown from "react-markdown";
import { CodeIcon, CheckCircleIcon } from "lucide-react";

const CodeEditor = () => {
    const [code, setCode] = useState("javascript");
    const [language, setLanguage] = useState("javascript");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (language === "javascript") {
            setCode(`function sum(){
  return a+b;
}`);
        } else if (language === "c") {
            setCode(`int sum() {
  return a + b;
}`);
        } else if (language === "python") {
            setCode(`def sum():
  return a + b`);
        } else {
            setCode(`int sum() {
  return a + b;
}`);
        }
    }, [language]);

    useEffect(() => {
        prism.highlightAll();
    }, []);

    const reviewCode = async () => {
        try {
            setIsLoading(true);
            const res = await axios.post("http://localhost:8080/ai/get-response", {
                prompt: code,
            });
            console.log(res.data);
            setResponse(res.data);
        } catch (error) {
            console.error(error);
            setResponse("Failed to review code.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full flex flex-col md:flex-row bg-white text-white p-4 md:p-6 gap-4">
            <div className="w-full md:w-1/2 bg-zinc-800 rounded-xl shadow-lg overflow-hidden border border-zinc-700 flex flex-col">
                <div className="flex items-center justify-between bg-zinc-700 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <CodeIcon size={20} className="text-blue-400" />
                        <h2 className="font-medium">Code Editor</h2>
                    </div>
                    <select
                        className="bg-zinc-800 text-white px-2 py-1.5 rounded-md border border-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="c">C</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                    </select>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto rounded-lg" style={{ minHeight: "300px" }}>
                        <Editor
                            value={code}
                            onValueChange={(code) => setCode(code)}
                            highlight={(code) =>
                                prism.highlight(
                                    code,
                                    prism.languages[language] || prism.languages.javascript,
                                    language || "javascript"
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
                                overflow: "auto",
                            }}
                            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                    <button
                        className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-6 rounded-md text-white font-medium transition-all ${isLoading ? "bg-orange-400 opacity-80 cursor-wait" : "bg-orange-500 hover:bg-orange-600 active:bg-blue-700"
                            }`}
                        onClick={reviewCode}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Reviewing...
                            </>
                        ) : (
                            <>
                                <CheckCircleIcon size={18} />
                                Review Code
                            </>
                        )}
                    </button>
                </div>
            </div>
            <div className="w-full md:w-1/2 bg-zinc-800 rounded-xl shadow-lg border border-zinc-700 overflow-hidden flex flex-col">
                <div className="bg-zinc-700 px-4 py-3">
                    <h2 className="font-medium">AI Review</h2>
                </div>
                <div className="p-5 overflow-auto flex-1" style={{ minHeight: "300px" }}>
                    {response ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                            <Markdown
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                    pre: ({ node, ...props }) => (
                                        <pre className="bg-zinc-900 p-4 rounded-lg my-4 overflow-x-auto" {...props} />
                                    ),
                                    code: ({ node, inline, ...props }) =>
                                        inline ? (
                                            <code className="bg-zinc-900 bg-opacity-50 px-1.5 py-0.5 rounded text-sm" {...props} />
                                        ) : (
                                            <code className="bg-transparent p-0" {...props} />
                                        ),
                                }}
                            >
                                {response}
                            </Markdown>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="mb-4 opacity-50"
                            >
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <p className="text-lg font-medium">No Review Yet</p>
                            <p className="mt-1">Click the Review button to analyze your code</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default CodeEditor;
