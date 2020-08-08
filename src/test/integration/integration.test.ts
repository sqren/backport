import { once } from 'lodash';
import { getOptions } from '../../options/options';
import { runWithOptions } from '../../runWithOptions';
import { PromiseReturnType } from '../../types/PromiseReturnType';
import { createSpies } from './createSpies';
import { REMOTE_ORIGIN_REPO_PATH, REMOTE_FORK_REPO_PATH } from './envConstants';
import {
  getBranches,
  getLatestCommit,
  deleteAndSetupEnvironment,
} from './helpers';

jest.unmock('make-dir');
jest.unmock('del');
jest.unmock('../../services/child-process-promisified');

describe('when a single commit is backported', () => {
  let res: PromiseReturnType<typeof runWithOptions>;
  let spies: ReturnType<typeof createSpies>;

  beforeEach(
    once(async () => {
      // use localhost to avoid CORS issues
      const githubApiBaseUrlV4 = 'http://localhost/graphql';

      jest.clearAllMocks();
      spies = createSpies({ commitCount: 1, githubApiBaseUrlV4 });

      await deleteAndSetupEnvironment();

      const options = await getOptions([], { githubApiBaseUrlV4 });
      res = await runWithOptions(options);
    })
  );

  it('returns pull request', () => {
    expect(res).toEqual([
      { pullRequestUrl: 'myHtmlUrl', success: true, targetBranch: '6.0' },
    ]);
  });

  it('sends the correct http body', () => {
    const { createPullRequestCalls } = spies.getSpyCalls();
    expect(createPullRequestCalls).toEqual([
      {
        base: '6.0',
        body: 'Backports the following commits to 6.0:\n - Add witch (#85)',
        head: 'sqren:backport/6.0/pr-85',
        title: '[6.0] Add witch (#85)',
      },
    ]);
  });

  it('should make correct API requests', () => {
    const spyCalls = spies.getSpyCalls();
    expect(spyCalls.graphQLCalls.getDefaultRepoBranchCalls).toMatchSnapshot();
    expect(spyCalls.graphQLCalls.getIdByLoginCalls).toMatchSnapshot();
    expect(spyCalls.graphQLCalls.fetchCommitsByAuthorCalls).toMatchSnapshot();
  });

  it('should not create new branches in origin (elastic/backport-demo)', async () => {
    const branches = await getBranches(REMOTE_ORIGIN_REPO_PATH);
    expect(branches).toEqual(['6.0', '* master']);
  });

  it('should create branch in the fork (sqren/backport-demo)', async () => {
    const branches = await getBranches(REMOTE_FORK_REPO_PATH);
    expect(branches).toEqual(['6.0', 'backport/6.0/pr-85', '* master']);
  });

  it('should have cherry picked the correct commit', async () => {
    const commit = await getLatestCommit({
      branch: 'backport/6.0/pr-85',
      commitCount: 1,
      cwd: REMOTE_FORK_REPO_PATH,
    });
    expect(commit).toMatchInlineSnapshot(`
      " romeo-and-juliet.txt | 2 +-
       1 file changed, 1 insertion(+), 1 deletion(-)

      diff --git a/romeo-and-juliet.txt b/romeo-and-juliet.txt
      index 87f1ac7..51e1e4b 100644
      --- a/romeo-and-juliet.txt
      +++ b/romeo-and-juliet.txt
      @@ -158 +158 @@ Thereto prick'd on by a most emulate pride,
      -Dared to the combat; in which our valiant Hamlet--
      +Dared to the combat; in 🧙‍♀️ our valiant Hamlet--
      "
    `);
  });
});

