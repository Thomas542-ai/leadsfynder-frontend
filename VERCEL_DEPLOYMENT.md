# Vercel Deployment Guide for Frontend

## Environment Variables for Vercel

Set these environment variables in your Vercel dashboard:

### Required Variables:
```
VITE_API_URL=https://leadsfynder-backend.onrender.com/api
```

### Optional Variables (if using Supabase for frontend features):
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment Steps

### 1. Deploy Frontend to Vercel:
1. Connect your frontend repository to Vercel
2. Set the environment variables listed above
3. Deploy!

### 2. Update Backend CORS (if needed):
After deploying your frontend, update the `FRONTEND_URL` environment variable in Render.com with your actual Vercel URL.

## Testing the Integration

1. **Test API Connection**: Visit your Vercel frontend and check if it can connect to the backend
2. **Test Authentication**: Try logging in/registering
3. **Test API Endpoints**: Check if dashboard data loads correctly

## Troubleshooting

### CORS Issues:
- Ensure `FRONTEND_URL` in Render.com matches your Vercel URL
- Check that CORS origins include `*.vercel.app`

### API Connection Issues:
- Verify `VITE_API_URL` points to your Render.com backend
- Check that backend is running and accessible

### Environment Variables:
- Make sure all environment variables are set in Vercel dashboard
- Restart the deployment after adding new environment variables
