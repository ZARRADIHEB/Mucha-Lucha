import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import Loader from "../common/Loading";

// Remove background function
const removeBg = async (imageFile) => {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_file", imageFile);

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": "sioXE4EPwUeMdwJMnTcXCWiF",
    },
    body: formData,
  });

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    return new Blob([buffer], { type: "image/png" });
  } else {
    throw new Error("Error removing background");
  }
};

const ProductImageUpload = ({
  imageFile,
  setImageFile,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
}) => {
  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setImageFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    const uploadImageToCloudinary = async () => {
      if (!imageFile) return;

      setImageLoadingState(true);
      try {
        const noBgImageBlob = await removeBg(imageFile);

        const formData = new FormData();
        formData.append("file", noBgImageBlob);
        formData.append("upload_preset", "Mucha_Lucha");

        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dwrfpjbmo/image/upload",
          formData
        );

        const cloudinaryUrl = cloudinaryResponse.data.secure_url;

        if (cloudinaryUrl) {
          setUploadedImageUrl(cloudinaryUrl);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageLoadingState(false);
      }
    };

    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile, setImageLoadingState, setUploadedImageUrl]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 mt-2 block">
        Upload Image
      </Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-40" : ""
        } border-2 border-dashed rounded-lg p-4 relative`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Loader height="100%" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="size-8 text-primary mr-2" />
            </div>
            <p className="text-sm font-medium">{imageFile.name}</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleRemoveImage}
            >
              <XIcon className="size-4" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

ProductImageUpload.propTypes = {
  imageFile: PropTypes.object,
  setImageFile: PropTypes.func.isRequired,
  setImageLoadingState: PropTypes.func.isRequired,
  imageLoadingState: PropTypes.bool.isRequired,
  setUploadedImageUrl: PropTypes.func,
  isEditMode: PropTypes.bool.isRequired,
};

export default ProductImageUpload;
