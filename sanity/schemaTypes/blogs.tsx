const BlogTags = [
  {
    name: "Event/Programme",
  },
  {
    name: "Personal",
  },
  {
    name: "Thematic",
  },
  {
    name: "Record",
  },
  {
    name: "Experience/Anecdote",
  },
  {
    name: "Discussion",
  },
  {
    name: "Case Study",
  },
  {
    name: "Behind-the-Scenes",
  },
  {
    name: "Recap",
  },
  {
    name: "Review",
  },
  {
    name: "Reflective",
  },
  {
    name: "Informative",
  },
  {
    name: "Analysis",
  },
  {
    name: "Relatable",
  },
];
const mathInlineIcon = () => (
  <span>
    <span style={{fontWeight: 'bold'}}>∑</span>
  </span>
)
const mathIcon = () => <span style={{fontWeight: 'bold'}}>∑</span>

export default {
  name: 'Blogs',
  type: 'document',
  title: 'Blogs',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title of blog',
      validation: (rule:any) => rule.required().warning('Title of blog is required'),
    },
    {
      name: 'author',
      type: 'string',
      title: 'Author',
      validation: (rule:any) => rule.required().warning('Author of blog is required'),
    },
    {
      name: 'tags',
      type: 'array',
      title: 'Tags',
      of: [
        {
          type: 'string',
        },
      ],
      options: {
        list: BlogTags.map((tag) => {
          return {
            title: tag.name,
            value: tag.name,
          };
        }),
      },
      validation: (rule:any) => rule.required().warning('Tags of blog is required'),
    },
    {
      name: 'coverImage',
      type: 'image',
      title: 'Image for the cover of your article',
      validation: (rule:any) => rule.required().warning('Cover image of blog is required'),
    },{
      name:'description',
      type:'text',
      title:'Description of blog',
    },
    {
      name: 'blog',
      type: 'array',
      title: 'Blog',
      of: [
        {
          type: 'block',
          // of: [{type: 'latex', icon: mathInlineIcon, title: 'Inline math'}],
        },
        {
          type: 'image',
        },
        // {type: 'latex', icon: mathIcon, title: 'Math block'},
      ],
      validation: (rule:any) => rule.required().warning('Blog article is required'),
    },
  ],
}
