import React, { useState, useRef } from "react";
import { usePost } from "../Context/PostingContext";
import getCroppedImg from "../utils/cropImage";

export function useCreatePost(makingpost) {
  const [pagestate, setPagestate] = useState("Home");
  const [finalImage, SetFinalImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [collaborators, setCollaborators] = useState("");
  const [hidelike, setHidelike] = useState(false);
  const [hidecomment, setHidecomment] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [Advanced, SetAdvanced] = useState(false);
  const [error, setError] = useState("");
  const { MakingPost, loading } = usePost();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1 / 1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showaspect, setShowaspect] = useState(false);
  const [showzoom, setshowzoom] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);

  const Max_Lenght = 2000;

  const onEmojiClick = (emojiData) => {
    setCaption((prev) => {
      if (prev.length + emojiData.emoji.length > Max_Lenght) {
        return prev;
      }
      return prev + emojiData.emoji;
    });
  };

  const handleChange = (e) => {
    setCaption(e.target.value);
  };

  const making_post = async (type) => {
    try {
      if (type === "Text") {
        await MakingPost({
          Post_Type: "Text",
          Caption: caption,
          Location: location,
          Collaborators: collaborators,
          hideLikesCount: hidelike,
          disableComments: hidecomment,
        });
        makingpost(false);
        setCaption("");
        setLocation("");
        setCollaborators("");
        setHidelike(false);
        setHidecomment(false);
        SetAdvanced(false);
        setPagestate("Home");
      } else {
        const formData = new FormData();

        formData.append("Post_Type", type);
        formData.append("Caption", caption);
        formData.append("Location", location);
        formData.append("Collaborators", collaborators);
        formData.append("hideLikesCount", hidelike);
        formData.append("disableComments", hidecomment);

        formData.append("media", type === "Image" ? finalImage : selectedFile);

        await MakingPost(formData, true);
        setshowzoom(false);
        setShowaspect(false);
        setCaption("");
        setLocation("");
        setCollaborators("");
        setHidelike(false);
        setHidecomment(false);
        SetAdvanced(false);
        setImageSrc(null);
        makingpost(false);
        setSelectedFile(null);
        setPagestate("Home");
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };

  const handleNext = async () => {
    const croppedImage = await getCroppedImg(
      URL.createObjectURL(selectedFile),
      croppedAreaPixels,
    );

    SetFinalImage(croppedImage);

    const imageURL = URL.createObjectURL(croppedImage);
    setImageSrc(imageURL);
    setPagestate("Post-Final");
  };

  return {
    pagestate,
    setPagestate,
    caption,
    setCaption,
    location,
    setLocation,
    collaborators,
    setCollaborators,
    hidelike,
    setHidelike,
    hidecomment,
    setHidecomment,
    selectedFile,
    setSelectedFile,
    showEmoji,
    setShowEmoji,
    Advanced,
    SetAdvanced,
    error,
    setError,
    MakingPost,
    loading,
    crop,
    setCrop,
    zoom,
    setZoom,
    aspect,
    setAspect,
    croppedAreaPixels,
    setCroppedAreaPixels,
    showaspect,
    setShowaspect,
    showzoom,
    setshowzoom,
    imageSrc,
    setImageSrc,
    Max_Lenght,
    onEmojiClick,
    handleChange,
    making_post,
    handleNext,
  };
}
