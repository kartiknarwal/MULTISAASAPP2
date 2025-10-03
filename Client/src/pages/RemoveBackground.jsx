import React, { useState } from "react";
import { Sparkles, Copy } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [recipientType, setRecipientType] = useState("Client");
  const [tone, setTone] = useState("Professional");
  const [keyPoints, setKeyPoints] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!keyPoints) return toast.error("Please enter key points for the email");

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        { recipientType, tone, keyPoints },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) setContent(data.content);
      else toast.error(data.message || "Something went wrong");
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
    <div className="h-full overflow-y-scroll p-6 flex flex-col lg:flex-row gap-6 bg-[#0D0D0D] text-white">
      {/* Left Column - Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col gap-4 shadow-neon"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#FF00FF] animate-pulse" />
          <h1 className="text-2xl font-bold tracking-wide">AI Email Composer</h1>
        </div>

        <p className="text-sm font-medium">Recipient Type</p>
        <select
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          className="w-full p-2 mt-2 text-sm rounded-xl border border-white/30 bg-white/10 backdrop-blur-md placeholder-white text-white focus:outline-none focus:border-cyan-400"
        >
          <option>Client</option>
          <option>Manager</option>
          <option>Colleague</option>
          <option>Professor</option>
          <option>General Audience</option>
        </select>

        <p className="text-sm font-medium">Tone</p>
        <div className="flex gap-3 flex-wrap">
          {["Professional", "Friendly", "Persuasive", "Formal", "Casual"].map((t) => (
            <span
              key={t}
              onClick={() => setTone(t)}
              className={`cursor-pointer text-xs px-4 py-1 rounded-full border ${
                tone === t
                  ? "bg-[#FF00FF]/30 border-[#FF00FF] text-[#FF00FF]"
                  : "border-white/30 text-white/70 hover:bg-white/10"
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        <p className="text-sm font-medium">Key Points</p>
        <textarea
          placeholder="Write key points for the email (e.g., meeting reminder, project update, request)..."
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          className="w-full p-3 mt-2 rounded-xl border border-white/30 bg-white/10 backdrop-blur-md text-white placeholder-white focus:outline-none focus:border-cyan-400 min-h-[6rem]"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 text-black font-semibold tracking-wide hover:from-purple-500 hover:to-cyan-400 transition-all duration-300 flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-t-transparent border-black animate-spin"></span>
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          Generate Email
        </button>
      </form>

      {/* Right Column - Output */}
      <div className="w-full lg:w-1/2 p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col min-h-[24rem] shadow-neon">
        <div className="flex justify-between items-center border-b border-white/30 pb-2 mb-3">
          <h2 className="text-xl font-semibold">Generated Email</h2>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-white/50 text-sm">
            Enter recipient, tone, and key points, then click "Generate Email"
          </div>
        ) : (
          <div className="flex-1 overflow-y-scroll text-white/90 whitespace-pre-line text-sm">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
