import React, { useRef, useEffect, useState } from "react";
import '../index.css'
const templates = [
  {
    id: 1,
    name: "Footer Of Lacoste",
    html: `
      <section>
        <img src="https://testhsmsamaa.s3.amazonaws.com/images/Adresses-LACOSsTEs.jpg" alt="BOUTIQUES" class="responsive-image" style="width: 100%; height: auto;"/>
        <div style="padding: 20px;">
          <h2 style="text-align: center;">SUIVEZ-NOUS</h2>
          <div style="padding: 10px; text-align: center;">
            <a href="https://web.facebook.com/safarigroupe" target="_blank" title="Follow us on Facebook">
              <img src="https://wpm.ccmp.eu/wpm/100036/ContentUploads/20230506_FR_SS23_MI_MothersDaySelection/15.png" alt="Facebook" style="width: 30px; height: auto; margin: 0 10px;"/>
            </a>
            <a href="https://www.instagram.com/safari.groupe" target="_blank" title="Follow us on Instagram">
              <img src="https://mtc.mysafari.ma/media/images/15.png" alt="Instagram" style="width: 30px; height: auto; margin: 0 10px;"/>
            </a>
          </div>
        </div>
        <div style="padding: 20px;">
          <a href="http://lacoste.ma" target="_blank" style="color: #000000; text-decoration: none;">
            <strong>lacoste.ma</strong>
          </a>
        </div>
        <div style="padding: 20px; background-color: #fdfdfd;">
          <p style="font-family: Arial, sans-serif; font-size: 10px; color: #999999; margin: 0;">
            LACOSTE MAROC - SAFARI IMPORT EXPORT - 3-4, Quartier industriel Takaddoum, 10260 Rabat, Maroc.<br>
            RC de Rabat N° : 44787
          </p>
          <p style="font-family: Arial, sans-serif; font-size: 10px; color: #999999; margin: 0;">
            <a href="YOUR_UNSUBSCRIBE_URL" style="color: #000000; text-decoration: none;">Se désabonner</a> pour ne plus recevoir nos emails.
          </p>
          <p style="font-family: Arial, sans-serif; font-size: 10px; color: #999999; margin: 0;">
            <em>Accréditation CNDP N° : D-GC-74/2020</em>
          </p>
        </div>
      </section>
    `
  },
  {
    id: 2,
    name: "Contact Form",
    html: "<section><form><input type='text' placeholder='Your Name'><button>Submit</button></form></section>"
  }
];

const TemplateSelector = ({ templates, onTemplateSelect }) => {
  return (
    <div className="template-selector">
      {templates.map((template) => (
        <div
          key={template.id}
          className="template-card"
          onClick={() => onTemplateSelect(template)}
        >
          <h3>{template.name}</h3>
          <div
            dangerouslySetInnerHTML={{ __html: template.html }}
          /> {/* Preview */}
        </div>
      ))}
    </div>
  );
};

