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

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
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
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Resume & JD Matcher</h1>
        </div>

        {/* Resume Upload */}
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setInput(e.target.files[0])}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF resumes only.
        </p>

        {/* Job Description */}
        <p className="mt-4 text-sm font-medium">Paste Job Description</p>
        <textarea
          rows={6}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full p-2 mt-2 border border-gray-300 rounded-md text-sm outline-none"
          required
        />

        {/* Submit Button */}
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Match Resume
        </button>
      </form>

      {/* Right col */}
      <div className="w-full max-w-lg bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px] p-4 overflow-y-scroll">
        <h2 className="text-lg font-semibold mb-3 text-[#00DA83]">Analysis Results</h2>

        {!content ? (
          <div className="flex-1 flex justify-center items-center text-gray-400">
            <div className="text-sm flex flex-col items-center gap-5">
              <FileText className="w-9 h-9" />
              <p>Upload a resume and paste a job description to get started</p>
            </div>
          </div>
        ) : (
          <div className="prose text-slate-700">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
