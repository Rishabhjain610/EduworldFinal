import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthDataContext } from "./AuthContext.jsx";
import { Search, Brain, Globe, ExternalLink, BookOpen, AlertCircle, List } from "lucide-react";

const ResearchAgent = () => {
  const { serverUrl } = useContext(AuthDataContext) || {};
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cleanText = (text) => {
    // Removes asterisks, hashtags, and citations like [1] or [Source 1]
    return text
      .replace(/[*#]/g, "")
      .replace(/\[\d+\]/g, "")
      .replace(/\[Source \d+\]/g, "")
      .trim();
  };

  const handleResearch = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setSources([]);

    try {
      const resp = await axios.post(`${serverUrl}/api/research`, { 
        query: query.trim() 
      });

      setAnswer(cleanText(resp.data.answer || ""));
      setSources(resp.data.sources || []);
    } catch (err) {
      setError("Failed to reach the research agent. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8 px-4 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Brain size={32} /> AI Research Agent
            </h1>
            <p className="text-orange-100 text-sm mt-1">Live Web Search & AI Synthesis</p>
          </div>

          <form onSubmit={handleResearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 text-orange-300" size={20} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-orange-300 focus:border-white focus:ring-2 focus:ring-orange-200 bg-white text-gray-800"
                placeholder="What would you like to research?"
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || !query.trim()}
              className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-all shadow-lg"
            >
              {loading ? "Processsing..." : "Research"}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-orange-600 font-bold">Searching the web...</p>
          </div>
        ) : (answer || sources.length > 0) ? (
          <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            
            {/* TOP: Web Sources */}
            {sources.length > 0 && (
              <section>
                <h3 className="text-gray-700 font-bold mb-4 flex items-center gap-2">
                  <Globe size={18} className="text-orange-500" /> Top Web Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {sources.map((src, idx) => (
                    <a 
                      key={idx}
                      href={src.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-orange-300 transition group"
                    >
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 mb-1">{src.title}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mb-2">{src.snippet}</p>
                      <div className="flex items-center text-[10px] text-orange-600 font-bold gap-1 uppercase">
                        Visit Site <ExternalLink size={10} />
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* BOTTOM: Synthesis Summary */}
            {answer && (
              <section className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden">
                <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center gap-2">
                  <BookOpen size={20} className="text-orange-600" />
                  <h2 className="text-orange-800 font-bold">Research Summary</h2>
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-gray-800 leading-relaxed text-lg italic bg-gray-50 p-4 rounded-lg border-l-4 border-orange-200">
                    {answer}
                  </p>
                </div>
              </section>
            )}

          </div>
        ) : (
          <div className="text-center py-24">
            <Brain size={64} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Results will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAgent;