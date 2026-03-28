export default {
    name:'banners',
    type:'document',
    title:'Banners',
    fields:[
        {
            name:'bannerTitle',
            type:'string',
            title:'Banner Title',
            validation: (rule:any) => rule.required().warning('Banner title is required'),
        },
        {
            name:'bannerLink',
            type:'url',
            title:'Banner Link (URL)',
        },
        {
            name:'bannerImage',
            type:'image',
            title:'Banner Image',
            validation: (rule:any) => rule.required().warning('Banner image is required'),    
        },
    ]   
}