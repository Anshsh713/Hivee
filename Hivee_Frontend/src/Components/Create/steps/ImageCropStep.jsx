import Cropper from "react-easy-crop";
export default function ImageCropStep({
  setPagestate,
  handleNext,
  selectedFile,
  crop,
  zoom,
  aspect,
  setCrop,
  setZoom,
  setAspect,
  setCroppedAreaPixels,
  showaspect,
  setShowaspect,
  showzoom,
  setshowzoom,
}) {
  return (
    <div className="Creat-Main-Box">
      <div className="create-boxs">
        <div className="posting">
          <div className="head">
            <i
              className="fa-solid fa-arrow-left"
              onClick={() => {
                setPagestate("Home");
              }}
            ></i>
            <p>Crop</p>
            <p className="skip" onClick={handleNext}>
              Next
            </p>
          </div>
          <div className="crop-container">
            <Cropper
              image={URL.createObjectURL(selectedFile)}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedPixels) =>
                setCroppedAreaPixels(croppedPixels)
              }
              showGrid={true}
            />
          </div>
          <div className="aspect-controls">
            <div className="controls">
              <button
                onClick={() => {
                  setShowaspect(!showaspect);
                  if (showzoom === true) {
                    setshowzoom(false);
                  }
                }}
              >
                <i className="fa-solid fa-expand"></i>
              </button>
              <button
                onClick={() => {
                  setshowzoom(!showzoom);
                  if (showaspect === true) {
                    setShowaspect(false);
                  }
                }}
              >
                <i class="fa-solid fa-magnifying-glass-plus"></i>
              </button>
              {showzoom && (
                <div className="zoom">
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="more-image">
              <button>
                <i class="fa-solid fa-clone fa-flip-horizontal"></i>
              </button>
            </div>
            {showaspect && (
              <div className="aspect">
                <button onClick={() => setAspect(undefined)}>Original</button>
                <button onClick={() => setAspect(1 / 1)}>1:1</button>
                <button onClick={() => setAspect(4 / 5)}>4:5</button>
                <button onClick={() => setAspect(16 / 9)}>16:9</button>
                <button onClick={() => setAspect(9 / 16)}>9:16</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
