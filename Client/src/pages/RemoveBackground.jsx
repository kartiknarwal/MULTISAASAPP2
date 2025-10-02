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
        "/api/ai/remove-image-background", // same endpoint name
        { recipientType, tone, keyPoints },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Something went wrong");
      }
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
      {/* Left col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#FF4938]" />
          <h1 className="text-xl font-semibold">AI Email Composer</h1>
        </div>

        <p className="mt-4 text-sm font-medium">Recipient Type</p>
        <select
          value={recipientType}
          onChange={(e) => setRecipientType(e.target.value)}
          className="w-full p-2 mt-2 text-sm rounded-md border border-gray-300"
        >
          <option>Client</option>
          <option>Manager</option>
          <option>Colleague</option>
          <option>Professor</option>
          <option>General Audience</option>
        </select>

        <p className="mt-4 text-sm font-medium">Tone</p>
        <div className="mt-2 flex gap-3 flex-wrap">
          {["Professional", "Friendly", "Persuasive", "Formal", "Casual"].map(
            (t) => (
              <span
                key={t}
                onClick={() => setTone(t)}
                className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                  tone === t
                    ? "bg-orange-50 text-orange-700 border-orange-300"
                    : "text-gray-500 border-gray-300"
                }`}
              >
                {t}
              </span>
            )
          )}
        </div>

        <p className="mt-4 text-sm font-medium">Key Points</p>
        <textarea
          placeholder="Write key points for the email (e.g., meeting reminder, project update, request)..."
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 min-h-[6rem]"
          value={keyPoints}
          onChange={(e) => setKeyPoints(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Sparkles className="w-5" />
          )}
          Generate Email
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 p-4">
        <div className="flex items-center justify-between p-2 border-b">
          <h1 className="text-xl font-semibold">Generated Email</h1>
          {content && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-sm text-orange-600 hover:underline"
            >
              <Copy className="w-4 h-4" /> Copy
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <p className="text-gray-400 text-sm mt-6">
              Enter recipient, tone, and key points, then click "Generate Email"
            </p>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600 whitespace-pre-line">
            <p>{content}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
