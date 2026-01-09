# Portfolio

A Next.js portfolio website that dynamically pulls content from a Notion database and automatically uploads images to Cloudinary for optimized delivery.

## Features

- Content managed through Notion database
- Automatic image upload to Cloudinary
- Automatic revalidation when Notion content changes

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Notion account with API access
- A Cloudinary account
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Notion Configuration
NOTION_TOKEN=your_notion_integration_token
NOTION_DB_ID=your_notion_database_id

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
CLOUDINARY_UPLOAD_FOLDER=portfolio

# Optional: Revalidation Secret (for API route)
REVALIDATION_SECRET=your_secret_key_here

# Optional: Upload external images not on Cloudinary (set to "1" to enable)
UPLOAD_EXTERNALS_NOT_ON_CLOUDINARY=0
```

#### Getting Your Notion Token

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Give it a name (e.g., "Portfolio Integration")
4. Select your workspace
5. Copy the "Internal Integration Token"
6. Paste it as `NOTION_TOKEN` in your `.env.local`

#### Getting Your Notion Database ID

1. Open your Notion database
2. Click "Share" → "Copy link"
3. The database ID is the long string between the workspace name and the `?` in the URL
   - Example: `https://www.notion.so/workspace/DATABASE_ID?v=...`
   - Copy `DATABASE_ID` and use it as `NOTION_DB_ID`

#### Getting Your Cloudinary URL

1. Sign up at [https://cloudinary.com](https://cloudinary.com)
2. Go to your Dashboard
3. Copy the "Cloudinary URL" from the dashboard
4. It should look like: `cloudinary://123456789012345:abcdefghijklmnopqrstuvwxyz@your-cloud-name`
5. Use this as `CLOUDINARY_URL`

**Important:** Make sure to share your Notion database with your integration:
1. Open your Notion database
2. Click the "..." menu in the top right
3. Click "Add connections"
4. Select your integration

### 3. Notion Database Setup

Create a Notion database with the following properties:

| Property Name | Property Type | Description |
|---------------|---------------|-------------|
| **Name** | Title | The title/name of the portfolio item |
| **Group** | Multi-select | Category or group for organizing items |
| **Description** | Text | Rich text description of the item |
| **Timeline** | Date | Start and/or end date for the item |
| **Link** | URL | External link to the item |
| **Files** | Files & media | Images or files associated with the item |
| **Publish** | Checkbox | Whether to display this item on the portfolio |
| **Place** | Location | Location associated with the item |
| **Status** | Status | Status of the item |
| **Type** | Select | Type of portfolio item (see Type Options below) |

#### Type Options

The `Type` select field should include these options (case-insensitive):

- `about` - About section content
- `headline` - Headline text
- `postscript` - Postscript content
- `summary` - Summary text
- `portrait` - Portrait image
- `thumbnail` - Thumbnail image
- `project` - Project entry
- `social` - Social media link
- `writing` - Writing/article entry
- `press` - Press/media mention
- `position` - Work position/role
- `award` - Award entry
- `certification` - Certification entry
- `education` - Education entry
- `skill` - Skill entry

**Note:** Only items with `Publish` checked will appear on your portfolio.

### 4. Cloudinary Setup

1. Sign up for a free account at [https://cloudinary.com](https://cloudinary.com)
2. Get your Cloudinary URL from the dashboard
3. Set up your upload folder (optional, defaults to "portfolio")

The application will automatically:
- Upload images from Notion to Cloudinary
- Update Notion with Cloudinary URLs
- Optimize images for web delivery

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your portfolio.

### 6. Upload Images to Cloudinary

Before building for production, upload all images from Notion to Cloudinary:

```bash
npm run upload-images
```

Or manually:

```bash
npx tsx lib/uploader.ts
```

This script will:
- Fetch all pages from your Notion database
- Download images from Notion
- Upload them to Cloudinary
- Update Notion with the new Cloudinary URLs

## Available Scripts

- `npm run dev` - Start development server (also runs image uploader)
- `npm run build` - Build for production (also runs image uploader)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run upload-images` - Upload images from Notion to Cloudinary

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

**Important:** For production, use `NEXT_PUBLIC_` prefix for environment variables that need to be accessible in the browser:

- `NEXT_PUBLIC_NOTION_TOKEN`
- `NEXT_PUBLIC_NOTION_DATABASE_ID`
- `NEXT_PUBLIC_CLOUDINARY_URL`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_FOLDER`

### Revalidation

Set up a Notion webhook to automatically revalidate your site when content changes:

1. In Vercel, go to your project settings
2. Add a webhook URL: `https://your-domain.com/api/revalidate?secret=your_revalidation_secret`
3. Configure the webhook in Notion to call this URL on database updates

Or manually revalidate by visiting:
```
https://your-domain.com/api/revalidate?secret=your_revalidation_secret
```

## Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── page.tsx           # Main portfolio page
│   └── layout.tsx         # Root layout
├── components/            # React components
│   └── ui/               # UI components
├── lib/                   # Utility libraries
│   ├── notion.ts         # Notion API client
│   ├── cloudinary.ts     # Cloudinary client
│   ├── portfolio.ts      # Portfolio data fetcher
│   └── uploader.ts       # Image upload script
└── types.d.ts            # TypeScript type definitions
```

## How It Works

1. **Content Management**: All content is stored in a Notion database
2. **Data Fetching**: The app fetches data from Notion using the Notion API
3. **Image Optimization**: Images are automatically uploaded to Cloudinary for optimized delivery
4. **Rendering**: Next.js renders the portfolio page server-side
5. **Revalidation**: The site can be revalidated when Notion content changes

## Customization

### Styling

The project uses Tailwind CSS. Modify `app/globals.css` and component files to customize the design.

### Default Values

Edit `lib/constants.ts` to change default values like:
- Default thumbnail URL
- Default logo URL
- Default portrait URL
- Site URL
- Default title and summary

## Troubleshooting

### Images not uploading

- Check that `CLOUDINARY_URL` is correctly formatted
- Ensure your Notion integration has access to the database
- Check that images in Notion are accessible

### Content not appearing

- Verify `Publish` checkbox is checked in Notion
- Check that `Type` field matches one of the supported types
- Ensure `NOTION_TOKEN` and `NOTION_DB_ID` are correct

### Build errors

- Make sure all environment variables are set
- Run `npm run upload-images` before building
- Check that your Notion database has the correct properties

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
