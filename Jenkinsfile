#!groovy
@Library('waluigi@v2.0.0') _

properties([
  disableConcurrentBuilds(),
  pipelineTriggers([
    pollSCM('H 0 1 1 1')
  ])
])

node("primary") {
  echo "Clean workspace"
  cleanWs()

  stage ("Checkout SCM") {
    checkout localBranch(scm)
  }

  stage("Building") {
    yarnInstall()
    exec "yarn run build"
  }

  def permutations = [
    [ name: "win10Chrome", os: "windows-10", browser: "chrome" ],
    [ name: "win10FF", os: "windows-10", browser: "firefox" ],
    [ name: "win10Edge", os: "windows-10", browser: "MicrosoftEdge" ]
  ]

  def processes = [:]

  for (int i = 0; i < permutations.size(); i++) {
    def permutation = permutations.get(i);
    def name = permutation.name;
    processes[name] = {
      node("bedrock-" + permutation.os) {
        echo "Clean workspace"
        cleanWs()

        echo "Checkout"
        checkout scm

        echo "Installing tools"
        yarnInstall()

        echo "Platform: browser tests for " + permutation.name
        bedrockTests(permutation.name, permutation.browser, "src/test/ts/browser")
      }
    }
  }

  stage("Parallel Browser Tests") {
    parallel processes
  }

  stage("Deploying storybook to github") {
    if (isReleaseBranch()) {
      sshagent (credentials: ['dcd9940f-08e1-4b75-bf0c-63fff1913540']) {
        sh 'yarn storybook-to-ghpages'
      }
    }
  }
}
