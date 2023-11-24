import "./profileModal.css";
import { useContext, useRef, useState } from "react";
import axios from "axios";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../../firebaseConfig.js";
import { AuthContext } from "../../context/AuthContext.js";

//* Components
import Loader from "../loader/Loader.jsx";

//* Import Material Icons
import { ClearRounded } from "@mui/icons-material";

export default function ProfileModal({ user, setIsProfileModalOpen }) {
  const { _id, profilePicture, coverPicture, desc, city, from, relationship } = user;
  const [isUploading, setIsUploading] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(null);
  const bioDescription = useRef();
  const currentTown = useRef();
  const currentCountry = useRef();
  const homeTown = useRef();
  const homeCountry = useRef();
  const relationShip = useRef();
  const [missingField, setMissingField] = useState("");
  const { dispatch } = useContext(AuthContext);

  const homeCity = from?.split(",");
  const currentCity = city?.split(",");

  const convertImagesInToFirebaseStorageURL = ({ type }, picture) => {
    setIsUploading(true);
    if (picture) {
      const metadata = {
        contentType: "image/jpeg",
      };

      // Upload file and metadata to the object 'images/example.jpg'
      const storageRef = ref(storage, "Profile-Images/" + picture.name);
      const uploadTask = uploadBytesResumable(storageRef, picture, metadata);

      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              console.log("Upload is done");
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              console.log("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              console.log("User canceled the upload");
              break;
            case "storage/unknown":
              console.log("Unknown error occurred, inspect error.serverResponse");
              break;
            default:
              console.log(error.message);
              break;
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            if (type === "PROFILE_PIC") {
              setProfilePicUrl(downloadURL);
              setIsUploading(false);
            } else if (type === "COVER_PIC") {
              setCoverPhotoUrl(downloadURL);
              setIsUploading(false);
            }
          });
        }
      );
    }
  };

  // Edit Profile Handler
  const editProfileHandler = async () => {
    if (
      profilePicUrl ||
      coverPhotoUrl ||
      bioDescription.current.value ||
      currentTown.current.value ||
      currentCountry.current.value ||
      homeTown.current.value ||
      homeCountry.current.value ||
      relationShip.current.value
    ) {
      if (
        (currentTown.current.value && currentCountry.current.value) ||
        (!currentTown.current.value && !currentCountry.current.value)
      ) {
        if (
          (homeTown.current.value && homeCountry.current.value) ||
          (!homeTown.current.value && !homeCountry.current.value)
        ) {
          setIsEditProfile(true);
          setIsUploading(true);

          // Current Town and Current Country
          const currentLocation = currentTown.current.value
            ? `${
                currentTown.current.value.trim().charAt(0).toUpperCase() +
                currentTown.current.value.trim().slice(1)
              }, ${
                currentCountry.current.value.trim().charAt(0).toUpperCase() +
                currentCountry.current.value.trim().slice(1).toUpperCase()
              }`
            : "";

          // Home Town and Home Country
          const homeLocation = homeTown.current.value
            ? `${
                homeTown.current.value.trim().charAt(0).toUpperCase() +
                homeTown.current.value.trim().slice(1)
              }, ${
                homeCountry.current.value.trim().charAt(0).toUpperCase() +
                homeCountry.current.value.trim().slice(1).toUpperCase()
              }`
            : "";

          const updateProfile = {
            userId: _id,
            profilePicture: profilePicUrl || profilePicture,
            coverPicture: coverPhotoUrl || coverPicture,
            desc: bioDescription.current.value.trim(),
            city: currentLocation,
            from: homeLocation,
            relationship: relationShip.current.value,
          };

          try {
            localStorage.removeItem("loggedInUser");

            await axios.put(`/user/${_id}`, updateProfile);
            dispatch({ type: "UPDATE_PROFILE", payload: { ...user, ...updateProfile } });
          } catch (error) {
            console.error(`Something went wrong on edit profile ${error}`);
          }

          setIsUploading(false);
          setIsEditProfile(false);
          setIsProfileModalOpen(false);
        } else {
          setMissingField(
            !homeTown.current.value ? "homeTownIsEmpty" : "homeCountryIsEmpty"
          );
          alert("Warning! missing field in a Home Location.");
        }
      } else {
        setMissingField(
          !currentTown.current.value ? "currentTownIsEmpty" : "currentCountryIsEmpty"
        );
        alert("Warning! missing field in a Current Location.");
      }
    } else {
      console.log("No edit profile");
    }
  };

  return (
    <div className="modalOverlay">
      <div className="profileModal">
        {isUploading && (
          <div className="uploadingArea">
            <Loader />
            <span>{isEditProfile ? "Saving" : "Uploading"} ...</span>
          </div>
        )}

        <header className="prflModalHeader">
          <h2>Edit Profile</h2>
          <button className="closePrflModalBtn">
            <ClearRounded
              className="closeIcon"
              onClick={() => setIsProfileModalOpen(false)}
            />
          </button>
        </header>

        <div className="prflModalMiddle">
          <section className="profilePicSection">
            <div className="profilePicSecTop">
              <h3 className="sectionHd">Profile Picture</h3>

              <span className="uploadPic">
                <label htmlFor="profilePic">Edit</label>
                <input
                  type="file"
                  name="ProfilePic"
                  id="profilePic"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    convertImagesInToFirebaseStorageURL(
                      { type: "PROFILE_PIC" },
                      e.target.files[0]
                    );
                  }}
                />
              </span>
            </div>

            <div className="profilePicSecBottom">
              <img
                className="profilePicDisplay"
                src={
                  profilePicUrl
                    ? profilePicUrl
                    : profilePicture || "/assets/no-profile-image.jpg"
                }
                alt="ProfilePic"
              />
            </div>
          </section>

          <section className="coverPicSection">
            <div className="coverPicSecTop">
              <h3 className="sectionHd">Cover Picture</h3>

              <span className="uploadPic">
                <label htmlFor="coverPic">Edit</label>
                <input
                  type="file"
                  name="coverPic"
                  id="coverPic"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    convertImagesInToFirebaseStorageURL(
                      { type: "COVER_PIC" },
                      e.target.files[0]
                    );
                  }}
                />
              </span>
            </div>

            <div className="coverPicSecBottom">
              <img
                className="coverPicDisplay"
                src={
                  coverPhotoUrl
                    ? coverPhotoUrl
                    : coverPicture || "/assets/no-cover-image.jpg"
                }
                alt="CoverPic"
              />
            </div>
          </section>

          <section className="bioSection">
            <div className="bioSecTop">
              <h3 className="sectionHd">Bio</h3>
            </div>

            <div className="bioSecBottom">
              <textarea
                name="Bio"
                className="descTextArea"
                defaultValue={desc || ""}
                ref={bioDescription}
                placeholder="Describe Yourself..."></textarea>
            </div>
          </section>

          <section className="introSection">
            <div className="introSecTop">
              <h3 className="sectionHd">Customize Your Intro</h3>
            </div>

            <div className="introSecBottom">
              <div className="currentLocation">
                <div className="cityField">
                  <label htmlFor="currentTown">Current Town</label>
                  <input
                    type="text"
                    name="CurrentTown"
                    id="currentTown"
                    defaultValue={currentCity?.[0] || ""}
                    placeholder="Enter Here"
                    ref={currentTown}
                    onChange={() => setMissingField("")}
                    style={
                      missingField === "currentTownIsEmpty"
                        ? { border: "2px solid #b60000" }
                        : { border: "2px solid #555" }
                    }
                  />
                </div>

                <div className="countryField">
                  <label htmlFor="currentCountry">Current Country</label>
                  <input
                    type="text"
                    name="CurrentCountry"
                    id="currentCountry"
                    defaultValue={currentCity?.[1]?.trim() || ""}
                    placeholder="Enter Here"
                    ref={currentCountry}
                    onChange={() => setMissingField("")}
                    style={
                      missingField === "currentCountryIsEmpty"
                        ? { border: "2px solid #b60000" }
                        : { border: "2px solid #555" }
                    }
                  />
                </div>
              </div>

              <div className="homeTown">
                <div className="cityField">
                  <label htmlFor="homeTown">Home Town</label>
                  <input
                    type="text"
                    name="HomeTown"
                    id="homeTown"
                    defaultValue={homeCity?.[0] || ""}
                    placeholder="Enter Here"
                    ref={homeTown}
                    onChange={() => setMissingField("")}
                    style={
                      missingField === "homeTownIsEmpty"
                        ? { border: "2px solid #b60000" }
                        : { border: "2px solid #555" }
                    }
                  />
                </div>

                <div className="countryField">
                  <label htmlFor="homeCountry">Home Country</label>
                  <input
                    type="text"
                    name="HomeCountry"
                    id="homeCountry"
                    defaultValue={homeCity?.[1]?.trim() || ""}
                    placeholder="Enter Here"
                    ref={homeCountry}
                    onChange={() => setMissingField("")}
                    style={
                      missingField === "homeCountryIsEmpty"
                        ? { border: "2px solid #b60000" }
                        : { border: "2px solid #555" }
                    }
                  />
                </div>
              </div>

              <div className="relationship">
                <span>Relationship</span>
                <select
                  name="relationship"
                  id="relationship"
                  defaultValue={relationship}
                  ref={relationShip}>
                  <option value="">Status</option>
                  <option value="Single">Single</option>
                  <option value="In a Relationship">In a Relationship</option>
                  <option value="Engaged">Engaged</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        <footer className="prflModalFooter">
          <button
            className="closePrflModalBtn"
            onClick={() => setIsProfileModalOpen(false)}>
            Close
          </button>
          <button className="editProfileBtn" onClick={editProfileHandler}>
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
}
