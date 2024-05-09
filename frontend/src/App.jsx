import React, { useState } from "react";

const App = () => {
  const [inputFile, setInputFile] = useState("");
  // console.log(inputFile);
  //change the end-point of the api for parallel uploads and s3 bucket storage
  const submitFile = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("inputFile", inputFile);
      const response = await fetch("http://localhost:3000/one-shot", {
        method: "POST",

        body: formData,
      });
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.log("error in sending file", error);
    }
  };
  return (
    <div>
      <form action="" onSubmit={submitFile}>
        <input
          type="file"
          name="inputFile"
          id=""
          onChange={(e) => setInputFile(e.target.files[0])}
        />
        <button type="submit">click me</button>
      </form>
    </div>
  );
};

export default App;
