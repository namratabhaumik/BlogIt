import { useContext, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ReactQuill from 'react-quill';
import { Autocomplete, TextField, Chip } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import CreatePostNavbar from '../Navbar/CreatePostNavbar';
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createVideoPost, getMaxId } from '../../api/Video';
import 'react-quill/dist/quill.snow.css';
import "react-toastify/dist/ReactToastify.css";
import './ComposeVideoPost.css';
import '../common.css';
import { useNavigate } from 'react-router-dom';
import { CurrentUserDataContext } from '../../App';

function ComposeVideo() {
  const [value, setValue] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [videoDuration, setVideoDuration] = useState("");
  const [thumbnailBlob, setThumbnailBlob] = useState(null);

  const { currentUserData } = useContext(CurrentUserDataContext);

  // TODO: Get tags from Mongo
  const tags = ["web", "java", "react", "android", "programming", "blogging"];

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedVideo(file);
  
    const videoElement = document.createElement('video');
    videoElement.preload = 'metadata';
    
    const videoBlobUrl = URL.createObjectURL(file);
    videoElement.src = videoBlobUrl;
  
    videoElement.onloadedmetadata = function () {
      const duration = videoElement.duration;
      
      const minutes = Math.floor(duration.toFixed(2) / 60);
      const seconds = Math.floor(duration.toFixed(2) % 60);

      setVideoDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      videoElement.currentTime = 1;
    };
  
    videoElement.onseeked = function () {
      if (videoElement.readyState >= 2) {
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
        canvas.toBlob((blob) => {
          if (blob) {
            setThumbnailBlob(blob);
            URL.revokeObjectURL(videoBlobUrl);
          } else {
            console.error("Failed to create thumbnail blob.");
          }
        }, 'image/jpeg');
      }
    };
  
    videoElement.onerror = function (error) {
      console.error("Error loading video: ", error);
    };
  };

  const removeVideo = () => {
    setSelectedVideo(null);
  };

  const handleSuccess = (response) => {
    toast.success("Post uploaded successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleError = (error) => {
    toast.error("Error uploading post");
  };

  const handlePublish = async () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleError("Title cannot be blank or contain only spaces.");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!value.trim() || value === '<p><br></p>') {
      setContentError("Content cannot be blank or contain only spaces.");
      hasError = true;
    } else {
      setContentError("");
    }

    if (!hasError) {
      try {
        let videoURL = '';
        let thumbnailURL = '';
        let maxId = 0;

        await getMaxId(
          (id) => {
            maxId = id;
          },
          (error) => {
            console.error("Error fetching max ID: ", error);
          }
        );

        if (selectedVideo) {
          const videoRef = ref(storage, `videos/${selectedVideo.name}`);
          await uploadBytes(videoRef, selectedVideo);
          videoURL = await getDownloadURL(videoRef);

          if (thumbnailBlob) {
            const thumbnailRef = ref(storage, `thumbnails/${selectedVideo.name}.jpg`);
            await uploadBytes(thumbnailRef, thumbnailBlob);
            thumbnailURL = await getDownloadURL(thumbnailRef);
          }
        }

        const postContent = value;

        // TODO: Hardcoded community ID needs to be replaced with actual value
        createVideoPost(maxId + 1, videoURL, title, currentUserData.id, selectedTags, videoDuration, thumbnailURL, postContent, 0, handleSuccess, handleError);
      } catch (error) {
        console.error("Error uploading post: ", error);
        handleError(error);
      }
    }
  };

  const handleSaveDraft = () => {
    let hasError = false;

    if (!title.trim()) {
      setTitleError("Title cannot be blank or contain only spaces.");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!value.trim() || value === '<p><br></p>') {
      setContentError("Content cannot be blank or contain only spaces.");
      hasError = true;
    } else {
      setContentError("");
    }

    if (!hasError) {
      // Save the draft
      toast.success("Video Post Saved Successfully");
      console.log("Saving draft...");
    }
  };

  const handleTagsChange = (event, newValue) => {
    if (!Array.isArray(newValue)) {
      newValue = [newValue];
    }
    const formattedTags = newValue.map(tag => tag.startsWith('#') ? tag : `#${tag}`);
    setSelectedTags(formattedTags);
  };

  return (
    <div className="compose-blog-post-container">
      <CreatePostNavbar />
      <Card className="title-card">
        <Card.Body>
          <Form className="post-form">
            <input
              type="file"
              accept="video/*"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="outline-primary"
              className="cover-btn"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Add a cover video
            </Button>
            {selectedVideo && (
              <div className="video-container">
                <video src={URL.createObjectURL(selectedVideo)} controls className="thumbnail" />
                <div>
                  <Button variant="danger" style={{ margin: "10px" }} onClick={removeVideo}>Remove</Button>
                  <Button variant="secondary" onClick={() => document.getElementById('fileInput').click()}>Change</Button>
                </div>
              </div>
            )}
            <Form.Control
              className="title-form"
              style={{ fontWeight: 'bold' }}
              size="lg"
              type="text"
              placeholder="New post title here..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              isInvalid={!!titleError}
            />
            <Form.Control.Feedback type="invalid">
              {titleError}
            </Form.Control.Feedback>

            <Autocomplete
              id="tags-autocomplete"
              freeSolo
              multiple
              options={tags.map((option) => `#${option}`)}
              value={selectedTags}
              onChange={handleTagsChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    key={index}
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Add a tag here..."
                  fullWidth
                />
              )}
              sx={{
                width: "100%",
                marginBottom: "10px",
                '& .MuiAutocomplete-listbox': {
                  bgcolor: '#DDDBF1',
                },
              }}
            />

            <ReactQuill
              className="editor"
              theme="snow"
              value={value}
              onChange={setValue}
              placeholder="Write your post content here..."
            />
            {contentError && <div className="error-message">{contentError}</div>}
            <div className="button-container">
              <Button variant="outline-primary" className="publish-btn" onClick={handlePublish}>
                Publish
              </Button>
              <Button variant="outline-primary" className="save-draft-btn" onClick={handleSaveDraft}>
                Save Draft
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
      <ToastContainer />
    </div>
  );
}

export default ComposeVideo;
