#!groovy
@Library('waluigi@release/7') _

beehiveFlowBuild(
  container: [ resourceRequestMemory: '3Gi', resourceLimitMemory: '3Gi' ],
  test: {
    bedrockBrowsers()
  },
  customSteps: {
    stage("update storybook") {
      def status = beehiveFlowStatus()
      if (status.branchState == 'releaseReady' && status.isLatest) {
        tinyGit.withGitHubSSHCredentials {
          exec('yarn deploy-storybook')
        }
      } else {
        echo "Skipping as is not latest release"
      }
    }
  }
)
