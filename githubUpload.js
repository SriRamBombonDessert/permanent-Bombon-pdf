export const handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const file = body.file;

    if (!file) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No file received" })
      };
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH;
    const token = process.env.GITHUB_TOKEN;

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

    await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/menu.pdf`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
          "User-Agent": "netlify-function"
        },
        body: JSON.stringify({
          message: "Update menu.pdf",
          content: file,
          sha: info.sha,
          branch
        })
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "PDF updated successfully ✅" })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: e.message })
    };
  }
};
