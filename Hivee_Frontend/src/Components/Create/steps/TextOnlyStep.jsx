import { useAuth } from "../../../Context/UserContext";
import EmojiPicker from "emoji-picker-react";

export default function TextOnlyStep({
  setPagestate,
  making_post,

  caption,
  handleChange,
  Max_Lenght,
  error,

  showEmoji,
  setShowEmoji,
  onEmojiClick,

  location,
  setLocation,

  collaborators,
  setCollaborators,

  Advanced,
  SetAdvanced,

  hidelike,
  setHidelike,

  hidecomment,
  setHidecomment,
}) {
  const { user, isAuthenticated } = useAuth();
  return (
    <div className="Creat-Main-Box">
      <div className="create-box">
        <div className="posting">
          <div className="header">
            <i
              className="fa-solid fa-arrow-left"
              onClick={() => {
                setPagestate("Home");
                setCaption("");
                setLocation("");
                setCollaborators("");
                setHidelike(false);
                setHidecomment(false);
                SetAdvanced(false);
              }}
            ></i>
            <p>New Thought</p>
            <p
              className="Share"
              onClick={() => {
                making_post("Text");
              }}
            >
              Share
            </p>
          </div>
          <div className="your-thought">
            <div className="user">
              <i class="fa-regular fa-circle-user"></i>
              {isAuthenticated && user && <p>{user.User_Name}</p>}
            </div>
            <div className="thought">
              <textarea
                value={caption}
                placeholder="Write Your Thought..."
                onChange={handleChange}
                maxLength={Max_Lenght}
              />
            </div>
            <div className="error">
              <p>{error}</p>
            </div>
            <div className="emoji-limti">
              <div
                className="emoji-btn"
                onClick={() => setShowEmoji(!showEmoji)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                >
                  <path d="M610.24-540q16.76 0 28.26-11.74 11.5-11.73 11.5-28.5 0-16.76-11.74-28.26-11.73-11.5-28.5-11.5-16.76 0-28.26 11.74-11.5 11.73-11.5 28.5 0 16.76 11.74 28.26 11.73 11.5 28.5 11.5Zm-260 0q16.76 0 28.26-11.74 11.5-11.73 11.5-28.5 0-16.76-11.74-28.26-11.73-11.5-28.5-11.5-16.76 0-28.26 11.74-11.5 11.73-11.5 28.5 0 16.76 11.74 28.26 11.73 11.5 28.5 11.5ZM480-292q54 0 100-29.5t70-78.5h-32q-22 37-58.5 58.5T480-320q-43 0-79.5-21.5T342-400h-32q24 49 70 78.5T480-292Zm.17 160q-72.17 0-135.73-27.39-63.56-27.39-110.57-74.35-47.02-46.96-74.44-110.43Q132-407.65 132-479.83q0-72.17 27.39-135.73 27.39-63.56 74.35-110.57 46.96-47.02 110.43-74.44Q407.65-828 479.83-828q72.17 0 135.73 27.39 63.56 27.39 110.57 74.35 47.02 46.96 74.44 110.43Q828-552.35 828-480.17q0 72.17-27.39 135.73-27.39 63.56-74.35 110.57-46.96 47.02-110.43 74.44Q552.35-132 480.17-132ZM480-480Zm0 320q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Z" />
                </svg>
              </div>
              <p className="char-count">{caption.length}/2000</p>

              {showEmoji && (
                <div className="emoji-picker">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
            <div className="location">
              <input
                type="text"
                placeholder="Add Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000000"
              >
                <path d="M480.18-494q24.82 0 42.32-17.68 17.5-17.67 17.5-42.5 0-24.82-17.68-42.32-17.67-17.5-42.5-17.5-24.82 0-42.32 17.68-17.5 17.67-17.5 42.5 0 24.82 17.68 42.32 17.67 17.5 42.5 17.5ZM480-169q110-94 177.5-198.5T725-547q0-110-69.5-182T480-801q-106 0-175.5 72T235-547q0 75 67.5 179.5T480-169Zm0 38Q345-252 276-357t-69-190q0-120 78.5-200.5T480-828q116 0 194.5 80.5T753-547q0 85-69 190T480-131Zm0-423Z" />
              </svg>
            </div>
            <div className="collaborators">
              <input
                type="text"
                placeholder="Add collaborators"
                value={collaborators}
                onChange={(e) => setCollaborators(e.target.value)}
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30px"
                viewBox="0 -960 960 960"
                width="30px"
                fill="#000000"
              >
                <path d="M733-426v-120H613v-28h120v-120h28v120h120v28H761v120h-28Zm-373-86q-44.55 0-76.27-31.72Q252-575.45 252-620t31.73-76.28Q315.45-728 360-728t76.27 31.72Q468-664.55 468-620t-31.73 76.28Q404.55-512 360-512ZM92-232v-52q0-22 13.5-41.5T142-356q55-26 109.5-39T360-408q54 0 108.5 13T578-356q23 11 36.5 30.5T628-284v52H92Zm28-28h480v-24q0-14-9.5-26.5T564-332q-48-23-99.69-35.5Q412.63-380 360-380t-104.31 12.5Q204-355 156-332q-17 9-26.5 21.5T120-284v24Zm240-280q33 0 56.5-23.5T440-620q0-33-23.5-56.5T360-700q-33 0-56.5 23.5T280-620q0 33 23.5 56.5T360-540Zm0-80Zm0 360Z" />
              </svg>
            </div>
            <div
              className="settings"
              onClick={() => {
                SetAdvanced(!Advanced);
              }}
            >
              <p>Advanced Setting</p>
              <i
                className={
                  Advanced ? "fa-solid fa-angle-up " : "fa-solid fa-angle-down"
                }
              ></i>
            </div>
            {Advanced && (
              <div className="Advanced-setting">
                <div className="like-count">
                  <div className="check-button">
                    <p>Hide like and view counts on this post</p>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={hidelike}
                        onChange={() => setHidelike(!hidelike)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="info">
                    Only you will see the total number of likes and views on
                    this post. You can change this later by going to the ···
                    menu at the top of the post. To hide like counts on other
                    people's posts, go to your account settings.
                  </div>
                </div>
                <div className="commenting">
                  <div className="check-button">
                    <p>Turn off commenting</p>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={hidecomment}
                        onChange={() => setHidecomment(!hidecomment)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="info">
                    You can change this later by going to the ··· menu at the
                    top of your post.
                  </div>
                </div>
              </div>
            )}
            <div className="info">
              <p>
                Your thought will be shared with your followers in their feeds
                and can be seen on your profile. It may also appear in places
                such as thoughts, where anyone can see it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
