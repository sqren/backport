import {
  getGlobalConfigPath,
  getReposPath,
  getRepoOwnerPath,
  getRepoPath
} from '../src/env';

describe('env.js', () => {
  test('getGlobalConfigPath', () => {
    expect(getGlobalConfigPath()).toBe('/myHomeDir/.backport/config.json');
  });

  test('getReposPath', () => {
    expect(getReposPath()).toBe('/myHomeDir/.backport/repositories');
  });

  test('getRepoOwnerPath', () => {
    expect(getRepoOwnerPath('elastic')).toBe(
      '/myHomeDir/.backport/repositories/elastic'
    );
  });

  test('getRepoPath', () => {
    expect(getRepoPath('elastic', 'kibana')).toBe(
      '/myHomeDir/.backport/repositories/elastic/kibana'
    );
  });
});
