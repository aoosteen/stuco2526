# Sanity CMS — Instructions & Schema Reference

> This document explains how content is structured, managed, and queried in the **stuco2526** Student Council website. Read this before adding, editing, or removing any Sanity content or schema.

---

## Table of Contents

1. [Overview](#overview)
2. [Project Setup](#project-setup)
3. [Studio Access](#studio-access)
4. [Schema Reference](#schema-reference)
   - [Blogs](#1-blogs)
   - [Gallery](#2-gallery)
   - [Members](#3-members)
   - [Banners *(inactive)*](#4-banners-inactive)
   - [Group Photos *(inactive)*](#5-group-photos-inactive)
5. [How Content Is Queried (GROQ)](#how-content-is-queried-groq)
6. [Image Handling](#image-handling)
7. [Adding a New Schema](#adding-a-new-schema)
8. [Running Migrations](#running-migrations)
9. [Common Pitfalls](#common-pitfalls)

---

## Overview

This project uses [Sanity.io](https://www.sanity.io/) as its headless CMS. Content is authored in the Sanity Studio (a separate app in the `/sanity` folder) and consumed by the React frontend via the `@sanity/client` package.

**Active document types:**

| Schema Name | Studio Title    | Used By              |
|-------------|-----------------|----------------------|
| `Blogs`     | Blogs           | Blog list & post pages |
| `gallery`   | Gallery         | Gallery list & event pages |
| `members`   | Members         | Members page         |

**Inactive (commented out in `schemaTypes/index.ts`):**

| Schema Name | Studio Title  | Notes                         |
|-------------|---------------|-------------------------------|
| `banners`   | Banners       | Planned feature, not yet used |
| `group`     | Group Photos  | Planned feature, not yet used |

---

## Project Setup

The Sanity Studio lives in a **separate directory** from the frontend:

```
stuco2526/
├── sanity/          ← Sanity Studio (its own npm project)
│   ├── sanity.config.ts
│   ├── sanity.cli.ts
│   └── schemaTypes/
│       ├── index.ts
│       ├── blogs.tsx
│       ├── gallery.tsx
│       ├── members.tsx
│       ├── banners.tsx   (inactive)
│       └── group.tsx     (inactive)
└── src/             ← React frontend
    ├── lib/sanity.ts          ← Sanity client & image URL builder
    └── hooks/
        ├── useBlog.ts         ← Blog GROQ queries
        ├── useGallery.ts      ← Gallery GROQ queries
        └── useMember.ts       ← Members GROQ queries
```

**Key config values** (shared between `sanity.config.ts`, `sanity.cli.ts`, and `src/lib/sanity.ts`):

| Setting     | Value        |
|-------------|--------------|
| `projectId` | `kwax2pg0`   |
| `dataset`   | `production` |
| `apiVersion`| `2024-03-29` |

> ⚠️ Never change `projectId` or `dataset` without updating all three files simultaneously.

---

## Studio Access

To run the Sanity Studio locally:

```bash
cd sanity
npm install
npx sanity dev
```

The Studio will be available at `http://localhost:3333`.

To deploy the Studio (makes it accessible at the configured `appId`):

```bash
cd sanity
npx sanity deploy
```

---

## Schema Reference

### 1. `Blogs`

**File:** `sanity/schemaTypes/blogs.tsx`  
**Used by:** `BlogListPage.tsx`, `BlogPostPage.tsx` via `src/hooks/useBlog.ts`

Represents a single blog post article written by a council member.

| Field         | Type       | Required | Notes                                                    |
|---------------|------------|----------|----------------------------------------------------------|
| `title`       | `string`   | ✅ Yes   | Displayed as the blog card headline                      |
| `author`      | `string`   | ✅ Yes   | Name of the author                                       |
| `category`    | `string`   | ✅ Yes   | Must be one of the predefined tags (see list below)      |
| `publishedAt` | `datetime` | ✅ Yes   | Defaults to the current time; used for sort order        |
| `coverImage`  | `image`    | ✅ Yes   | Shown on the blog card and at the top of the post page   |
| `description` | `text`     | ❌ No    | Short excerpt; shown on the blog list card               |
| `blog`        | `array`    | ✅ Yes   | Rich text body (Portable Text blocks + inline images)    |

**Allowed `category` values:**

```
Event/Programme, Personal, Thematic, Record, Experience/Anecdote,
Discussion, Case Study, Behind-the-Scenes, Recap, Review,
Reflective, Informative, Analysis, Relatable
```

**`blog` field structure:**
- `block` — standard Portable Text (headings, paragraphs, lists, bold/italic, links)
- `image` — inline images within the article body

> 💡 Inline `latex` math blocks exist in the schema code but are currently commented out. Do not uncomment without also installing the `sanity-plugin-latex` package.

**Example GROQ query (from `useBlog.ts`):**
```groq
*[_type == "Blogs"] | order(publishedAt desc, _createdAt desc) [0...9] {
  _id,
  title,
  author,
  category,
  coverImage,
  description,
  publishedAt,
  _createdAt
}
```

---

### 2. `gallery`

**File:** `sanity/schemaTypes/gallery.tsx`  
**Used by:** `GalleryPage.tsx`, `EventGalleryPage.tsx` via `src/hooks/useGallery.ts`

Represents a single school event with multiple photo categories.

| Field               | Type     | Required | Notes                                                         |
|---------------------|----------|----------|---------------------------------------------------------------|
| `title`             | `string` | ✅ Yes   | Event name                                                    |
| `description`       | `text`   | ✅ Yes   | Short description of the event                                |
| `date`              | `date`   | ✅ Yes   | Event date; used for chronological ordering in the gallery    |
| `term`              | `string` | ✅ Yes   | Must be `term1`, `term2`, `term3`, or `term4`                 |
| `shortWords`        | `string` | ✅ Yes   | A short 2-word label (max 20 chars); shown as a sticker       |
| `coverPhoto`        | `image`  | ✅ Yes   | Main event photo; shown on the gallery list card (hotspot enabled) |
| `highlights`        | `image[]`| ✅ Yes   | Best photos from the event                                    |
| `BTS`               | `image[]`| ❌ No    | Behind-the-scenes photos                                      |
| `studentsCollection`| `image[]`| ❌ No    | Photos submitted by students                                  |
| `miscellaneous`     | `image[]`| ❌ No    | Any other photos that don't fit the above categories          |

**`term` values and their frontend display names:**

| Value   | Displayed As | Theme              |
|---------|--------------|--------------------|
| `term1` | Term 1       | New Beginnings     |
| `term2` | Term 2       | Building Momentum  |
| `term3` | Term 3       | Spring Awakening   |
| `term4` | Term 4       | The Grand Finale   |

> 💡 Events with no `highlights` photos will still appear in the gallery list but will show "No Photos" in the event detail page. Always upload at least one highlight photo.

**Example GROQ query (from `useGallery.ts`):**
```groq
*[_type == "gallery"] | order(date asc)
```

For a single event detail:
```groq
*[_type == "gallery" && _id == $id][0]
```

---

### 3. `members`

**File:** `sanity/schemaTypes/members.tsx`  
**Used by:** `MembersPage.tsx` via `src/hooks/useMember.ts`

Represents a single council member. The frontend splits members into two groups: **Major Positions** (The Council) and **Level Representatives**, determined solely by the `position` field value.

| Field         | Type       | Required | Notes                                                           |
|---------------|------------|----------|-----------------------------------------------------------------|
| `name`        | `string`   | ✅ Yes   | Full name (2–50 characters)                                     |
| `position`    | `string`   | ✅ Yes   | Must be one of the predefined roles (dropdown). Controls rendering order and which section they appear in |
| `twoWords`    | `string`   | ✅ Yes   | Exactly 2–3 words self-describing the member (max 25 chars). Shown as a sticker on their card |
| `image`       | `image`    | ✅ Yes   | Profile photo (hotspot enabled for smart cropping)              |
| `description` | `text`     | ✅ Yes   | Short bio (5–200 characters)                                    |
| `events`      | `string[]` | ❌ No    | List of event names this member participated in (free text)     |

**Allowed `position` values and which section they render in:**

| Position                          | Section            | Display Order |
|-----------------------------------|--------------------|---------------|
| `StuCo Advisor`                   | The Council        | 1st           |
| `President`                       | The Council        | 2nd           |
| `Vice-President`                  | The Council        | 3rd           |
| `Secretary General`               | The Council        | 4th           |
| `Finance and Logistics Officer`   | The Council        | 5th           |
| `Public Relations Officer`        | The Council        | 6th           |
| `JC2 Level Representative`        | Level Reps         | 1st           |
| `JC1 Level Representative`        | Level Reps         | 2nd           |
| `Sec 4 Level Representative`      | Level Reps         | 3rd           |
| `Sec 3 Level Representative`      | Level Reps         | 4th           |
| `Sec 2 Level Representative`      | Level Reps         | 5th           |
| `Sec 1 Level Representative`      | Level Reps         | 6th           |

> ⚠️ **Order is hardcoded in the frontend** (`useMember.ts`). A member will only appear if their `position` exactly matches one of the values above (case-sensitive). If they have an unrecognized position, they will not be displayed on the Members page.

> ⚠️ **Only one member per position** is expected. If you add two documents with the same `position`, only the first match found by `data.find()` will be rendered.

**Example GROQ query (from `useMember.ts`):**
```groq
*[_type == "members"]
```

---

### 4. `banners` *(inactive)*

**File:** `sanity/schemaTypes/banners.tsx`  
**Status:** Commented out in `schemaTypes/index.ts`. Not currently used by the frontend.

Would represent promotional banner images (e.g., for the home page or announcements).

| Field         | Type     | Required | Notes                                    |
|---------------|----------|----------|------------------------------------------|
| `bannerTitle` | `string` | ✅ Yes   | Alt text / label for the banner          |
| `bannerLink`  | `url`    | ❌ No    | Optional link the banner navigates to    |
| `bannerImage` | `image`  | ✅ Yes   | The banner image itself                  |

**To activate:** Uncomment `import banners from './banners'` and add `banners` to the `schemaTypes` array in `sanity/schemaTypes/index.ts`.

---

### 5. `group` *(inactive)*

**File:** `sanity/schemaTypes/group.tsx`  
**Status:** Commented out in `schemaTypes/index.ts`. Not currently used by the frontend.

Would represent group photos of the council organized by position tier.

| Field      | Type     | Required | Notes                                                              |
|------------|----------|----------|--------------------------------------------------------------------|
| `position` | `string` | ✅ Yes   | Either `LR` (Level Representatives), `MP` (Major Positions), or `all` |
| `image`    | `image`  | ✅ Yes   | The group photo                                                    |

**To activate:** Uncomment `import group from './group'` and add `group` to the `schemaTypes` array in `sanity/schemaTypes/index.ts`.

---

## How Content Is Queried (GROQ)

The frontend uses [GROQ](https://www.sanity.io/docs/groq) (Graph-Relational Object Queries) via the Sanity client. All queries live inside React hooks in `src/hooks/`.

### Query patterns

**Fetch all documents of a type:**
```groq
*[_type == "gallery"]
```

**Fetch with ordering:**
```groq
*[_type == "Blogs"] | order(publishedAt desc)
```

**Fetch with pagination (GROQ slice):**
```groq
*[_type == "Blogs"] | order(publishedAt desc) [0...9]
*[_type == "Blogs"] | order(publishedAt desc) [9...18]
```

**Fetch a single document by ID:**
```groq
*[_type == "gallery" && _id == $id][0]
```

**Count documents:**
```groq
count(*[_type == "Blogs"])
```

### Hook → Schema mapping

| Hook file         | Schemas queried | Key exports                                         |
|-------------------|-----------------|-----------------------------------------------------|
| `useBlog.ts`      | `Blogs`         | `useBlogPosts()`, `useBlogPost(id)`                 |
| `useGallery.ts`   | `gallery`       | `useGalleryData()`, `useLatestGalleryEvents(n)`, `useGalleryEvent(id)` |
| `useMember.ts`    | `members`       | `useMember()`                                       |

---

## Image Handling

Images in Sanity are stored as asset references, not plain URLs. The frontend resolves them using `@sanity/image-url`.

**Setup (in `src/lib/sanity.ts`):**
```ts
import imageUrlBuilder from '@sanity/image-url';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
```

**Usage in components:**
```tsx
// Basic URL
urlFor(member.image).url()

// With transformations
urlFor(event.coverPhoto).width(800).url()
```

**Hotspot** is enabled on `members.image`, `gallery.coverPhoto`, and `banners.bannerImage`. This lets editors define a focal point in the Studio so images crop correctly at any size.

---

## Adding a New Schema

1. **Create the schema file** in `sanity/schemaTypes/yourSchema.tsx`:
   ```ts
   export default {
     name: 'yourSchema',
     type: 'document',
     title: 'Your Schema',
     fields: [
       // ...
     ],
   }
   ```

2. **Register it** in `sanity/schemaTypes/index.ts`:
   ```ts
   import yourSchema from './yourSchema'
   export const schemaTypes = [Blogs, Gallery, members, yourSchema]
   ```

3. **Restart the Studio** — it will pick up the new type automatically.

4. **Create a hook** in `src/hooks/useYourSchema.ts` with the appropriate GROQ query.

5. **Use the hook** in your React page/component.

---

## Running Migrations

The `sanity/migrate.ts` file is a one-off data migration script used to backfill fields on existing `Blogs` documents. It was used to migrate from a deprecated `tags[]` array field to the current single `category` string field.

**To run a migration:**
```bash
cd sanity
npx sanity exec migrate.ts --with-user-token
```

The script:
1. Fetches all `Blogs` documents
2. If a doc has no `category` but has `tags`, it uses the first tag value
3. Falls back to `"Event/Programme"` if both are missing
4. Removes the old `tags` field
5. Ensures `publishedAt` is set (falls back to `_createdAt`)

> ⚠️ Only run migration scripts once. Running them again is safe but redundant (the fields will already be set).

---

## Common Pitfalls

| Problem | Cause | Fix |
|---|---|---|
| Member not showing on the Members page | `position` field doesn't exactly match the hardcoded list in `useMember.ts` | Check for typos, extra spaces, or capitalization differences |
| Blog post not appearing | `publishedAt` is missing or the post was saved without it | Open the document in Studio and ensure `publishedAt` is set |
| Gallery event shows in wrong term | `term` field is set incorrectly | Confirm the value is exactly `term1`, `term2`, `term3`, or `term4` |
| Images not loading | The `coverPhoto` / `image` reference was not uploaded properly | Re-upload the asset in Studio |
| Schema changes not reflecting in Studio | Studio wasn't restarted after modifying a schema file | Restart `npx sanity dev` |
| Two members with the same position | Only the first match is rendered | Each position should have exactly one member document |
| Adding an inactive schema (banners/group) | It's commented out in `schemaTypes/index.ts` | Uncomment the import and add it to the `schemaTypes` array |
