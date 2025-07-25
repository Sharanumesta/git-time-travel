const simpleGit = require('simple-git');
const git = simpleGit();

exports.getRecentCommits = async () => {
  const log = await git.log({ n: 10 });
  return log.all.map(c => ({
    hash: c.hash,
    message: c.message,
    date: c.date
  }));
};

exports.getDiff = async (hash) => {
  return await git.show([hash]);
};
