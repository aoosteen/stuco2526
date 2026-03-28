import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'kwax2pg0', // Replace with your projectId
    dataset: 'production'         // Replace with your dataset
  },
  autoUpdates:true,
  app:{
   organizationId:'ovD5DF1kd' 
  }
})
