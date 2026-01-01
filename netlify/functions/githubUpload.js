export const handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Empty request body" })
      };
    }

    const { file } = JSON.parse(event.body);

    if (!file || file.length < 1000) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid or empty Base64 file" })
      };
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH;
    const token = process.env.GITHUB_TOKEN;

    /* 1️⃣ Get current file SHA */
    const infoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/menu.pdf`,
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "netlify-function"
        }
      }
    );

    const info = await infoRes.json();

    if (!info.sha) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to read existing file SHA" })
      };
    }

    /* 2️⃣ Upload new file */
    const uploadRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/menu.pdf`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "netlify-function"
        },
        body: JSON.stringify({
          message: "Update menu.pdf via Netlify",
          content: file,
          sha: info.sha,
          branch
        })
      }
    );

    const uploadResult = await uploadRes.json();

    if (!uploadRes.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "GitHub upload failed",
          details: uploadResult
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "PDF updated successfully ✅",
        commit: uploadResult.commit?.html_url
      })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message })
    };
  }
};
