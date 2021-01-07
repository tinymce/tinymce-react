#!groovy
@Library('waluigi@v3.2.0') _

standardProperties()

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

    parallel processes
  }

  stage("publish") {
    sh "yarn beehive-flow publish"
    sshagent(credentials: ['jenkins2-github']) {
      sh "yarn beehive-flow advance-ci"
    }
  }
}
