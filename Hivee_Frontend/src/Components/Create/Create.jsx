import { useCreatePost } from "../../Hooks/useCreatePost";
import HomeStep from "./steps/HomeStep";

import "./Create.css";
import ImageCropStep from "./steps/ImageCropStep";
import ImageFinalStep from "./steps/ImageFinalStep";
import TextOnlyStep from "./steps/TextOnlyStep";
import VideoPreview from "./steps/VideoPreview";
import VideoFinalStep from "./steps/VideoFinalStep";

export default function Creating({ makingpost }) {
  const post = useCreatePost(makingpost);

  return (
    <div className="create-overlay">
      <div className="close-btn">
        <i
          className="fa-solid fa-x"
          onClick={() => {
            makingpost(false);
          }}
        ></i>
      </div>
      {post.pagestate === "Home" && <HomeStep {...post} />}
      {post.pagestate === "Image-Sized" && <ImageCropStep {...post} />}
      {post.pagestate === "Post-Final" && <ImageFinalStep {...post} />}
      {post.pagestate === "Text-Only" && <TextOnlyStep {...post} />}
      {post.pagestate === "Video-Preview" && <VideoPreview {...post} />}
      {post.pagestate === "Video-Final" && <VideoFinalStep {...post} />}
    </div>
  );
}
