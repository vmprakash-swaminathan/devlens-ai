const GithubService = require("./src/services/github.service");

(async () => {

    try {

        const repository = await GithubService.cloneRepository(
            "https://github.com/octocat/Hello-World.git"
        );

        console.log(repository);

    } catch (error) {

        console.error(error);

    }

})();