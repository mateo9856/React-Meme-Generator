import React, { useEffect, useState } from "react";
import qs from "qs";
import "./App.css";

function App() {
  const [textUp, setTextUp] = useState("");
  const [textDown, setTextDown] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [meme, setMeme] = useState(null);


  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((response) => response.json())
      .then((datas) => {
        setTemplates(datas.data.memes);
      });

  }, []);

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    console.log(fieldName);
    if(fieldName === "Up") {
      setTextUp(fieldValue);
    } else if(fieldName === "Down") {
      setTextDown(fieldValue);
    } else return;
  };

  const handleClick = (imageId) => {
    setSelectedId(imageId);
    console.log(imageId);
    
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = {
      template_id: selectedId,
      text0: textUp,
      text1: textDown,
      username: 'mateo9856',//zarejestrowac sie w imgflip by miec dostep do api
      password: 'mateo1998'
    }
    fetch(`https://api.imgflip.com/caption_image?${qs.stringify(params)}`)
    .then(response => response.json())
    .then((data) => {
      //console.log(data);
      if(data.success) {
        setMeme(data.data.url)
      } else {
        alert("Nie udało się połączyć z API problem z użytkownikiem")
      }
    });
  };

  console.log(templates);
  return (
    <div className="App">
      <div className = "submitContainer">
      <form onSubmit={handleSubmit}>
        Text Up:
        <input type = "text" name = "Up" value = {textUp} onChange = {handleChange} />
        Text Down:
        <input type = "text" name = "Down" value = {textDown} onChange = {handleChange} />
        <input type="submit" value="GET!" />
      </form>

      <div className="meme">
        {meme ? <img src ={meme} alt="" /> : null}
      </div>
      </div>
      <div className="meme-container">
        {templates &&
          templates.filter(el => el.box_count <= 2 ).map((elem) => {
            return (
              <img
                className = {elem.id === selectedId ? 'active-meme' : ''}
                src={elem.url}
                onClick={() => handleClick(elem.id)}
                id={elem.id}
                alt=""
              />
              
            );
          })}
      </div>
    </div>
  );
}

export default App;
