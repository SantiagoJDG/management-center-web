# Management Center WEB

Management Center WEB is a cloud-project that work as Front-End of Management Center app, created by Consultec-ti.

## Technologies used:

 - [React](https://reactjs.org/)

 - [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

 - [NPM](https://www.npmjs.com/)

 - [Google Cloud Platform](https://cloud.google.com/)

 - [App Engine](https://cloud.google.com/appengine)

## Installation

First step is install of necessary dependencies .

```sh
  npm install
```
Then there are many scripts available to different scenarios

Start the application in dev mode

```sh
  npm run dev
```
Run tests of application

```sh
  npm run test
```
Run linter

```sh
  npm run lint
```
Start the application in prod mode needs to steps
  
  - Build all project 
    ```sh
      npm run build
    ```
  - And then start the project
    ```sh
      npm run start
    ```
## Google Cloud Project

This application will be deploy on GCP within a App Engine, since that the project has the following configuration:

To create an App Engine it needs a file called app.yaml that contains all information will be used to create the app engine.

```yaml
env: standard
runtime: nodejs16
service: default

automatic_scaling:
  min_instances: 0
  max_instances: 2
  target_cpu_utilization: 0.8
  max_concurrent_requests: 50
  min_pending_latency: 100ms
  max_pending_latency: automatic
```

Also needs a file called .gcloudignore that contains all information that GCP goes to ignore.

```markdown
# This file specifies files that are *not* uploaded to Google Cloud
# using gcloud. It follows the same syntax as .gitignore, with the addition of
# "#!include" directives (which insert the entries of the given .gitignore-style
# file at that point).
#
# For more information, run:
#   $ gcloud topic gcloudignore
#
.gcloudignore
# If you would like to upload your .git directory, .gitignore file or files
# from your .gitignore file, remove the corresponding line
# below:
.git
.gitignore

# Node.js dependencies:
node_modules/
```

## Continuos Integration (CI)

The CI of a project commonly is a process that help to development team with the automatic execution of build, testing and another “check ins” to prevent that incomplete feature or something that would affects the application would merge with the stable code.

In this case the application have a CI based on [pipelines of bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/configure-bitbucket-pipelinesyml/) will be executed every time that indicates in the following triggers:

- Development team create a pull request
- Merge a pull request into Development/Release/Master branch.

To generate this CI the project needs a file called bitbucket-pipelines.yaml that contains all information of every trigger that it will need.

```yaml
#  Template NodeJS build

#  This template allows you to validate your NodeJS code.
#  The workflow allows running tests and code linting on the default branch.

image: node:16

pipelines:
  default:
    - parallel:
        - step:
            name: Build and Test
            caches:
              - node
            script:
              - npm install
              - npm test
        - step:
            name: Code linting
            script:
              - npm install eslint
              - npx eslint .
            caches:
              - node
```

## Continuos Deployment/delivery (CD)

The CD of a project commonly is a process that help to development team with takes the ongoing code development/Release/Master and automatically deploys it to where it needs to be.

In this case the application have a CD based on [cloud build](https://cloud.google.com/build) will be executed through a [webhook of bitbucket](https://support.atlassian.com/bitbucket-cloud/docs/manage-webhooks/) that are executed every push to a branch and every merged.

Once a webhook is executed this call a [webhook trigger on GCP](https://cloud.google.com/build/docs/automate-builds-webhook-events#creating_webhook_triggers) and this is it deploy the code.

To generate this DC the project needs a file called cloudbuild.yaml that contains every necessary step to generate the app engine and then build, test and deploy the code.

note: for this webhook its necessary create ssh key to authenticate into the bitbucket and to keep safe that information is necessary save that information into a Secret manager.

```yaml
steps:
# first, setup SSH:
# 1- save the SSH key from Secret Manager to a file
# 2- add the host key to the known_hosts file
- name: gcr.io/cloud-builders/git
  args:
    - '-c'
    - |
      echo "$$SSHKEY" > /root/.ssh/id_rsa
      chmod 400 /root/.ssh/id_rsa
      ssh-keyscan bitbucket.org > /root/.ssh/known_hosts
  entrypoint: bash
  secretEnv:
    - SSHKEY
  volumes:
    - name: ssh
      path: /root/.ssh
# second, clone the repository
- name: gcr.io/cloud-builders/git
  args:
    - clone
    - '-n'
    - 'git@bitbucket.org:{BITBUCKET_NAME}/{REPOSITORY_NAME}.git'
    - .
  volumes:
    - name: ssh
      path: /root/.ssh
# third, checkout the specific commit that invoked this build
- name: gcr.io/cloud-builders/git
  args:
    - checkout
    - $_BRANCH
#forth, install the app.
- name: node
  entrypoint: npm
  args: ['install']
#fiveth, deploy the app.
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: 'bash'
  args: ['-c', 'gcloud config set app/cloud_build_timeout 1600 && gcloud app deploy']
timeout: '1600s'
availableSecrets:
  secretManager:
  - versionName: projects/{ID_PROJECT}/secrets/{SECRET_NAME}/versions/{SECREET_VERSION}
    env: SSHKEY
```

## Development environment

The idea is generate a homologue development environment to every developer, and there’s a tool that will help with that called [editorConfig](https://editorconfig.org/) and also it have a [plugin to Visual  Studio Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig).

For that plugin works is necessary have a file called .editorconfig tha contains all editor’s configuration

```
# Editor configuration, see https://editorconfig.org
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.js]
quote_type = single

[*.md]
max_line_length = off
trim_trailing_whitespace = false
```
