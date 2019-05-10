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
    checkout scm
    sh "mkdir -p jenkins-plumbing"
    dir ("jenkins-plumbing") {
      git([branch: "master", url:'ssh://git@stash:7999/van/jenkins-plumbing.git', credentialsId: '8aa93893-84cc-45fc-a029-a42f21197bb3'])
    }
  }

  def extExec = load("jenkins-plumbing/exec.groovy")
  def extBedrock = load("jenkins-plumbing/bedrock-tests.groovy")
  def extNpmInstall = load("jenkins-plumbing/npm-install.groovy")

  stage("Building") {
    extNpmInstall()
    extExec("yarn run build")
  }

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

        echo "Slave checkout"
        checkout scm

        echo "Installing tools"
        extNpmInstall()          

        echo "Platform: browser tests for " + permutation.name
        extBedrock(permutation.name, permutation.browser, "src/test/ts/browser")
      }
    }
  }

  stage("Parallel Browser Tests") {
    parallel processes
  }

  stage("Deploying storybook to github") {
    sshagent (credentials: ['dcd9940f-08e1-4b75-bf0c-63fff1913540']) {
      sh("git remote add upstream git@github.com:tinymce/tinymce-react.git")
      sh('npx storybook-to-ghpages --remote=upstream')
    }
  }

  stage("Synching master branch to public github repo") {
    sshagent (credentials: ['dcd9940f-08e1-4b75-bf0c-63fff1913540']) {
      sh("git checkout master")
      sh("git push upstream master --tags")
    }
  }
}