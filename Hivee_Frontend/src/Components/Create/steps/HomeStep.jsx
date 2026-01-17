import { useRef } from "react";

export default function HomeStep({ setPagestate, setSelectedFile, setError }) {
  const fileInputRef = useRef(null);

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setError("Only image or video files are allowed");
      return;
    }

    if (isImage) {
      setSelectedFile(file);
      setPagestate("Image-Sized");
      return;
    }

    if (isVideo) {
      try {
        const duration = await getVideoDuration(file);

        if (duration > 120) {
          setError("Video must be 2 minutes or less");
          return;
        }

        setSelectedFile(file);
        setPagestate("Video-Preview");
      } catch (err) {
        setError("Failed to load video");
      }
    }
  };

  return (
    <div className="Creat-Main-Box">
      <div className="create-box">
        <div className="posting">
          <div className="header">
            <p>Create your new post</p>
            <p className="skip" onClick={() => setPagestate("Text-Only")}>
              skip
            </p>
          </div>

          <div className="image-video">
            <i className="fa-solid fa-photo-film fa-bounce"></i>
            <p>Drag photos and videos here</p>

            <div className="img-vid" onClick={openFilePicker}>
              Select from your device
            </div>

            <input
              type="file"
              ref={fileInputRef}
              hidden
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
const getVideoDuration = (file) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      resolve(video.duration);
      URL.revokeObjectURL(video.src);
    };

    video.onerror = () => reject();

    video.src = URL.createObjectURL(file);
  });
};
