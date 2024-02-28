#!groovy
@Library('waluigi@feature/TINY-10569') _

mixedBeehiveFlowBuild(
  container: [ resourceRequestMemory: '3Gi', resourceLimitMemory: '3Gi' ],
  testPrefix: 'Tiny-React',
  platforms: [
    [ browser: 'chrome', headless: true ],
    [ browser: 'firefox', provider: 'aws', buckets: 2 ],
    [ browser: 'safari', provider: 'lambdatest', os: 'macOS Sonoma', buckets: 1 ]
  ],
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
