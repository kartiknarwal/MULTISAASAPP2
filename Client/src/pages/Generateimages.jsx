import { Sparkles, Copy, Play } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const LanguageAssistant = () => {
  const modes = ["translate", "quiz", "suggest"];
  const languages = ["Spanish", "French", "German", "Japanese", "Chinese"];

  const [input, setInput] = useState("");
  const [selectedMode, setSelectedMode] = useState("translate");
  const [targetLanguage, setTargetLanguage] = useState("Spanish");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error("Please enter text to learn.");

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/ai/generate-image",
        { text: input, targetLanguage, mode: selectedMode },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (!data.success) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      setContent(data.content);
      setAudioUrl(data.audioUrl || "");
    } catch (error) {
      toast.error(error.message);
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
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Language Learning Assistant</h1>
        </div>

        <p className="mt-4 text-sm font-medium">Text to Learn</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Enter the text you want to practice..."
          required
        />

        <p className="mt-4 text-sm font-medium">Mode</p>
        <div className="mt-2 flex gap-3 flex-wrap">
          {modes.map((mode) => (
            <span
              key={mode}
              onClick={() => setSelectedMode(mode)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedMode === mode
                  ? "bg-purple-50 text-purple-700 border-purple-300"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {mode}
            </span>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium">Target Language</p>
        <div className="mt-2 flex gap-3 flex-wrap">
          {languages.map((lang) => (
            <span
              key={lang}
              onClick={() => setTargetLanguage(lang)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                targetLanguage === lang
                  ? "bg-purple-50 text-purple-700 border-purple-300"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {lang}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Sparkles className="w-5" />
          )}
          Generate
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem] p-4">
        <div className="flex items-center justify-between p-2 border-b">
          <h1 className="text-xl font-semibold">Generated Output</h1>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-sm text-purple-600 hover:underline"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-400 text-sm mt-6">
              Enter text and click "Generate" to get started
            </p>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <Markdown>{content}</Markdown>
            {audioUrl && (
              <audio controls src={audioUrl} className="mt-3 w-full">
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LanguageAssistant;
