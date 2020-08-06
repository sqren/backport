import { AxiosError } from 'axios';
import ora from 'ora';
import { ValidatedOptions } from '../../../options/getValidatedOptions';
import { HandledError } from '../../HandledError';
import {
  apiRequestV4,
  handleGithubV4Error,
  GithubV4Response,
} from './apiRequestV4';
import { throwOnInvalidAccessToken } from './throwOnInvalidAccessToken';

export interface DataResponse {
  viewer: { login: string };
  repository: {
    ref?: { name: string };
    defaultBranchRef: { name: string };
  };
}

// fetches the default source branch for the repo (normally "master")
// startup checks:
// - verify the access token
// - ensure no branch named "backport" exists
export async function getDefaultRepoBranchAndPerformStartupChecks({
  accessToken,
  githubApiBaseUrlV4,
  repoName,
  repoOwner,
}: ValidatedOptions) {
  const query = /* GraphQL */ `
    query getDefaultRepoBranchAndPerformStartupChecks(
      $repoOwner: String!
      $repoName: String!
    ) {
      viewer {
        login
      }
      repository(owner: $repoOwner, name: $repoName) {
        # check whether "backport" branch exists
        ref(qualifiedName: "refs/heads/backport") {
          name
        }

        # get default branch
        defaultBranchRef {
          name
        }
      }
    }
  `;

  let res: DataResponse;
  const spinner = ora().start('Initializing...');
  try {
    res = await apiRequestV4<DataResponse>({
      githubApiBaseUrlV4,
      accessToken,
      query,
      variables: {
        repoOwner,
        repoName,
      },
      handleError: false,
    });
    spinner.stop();
  } catch (e) {
    spinner.stop();
    const error = e as AxiosError<GithubV4Response<null>>;

    throwOnInvalidAccessToken({
      error,
      repoName,
      repoOwner,
    });

    throw handleGithubV4Error(error);
  }

  // it is not possible to have a branch named "backport"
  if (res.repository.ref?.name === 'backport') {
    throw new HandledError(
      'You must delete the branch "backport" to continue. See https://github.com/sqren/backport/issues/155 for details'
    );
  }

  // return default branch
  return {
    defaultBranch: res.repository.defaultBranchRef.name,
  };
}
