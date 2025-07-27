const simpleGit = require('simple-git');

async function getRecentCommits(repoPath = '.', since = '3 months ago') {
  const git = simpleGit(repoPath);
  const log = await git.log({ '--since': since });

  return log.all.map(commit => ({
    hash: commit.hash,
    message: commit.message,
    date: commit.date,
    author: commit.author_name,
  }));
}

async function getDiff(repoPath = '.', hash) {
  const git = simpleGit(repoPath);
  const diff = await git.diff([`${hash}^!`]);
  return diff;
}

module.exports = {
  getRecentCommits,
  getDiff,
};
