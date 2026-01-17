export default function VideoPreview({ setPagestate, selectedFile }) {
  const videoURL = URL.createObjectURL(selectedFile);

  return (
    <div className="Creat-Main-Box">
      <div className="create-boxs">
        <div className="posting">
          <div className="head">
            <i
              className="fa-solid fa-arrow-left"
              onClick={() => setPagestate("Home")}
            />
            <p>Preview</p>
            <p className="skip" onClick={() => setPagestate("Video-Final")}>
              Next
            </p>
          </div>
          <div className="video-crop-container">
            <video src={videoURL} autoPlay loop playsInline />
            <div className="grid-overlay" />
          </div>
          <div className="aspect-controls">
            <div className="more-image">
              <button>
                <i class="fa-solid fa-clone fa-flip-horizontal"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
