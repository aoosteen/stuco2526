import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const singletonTypes = new Set(['homeHeroVideo'])
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Student council website',
  projectId: 'kwax2pg0', // Replace with your projectId
  dataset: 'production',        // Replace with your dataset

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Home Hero Video')
              .id('homeHeroVideo')
              .child(
                S.editor()
                  .id('homeHeroVideo')
                  .schemaType('homeHeroVideo')
                  .documentId('homeHeroVideo'),
              ),
            ...S.documentTypeListItems().filter(
              (listItem) => !singletonTypes.has(listItem.getId() ?? ''),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (templateItem) => !singletonTypes.has(templateItem.templateId),
        )
      }
      return prev
    },
    actions: (prev, {schemaType}) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(
          ({action}) => action !== undefined && singletonActions.has(action),
        )
      }
      return prev
    },
  },
})
