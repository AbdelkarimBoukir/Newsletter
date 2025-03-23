import React, { useState } from "react";
import Toolbar from "../component/Toolbar";
import Editor from "../component/Editor";

const Home = () => {
  const [content, setContent] = useState("<h1>Hello Newsletter</h1>");     

  return (
    <div className="container">
      <Toolbar content={content} />
      <Editor content={content} setContent={setContent} />
    </div>
  );
};
export default Home;