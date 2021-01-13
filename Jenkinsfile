#!groovy
@Library('waluigi@feature/INT-2305') _

standardProperties()

def shJson(String script) {
  def s = sh(script: script, returnStdout: true);
  return readJSON(text: s);
}

def beehiveFlowStatus() {
  return shJson("yarn run --silent beehive-flow status");
}

node("primary") {
  echo "Clean workspace"
  cleanWs()

  stage("checkout") {
    checkout scm
  }

  stage("dependencies") {
    sh "yarn install"
  }

  stage("stamp") {
    sh "yarn beehive-flow stamp"
  }

  stage("build") {
    sh "yarn build"
  }

  stage("lint") {
    sh "yarn lint"
  }

  stage("test") {
    def permutations = [
      [ name: "win10Chrome", os: "windows-10", browser: "chrome" ],
      [ name: "win10FF", os: "windows-10", browser: "firefox" ],
      [ name: "win10Edge", os: "windows-10", browser: "MicrosoftEdge" ],
      [ name: "win10IE", os: "windows-10", browser: "ie" ]
    ]
    bedrockBrowsers(permutations: permutations)
  }

  stage("update storybook") {
    def status = beehiveFlowStatus();
    if (status.branchState == 'releaseReady' && status.isLatestReleaseBranch) {
      sshagent (credentials: ['dcd9940f-08e1-4b75-bf0c-63fff1913540']) {
        sh 'yarn storybook-to-ghpages'
      }
    } else {
      echo "Skipping as is not latest release"
    }
  }

  stage("publish") {
    sh "yarn beehive-flow publish"
    sshagent(credentials: ['jenkins2-github']) {
      sh "yarn beehive-flow advance-ci"
    }
  }
}
