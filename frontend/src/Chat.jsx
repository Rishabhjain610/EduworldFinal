import React, { useContext } from "react";
import { dataContext, prevUser } from "./UserContextChat";

function Chat() {
  let {
    input,
    setInput,
    prevInput,
    setPrevInput,
    showResult,
    setShowResult,
    feature,
    setFeature,
    prevFeature,
    setPrevFeature,
    genImgUrl,
    setGenImgUrl,
  } = useContext(dataContext);

  return (
    <div className="chat-page h-[80vh] bg-black text-white flex flex-col  w-full p-8 gap-8 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
      {/* User Message */}
      <div className="flex justify-end">
        <div className="bg-black border border-gray-700 p-6 rounded-xl min-w-[45%] shadow-lg text-lg">
          {prevFeature === "upimg" ? (
            <>
              <img
                src={prevUser.imgUrl}
                alt="Uploaded"
                className="h-34 w-44 object-cover rounded-lg mb-4"
              />
              <span className="text-lg">{prevUser.prompt}</span>
            </>
          ) : (
            <span className="text-lg">{prevUser.prompt}</span>
          )}
        </div>
      </div>

      {/* AI Response */}
      <div className="flex justify-start">
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-xl min-w-[45%] shadow-lg text-lg max-w-[55%]">
          {prevFeature === "genimg" ? (
            <>
              {!genImgUrl ? (
                <span className="text-2xl">Generating Image...</span>
              ) : (
                <img
                  src={genImgUrl}
                  alt="Generated"
                  className="w-[400px] h-70 rounded-lg mb-4"
                />
              )}
            </>
          ) : !showResult ? (
            <span className="text-lg">Loading...</span>
          ) : (
            <span className="text-lg  whitespace-pre-wrap">{showResult}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
