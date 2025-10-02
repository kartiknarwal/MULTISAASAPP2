import React, { useState } from "react";
import { FileText, Sparkles, Download } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const DocumentAnalyzer = () => {
  const [input, setInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!input) {
        return toast.error("Please upload a document");
      }

      const formData = new FormData();
      formData.append("document", input);

      const { data } = await axios.post("/api/ai/remove-image-object", formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!analysis) return;
    const blob = new Blob([analysis], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document-analysis.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Col */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Document Analyzer</h1>
        </div>

        <p className="mt-6 text-sm font-medium">Upload Document</p>
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600"
          onChange={(e) => setInput(e.target.files[0])}
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417Df6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Analyze Document
        </button>
      </form>

      {/* Right Col */}
      <div className="w-full max-w-lg bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3 p-4 border-b justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#4A7AFF]" />
            <h1 className="text-xl font-semibold">Analysis Result</h1>
          </div>
          {analysis && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1 bg-[#4A7AFF] text-white text-xs rounded-md hover:bg-[#385ecf]"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          )}
        </div>

        {!analysis ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9" />
              <p>Upload a document and click "Analyze Document" to get insights</p>
            </div>
          </div>
        ) : (
          <div className="p-4 whitespace-pre-wrap text-sm text-gray-700">{analysis}</div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalyzer;
