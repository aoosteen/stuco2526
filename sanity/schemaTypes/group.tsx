export default {
  type: 'document',
  title: 'Group Photos',
  name: 'group',
  fields: [
    {
      name: 'position',
      type: 'string',
      options: {
        list: [
          {title: 'Level Representatives', value: 'LR'},
          {title: 'Major Positions', value: 'MP'},
          {title: 'All', value: 'all'},
        ],
      },
      title: 'Position of group photo',
      validation: (rule: any) => rule.required().error('Position of group photo is required'),
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      validation: (rule: any) => rule.required().error('Image is required'),
    },
  ],
}
