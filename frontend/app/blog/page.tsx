import { redirect } from 'next/navigation';

// Redirect /blog to home page since categories are on home
export default function BlogPage() {
  redirect('/');
}
