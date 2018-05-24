import Program from "commander";
import Chalk from "chalk";
import Git from "nodegit";
Git.Clone("https://github.com/odinr/CoreComponents-Boilerplate.git", "./tmp")
.then(e => {
    console.log(e.getMasterCommit());
});