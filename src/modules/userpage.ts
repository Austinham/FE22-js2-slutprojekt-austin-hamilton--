const url: string = `https://login-2c7ee-default-rtdb.europe-west1.firebasedatabase.app/`;
const loggedInUserJSON: string | null = localStorage.getItem("loggedInUser");
const loggedInUser = loggedInUserJSON ? JSON.parse(loggedInUserJSON) : null;
const newUrl = loggedInUser ? `${url}users/${loggedInUser.id}.json` : null;
console.log(loggedInUser.id);

console.log(loggedInUser.username, "2");

const postButton = document.querySelector("#post-button") as HTMLButtonElement;
const deleteUserBtn = document.querySelector(
  "#dele-button"
) as HTMLButtonElement;
const postInput = document.querySelector("#status") as HTMLInputElement;
const container = document.querySelector("#container") as HTMLDivElement;
const textContent = document.querySelector("#content") as HTMLDivElement;
const post = document.querySelector("#post") as HTMLDivElement;

postButton.addEventListener("click", updatePost); // add event listener to call updatePost() function

deleteUserBtn.addEventListener("click", () => {
  
  if (newUrl) {
    const init = {
      method: "DELETE",
    };
    fetch(newUrl, init)
      .then((response) => {
        console.log(response.status);
        localStorage.clear();
        location.assign("../index.html"); // reload the page to clear data and redirect to login page
      })
      .catch((error) => {
        console.log(`Error deleting user account: ${error}`);
        alert("Error deleting user account. Please try again later.");
      });
  }
});
async function updatePost(e: Event): Promise<void> {
  e.preventDefault();

  const writemessage: string = postInput.value;
  console.log(writemessage);

  if (loggedInUser && loggedInUser.id) {
    const newUrl = `${url}users/${loggedInUser.id}.json`;
    const response = await fetch(newUrl);
    const userData = (await response.json()) as { posts?: string[] };
    console.log(userData, "posts");

    if (userData !== null && userData.posts !== undefined) {
      userData.posts.push(writemessage);
    } else if (userData !== null) {
      userData.posts = [writemessage];
    } else {
      // handle case where userData is null or undefined
    }

    const init = {
      method: "PATCH",
      body: JSON.stringify(userData),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };

    const updateResponse = await fetch(newUrl, init);
    const dataFromPost = (await updateResponse.json()) as { posts?: string[] };
    console.log(dataFromPost, "hello ew world!");
  }
  await fetchData();
  
}

// displaying the posts
async function fetchData(): Promise<void> {
  if (loggedInUser && loggedInUser.id) {
    const usersUrl = `${url}users.json`;
    try {
      const response = await fetch(usersUrl);
      const data = await response.json();

      if (data) {
        const user = data[loggedInUser.id];
        if (user && user.posts) {
          const userPosts = user.posts
            .map((post) => `<p><strong>You:</strong> ${post}</p>`)
            .join("");
          post.innerHTML = userPosts;
        } else {
          console.log(`Error: no posts found for user ${loggedInUser.id}.`);
        }
      } else {
        console.log("Error: data is null or undefined.");
      }
    } catch (error) {
      console.log(`Error fetching data from ${usersUrl}: ${error}`);
    }
  }
}
fetchData();

async function fetchingAlldata() {
  const newUrl = `${url}users.json`;
  const response = await fetch(newUrl);
  const showDataFromProfile = await response.json() as Record<string, User>;
  showOtherProfiles(showDataFromProfile);
  console.log(showDataFromProfile);
}
fetchingAlldata();
interface UserProfile {
  username: string;
  password: string;
  image: string;
  posts?: string[];
}

function showOtherProfiles(showDataFromProfile: Record<string, UserProfile>) {
  const keysfromUsernameData = Object.keys(showDataFromProfile);
  const objectFromUsernameData = Object.values(showDataFromProfile);

  const modal = document.getElementById("myModal") as HTMLDivElement;
  const modalContent = document.getElementById("modal-content") as HTMLDivElement;
  const closeBtn = document.getElementsByClassName("close")[0];
  

  for (let i = 0; i < objectFromUsernameData.length; i++) {
    const userProfile = objectFromUsernameData[i];
    const usernameProfile = document.createElement('h4');
    const postsProfile = document.createElement('h4');
    const imageProfile = document.createElement('img'); // create image element
    document.body.appendChild(usernameProfile);
    document.body.appendChild(postsProfile);
    usernameProfile.innerText = userProfile.username;
    imageProfile.src = userProfile.image; // set the image URL

    usernameProfile.addEventListener('click', () => {
      const latestPost = userProfile.posts && userProfile.posts.length > 0 ? userProfile.posts[userProfile.posts.length - 1] : '';
      const listFromData: UserProfile & { id: string, latestPost: string } = { ...userProfile, id: keysfromUsernameData[i], latestPost };
      console.log(listFromData);
      localStorage.setItem('loggedInUser', JSON.stringify(listFromData));
      modalContent.innerHTML = "";
      const usernameWithLatestPost = document.createElement('p');
      usernameWithLatestPost.innerText = `${userProfile.username} - Latest Post: ${latestPost}`;
      modalContent.appendChild(usernameWithLatestPost);
      modalContent.appendChild(imageProfile); // append the image element to the modal content
      modal.style.display = "block";
    });
  }

  closeBtn.addEventListener('click', () => {
    modal.style.display = "none";
  });
}




interface User {
  username: string;
  password: string;
  image: string;
}

if (loggedInUserJSON) {
  const loggedInUser: User = JSON.parse(loggedInUserJSON);
  const username = loggedInUser.username;
  const image = loggedInUser.image;
  
  const usernameElement = document.querySelector("#name") as HTMLElement;

  console.log(usernameElement)
  const imageElement = document.querySelector("#images") as HTMLImageElement;

  usernameElement.textContent = username;
  imageElement.src = image;
  console.log(username, "hello");
} else {
  // handle case where loggedInUserJSON is null or undefined
}

