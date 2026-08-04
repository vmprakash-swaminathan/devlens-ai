const GithubService = require("./src/services/github.service");

(async () => {

    const path = await GithubService.cloneRepository(
        "https://github.com/octocat/Hello-World.git"
    );

    console.log(path);

})();