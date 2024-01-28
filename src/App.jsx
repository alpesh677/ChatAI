import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-markdown'
import markdownit from 'markdown-it';
import './App.css'
import './style/styles.css'

function App() {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const [data, setData] = useState(undefined);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchDataFromGeminiAPI(e) {
    e.preventDefault();
    try {
      if (!inputText) {
        alert("Please enter a text");
        return;
      }

      setLoading(true);

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // const prompt = "Write about India"
      const result = await model.generateContent(inputText);
      const text = result.response.text();
      const md = markdownit()
      const final_data = md.render(text);
      console.log(final_data);

      const codeContent = text.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/i);
      const cleanData = codeContent ? codeContent[1] : text;

      setLoading(false);
      setData(cleanData);
      setInputText("")

    } catch (error) {
      setLoading(false);
      console.error("fetchDataFromGeminiAPI error :", error)
    }
  }
  return (
    <>
      <div className='min-h-[100vh] min-w-full lg:px-16 px-1 flex flex-col gap-2 m-2 '>
        <div className='h-[70vh] min-w-full rounded-lg px-4 py-4 overflow-hidden bg-[#0b0b1d] text-white overflow-y-scroll'>
          <div className='text-purple-600 mb-5 font-bold text-lg '>GEMINI AI :</div>
          {loading ? <div className="flex justify-center items-center h-full">
            <span className="loader"></span>
          </div> : (<Markdown>{data}</Markdown>)
          }

        </div>
        <form
          onSubmit={fetchDataFromGeminiAPI}
          className='flex flex-col gap-2 bg-[#0b0b1d] rounded-xl'
        >
          <textarea
            className='w-full outline-none bg-[#0b0b1d] text-white rounded-xl p-4'
            rows="3"
            placeholder='Message to AI...'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />

          <div className='flex flex-row justify-end gap-2 p-3'>
            <button type="submit"
              disabled={loading}
              className='rounded-full my-auto text-sm p-2 text-blue-100 bg-blue-600 w-fit text-end flex gap-2 px-4 hover:bg-blue-800'
            >
              <div className='text-base font-outfit font-bold my-auto'>Send</div>

              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-horizontal"><path d="m3 3 3 9-3 9 19-9Z" /><path d="M6 12h16" /></svg>
            </button>
          </div>
        </form>

      </div>

    </>
  )
}

export default App
