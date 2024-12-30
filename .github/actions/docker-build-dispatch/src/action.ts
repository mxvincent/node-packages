import { setOutput } from '@actions/core'
import { context, getOctokit } from '@actions/github'
import { getPublishedPackages, listApplications } from './context'

const octokit = getOctokit(process.env.GITHUB_TOKEN)

const applications = listApplications()
const publishedApplications = getPublishedPackages()
	.filter((pkg) => applications.find((appName) => appName === pkg.name))
	.map((pkg) => ({
		application: pkg.name,
		image: `ghcr.io/mxvincent/${pkg.name}`,
		version: pkg.version
	}))

console.log('dispatch docker-build workflow', publishedApplications)

octokit.rest.actions.createWorkflowDispatch({
	owner: context.repo.owner,
	repo: context.repo.repo,
	workflow_id: 'docker-build.yaml',
	ref: context.ref,
	inputs: {
		matrix: JSON.stringify({
			include: publishedApplications
		})
	}
})

setOutput('published-applications', publishedApplications)
