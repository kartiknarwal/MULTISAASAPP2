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
  const [input, setInput] = useState(''); // meeting transcript
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
    <div className="h-full overflow-y-scroll p-6 flex flex-col lg:flex-row items-start gap-6 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Meeting Notes Summarizer</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Meeting Transcript</p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 min-h-[6rem]"
          placeholder="Paste the transcript of your meeting here..."
          required
        />

        <p className="mt-4 text-sm font-medium">Summary Length</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {summaryLengths.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? 'bg-purple-50 text-purple-700 border-purple-300'
                  : 'text-gray-500 border-gray-300'
              }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Summary
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 max-w-lg bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem] max-h-[600px] p-4">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Hash className="w-5 h-5 text-[#8E37EB]" />
            <h1 className="text-xl font-semibold">Generated Summary</h1>
          </div>
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
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Hash className="w-9 h-9" />
              <p>Paste the transcript and click "Generate Summary" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;
