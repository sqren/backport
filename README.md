# backport

[![Build Status](https://travis-ci.org/sqren/backport.svg?branch=master)](https://travis-ci.org/sqren/backport)
[![NPM version](https://img.shields.io/npm/v/backport.svg)](https://www.npmjs.com/package/backport)
[![dependencies Status](https://david-dm.org/sqren/backport/status.svg)](https://david-dm.org/sqren/backport)
[![Coverage Status](https://coveralls.io/repos/github/sqren/backport/badge.svg?branch=master)](https://coveralls.io/github/sqren/backport?branch=master)

A simple CLI tool that automates the process of backporting commits on a GitHub repo.

![Demonstration gif](https://i.makeagif.com/media/10-05-2017/kEJLqe.gif)

## Requirements

- Node 8 or higher
- git

## Install

```sh
npm install -g backport

# or locally
npm install backport
```

After installation you should update the [global config](https://github.com/sqren/backport/blob/master/docs/configuration.md#global-config-backportconfigjson) in `~/.backport/config.json` with your Github username and a Github access token. See the [documentation](https://github.com/sqren/backport/blob/master/docs/configuration.md#accesstoken-required) for how generate the access token.

## Quick start

**Project config**
Add a [project config](https://github.com/sqren/backport/blob/master/docs/configuration.md#project-config-backportrcjson) to the root of your repository:
```js
// .backportrc.json
{
  "upstream": "elastic/kibana",
  "branches": [{ "name": "6.x", "checked": true }, "6.3", "6.2", "6.1", "6.0"],
}
```

**Install backport locally**
```
npm install backport
```

**Run backport:**
```
> npx backport
```

The above commands will start an interactive prompt. You can use the `arrow keys` to choose options, `<space>` to select checkboxes and `<enter>` to proceed.

### Config options

See [configuration.md](https://github.com/sqren/backport/blob/master/docs/configuration.md)

### CLI options

| Option                   | Description                                            | Default                        | Type    |
| ------------------------ | ------------------------------------------------------ | ------------------------------ | ------- |
| --accesstoken            | Github access token                                    |                                | string  |
| --all                    | Show commits from other than me                        | false                          | boolean |
| --author                 | Filter commits by author                               | _Current user_                 | string  |
| --branch                 | Target branch to backport to                           |                                | string  |
| --commits-count          | Number of commits to choose from                       | 10                             | number  |
| --dry-run                | Perform backport without pushing to Github             | false                          | boolean |
| --editor                 | Editor (eg. `code`) to open and solve conflicts        |                                | string  |
| --fork                   | Create backports in fork (true) or origin repo (false) | true                           | boolean |
| --git-hostname           | Hostname for Git remotes                               | github.com                     | string  |
| --github-api-base-url-v3 | Base url for Github's Rest (v3) API                    | https://api.github.com         | string  |
| --github-api-base-url-v4 | Base url for Github's GraphQL (v4) API                 | https://api.github.com/graphql | string  |
| --labels                 | Pull request labels                                    |                                | string  |
| --mainline               | Parent id of merge commit                              | 1                              | number  |
| --multiple               | Select multiple commits/branches                       | false                          | boolean |
| --path                   | Only list commits touching files under a specific path |                                | string  |
| --pr-description         | Pull request description suffix                        |                                | string  |
| --pr-title               | Pull request title pattern                             |                                | string  |
| --pr                     | Pull request to backport                               |                                | number  |
| --reset-author           | Set yourself as commit author                          |                                | boolean |
| --sha                    | Sha of commit to backport                              |                                | string  |
| --sourceBranch           | The branch to source commits from                      |                                | string  |
| --upstream               | Name of organization and repository                    |                                | string  |
| --username               | Github username                                        |                                | string  |
| --help                   | Show help                                              |                                |         |
| -v, --version            | Show version number                                    |                                |         |

The CLI options will override the [configuration options](https://github.com/sqren/backport/blob/master/docs/configuration.md).

## What is backporting?

> Backporting is the action of taking parts from a newer version of a software system [..] and porting them to an older version of the same software. It forms part of the maintenance step in a software development process, and it is commonly used for fixing security issues in older versions of the software and also for providing new features to older versions.

Source: [https://en.wikipedia.org/wiki/Backporting](https://en.wikipedia.org/wiki/Backporting)

## Who is this tool for?

This tools is for anybody who is working on a codebase where they have to maintain multiple versions. If you manually cherry-pick commits from master and apply them to one or more branches, this tool might save you a lot of time.

`backport` is a CLI tool that will let you backport commit(s) interactively and then cherry-pick and create pull requests automatically. `backport` will always perform the git operation in a temporary folder (`~/.backport/repositories/`) separate from your working directory, thereby never interfering with any unstages changes your might have.

**Features:**

- interactively backport one or more commits to one or more branches with an intuitive UI
- will never run `git reset --hard` or other git commands in your working directory - all git operations are handled in a separate directory
- backport a commit by specifying a PR (`backport --pr 1337`)
- list and backport commits by a particular user (`backport --author john`)
- list and backport commits by a particular path (`backport --path src/plugins/chatbot`)
- forward port commits: `backport --sourceBranch 7.x --branch master` (will backport from 7.x to master)
- backport merge commits (`backport --mainline`)
- see which commits have been backported and to which branches
- customize the title, description and labels of the created backport PRs

## Contributing

See [CONTRIBUTING.md](https://github.com/sqren/backport/blob/master/CONTRIBUTING.md)
