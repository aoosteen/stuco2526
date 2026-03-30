import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'kwax2pg0', // Replace with your projectId
    dataset: 'production'         // Replace with your dataset
  },
  autoUpdates:true,
  deployment:{
    appId:'bqrjn3e596de29du8oe1g4xx'
  }

})
