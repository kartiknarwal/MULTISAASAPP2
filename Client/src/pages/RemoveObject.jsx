import React, { useState } from "react";
import { FileText, Sparkles, Download } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import PptxGenJS from "pptxgenjs";
import mermaid from "mermaid";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const DocumentAnalyzer = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [outline, setOutline] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!topic) return toast.error("Please enter a topic.");

    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        { topic },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) setOutline(data.content);
      else toast.error(data.message || "Something went wrong");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPPT = async () => {
    if (!outline) return toast.error("No outline to generate PPTX.");

    const pptx = new PptxGenJS();
    const slideColors = ["#FF1493", "#00FFFF", "#FF8C00", "#7CFC00", "#8A2BE2"];
    const slidesRaw = outline.split("---").filter(Boolean);

    slidesRaw.forEach((slideText, i) => {
      const lines = slideText.split("\n").filter(Boolean);
      const titleLine = lines.find((l) => l.startsWith("#"));
      const title = titleLine ? titleLine.replace(/^#+\s*/, "") : `Slide ${i + 1}`;
      const contentLines = lines.filter((l) => !l.startsWith("#"));

      const slide = pptx.addSlide();
      slide.background = { color: slideColors[i % slideColors.length] };

      slide.addText(title, { x: 0.5, y: 0.5, fontSize: 28, bold: true, color: "ffffff" });
      if (contentLines.length) {
        slide.addText(contentLines.map((b) => "• " + b).join("\n"), {
          x: 0.5,
          y: 1.5,
          fontSize: 18,
          color: "ffffff",
          bullet: true,
          margin: 0.1,
        });
      }

      slide.addText(`Slide ${i + 1}`, { x: 8, y: 6.8, fontSize: 12, color: "ffffff", align: "right" });
    });

    pptx.writeFile({ fileName: `${topic.replace(/\s+/g, "_")}_Slides.pptx` });
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex flex-col lg:flex-row gap-6 bg-[#0B0B1D] text-white">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full lg:w-1/2 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col gap-4 transform transition duration-300 hover:scale-[1.03] hover:rotate-1 shadow-xl"
      >
        <div className="flex items-center gap-3 animate-bounce">
          <Sparkles className="w-6 h-6 text-[#FF1493] drop-shadow-[0_0_8px_#FF1493]" />
          <h1 className="text-2xl font-bold tracking-wide drop-shadow-[0_0_8px_#00FFFF]">
            Slide Deck Generator
          </h1>
        </div>

        <p className="text-sm font-medium text-[#00FFFF]">Enter Topic</p>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., AI in Healthcare"
          className="w-full p-3 mt-2 border border-white/30 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-[#FF1493] transition duration-300 hover:scale-[1.02]"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-2 rounded-2xl bg-gradient-to-r from-[#FF1493] to-[#00FFFF] text-black font-semibold tracking-wide hover:from-[#00FFFF] hover:to-[#FF1493] relative overflow-hidden transition-all duration-300 flex justify-center items-center gap-2 active:scale-95"
        >
          {loading ? (
            <span className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Generate Slides
          {/* Neon Ripple Effect */}
          <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-30 rounded-2xl pointer-events-none transition duration-300 animate-pulse"></span>
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full lg:w-1/2 p-6 rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-col min-h-[24rem] shadow-xl transform transition duration-300 hover:scale-[1.02] hover:-rotate-1">
        <div className="flex justify-between items-center border-b border-white/30 pb-2 mb-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-[#00FFFF] drop-shadow-[0_0_6px_#00FFFF]" />
            <h1 className="text-xl font-semibold drop-shadow-[0_0_6px_#FF1493]">Slide Outline</h1>
          </div>
          {outline && (
            <button
              onClick={handleDownloadPPT}
              className="flex items-center gap-2 px-3 py-1 bg-[#FF1493] text-black text-xs rounded-full hover:bg-[#00FFFF] hover:text-white transition duration-300 relative overflow-hidden"
            >
              <Download className="w-4 h-4" /> Download PPTX
              <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 rounded-full pointer-events-none transition duration-300 animate-pulse"></span>
            </button>
          )}
        </div>

        {!outline ? (
          <div className="flex-1 flex justify-center items-center text-white/50 text-sm text-center">
            Enter a topic and click "Generate Slides" to get a structured outline
          </div>
        ) : (
          <div className="p-4 whitespace-pre-wrap text-white/90 prose prose-invert">
            <Markdown>{outline}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentAnalyzer;
