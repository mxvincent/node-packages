import { Experience } from '@charts/experience'
import { Context } from '@helpers/context'
import { synthesizeAllResources } from '@helpers/scope'

new Experience(new Context('development', 'experience-a'))
new Experience(new Context('production', 'experience-a'))

new Experience(new Context('development', 'experience-b'))
new Experience(new Context('production', 'experience-b'))

synthesizeAllResources()
