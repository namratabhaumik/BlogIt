import React, { useEffect, useState, useContext } from "react";
import { Form, Button, Card, Badge } from "react-bootstrap";
import ReactQuill from "react-quill";
import { ToastContainer, toast } from "react-toastify";
import CreatePostNavbar from "../Navbar/CreatePostNavbar";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CurrentUserDataContext } from "../../App";
import "react-quill/dist/quill.snow.css";
import "react-toastify/dist/ReactToastify.css";
import "./ComposeBlogPost.css";
import "../common.css";
import { createBlogPost, getMaxId } from "../../api/Blog";
import { useNavigate, useLocation } from "react-router-dom";

function ComposeBlog() {
  const [value, setValue] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagError, setTagError] = useState("");
  const { currentUserData } = useContext(CurrentUserDataContext);
  const navigate = useNavigate();
  const location = useLocation();
  const communityId = new URLSearchParams(location.search).get("community_id");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    document.title = "Compose Blog Post";
  }, []);

  const removeImage = () => {
    setSelectedImageFile(null);
    setSelectedImagePreview(null);
  };

  const handleSuccess = () => {
    toast.success("Post uploaded successfully");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const handleError = () => {
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

    if (!value.trim() || value === "<p><br></p>") {
      setContentError("Content cannot be blank or contain only spaces.");
      hasError = true;
    } else {
      setContentError("");
    }

    if (!hasError) {
      try {
        let imageURL = "";
        const maxId = await getMaxId();

        if (selectedImageFile) {
          const imageRef = ref(
            storage,
            `images/blogs/${selectedImageFile.name}`
          );
          await uploadBytes(imageRef, selectedImageFile);
          imageURL = await getDownloadURL(imageRef);
        }

        const postContent = value;

        console.log("Author id is: " , currentUserData.id)
        // TODO: Need to add community ID
        createBlogPost(
          maxId + 1,
          title,
          currentUserData.id,
          selectedTags,
          imageURL,
          postContent,
          communityId,
          handleSuccess,
          handleError
        );
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

    if (!value.trim() || value === "<p><br></p>") {
      setContentError("Content cannot be blank or contain only spaces.");
      hasError = true;
    } else {
      setContentError("");
    }

    if (!hasError) {
      toast.success("Blog Post Saved Successfully");
      console.log("Saving post...");
    }
  };

  const handleTagsChange = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newTag = event.target.value.trim();

      if (newTag !== "") {
        if (newTag.length > 15) {
          setTagError("Tag cannot exceed 15 characters.");
        } else {
          setSelectedTags([...selectedTags, newTag]);
          setTagError("");
          event.target.value = "";
        }
      }
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setSelectedTags((prevTags) =>
      prevTags.filter((tag) => tag !== tagToDelete)
    );
  };

  return (
    <div className="compose-blog-post-container">
      <CreatePostNavbar />
      <Card className="title-card">
        <Card.Body>
          <Form className="post-form">
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              variant="outline-primary"
              className="cover-btn"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Add a cover image
            </Button>
            {selectedImageFile && (
              <div className="image-container">
                <img
                  src={selectedImagePreview}
                  alt="Selected"
                  className="thumbnail"
                />
                <div>
                  <Button
                    variant="danger"
                    style={{ margin: "10px" }}
                    onClick={removeImage}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}
            <Form.Control
              className="blog-title-form"
              style={{ fontWeight: "bold" }}
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

            <Form.Group controlId="formTags" className="mt-3">
              <Form.Control
                type="text"
                placeholder="Add a tag and press Enter"
                onKeyDown={handleTagsChange}
                className={`custom-tag-input ${tagError ? "input-error" : ""}`}
              />
              {tagError && <div className="tag-error-message">{tagError}</div>}
              <div className="mt-2">
                {selectedTags.map((tag, index) => (
                  <Badge
                    key={index}
                    pill
                    className="badge-style custom-tag-badge"
                    onClick={() => handleTagDelete(tag)}
                    style={{
                      padding: "10px 15px",
                      fontSize: "1.1rem",
                      borderRadius: "12px",
                      border: "1px solid #383F51",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    {tag} &times;
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <ReactQuill
              className="editor"
              theme="snow"
              value={value}
              onChange={setValue}
              placeholder="Write your post content here..."
            />
            {contentError && (
              <div className="error-message">{contentError}</div>
            )}
            <div className="button-container">
              <Button
                variant="outline-primary"
                className="publish-btn"
                onClick={handlePublish}
              >
                Publish
              </Button>
              <Button
                variant="outline-primary"
                className="save-draft-btn"
                onClick={handleSaveDraft}
              >
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

export default ComposeBlog;
