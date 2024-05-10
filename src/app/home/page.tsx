"use client";
import "../fbLayout.css";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Homes() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [posts, setPosts] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<number[]>([]);
  const [newlikeCounts, setNewLikeCounts] = useState<number[]>([]);
  const [commentInputs, setCommentInputs] = useState<string[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string[] }>({}) // Define comments state
  const [showCommentSection, setShowCommentSection] = useState<boolean[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const res = await fetch("/api/render-profile-photo", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setImageUrl(data.photo);
          console.log(data);
        }
      } catch(error) {
        console.log(error);
      }
    }
    fetchUrl();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/render-posts", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        console.log("Post data is: ", data);
        const postUrl = data.photourl;
        setPosts(postUrl);
        console.log("Posts is : ", posts);
        setLikeCounts(new Array(data.photourl.length).fill(0));
      } else {
        console.log("Post not found");
      }
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('/api/verify');
        if (response.ok) {
          const data = await response.json();
          setUserName(data.username);
        } else {
          alert("Session timeout! Please Login again.");
          router.push("/");
          throw new Error('Failed to fetch userName');
        }
      } catch (error) {
        console.error('Error fetching userName:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleCommentInput = (index, event) => {
    const { value } = event.target;
    const newCommentInputs = [...commentInputs];
    newCommentInputs[index] = value;
    setCommentInputs(newCommentInputs);
  };

  const handleCommentSubmission = async (index) => {
    const pID = index + 1;
    const comment = commentInputs[index];
    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ pID, comment }),
      });
      if (response.ok) {
        // Update comment count locally
        const newCommentCounts = [...commentCounts];
        newCommentCounts[index] = (commentCounts[index] || 0) + 1;
        setCommentCounts(newCommentCounts);
        // Clear comment input
        const newCommentInputs = [...commentInputs];
        newCommentInputs[index] = '';
        setCommentInputs(newCommentInputs);
      } else {
        console.error('Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data is : ", data);
        console.log("Image url is : ", data.imageUrl);
        setImageUrl(data.imageUrl);
      } else {
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };
  
  const handlePostUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch('/api/upload-post', {
        method: 'POST',
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prevPosts => [...prevPosts, data.imageUrl]);
      } else {
        throw new Error('Failed to upload image to Cloudinary');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleDeletePost = async (index: number) => {
    const pID = index + 1;
    const res = await fetch("/api/delete-post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({pID}),
      credentials: "include",
    });

    if (res.ok) {
      alert("Post Deleted successfully!!")
      router.push("/home");
    }

    else {
      alert("Some issue deleting the post");
    }
  }

  const handleLikePost = async (index: number) => {
    const pID = index + 1;
    const newLikeCounts = [...likeCounts];

    if (newLikeCounts[index] === 0) {
      newLikeCounts[index]++;
    } else {
      newLikeCounts[index]--;
    }

    setLikeCounts(newLikeCounts);

    try {
      const res = await fetch("/api/update-like-count", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pID, likeCount: newLikeCounts[index]}),
        credentials: "include",
      });
  
      if (!res.ok) {
        console.error("Failed to update like count");
      }
    } catch (error) {
      console.error("Error updating like count:", error);
    }
  };

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmission = () => {
    if (searchQuery.trim() !== '') {
      // Update URL and navigate to search results page
      router.push(`/home/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (res.status === 302) {
        const data = await res.json();
        alert(data.message);
        router.push("/");
      }
      else {
        console.log("Not Ok");
      }
    } catch (error) {
      console.log(error, "Error logging out :<");
    }
  }

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await fetch("/api/render-likes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ user: "Hello" }),
        });
        if (res.ok) {
          const data = await res.json();
          const likes = data.likes;
          const newLikeCounts = Array.from({ length: 1000 }, () => 0);
  
          likes.forEach(like => {
            const index = like.pID - 1;
            if (index >= 0 && index < newLikeCounts.length) {
              newLikeCounts[index] = parseInt(like.likeCount);
            }
          });
  
          setNewLikeCounts(newLikeCounts);
          setLikeCounts(prevLikeCounts => {
            console.log("likeCounts is updated:", newLikeCounts);
            return newLikeCounts;
          });
        } else {
          console.log("Failed to fetch likes");
        }
      } catch (error) {
        console.log("Error fetching likes:", error);
      }
    };
    
    fetchLikes();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      const res = await fetch("/api/render-comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify("hello"),
      });
      if (res.ok) {
        const data = await res.json();
        console.log("comments data is : ", data);
        console.log("Everything went right");
        const groupedComments: { [key: number]: string[] } = {};
          data.comment.forEach((comment: { pID: number; comment: string }) => {
            if (groupedComments[comment.pID]) {
              groupedComments[comment.pID].push(comment.comment);
            } else {
              groupedComments[comment.pID] = [comment.comment];
            }
          });
          setComments(groupedComments);
      }
      else {
        console.log("Everything didn't went right");
      }
    }
    fetchComments()
  }, []);

  const handleToggleCommentSection = (index: number) => {
    const newShowCommentSection = [...showCommentSection];
    newShowCommentSection[index] = !newShowCommentSection[index];
    setShowCommentSection(newShowCommentSection);
  };

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>(20+) Facebook</title>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <link rel="stylesheet" href="fbLayout.css" />
      <div className="navbarContainer">
        <nav className="navbar">
          <ul className="navbarUl">
            <div className="firstPartNav">
              <li>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXoMFtNYy-gfuvVnQkKSiDAmfYt0ynmaGz55WPNbUPZw&s" alt="facebookImage"/>
              </li>
              <li>
                <label className="search">
                  <span className="searchIcon">
                    <span className="material-symbols-outlined">search</span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Search Facebook"
                    />
                    <button onClick={handleSearchSubmission}>Search</button>
                  </span>
                </label>
              </li>
            </div>
            <div className="secondPartNav">
              <li>
                <span className="material-symbols-outlined">home</span>
              </li>
              <li>
                <span className="material-symbols-outlined">slideshow</span>
              </li>
              <li>
                <span className="material-symbols-outlined">storefront</span>
              </li>
              <li>
                <span className="material-symbols-outlined">groups</span>
              </li>
            </div>
            <div className="thirdPartNav">
              <div className="iconCircles">
                <li>
                  <span className="material-symbols-outlined">menu</span>
                </li>
              </div>
              <div className="iconCircles">
                <li>
                  <span className="material-symbols-outlined">maps_ugc</span>
                </li>
              </div>
              <div className="iconCircles">
                <li>
                  <span className="material-symbols-outlined">notifications</span>
                </li>
              </div>
              <div className="iconCircles">
                <div className="dropdown">
                  <button className="dropbtn"> {/* Button to toggle the dropdown */}
                    {imageUrl && <Image className="iconCircles" src={imageUrl} alt="Profile" width={40} height={40} />}
                    {!imageUrl && <span className="material-symbols-outlined">photo_camera_back</span>}
                  </button>
                  <div className="dropdown-content">
                    <button onClick={() => document.getElementById('fileInput').click()}>Upload Profile Picture</button>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                </div>
                  <input id="fileInput" type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
              </div>
            </div>
          </ul>
        </nav>
      </div>
      <div className="bodyContainer">
        <div className="firstPartContainer">
          <nav className="firstPartContainerNavbar">
            <ul className="firstPartContainerNavbarUl">
              <div className="firstPartContainerNavbardivLi">
                <li>

                  {imageUrl && <Image className="firstPartDp" src={imageUrl} alt="Profile" width={40} height={40} />}
                  {!imageUrl && <span className="firstPartDp material-symbols-outlined">photo_camera_back</span>}

                  <span className="textAfterIcon UserName">{userName}</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <span className="material-symbols-outlined">group</span>
                  <span className="textAfterIcon">Friends</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <span className="material-symbols-outlined">manage_history</span>
                  <span className="textAfterIcon">Memories</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <span className="material-symbols-outlined">bookmark</span>
                  <span className="textAfterIcon">Saved</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <span className="material-symbols-outlined">groups</span>
                  <span className="textAfterIcon">Groups</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <span className="material-symbols-outlined">slideshow</span>
                  <span className="textAfterIcon">Video</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <span className="material-symbols-outlined">storefront</span>
                  <span className="textAfterIcon">Marketplace</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <span className="material-symbols-outlined">
                    photo_camera_back
                  </span>
                  <span className="textAfterIcon">Feed</span>
                </li>
              </div>
              <div className="firstPartContainerNavbardivLi">
                <li>
                  <div className="anotherIconCircles">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                  <span className="textAfterIcon">See more</span>
                </li>
              </div>
            </ul>
          </nav>
        </div>
        <div className="secondPartContainer">
          {posts.length > 0 ? (
            <div className="postContainer">
              {posts.map((postUrl, index) => (
                <div className="posts" key={index}>
                  <div className="postInfos">
                    <div className="postImage">
                      <img src={postUrl} alt="post" />
                    </div>

                    <div className="likeInfoContainer">
                      <div className="LikeInfo">
                        <span className="numberOfLikes">{newlikeCounts[index]}</span>
                        <button type="button" onClick={() => handleLikePost(index)}>
                          <span className="material-symbols-outlined">thumb_up</span>
                        </button>
                      </div>

                      <div className="commentsInfo">
                        <div className="commentButton">
                          <span className="comment">Comment</span>
                          <button type="button"  onClick={() => handleToggleCommentSection(index)}>
                            <span className="material-symbols-outlined">comment</span>
                          </button>
                        </div>
                        {showCommentSection[index] && (
                          <div className="commentsSection">
                            <textarea
                              className="writeAComment"
                              value={commentInputs[index] || ''}
                              onChange={(event) => handleCommentInput(index, event)}
                              placeholder="Write a comment..."
                            />
                            <button onClick={() => handleCommentSubmission(index)}>Post</button>
                            <div className="commentsContainer">
                              <span>Previous Comments</span>
                              {comments[index + 1] && comments[index + 1].map((comment, commentIndex) => (
                                <div className="comment" key={commentIndex}>
                                  {/* Render comment text */}
                                  <span className="commentText">{commentIndex + 1}. {" "} { comment}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="deleteButtonInfo">
                        <span className="Delete">Delete Post</span>
                        <button onClick={() => handleDeletePost(index)} type="button">
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="makePostButton">
                <button onClick={() => document.getElementById('postFileInput').click()}>Make a Post</button>
                <input id="postFileInput" type="file" onChange={handlePostUpload} style={{ display: 'none' }} />
              </div>
            </div>
          ) : (
            <div className="noPosts">
              <p>No posts yet!</p>
              <div className="makePostButton">
                <button onClick={() => document.getElementById('postFileInput').click()}>Make a Post</button>
                <input id="postFileInput" type="file" onChange={handlePostUpload} style={{ display: 'none' }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}