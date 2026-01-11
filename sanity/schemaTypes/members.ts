export default {
  name: 'members',
  type: 'document',
  title: 'Members',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
    },
    {
      name: 'position',
      type: 'string',
      title: 'Role',
      options: {
        list: [
          {title: 'StuCo Advisor', value: 'StuCo Advisor'},
          {title: 'President', value: 'President'},
          {title: 'Vice-President', value: 'Vice-President'},
          {title: 'SecGen', value: 'SecGen'},
          {title: 'FILO', value: 'FILO'},
          {title: 'PRO', value: 'PRO'},
          {title: 'JC2 Level Representative', value: 'JC2 Level Representative'},
          {title: 'JC1 Level Representative', value: 'JC1 Level Representative'},
          {title: 'Sec 4 Level Representative', value: 'Sec 4 Level Representative'},
          {title: 'Sec 3 Level Representative', value: 'Sec 3 Level Representative'},
          {title: 'Sec 2 Level Representative', value: 'Sec 2 Level Representative'},
          {title: 'Sec 1 Level Representative', value: 'Sec 1 Level Representative'},
        ],
      },
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
    },
    {
      name: 'events',
      type: 'array',
      title: 'Events',
      of: [{type: 'string'}],
    },
  ],
}