const Editor = ({ content, setContent }) => {
  const iframeRef = useRef(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [textColor, setTextColor] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [linkHref, setLinkHref] = useState("");
  const [textAlign, setTextAlign] = useState("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setContent(e.target.result);
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(content);
    iframeDoc.close();

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();

      let target = e.target;
      const tag = target.tagName;

      if (selectedElement) {
        selectedElement.style.border = "none";
      }

      if (["P", "H1", "H2", "SPAN", "BUTTON", "DIV"].includes(tag)) {
        setSelectedElement(target);
        target.style.border = "2px solid blue";
        setInputValue(target.innerText);
        setTextColor(target.style.color );
        setFontSize(target.style.fontSize );
        setBgColor(target.style.backgroundColor);
        setFontFamily(target.style.fontFamily);
        setImgSrc("");
        setLinkHref("");
      } else if (tag === "A") {
        setSelectedElement(target);
        target.style.border = "2px solid blue";
        setLinkHref(target.href);
        setInputValue(target.innerText);
        setImgSrc("");
      } else if (tag === "BUTTON") {
        setSelectedElement(target);
        target.style.border = "2px solid blue";
        setInputValue(target.innerText);
        setLinkHref("");
      } else if (tag === "IMG") {
        setSelectedElement(target);
        setImgSrc(target.src);
        setLinkHref(target.parentElement?.tagName === "A" ? target.parentElement.href : "");
        setInputValue("");

        handleImageResize(target);
      }
    };

    iframeDoc.body.addEventListener("click", handleClick);
    return () => {
      iframeDoc.body.removeEventListener("click", handleClick);
    };
  }, [content, setContent]);

  const handleConfirmChange = (event) => {
    event.preventDefault();
    if (!selectedElement) return;

    if (selectedElement.tagName === "A") {
      selectedElement.innerText = inputValue;
      selectedElement.href = linkHref;
    } else if (selectedElement.tagName === "BUTTON") {
      selectedElement.innerText = inputValue;
    } else if (selectedElement.tagName === "IMG") {
      selectedElement.src = imgSrc; 
      if (selectedElement.parentElement.tagName === "A") {
        selectedElement.parentElement.href = linkHref;
      }
    } else {
      selectedElement.innerText = inputValue;
      selectedElement.style.color = textColor;
      selectedElement.style.fontSize = fontSize;
      selectedElement.style.backgroundColor = bgColor;
      selectedElement.style.fontFamily = fontFamily;
      selectedElement.style.textAlign = textAlign;
    }

    selectedElement.style.border = "none";
    setSelectedElement(null);

    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      setContent(iframeDoc.documentElement.outerHTML);
    }
  };


  const handleTextAlign = (alignment) => {
    if (!selectedElement) return;
    setTextAlign(alignment);
    selectedElement.style.textAlign = alignment;
  };

  const insertTemplate = (template) => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    try {
      if (selectedElement) {
        selectedElement.insertAdjacentHTML("afterend", template.html);
      } else {
        iframeDoc.body.innerHTML += template.html;
      }
      setContent(iframeDoc.documentElement.outerHTML);
    } catch (error) {
      console.error("Error inserting template:", error);
    }
  };

  const handleDelete = () => {
    if (!selectedElement) return;

    selectedElement.remove();
    setSelectedElement(null);

    const iframeDoc = iframeRef.current?.contentDocument;
    if (iframeDoc) {
      setContent(iframeDoc.documentElement.outerHTML);
    }
  };

  const addImage = () => {
    const imageUrl = prompt("Enter the image URL:");
    if (imageUrl) {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      const imgElement = `<img src="${imageUrl}" alt="User added image" style="width: 100%; height: auto;"/>`;

      if (selectedElement) {
        selectedElement.insertAdjacentHTML("afterend", imgElement);
      } else {
        iframeDoc.body.innerHTML += imgElement;
      }

      setContent(iframeDoc.documentElement.outerHTML);
    }
  };

  const handleTemplateSelect = (template) => {
    insertTemplate(template);
    setShowTemplateSelector(false);
  };

  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;

    const message = event.data;
    if (message.type === 'initResize') {
        const img = document.getElementById(message.imgId);
        if (img) {
            handleImageResize(img);
        } else {
            console.error(`Image with ID "${message.imgId}" not found in iframe.`);
        }
    }
});

