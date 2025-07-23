import { createMetadata } from '@/config/seo'
import SignInMethods from './sign-in-methods'
import DeleteAccount from './delete-account'

export const metadata = createMetadata({
  title: 'Account Settings - Management'
})

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <SignInMethods />
      <DeleteAccount />
    </div>
  )
}