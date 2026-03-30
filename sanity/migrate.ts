import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const fetchDocuments = async () => {
  return await client.fetch('*[_type == "Blogs"]')
}

const buildMutations = (docs) => {
  const mutations = []

  docs.forEach((doc) => {
    // If not having category but having tags
    let categoryValue = doc.category
    if (!categoryValue && doc.tags && doc.tags.length > 0) {
      categoryValue = doc.tags[0] // take first tag
    } else if (!categoryValue) {
      categoryValue = "Event/Programme" // fallback
    }

    // Ensure publishedAt exists
    const publishedAtValue = doc.publishedAt || doc._createdAt

    const patch = {
      id: doc._id,
      patch: {
        set: {
          category: categoryValue,
          publishedAt: publishedAtValue,
        },
        unset: ['tags'],
      },
    }
    mutations.push(patch)
  })

  return mutations
}

const createTransaction = (mutations) => {
  return mutations.reduce((tx, mutation) => {
    return tx.patch(mutation.id, mutation.patch)
  }, client.transaction())
}

const migrateNextBatch = async () => {
  const documents = await fetchDocuments()
  const mutations = buildMutations(documents)

  if (mutations.length === 0) {
    console.log('No more documents to migrate!')
    return null
  }

  console.log(`Migrating batch of ${mutations.length} documents...`)

  const transaction = createTransaction(mutations)
  await transaction.commit()
  console.log('Batch migration completed.')
}

migrateNextBatch().catch((err) => {
  console.error(err)
  process.exit(1)
})
