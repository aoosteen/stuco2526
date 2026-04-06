export default {
  name: 'homeHeroVideo',
  type: 'document',
  title: 'Home Hero Video',
  fields: [
    {
      name: 'label',
      type: 'string',
      title: 'Label',
      description: 'Internal label to identify this content entry in Studio.',
      initialValue: 'Homepage Hero Video',
      readOnly: true,
      validation: (rule: any) => rule.required().warning('Label is required'),
    },
    {
      name: 'videoFile',
      type: 'file',
      title: 'Landing Video',
      description: 'Replace this file to update the hero video on the homepage.',
      options: {
        accept: 'video/mp4,video/webm',
      },
      validation: (rule: any) =>
        rule
          .required()
          .custom(async (file: any, context: any) => {
            const ref = file?.asset?._ref
            if (!ref) return true

            const client = context.getClient({apiVersion: '2024-03-29'})
            const asset = await client.fetch(`*[_id == $id][0]{size}`, {id: ref})
            const size = asset?.size

            if (typeof size === 'number' && size > 15 * 1024 * 1024) {
              return 'Video must be 15 MB or smaller.'
            }
            return true
          }),
    },
  ],
  preview: {
    select: {
      title: 'label',
      media: 'videoFile',
    },
    prepare(selection: any) {
      return {
        title: selection.title || 'Homepage Hero Video',
        subtitle: 'Singleton',
        media: selection.media,
      }
    },
  },
}
