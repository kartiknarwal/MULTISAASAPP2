import React, { useState } from "react";
import { FileText, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!input) return toast.error("Please upload a resume.");
    if (!jobDescription) return toast.error("Please paste a job description.");

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", input);
      formData.append("jobDescription", jobDescription);

      const { data } = await axios.post("/api/ai/resume-review", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) setContent(data.content);
      else toast.error(data.message || "Something went wrong");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-6 bg-[#0C0D2E] text-white">
      {/* Sidebar Placeholder */}
      <div className="w-full lg:w-1/5 flex flex-col gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20">
        <h2 className="text-lg font-semibold text-[#00DA83]">Dashboard</h2>
        <div className="flex flex-col gap-2">
          <div className="p-2 rounded-lg hover:bg-[#00DA83]/20 transition cursor-pointer">Resume Analysis</div>
          <div className="p-2 rounded-lg hover:bg-[#FF1493]/20 transition cursor-pointer">Job Matches</div>
          {/* <div className="p-2 rounded-lg hover:bg-[#00FFFF]/20 transition cursor-pointer">Settings</div> */}
        </div>
      </div>

      {/* Main Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-2/5 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col gap-4 transform transition hover:scale-[1.02] shadow-xl"
      >
        <div className="flex items-center gap-3 animate-bounce">
          <Sparkles className="w-6 h-6 text-[#00DA83] drop-shadow-[0_0_8px_#00DA83]" />
          <h1 className="text-2xl font-bold tracking-wide drop-shadow-[0_0_8px_#00FFFF]">
            Resume & JD Matcher
          </h1>
        </div>

        <p className="text-sm font-medium text-[#00FFFF]">Upload Resume</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-3 mt-2 border border-white/30 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#00DA83] transition duration-300"
          required
        />
        <p className="text-xs text-white/50 mt-1">PDF only</p>

        <p className="mt-4 text-sm font-medium text-[#FF1493]">Paste Job Description</p>
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full p-3 mt-2 border border-white/30 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF1493] transition duration-300"
          required
        />

        <button
          disabled={loading}
          className="w-full mt-4 py-2 rounded-2xl bg-gradient-to-r from-[#00DA83] to-[#00FFFF] text-black font-semibold hover:from-[#00FFFF] hover:to-[#00DA83] relative overflow-hidden transition duration-300 flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Match Resume
        </button>
      </form>

      {/* Output Panel */}
      <div className="w-full lg:w-2/5 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col min-h-[24rem] shadow-xl overflow-y-auto">
        <h2 className="text-lg font-semibold mb-3 text-[#FF1493]">Analysis Results</h2>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-white/50 text-sm text-center">
            Upload a resume and paste a job description to start
          </div>
        ) : (
          <div className="p-2 prose prose-invert text-white/90">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
