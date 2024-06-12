#!groovy
@Library('waluigi@release/7') _

mixedBeehiveFlow(
  container: [ resourceRequestMemory: '3Gi', resourceLimitMemory: '3Gi' ],
  testPrefix: 'Tiny-React',
  platforms: [
    [ browser: 'chrome', headless: true ],
    [ browser: 'firefox', provider: 'aws', buckets: 1 ],
    [ browser: 'safari', provider: 'lambdatest', buckets: 1 ]
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
  },
  preparePublish:{
    yarnInstall()
    sh "yarn build"
  }
)
