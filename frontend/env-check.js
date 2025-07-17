// This file is used to check environment variables during build time
console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('=== END ENVIRONMENT VARIABLES CHECK ===');

// Export a dummy function to avoid unused file warnings
module.exports = { checkEnv: () => true };