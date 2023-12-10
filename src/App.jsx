import { useState, useEffect } from "react";

import "./App.css";

import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import Showdown from "showdown";
import parse from "html-react-parser";

function App() {
  const [text, setText] = useState("");
  const [book, setBook] = useState();
  const [hadithNo, setHadithNo] = useState(0);

  const [loading, setLoading] = useState(false)

  const [html, setHtml] = useState("sahih-bukhari");

  const converter = new Showdown.Converter();

  const inputchangeHandler = (event) => {
    setText(event.target.value);
  };

  const columns = function () {
    if (window.innerWidth < 700) {
      return window.innerWidth / 9;
    } else {
      return window.innerWidth / 15;
    }
  };

  useEffect(() => {
    setHtml(converter.makeHtml(text));
  }, [text, converter]);

  const submitHandler = async (event) => {
    event.preventDefault()
    setLoading(true)

    const dbHadith = await getDoc(doc(db, `${book}`, `${hadithNo}`));

    if (dbHadith.exists()) {
      if (confirm("Caution: There is already commentary here. Overwrite?")) {
        await setDoc(doc(db, `${book}`, `${hadithNo}`), {
          html: html
        }).then(setLoading(false));
      }
    } else {
      await setDoc(doc(db, `${book}`, `${hadithNo}`), {
        html: html
      }).then(setLoading(false));
    }
  };

  return (
    <>
      {loading && <div className="loading"><p>Loading...</p></div>}
      <h1>Notion to hadith app</h1>
      <div className="form" onSubmit={submitHandler}>
        <form>
          <div className="details">
            <div>
              <label htmlFor="book" id="book" className="book-label">
                Collection:
              </label>

              <select
                name="book"
                id="book"
                value={book}
                onChange={(event) => {
                  setBook(event.target.value);
                  console.log(event);
                }}
                required
              >
                <option value="sahih-bukhari">Bukhari</option>
                <option value="sahih-muslim">Muslim</option>
                <option value="abu-dawood">Abu Dawood</option>
                <option value="al-tirmidhi">Tirmidhi</option>
                <option value="sunan-nasai">Nasa'i</option>
                <option value="ibn-e-majah">Ibn Majah</option>
              </select>
            </div>

            <div>
              <label htmlFor="hadith">Hadith No.:</label>
              <input
                id="hadith"
                type="number"
                value={hadithNo}
                onChange={(event) => setHadithNo(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="markdown-html">
            <div className="markdown">
              <textarea
                onChange={inputchangeHandler}
                value={text}
                rows={30}
                cols={columns()}
                placeholder="Notion text goes here"
                required
              ></textarea>
            </div>
            <div className="html">{parse(html)}</div>
          </div>
          <button type="submit">Add to website</button>
        </form>
      </div>
    </>
  );
}

export default App;
