# DO-letter-converter

A privacy-conscious AI drafting tool that converts official government correspondence into polished Demi-Official (D.O.) letters. It has no database, login, analytics, or persistent user-data storage.

You can paste correspondence directly or upload a text-based PDF or Word (`.docx`) file. Uploaded files are read locally in the browser, then their extracted text is placed in the editor. Scanned PDFs without selectable text need OCR before upload.

## Stack

- React + Vite
- Tailwind CSS
- Vercel serverless API route
- OpenAI Responses API

## Install and run locally

1. Install Node.js 20 or later.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.example` and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   Open the address Vite prints (usually `http://localhost:5173`). Vite serves the serverless function during local development.

## Deploy to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket and import it in [Vercel](https://vercel.com/new), or run `vercel` from the project folder.
2. In **Project Settings → Environment Variables**, add `OPENAI_API_KEY` with your OpenAI API key. Add it for Production, Preview, and Development as appropriate.
3. Use the automatically detected settings: build command `npm run build` and output directory `dist`.
4. Deploy. The `/api/convert` Vercel function keeps the API key private on the server.

## Project layout

```
api/          Vercel serverless OpenAI proxy
src/components Reusable UI components
src/utils      Client-side DOCX builder
src/           React application and styles
public/        Static assets (ready for additions)
```

## Notes

- Official letter content is held only in the browser while the page is open. The conversion request is sent to OpenAI through the serverless endpoint and is not stored by this application.
- DOCX download is generated fully in the browser with no third-party document service.
- Hindi and Odia are deliberately shown as future placeholders and cannot yet be submitted.

