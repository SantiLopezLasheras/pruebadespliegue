const core = require("@actions/core");
const fs = require("fs").promises;

async function main() {
  try {
    const resultado = core.getInput("resultado");

    const img =
      resultado === "success"
        ? "https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg"
        : "https://img.shields.io/badge/test-failure-red";

    const old_readme = await fs.readFile("./OldREADME.md", "utf8");
    const new_readme = old_readme + resultado;

    await fs.writeFile("./README.md", new_readme);
    process.exit(0);
  } catch (error) {
    core.setFailed(error);
  }
}

main();
