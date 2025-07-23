import { createMetadata } from '@/config/seo'
import ProfileSection from './profile'

export const metadata = createMetadata({
  title: 'Account Settings - Profile'
})

export default function ProfilePage() {
  return <ProfileSection />
} 