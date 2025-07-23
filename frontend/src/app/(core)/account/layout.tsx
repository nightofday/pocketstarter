import AccountSidebar from './sidebar'

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your account details and preferences.</p>
        </div>

        {/* Layout with Sidebar */}
        <div className="lg:flex lg:gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 lg:flex-shrink-0">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
} 