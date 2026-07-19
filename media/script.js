const feedUrl = "insta.json";
const container = document.getElementById("instagram-feed");

fetch(feedUrl)
  .then(res => res.json())
  .then(data => {
    if (!data.items) {
      container.innerHTML = "<p>Unable to load Instagram feed.</p>";
      return;
    }

    data.items.forEach(item => {
      const post = document.createElement("div");
      post.className = "insta-post";

      // Try to get media URL
      let mediaUrl = null;
      if (item.enclosure && item.enclosure.url) {
        mediaUrl = item.enclosure.url;
      } else if (item.image) {
        mediaUrl = item.image;
      }

      // Caption
      const caption = document.createElement("p");
      caption.textContent = item.title || "";

      // If media found
      if (mediaUrl) {
        // Check if it's a video
        if (mediaUrl.match(/\.(mp4|webm|ogg)$/i)) {
          const video = document.createElement("video");
          video.src = mediaUrl;
          video.controls = true;
          video.width = 320;
          video.height = 240;
          post.appendChild(video);
        } else {
          // Proxy images via images.weserv.nl
          const proxyUrl =
            "https://images.weserv.nl/?url=" +
            encodeURIComponent(mediaUrl.replace(/^https?:\/\//, ""));
          const img = document.createElement("img");
          img.src = proxyUrl;
          img.alt = caption.textContent || "Instagram image";
          post.appendChild(img);
        }
      }

      post.appendChild(caption);
      container.appendChild(post);
    });
  })
  .catch(err => {
    console.error("Error fetching feed:", err);
    container.innerHTML = "<p>Failed to load Instagram feed.</p>";
  });
