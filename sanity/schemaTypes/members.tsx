import { Rule } from "sanity";

export default {
  name: 'members',
  type: 'document',
  title: 'Members',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name',
      validation: (Rule: Rule) => Rule.required().min(2).max(50),
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
          {title: 'Secretary General', value: 'Secretary General'},
          {title: 'Finance and Logistics Officer', value: 'Finance and Logistics Officer'},
          {title: 'Public Relations Officer', value: 'Public Relations Officer'},
          {title: 'JC2 Level Representative', value: 'JC2 Level Representative'},
          {title: 'JC1 Level Representative', value: 'JC1 Level Representative'},
          {title: 'Sec 4 Level Representative', value: 'Sec 4 Level Representative'},
          {title: 'Sec 3 Level Representative', value: 'Sec 3 Level Representative'},
          {title: 'Sec 2 Level Representative', value: 'Sec 2 Level Representative'},
          {title: 'Sec 1 Level Representative', value: 'Sec 1 Level Representative'},
        ],
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'twoWords',
      type: 'string',
      title: '2 words to describe you',
      validation: (Rule: Rule) => Rule.required().max(25),
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
      validation: (Rule: Rule) => Rule.required().min(5).max(200),
    },
    {
      name: 'events',
      type: 'array',
      title: 'Events',
      of: [{type: 'string'}],
    },
  ],
}