function handleImageResize(img) {
  const resizeHandle = document.createElement("div");
  resizeHandle.style.width = "10px";
  resizeHandle.style.height = "10px";
  resizeHandle.style.position = "absolute";
  resizeHandle.style.cursor = "nwse-resize";
  resizeHandle.style.background = "transparent";

  img.parentElement.style.position = "relative"; 

  let startX, startY, startWidth, startHeight;
  let resizeFunction, stopResizeFunction;

  const updateHandlePosition = () => {
      const imgRect = img.getBoundingClientRect();
      const parentRect = img.parentElement.getBoundingClientRect();

      resizeHandle.style.right = `${parentRect.width - imgRect.right}px`;
      resizeHandle.style.bottom = `${parentRect.height - imgRect.bottom}px`;
  };

  resizeHandle.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = img.offsetWidth;
      startHeight = img.offsetHeight;

      resizeFunction = (moveEvent) => {
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;

          let newWidth = startWidth + deltaX;
          newWidth = Math.max(newWidth, 20  );

          let newHeight = startHeight + deltaY;
          newHeight = Math.max(newHeight, 20);

          const aspectRatio = startWidth / startHeight;
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
              newHeight = newWidth / aspectRatio;
          } else {
              newWidth = newHeight * aspectRatio;
          }
          img.style.width = `${newWidth}px`;
          img.style.height = `${newHeight}px`;
          updateHandlePosition(); 
          window.parent.postMessage({ type: 'resizeRequest', width: newWidth, height: newHeight }, '*');
      };

      stopResizeFunction = () => {
          document.removeEventListener("mousemove", resizeFunction);
          document.removeEventListener("mouseup", stopResizeFunction);
      };

      document.addEventListener("mousemove", resizeFunction);
      document.addEventListener("mouseup", stopResizeFunction);
  });

  img.parentElement.appendChild(resizeHandle); 
  updateHandlePosition(); 
}

  const addText = () => {
    const text = prompt("Enter the text:");
    if (text) {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      const paragraphElement = `<p>${text}</p>`;

      if (selectedElement) {
        selectedElement.insertAdjacentHTML("afterend", paragraphElement);
      } else {
        iframeDoc.body.innerHTML += paragraphElement;
      }

      setContent(iframeDoc.documentElement.outerHTML);
    }
  };

  return (
    <div style={{ display: "flex"}}>
      <div style={{ width: "250px", padding: "10px" }}>
        <button style={{ padding: "5px 10px", cursor: "pointer", width: "100%" }} onClick={() => setShowTemplateSelector(!showTemplateSelector)}>
          Select Template
        </button>
        {showTemplateSelector && (
          <TemplateSelector
            templates={templates}
            onTemplateSelect={handleTemplateSelect}
            className='template-card'
          />
        )}
        <button onClick={addImage} style={{ padding: "5px 10px", cursor: "pointer", width: "100%" }}>
          Add Image
        </button>
        <button onClick={addText} style={{ padding: "5px 10px", cursor: "pointer", width: "100%", marginTop: "5px" }}>
          Add Text
        </button>

        <label>Text:</label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Edit text..."
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        />

        <label>Link URL:</label>
        <input
          type="text"
          value={linkHref}
          onChange={(e) => setLinkHref(e.target.value)}
          placeholder="Change link URL..."
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        />

        <label>Image URL:</label>
        <input
          type="text"
          value={imgSrc}
          onChange={(e) => setImgSrc(e.target.value)}
          placeholder="Change image URL..."
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        />

        <label>Font Family:</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
        >
          <option value="Arial">Arial</option>
          <option value="Verdana">Verdana</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
          <option value="Impact">Impact</option>
          <option value="Comic Sans MS">Comic Sans MS</option>
          <option value="Lucida Console">Lucida Console</option>
        </select>

        <label>Color:</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          style={{ width: "90%", marginBottom: "10px" }}
        />

        <label>Font Size:</label>
        <input
          type="number"
          value={parseInt(fontSize, 10)}
          onChange={(e) => setFontSize(`${e.target.value}px`)}
          min="10"
          max="100"
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <label>Background Color:</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <button onClick={() => handleTextAlign("left")} style={{ padding: "5px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
              <path d="M120-120v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Zm0-160v-80h480v80H120Zm0-160v-80h720v80H120Z"/>
            </svg>
          </button>
          <button onClick={() => handleTextAlign("center")} style={{ padding: "5px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
              <path d="M120-120v-80h720v80H120Zm160-160v-80h400v80H280ZM120-440v-80h720v80H120Zm160-160v-80h400v80H280ZM120-760v-80h720v80H120Z"/>
            </svg>
          </button>
          <button onClick={() => handleTextAlign("right")} style={{ padding: "5px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f">
              <path d="M120-760v-80h720v80H120Zm240 160v-80h480v80H360ZM120-440v-80h720v80H120Zm240 160v-80h480v80H360ZM120-120v-80h720v80H120Z"/>
            </svg>
          </button>
        </div>

        <button onClick={handleConfirmChange} style={{ padding: "5px 10px", cursor: "pointer", width: "100%" }}>
          Confirm
        </button>
        <button
          onClick={handleDelete}
          style={{ padding: "5px 10px", cursor: "pointer", width: "100%", backgroundColor: "#ff4d4d", color: "#fff" }}
        >
          Delete
        </button>

      </div>
      <div style={{ flex: 1, paddingLeft: "20px" }}>
        <input type="file" onChange={handleFileUpload} />
        <iframe ref={iframeRef} className="preview" title="Newsletter Preview" style={{ width: "90%", height: "600px" }} />
      </div>
    </div>
  );
};

export default Editor;