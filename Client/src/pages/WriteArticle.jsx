import React, { useState } from 'react';
import { Edit, Sparkles, Copy, Volume2, History } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const summaryLength = [
    { length: 200, text: 'Short' },
    { length: 400, text: 'Medium' },
    { length: 600, text: 'Long' },
  ];

  const tones = ['Professional', 'Casual', 'Persuasive', 'Analytical'];

  const [selectedLength, setSelectedLength] = useState(summaryLength[0]);
  const [selectedTone, setSelectedTone] = useState(tones[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [history, setHistory] = useState([]);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error('Please enter the text to summarize.');

    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/ai/generate-article',
        {
          text: input,
          length: selectedLength.length,
          tone: selectedTone,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.summary || data.content);
        setHighlights(data.highlights || []);
        setHistory((prev) => [...prev, { summary: data.summary, highlights: data.highlights }]);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  const readAloud = () => {
    if (!content) return;
    const utter = new SpeechSynthesisUtterance(content);
    speechSynthesis.speak(utter);
  };

  return (
    <div className="min-h-screen w-full p-6 text-white 
      bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] animate-gradient-x">
      
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column - Config */}
        <form
          onSubmit={onSubmitHandler}
          className="bg-glass w-full lg:w-1/2 rounded-xl p-6 shadow-2xl border border-white/10"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 text-blue-400" />
            <h1 className="text-xl font-semibold">AI Summarizer</h1>
          </div>

          <p className="mt-6 text-sm font-medium">Text to Summarize</p>
          <textarea
            placeholder="Paste your text or article here..."
            className="w-full p-3 mt-2 rounded-md bg-black/30 border border-white/20 text-sm focus:ring-2 focus:ring-blue-500 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <p className="mt-4 text-sm font-medium">Summary Length</p>
          <div className="flex gap-3 mt-2 flex-wrap">
            {summaryLength.map((item) => (
              <span
                key={item.text}
                onClick={() => setSelectedLength(item)}
                className={`px-4 py-1 text-xs rounded-full cursor-pointer border transition ${
                  selectedLength.text === item.text
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-black/30 text-gray-300 border-white/20 hover:bg-blue-500/20'
                }`}
              >
                {item.text}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm font-medium">Tone</p>
          <select
            value={selectedTone}
            onChange={(e) => setSelectedTone(e.target.value)}
            className="w-full mt-2 p-2 rounded-md bg-black/30 border border-white/20 text-sm"
          >
            {tones.map((tone) => (
              <option key={tone} value={tone}>
                {tone}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white 
              flex justify-center items-center gap-2 hover:scale-[1.02] transition"
          >
            {loading ? (
              <div className="flex gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300"></span>
              </div>
            ) : (
              <>
                <Edit className="w-5" /> Generate Summary
              </>
            )}
          </button>
        </form>

        {/* Right Column - Output */}
        <div className="bg-glass w-full lg:w-1/2 rounded-xl p-6 shadow-2xl border border-white/10 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <Edit className="w-5 text-blue-400" />
            <h1 className="text-lg font-semibold">Generated Summary</h1>
            {content && (
              <div className="ml-auto flex gap-2">
                <button onClick={copyToClipboard} className="px-2 py-1 text-xs bg-blue-600 rounded-md">Copy</button>
                <button onClick={readAloud} className="px-2 py-1 text-xs bg-purple-600 rounded-md flex items-center gap-1">
                  <Volume2 className="w-4" /> Listen
                </button>
              </div>
            )}
          </div>

          {!content ? (
            <div className="flex-1 flex justify-center items-center text-gray-400">
              <p>Paste text and generate a summary to get started</p>
            </div>
          ) : (
            <div className="overflow-y-scroll text-sm space-y-4">
              <Markdown>{content}</Markdown>
              {highlights.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-md font-semibold text-blue-400">Key Highlights</h2>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-2 text-gray-300">
                <History className="w-4" /> <span>Session History</span>
              </div>
              <div className="max-h-[150px] overflow-y-scroll space-y-2 text-xs">
                {history.map((h, i) => (
                  <div key={i} className="p-2 bg-black/30 rounded-md border border-white/10">
                    <p className="text-gray-200">{h.summary?.slice(0, 80)}...</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WriteArticle;
