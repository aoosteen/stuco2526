import { getCliClient } from 'sanity/cli'

const client = getCliClient()

const ROLES_MAP = {
  'SecGen': 'Secretary General',
  'FILO': 'Finance and Logistics Officer',
  'PRO': 'Public Relations Officer'
}

async function migrate() {
  console.log('Fetching members to migrate...')
  const members = await client.fetch(`*[_type == "members" && position in ["SecGen", "FILO", "PRO"]]`)
  
  if (members.length === 0) {
    console.log('No members found to migrate.')
    return
  }

  console.log(`Found ${members.length} members to migrate.`)

  const transaction = client.transaction()

  for (const member of members) {
    const newRole = ROLES_MAP[member.position as keyof typeof ROLES_MAP]
    if (newRole) {
      console.log(`Migrating ${member.name} from ${member.position} to ${newRole}`)
      transaction.patch(member._id, p => p.set({ position: newRole }))
    }
  }

  await transaction.commit()
  console.log('Migration complete!')
}

migrate().catch(console.error)
