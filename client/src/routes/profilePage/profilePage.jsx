import { Suspense, useContext, useState } from "react";
import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import apiRequest from "../../lib/apiRequest";
import "./profilePage.scss";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest.post("/auth/logout");
      updateUser(null);
      console.log(res.data);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    navigate("/add");
  };

  const data = useLoaderData();

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button disabled={isLoading} onClick={handleLogout}>
              Logout
            </button>
            {error && <span>{error}</span>}
          </div>
          <div className="title">
            <h1>My List</h1>
            <button onClick={handleClick}>Create New Post</button>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Saved List</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading saved posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
