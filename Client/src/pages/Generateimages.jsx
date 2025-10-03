import { Zap, Copy, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ResearchAssistant = () => {
  const [topic, setTopic] = useState("");
  const [filters, setFilters] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic) return toast.error("Enter a topic to research.");

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { topic, filters },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (!data.success) return toast.error(data.message || "Something went wrong");

      setContent(data.content);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!content) return toast.error("Nothing to copy!");
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy!");
    }
  };

  return (
    <div className="h-full w-full p-6 flex flex-col lg:flex-row gap-6 font-mono bg-[#0D0D0D] text-[#00FFF0] overflow-y-scroll">
      
      {/* Left Panel */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 p-5 bg-[#111111] rounded-xl border border-[#00FFF0] shadow-neon"
      >
        <h1 className="text-2xl font-bold text-[#FF00FF] flex items-center gap-2 mb-6">
          <Zap className="animate-pulse w-6 h-6" />
          Research AI Console
        </h1>

        <label className="text-[#00FFF0] text-sm font-semibold">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter topic..."
          className="w-full mt-2 p-3 rounded-md bg-[#111111] border border-[#FF00FF] text-[#00FFF0] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF00FF]"
          required
        />

        <label className="text-[#00FFF0] text-sm font-semibold mt-4">Filters (optional)</label>
        <input
          type="text"
          value={filters}
          onChange={(e) => setFilters(e.target.value)}
          placeholder='e.g., year>2020, domain:"AI"'
          className="w-full mt-2 p-3 rounded-md bg-[#111111] border border-[#FF00FF] text-[#00FFF0] placeholder:text-[#555] focus:outline-none focus:ring-2 focus:ring-[#FF00FF]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 p-3 rounded-lg text-[#0D0D0D] font-bold bg-gradient-to-r from-[#FF00FF] to-[#00FFF0] hover:scale-105 transform transition-all"
        >
          {loading ? "Loading..." : "Generate Insights"}
        </button>
      </form>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 p-5 bg-[#111111] rounded-xl border border-[#00FFF0] shadow-neon flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-[#FF00FF] pb-2">
          <h2 className="text-lg font-bold text-[#FF00FF]">Output</h2>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-sm text-[#00FFF0] hover:text-[#FF00FF]"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          )}
        </div>

        {!content ? (
          <p className="text-[#555] mt-6 text-sm">
            Enter a topic and click "Generate Insights" to get results
          </p>
        ) : (
          <div className="overflow-y-scroll text-[#00FFF0] text-sm mt-2 space-y-4">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchAssistant;
