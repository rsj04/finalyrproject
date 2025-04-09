import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OCRFileUpload = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult("");
    }
  };

  const processImage = async () => {
    if (!image) {
      alert("Please select an image first");
      return;
    }

    setResult("Processing image...");

    try {
      const file = document.getElementById("image-input").files[0];
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      Tesseract.recognize(
        dataUrl,
        "eng",
        {
          logger: (info) => console.log(info),
        }
      ).then(({ data: { text } }) => {
        setResult(text || "No text found in image");
      }).catch((error) => {
        setResult(`Error: ${error.message}`);
      });
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px", maxWidth: "600px", margin: "auto", textAlign: "center", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)" }}>
      <h3 style={{ color: "#333", marginBottom: "20px" }}>OCR File Upload</h3>
      <input id="image-input" type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: "10px" }} />
      <button onClick={processImage} style={{ padding: "10px 20px", backgroundColor: "#4caf50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", transition: "0.3s ease" }}>
        Process Image
      </button>

      {image && (
        <div style={{ marginTop: "20px" }}>
          <h4 style={{ color: "#555" }}>Preview:</h4>
          <img src={image} alt="Preview" style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "10px" }} />
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <h4 style={{ color: "#555" }}>Extracted Text:</h4>
        <div style={{ whiteSpace: "pre-wrap", color: "#444", padding: "10px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "5px", marginTop: "10px" }}>
          {result}
        </div>
      </div>
    </div>
  );
};

export default OCRFileUpload;
