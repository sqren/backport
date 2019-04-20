import { setAccessToken } from '../services/github';
import { doBackportVersions } from './doBackportVersions';
import { BackportOptions } from '../options/options';
import { getCommits } from './getCommits';
import { getBranches } from './getBranches';
import { maybeSetupRepo } from './maybeSetupRepo';

export async function initSteps(options: BackportOptions) {
  const [owner, repoName] = options.upstream.split('/');
  setAccessToken(options.accessToken);

  const commits = await getCommits(options);
  const branches = await getBranches(options);

  await maybeSetupRepo(options.accessToken, owner, repoName, options.username);
  await doBackportVersions(
    owner,
    repoName,
    commits,
    branches,
    options.username,
    options.labels
  );
}