describe('when two commits are backported', () => {
  let spies: ReturnType<typeof createSpies>;
  let res: PromiseReturnType<typeof runWithOptions>;

  beforeEach(
    once(async () => {
      jest.clearAllMocks();
      const githubApiBaseUrlV4 = 'http://localhost/graphql';
      spies = createSpies({ commitCount: 2, githubApiBaseUrlV4 });

      await deleteAndSetupEnvironment();

      const options = await getOptions([], { githubApiBaseUrlV4 });
      res = await runWithOptions(options);
    })
  );

  it('sends the correct http body', () => {
    const { createPullRequestCalls } = spies.getSpyCalls();
    expect(createPullRequestCalls).toEqual([
      {
        title: '[6.0] Add witch (#85) | Add 👻 (2e63475c)',
        head: 'sqren:backport/6.0/pr-85_commit-2e63475c',
        base: '6.0',
        body:
          'Backports the following commits to 6.0:\n - Add witch (#85)\n - Add 👻 (2e63475c)',
      },
    ]);
  });

  it('returns pull request', () => {
    expect(res).toEqual([
      { pullRequestUrl: 'myHtmlUrl', success: true, targetBranch: '6.0' },
    ]);
  });

  it('should make correct API requests', () => {
    const spyCalls = spies.getSpyCalls();
    expect(spyCalls.graphQLCalls.getDefaultRepoBranchCalls).toMatchSnapshot();
    expect(spyCalls.graphQLCalls.getIdByLoginCalls).toMatchSnapshot();
    expect(spyCalls.graphQLCalls.fetchCommitsByAuthorCalls).toMatchSnapshot();
  });

  it('should not create new branches in origin (elastic/backport-demo)', async () => {
    const branches = await getBranches(REMOTE_ORIGIN_REPO_PATH);
    expect(branches).toEqual(['6.0', '* master']);
  });

  it('should create branch in the fork (sqren/backport-demo)', async () => {
    const branches = await getBranches(REMOTE_FORK_REPO_PATH);
    expect(branches).toEqual([
      '6.0',
      'backport/6.0/pr-85_commit-2e63475c',
      '* master',
    ]);
  });

  it('should have cherry picked the correct commit', async () => {
    const commit = await getLatestCommit({
      branch: 'backport/6.0/pr-85_commit-2e63475c',
      commitCount: 2,
      cwd: REMOTE_FORK_REPO_PATH,
    });
    expect(commit).toMatchInlineSnapshot(`
            " romeo-and-juliet.txt | 2 +-
             1 file changed, 1 insertion(+), 1 deletion(-)

            diff --git a/romeo-and-juliet.txt b/romeo-and-juliet.txt
            index 51e1e4b..4814bb0 100644
            --- a/romeo-and-juliet.txt
            +++ b/romeo-and-juliet.txt
            @@ -203 +203 @@ But soft, behold! lo, where it comes again!
            -Re-enter Ghost
            +Re-enter 👻
             romeo-and-juliet.txt | 2 +-
             1 file changed, 1 insertion(+), 1 deletion(-)

            diff --git a/romeo-and-juliet.txt b/romeo-and-juliet.txt
            index 87f1ac7..51e1e4b 100644
            --- a/romeo-and-juliet.txt
            +++ b/romeo-and-juliet.txt
            @@ -158 +158 @@ Thereto prick'd on by a most emulate pride,
            -Dared to the combat; in which our valiant Hamlet--
            +Dared to the combat; in 🧙‍♀️ our valiant Hamlet--
            "
        `);
  });
});

describe('when disabling fork mode', () => {
  let res: PromiseReturnType<typeof runWithOptions>;
  let spies: ReturnType<typeof createSpies>;

  beforeEach(
    once(async () => {
      jest.clearAllMocks();
      const githubApiBaseUrlV4 = 'http://localhost/graphql';
      spies = createSpies({ commitCount: 1, githubApiBaseUrlV4 });
      await deleteAndSetupEnvironment();

      const options = await getOptions(['--fork=false'], {
        githubApiBaseUrlV4,
      });
      res = await runWithOptions(options);
    })
  );

  it('sends the correct http body', () => {
    const { createPullRequestCalls } = spies.getSpyCalls();
    expect(createPullRequestCalls).toEqual([
      {
        base: '6.0',
        body: 'Backports the following commits to 6.0:\n - Add witch (#85)',
        head: 'elastic:backport/6.0/pr-85',
        title: '[6.0] Add witch (#85)',
      },
    ]);
  });

  it('returns pull request', () => {
    expect(res).toEqual([
      { pullRequestUrl: 'myHtmlUrl', success: true, targetBranch: '6.0' },
    ]);
  });

  it('should create new branches in origin (elastic/backport-demo)', async () => {
    const branches = await getBranches(REMOTE_ORIGIN_REPO_PATH);
    expect(branches).toEqual(['6.0', 'backport/6.0/pr-85', '* master']);
  });

  it('should NOT create branch in the fork (sqren/backport-demo)', async () => {
    const branches = await getBranches(REMOTE_FORK_REPO_PATH);
    expect(branches).toEqual(['6.0', '* master']);
  });

  it('should cherry pick the correct commit', async () => {
    const commit = await getLatestCommit({
      branch: 'backport/6.0/pr-85',
      commitCount: 1,
      cwd: REMOTE_ORIGIN_REPO_PATH,
    });
    expect(commit).toMatchInlineSnapshot(`
      " romeo-and-juliet.txt | 2 +-
       1 file changed, 1 insertion(+), 1 deletion(-)

      diff --git a/romeo-and-juliet.txt b/romeo-and-juliet.txt
      index 87f1ac7..51e1e4b 100644
      --- a/romeo-and-juliet.txt
      +++ b/romeo-and-juliet.txt
      @@ -158 +158 @@ Thereto prick'd on by a most emulate pride,
      -Dared to the combat; in which our valiant Hamlet--
      +Dared to the combat; in 🧙‍♀️ our valiant Hamlet--
      "
    `);
  });
});
