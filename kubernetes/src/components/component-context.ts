import { ApplicationContext } from '@libs/application-context'
import { LABEL_COMPONENT } from '@libs/labels'

export class ComponentContext extends ApplicationContext {
	readonly component: string

	constructor({ environment, application, revision, chart }: ApplicationContext, component: string) {
		super(environment, application, { chart, revision })
		this.component = component
	}

	get labels(): Record<string, string> {
		return {
			...super.labels,
			[LABEL_COMPONENT]: this.component
		}
	}
}
