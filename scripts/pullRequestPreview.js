import { execSync } from "child_process";
import fetch from "node-fetch";

console.log("[DEPLOY_PREVIEW]: START");
const command = "yarn deploy:staging";
const output = execSync(command, { encoding: "utf-8" });
const outputLines = output.split("\n");
const DEPLOY_URL = outputLines[outputLines.length - 1];
console.log("[DEPLOY_PREVIEW]: END");

console.log(`You can see the deploy preview on: ${DEPLOY_URL}`);

console.log("[GITHUB_COMMENT]: START");
const { GITHUB_REPOSITORY, GITHUB_PR_NUMBER, GITHUB_TOKEN } = process.env;
const GH_COMMENT = `
- Deploy URL: [${DEPLOY_URL}](${DEPLOY_URL})
`;

const defaultHeaders = {};
defaultHeaders["authorization"] = `token ${GITHUB_TOKEN}`;
defaultHeaders["accept"] =
    "application/vnd.github.v3+json; application/vnd.github.antiope-preview+json";
defaultHeaders["content-type"] = "application/json";

console.log("GITHUB_REPOSITORY", GITHUB_REPOSITORY);
console.log("GITHUB_PR_NUMBER", GITHUB_PR_NUMBER);

fetch(
    `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/issues/${
        process.env.GITHUB_REF.split("/")[2]
    }/comments`,
    {
        headers: defaultHeaders,
        method: "POST",
        body: JSON.stringify({
            body: GH_COMMENT,
        }),
    }
)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Failed to post comment: ${response.statusText}`);
        }
    })
    .catch((err) => {
        console.log("[COMMENT_ON_GITHUB]: ERROR");
        throw new Error(`Failed to post comment: ${err.message}`);
    })
    .finally(() => console.log("[GITHUB_COMMENT]: END"));
