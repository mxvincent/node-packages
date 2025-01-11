import { ExperienceA } from '#/charts/experience-a'
import { ExperienceB } from '#/charts/experience-b'
import { Context } from '#/helpers/context'
import { synthesizeAllResources } from '#/helpers/scope'

new ExperienceA(new Context('development', 'experience-a'))
new ExperienceA(new Context('production', 'experience-a'))

new ExperienceB(new Context('development', 'experience-b'))
new ExperienceB(new Context('production', 'experience-b'))

synthesizeAllResources()
