'use client'

import { AlertTriangle, Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/stores/auth'
import { pocketbase } from '@/lib/pocketbase'
import { Collections } from '@/types/pocketbase-types'

export default function DangerZone() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [confirmText, setConfirmText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleDeleteAccount = async () => {
    if (!user || confirmText !== 'DELETE') return

    setIsDeleting(true)
    try {
      await pocketbase.collection(Collections.Users).delete(user.id)

      // Account deleted successfully - sign out and redirect to homepage
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Failed to delete account')
    } finally {
      setIsDeleting(false)
      setIsDialogOpen(false)
      setConfirmText('')
    }
  }

  if (!user) return null

  const isConfirmValid = confirmText === 'DELETE'

  return (
    <Card className="border-1 border-destructive/20 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          <span>Danger Zone</span>
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              className="w-full md:w-auto"
              onClick={() => setIsDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>Delete Account</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </AlertDialogDescription>
              <div className="space-y-4 mt-4">
                <div className="font-medium text-sm">
                  To confirm, type <strong>DELETE</strong> in the box below:
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmDelete">Confirmation</Label>
                  <Input
                    id="confirmDelete"
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="border-2 border-destructive/50"
                  />
                </div>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel 
                onClick={() => {
                  setConfirmText('')
                  setIsDialogOpen(false)
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                disabled={!isConfirmValid || isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
} 