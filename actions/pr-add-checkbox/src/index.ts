import * as core from "@actions/core";
import * as github from "@actions/github";

async function run() {
  try {
    const token = core.getInput("github-token", { required: true });
    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.eventName !== "pull_request") {
      core.setFailed("This action only runs on pull_request events.");
      return;
    }

    const { owner, repo } = context.repo;
    const issue_number = context.payload.pull_request?.number;

    if (!issue_number) {
      core.setFailed("Pull request number is undefined.");
      return;
    }

    const body = `
## Select which tests to run
- [ ] Run expensive integration tests
- [ ] Run UI regression tests
`;

    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
    });

    core.info("Comment with checkboxes posted.");
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
