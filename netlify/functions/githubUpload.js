export const handler = async (event) => {
  try {
    const { file } = JSON.parse(event.body || "{}");
    if (!file) {
      return { statusCode: 400, body: JSON.stringify({ message: "No file received" }) };
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH;
    const token = process.env.GITHUB_TOKEN;

    // ✅ CORRECT PATH
    const filePath = "public/menu.pdf";

    // 1️⃣ Get existing file SHA (if exists)
    const infoRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        headers: {
          Authorization: `token ${token}`,
          "User-Agent": "netlify-function"
        }
      }
    );

    let sha;
    if (infoRes.status === 200) {
      const info = await infoRes.json();
      sha = info.sha;
    }

    // 2️⃣ Create or update file
    const uploadRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "netlify-function"
        },
        body: JSON.stringify({
          message: "Update public/menu.pdf via Netlify",
          content: file,
          branch,
          ...(sha && { sha })
        })
      }
    );

    const result = await uploadRes.json();

    if (!uploadRes.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "GitHub upload failed", details: result })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "PDF updated successfully ✅",
        commit: result.commit?.html_url
      })
    };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: e.message }) };
  }
};
