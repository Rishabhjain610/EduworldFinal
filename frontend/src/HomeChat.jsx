import React, { useContext, useState, useEffect } from "react";
import { RiImageAiLine, RiImageAddLine, RiSendPlaneFill, RiCloseLine } from "react-icons/ri";
import { MdChatBubbleOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaArrowUpLong } from "react-icons/fa6";
import { dataContext, prevUser, user } from "./UserContextChat";
import Chat from "./Chat";
import { generateResponse } from "./gemini";
import { query } from "./huggingFace";

function HomeChat() {
  let {
    startRes,
    setStartRes,
    popUp,
    setPopUP,
    input,
    setInput,
    feature,
    setFeature,
    showResult,
    setShowResult,
    prevFeature,
    setPrevFeature,
    genImgUrl,
    setGenImgUrl,
  } = useContext(dataContext);


  const [greeting, setGreeting] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good morning")
    else if (hour < 18) setGreeting("Good afternoon")
    else setGreeting("Good evening")
  }, [])

  async function handleSubmit(e) {
    setStartRes(true);
    setPrevFeature(feature);

    setShowResult("");
    prevUser.data = user.data;
    prevUser.mime_type = user.mime_type;
    prevUser.imgUrl = user.imgUrl;
    prevUser.prompt = input;
    user.data = null;
    user.mime_type = null;
    user.imgUrl = null;
    setInput("");
    let result = await generateResponse();
    console.log(result);
    setShowResult(result);
    setFeature("chat");
  }

  function handleImage(e) {
    setFeature("upimg");
    let file = e.target.files[0];

    let reader = new FileReader();
    reader.onload = (event) => {
      let base64 = event.target.result.split(",")[1];
      user.data = base64;
      user.mime_type = file.type;
      user.imgUrl = `data:${user.mime_type};base64,${user.data}`;
    };
    console.log(user.imgUrl);
    reader.readAsDataURL(file);
  }

  async function handleGenerateImg() {
    setStartRes(true);
    setPrevFeature(feature);
    setGenImgUrl("");
    prevUser.prompt = input;
    let result = await query().then((e) => {
      let url = URL.createObjectURL(e);
      setGenImgUrl(url);
    });
    setInput("");
    setFeature("chat");
  }

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center overflow-hidden relative">
        <input type="file" accept="image/*" hidden id="inputImg" onChange={handleImage} />

        {!startRes ? (
          <div className="w-full max-w-3xl flex flex-col items-center justify-center gap-8 px-6 py-10 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                {greeting}!
              </h2>
              <p className="text-2xl text-gray-300 font-light">How can I assist you today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <button
                onClick={() => document.getElementById("inputImg").click()}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-br from-neutral-900/40 to-black border transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <RiImageAddLine className="w-7 h-7 text-green-400" />
                </div>
                <span className="text-lg font-medium text-gray-200">Upload Image</span>
              </button>

              <button
                onClick={() => setFeature("genimg")}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-br from-neutral-900/40 to-black border transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <RiImageAiLine className="w-7 h-7 text-cyan-400" />
                </div>
                <span className="text-lg font-medium text-white">Generate Image</span>
              </button>

              <button
                onClick={() => setFeature("chat")}
                className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-br from-neutral-900/40 to-black border transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-transparent flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MdChatBubbleOutline className="w-7 h-7 text-purple-400" />
                </div>
                <span className="text-lg font-medium text-white">Let's Chat</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Try asking about campus facilities, course schedules, or assignments
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full overflow-y-auto">
            <Chat isTyping={isTyping} />
          </div>
        )}

        {/* User uploaded image preview */}
        {user.imgUrl && (
          <div className="absolute left-2 bottom-24 md:left-55 md:bottom-1">
            <div className="relative group">
              <img
                src={user.imgUrl || "/placeholder.svg"}
                alt="Uploaded"
                className="h-24 w-auto rounded-lg shadow-lg border-2 border-white/20"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  user.data = null
                  user.mime_type = null
                  user.imgUrl = null
                }}
              >
                <RiCloseLine className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Feature popup */}
        {popUp && (
          <div className="absolute left-5 bottom-0 md:left-48 md:bottom-0 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl z-10">
            <div className="flex flex-col p-2 min-w-[200px]">
              <button
                className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-left hover:bg-gray-700/70 transition-colors"
                onClick={() => {
                  setPopUP(false)
                  setFeature("chat")
                  document.getElementById("inputImg").click()
                }}
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <RiImageAddLine className="w-4 h-4 text-green-400" />
                </div>
                <span>Upload Image</span>
              </button>

              <button
                className="flex items-center gap-3 w-full px-4 py-3 rounded-md text-left hover:bg-gray-700/70 transition-colors"
                onClick={() => {
                  setFeature("genimg")
                  setPopUP(false)
                }}
              >
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <RiImageAiLine className="w-4 h-4 text-cyan-400" />
                </div>
                <span>Generate Image</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Input Form */}
      <form
        className="w-full px-4 py-4 bg-black backdrop-blur-sm border-t border-black"
        onSubmit={(e) => {
          e.preventDefault()
          if (input) {
            if (feature === "genimg") {
              handleGenerateImg()
            } else {
              handleSubmit(e)
            }
          }
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <button
            type="button"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${feature === "genimg" ? "bg-cyan-500/20 text-cyan-400" : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            onClick={() => setPopUP((prev) => !prev)}
          >
            {feature === "genimg" ? <RiImageAiLine className="w-5 h-5" /> : <FiPlus className="w-5 h-5" />}
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={feature === "genimg" ? "Describe the image you want to generate..." : "Ask something..."}
              className="w-full h-12 bg-gray-700/70 border border-gray-600 focus:border-purple-500 rounded-full px-5 text-white outline-none transition-all duration-200"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />

            {feature === "genimg" && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-md text-xs">
                Image Gen
              </div>
            )}
          </div>

          {input.trim() && (
            <button
              type="submit"
              className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition-colors"
            >
              <RiSendPlaneFill className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default HomeChat;