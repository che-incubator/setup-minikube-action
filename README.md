[![codecov](https://img.shields.io/codecov/c/github/che-incubator/setup-minikube-action)](https://codecov.io/gh/che-incubator/setup-minikube-action)

# Eclipse Che - Setup Minikube Action

This Github action will start Minikube to be able to Install/Run Eclipse Che

## pre-requisites:

- tested on ubuntu 20.04

## why:

There are tons of github actions to setup minikube but as the idea was here to have a single action without any setup it was not the case.

It's because the idea is to have the minikube setup logic in the action and no configuration setting at all so every job use the same lines and are automatically updated when this action is updated.

# Usage

```yaml
# Install che
name: che

# Trigger the workflow on push or pull request
on: [push, pull_request]

jobs:
  install:
    runs-on: ubuntu-20.04
    steps:
      - name: Start minikube
        id: run-minikube
        uses: che-incubator/setup-minikube-action@next
```

Development version is available with `@next`. At each commit in main branch, a new development release is pushed to `next` branch.

# Trademark

"Che" is a trademark of the Eclipse Foundation.
