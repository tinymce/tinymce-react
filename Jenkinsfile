#!groovy
@Library('waluigi@v4.1.0') _

standardProperties()

node("primary") {
  echo "Clean workspace"
  cleanWs()

  stage("checkout") {
    checkout localBranch(scm)
  }

  stage("dependencies") {
    yarnInstall()
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

  bedrockBrowsers testDirs: [ "src/test/ts/browser" ]

  stage("update storybook") {
    def status = beehiveFlowStatus();
    if (status.branchState == 'releaseReady' && status.isLatest) {
      sshagent (credentials: ['dcd9940f-08e1-4b75-bf0c-63fff1913540']) {
        sh 'yarn storybook-to-ghpages'
      }
    } else {
      echo "Skipping as is not latest release"
    }
  }

  stage("publish") {
    sshagent(credentials: ['jenkins2-github']) {
      sh "yarn beehive-flow publish"
      sh "yarn beehive-flow advance-ci"
    }
  }
}
