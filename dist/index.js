"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBody = createBody;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
function createBody(checkboxes) {
    let body = ``;
    for (const checkbox of checkboxes.split(",")) {
        const parts = checkbox.split("=");
        let label = parts[0].trim();
        let name = label;
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
        let body = `## Select which tests to run:\n` + createBody(checkboxes);
        await octokit.rest.issues.createComment({
            owner,
            repo,
            issue_number,
            body,
        });
        core.info("Comment with checkboxes posted.");
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
run();
