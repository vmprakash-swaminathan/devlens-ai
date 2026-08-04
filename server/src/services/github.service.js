const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

const git = simpleGit();

const GithubService = {};

/**
 * Clone a GitHub repository
 */
GithubService.cloneRepository = async (githubUrl) => {

    // Repository name
    const repoName = githubUrl
        .split("/")
        .pop()
        .replace(".git", "");

    // Clone location
    const clonePath = path.join("repositories", repoName);

    // Delete old copy if it exists
    if (fs.existsSync(clonePath)) {
        fs.rmSync(clonePath, {
            recursive: true,
            force: true
        });
    }

    console.log("📥 Cloning Repository...");
    console.log("GitHub URL:", githubUrl);

    // Clone repository
    await git.clone(githubUrl, clonePath);

    console.log("✅ Repository Cloned Successfully");

    return {
        repositoryName: repoName,
        repositoryPath: clonePath
    };
};

module.exports = GithubService;