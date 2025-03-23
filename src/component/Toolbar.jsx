import '../toolbar.css';
const Toolbar = ({ content }) => {
    const saveTemplate = () => {
      localStorage.setItem("NewSletter", content);
      alert("Template saved!");
    };
  
    const exportTemplate = () =>{
      const blob = new Blob([content], { type: "text/html" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "newsletter.html";
      link.click();
    };
  
    return (
      <div className="toolbar">
        <div className="toolbar-item">
          <h1 className='Name'>Safari Editor</h1>
        </div>
        <div className="toolbar-item">
          <button className="Save" onClick={saveTemplate}>Save</button>
        </div>
        <div className="toolbar-item">
          <button className="Export" onClick={exportTemplate}>Export</button>
        </div>
      </div>
    );
  };
  
  export default Toolbar;
  