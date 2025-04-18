import * as core from "@actions/core";
import * as github from "@actions/github";

export function createBody(checkboxes: string): string {
  let body = ``;
  if (!checkboxes) {
    return body;
  }
  for (const checkbox of checkboxes.split(",")) {
    const parts = checkbox.split("=")
    let label = parts[0].trim();
    let name = label
    if (parts.length == 2) {
      name = parts[1].trim();
    }
    body += `- [ ] <!--${label}--> ${name}\n`;
  }
  return body;
}

async function run() {
  try {
    const token = core.getInput("github-token", { required: true });
    const checkboxes = core.getInput("checkboxes", { required: true });
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

    let body = `<!-- pr-add-checkbox -->\n`;
    body += `## Select which tests to run:\n`
    body += createBody(checkboxes);
    body += `\n\n[Re-run this action](# "Re-run this action by re-triggering the workflow.")\n`;

    const comments = await octokit.rest.issues.listComments({
      owner,
      repo,
      issue_number,
    });

    const existingComment = comments.data.find(comment =>
      comment.body?.startsWith("<!-- pr-add-checkbox -->")
    );

    if (existingComment) {
      await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: existingComment.id,
      body,
      });
    } else {
      await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body,
      });
    }

    core.info("Comment with checkboxes posted.");
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
