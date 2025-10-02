import React, { useState } from 'react';
import { Edit, Sparkles, Copy } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const summaryLength = [
    { length: 200, text: 'Short Summary' },
    { length: 400, text: 'Medium Summary' },
    { length: 600, text: 'Long Summary' },
  ];

  const [selectedLength, setSelectedLength] = useState(summaryLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error('Please enter the text to summarize.');

    try {
      setLoading(true);
      const prompt = `
Please summarize the following text in a clear and concise manner in ${selectedLength.text}:
"${input}"
- Make it easy to read.
- Keep important points intact.
- Write in a professional, human-like style.
`;

      const { data } = await axios.post(
        '/api/ai/generate-article', // keep endpoint same
        {
          text: input,
          length: selectedLength.length,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) setContent(data.summary || data.content); // backend may return `summary`
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!content) return;

    try {
      const container = document.createElement('div');
      container.innerHTML = document.querySelector('.reset-tw')?.innerHTML || '';

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([container.innerHTML], { type: 'text/html' }),
          'text/plain': new Blob([content], { type: 'text/plain' }),
        }),
      ]);
      toast.success('Copied with formatting!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-col lg:flex-row items-start gap-6 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 max-w-full p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4a7aFF]" />
          <h1 className="text-xl font-semibold">Summarizer Configuration</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Text to Summarize</p>
        <textarea
          placeholder="Paste your text or article here..."
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 min-h-[6rem]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />

        <p className="mt-4 text-sm font-medium">Summary Length</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {summaryLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700 border-blue-300'
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
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Summary
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 max-w-full bg-white rounded-lg flex flex-col border border-gray-200 min-h-[24rem] max-h-[600px] p-4 relative">
        <div className="flex items-center gap-3 mb-4">
          <Edit className="w-5 h-5 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Generated Summary</h1>
          {content && (
            <button
              onClick={copyToClipboard}
              className="ml-auto flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Edit className="w-9 h-9" />
              <p>Paste text and click "Generate Summary" to get started</p>
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

export default WriteArticle;
