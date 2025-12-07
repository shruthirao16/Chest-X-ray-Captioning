import React, { useState } from "react";
import axios from "axios";
import "./ModelPage.css";

const ModelPage = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [finalView, setFinalView] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setCaption("");
    setLoading(false);
    setFinalView(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert("Please select an image.");
      return;
    }

    setLoading(true);
    setCaption("");
    setFinalView(false);

    const formData = new FormData();
    formData.append("file", image);

    try {
      const res = await axios.post("http://127.0.0.1:5000/predictnlp", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCaption(res.data.caption);
      setLoading(false);

      setTimeout(() => {
        setFinalView(true); // trigger slide animation
      }, 300);

    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
  <div className="model-container">
    <div className="model-inner">
      <h1 className="title">Automated Chest X-ray Captioning</h1>
    
       <p className="page-subtext">
        Choose a chest X-ray image (JPG, JPEG, PNG) to generate an automated medical caption.
        </p>

      <form onSubmit={handleSubmit} className="upload-section">
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload & Generate Caption</button>
      </form>

      {/* Preview & Caption Phases */}
      {preview && !finalView && (
        <div className="center-view">
          <img src={preview} className="preview-center small-preview" alt="preview" />
          {loading && <p className="loading-text">Generating caption...</p>}
        </div>
      )}

      {finalView && (
        <div className="final-layout">
          <img src={preview} alt="preview" className="final-img" />
          <div className="caption-box">
            <h2>Generated Caption</h2>
            <p>{caption}</p>
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default ModelPage;

