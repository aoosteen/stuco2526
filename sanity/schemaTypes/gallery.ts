export default {
  name: 'gallery',
  type: 'document',
  title: 'Gallery',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title of event',
      validation: (Rule: any) => Rule.required().warning('Title is required'),
    },
    {
      name: 'description',
      type: 'text',
      rows: 10,
      title: 'Description of event',

      validation: (Rule: any) => Rule.required().warning('Description is required'),
    },
    {
      name: 'date',
      type: 'date',
      title: 'Date of event',
      validation: (Rule: any) => Rule.required().warning('Date is required'),
    },
    {
      name: 'term',
      type: 'string',
      title: 'Term of event',
      options: {
        list: [
          {title: 'Term 1', value: 'term1'},
          {title: 'Term 2', value: 'term2'},
          {title: 'Term 3', value: 'term3'},
          {title: 'Term 4', value: 'term4'},
        ],
      },
      validation: (Rule: any) => Rule.required().warning('Term is required'),
    },
    {
      name: 'specialImage',
      type: 'string',
      title: 'An emoji to describe the event in general',
      validation: (Rule: any) => [
        Rule.required().warning('Special Emoji is required'),
        Rule.regex(
          /^(?:\p{Extended_Pictographic}(?:\u200d\p{Extended_Pictographic}|\ufe0f|\p{Emoji_Modifier})*|[\u{1F1E6}-\u{1F1FF}]{2})$/u,
          {
            name: 'emoji',
            message: 'Only one emoji is allowed',
          },
        ),
      ],
    },
    {
      name: 'highlights',
      type: 'array',
      title: 'Highlights',
      of: [{type: 'image'}],
      validation: (Rule: any) => Rule.required().warning('Highlights is required'),
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'BTS',
      type: 'array',
      title: 'BTS',
      of: [{type: 'image'}],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'studentsCollection',
      type: 'array',
      title: "Student's Collections",
      of: [{type: 'image'}],
      options: {
        layout: 'grid',
      },
    },
    {
      name: 'miscellaneous',
      type: 'array',
      title: 'Miscellaneous',
      of: [{type: 'image'}],
      options: {
        layout: 'grid',
      },
    },
  ],
}
