import { Hash, Sparkles, Copy } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

const BlogTitles = () => {
  const summaryLengths = [
    { length: 200, text: 'Short Summary' },
    { length: 400, text: 'Medium Summary' },
    { length: 600, text: 'Long Summary' },
  ];

  const [selectedLength, setSelectedLength] = useState(summaryLengths[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error('Please paste the meeting transcript.');

    try {
      setLoading(true);

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { transcript: input, length: selectedLength.length },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) setContent(data.summary);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!content) return toast.error('Nothing to copy!');
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy!');
    }
  };

  return (
    <div className="min-h-screen w-full p-6 flex flex-col lg:flex-row gap-6 
      bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] text-gray-100">

      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 p-6 rounded-2xl shadow-xl 
        bg-white/10 backdrop-blur-md border border-white/10"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-purple-400" />
          <h1 className="text-xl font-semibold">Meeting Notes Summarizer</h1>
        </div>

        <p className="mt-6 text-sm font-medium text-gray-300">Meeting Transcript</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 mt-2 rounded-lg bg-black/40 border border-white/20 text-sm 
            focus:ring-2 focus:ring-purple-500 outline-none resize-none min-h-[6rem]"
          placeholder="Paste the transcript of your meeting here..."
          required
        />

        <p className="mt-4 text-sm font-medium text-gray-300">Summary Length</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {summaryLengths.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`px-4 py-1 text-xs rounded-full cursor-pointer transition-all 
                ${selectedLength.text === item.text
                  ? 'bg-purple-600 text-white border border-purple-400'
                  : 'bg-black/40 text-gray-300 border border-white/20 hover:bg-purple-500/30'}`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 
            bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 mt-6 
            text-sm rounded-lg cursor-pointer disabled:opacity-60 hover:scale-[1.02] transition"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Summary
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 rounded-2xl shadow-xl 
        bg-white/10 backdrop-blur-md border border-white/10 p-6 flex flex-col">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-semibold">Generated Summary</h1>
          </div>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Paste the transcript and click "Generate Summary" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm leading-relaxed text-gray-200">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
