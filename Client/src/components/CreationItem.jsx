import React, { useState } from 'react';
import Markdown from 'react-markdown';

const CreationItem = ({ item, cyberpunk }) => {
  const [expanded, setExpanded] = useState(false);

  // Dark/Cyberpunk colors
  const bgColor = cyberpunk ? '#111111' : 'bg-white';
  const borderColor = cyberpunk ? 'border-[#FF3C9E]/40' : 'border-gray-200';
  const textColor = cyberpunk ? 'text-[#00FFD1]' : 'text-slate-700';
  const buttonBg = cyberpunk ? 'bg-gradient-to-r from-[#FF3C9E] to-[#00FFD1]' : 'bg-[#EFF6FF]';
  const buttonText = cyberpunk ? 'text-black' : 'text-[#1E40AF]';

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`p-4 max-w-5xl rounded-lg cursor-pointer ${bgColor} border ${borderColor} hover:shadow-[0_0_15px_#FF3C9E] transition-all duration-300`}
    >
      <div className="flex justify-between items-center gap-4">
        <div>
          <h2 className={`${textColor} font-semibold`}>{item.prompt}</h2>
          <p className={`${textColor} opacity-70 text-xs mt-1`}>
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          className={`px-4 py-1 rounded-full ${buttonBg} ${buttonText} text-sm shadow-[0_0_8px_#FF3C9E]`}
        >
          {item.type}
        </button>
      </div>

      {expanded && (
        <div className="mt-3">
          {item.type === 'image' ? (
            <img src={item.content} alt="" className="w-full max-w-md rounded-md shadow-[0_0_15px_#FF3C9E]" />
          ) : (
            <div className={`h-full overflow-y-scroll text-sm ${textColor} prose`}>
              <Markdown>{item.content}</Markdown>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
